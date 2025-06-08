import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import MapSearch from "../components/MapSearch";
import { fetchPlaceDetails } from "../services/googlePlaces";
import { GOOGLE_MAPS_API_KEY } from "../config";
import { analyzeSentiment } from "../services/sentiment";

import BusinessCard from "../components/BusinessCard";
import SentimentChart from "../components/SentimentChart";

const POLLING_INTERVAL = 10 * 60 * 1000; // 10 минут

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const pollingRef = useRef(null);
  const savedReviewsRef = useRef([]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const updateReviews = async (placeId) => {
    try {
      setLoading(true);
      setAnalyzing(false);

      const details = await fetchPlaceDetails(placeId, GOOGLE_MAPS_API_KEY);
      const newReviews = details.reviews || [];

      // Отфильтровываем новые отзывы по времени
      const existingTimes = new Set(savedReviewsRef.current.map((r) => r.time));
      const freshReviews = newReviews.filter((r) => !existingTimes.has(r.time));

      if (freshReviews.length === 0) {
        setLoading(false);
        return;
      }

      setAnalyzing(true);

      // Анализ сентимента для новых отзывов
      const freshReviewsWithSentiment = await Promise.all(
        freshReviews.map(async (review) => {
          try {
            const sentiment = await analyzeSentiment(review.text);
            return { ...review, sentiment };
          } catch {
            return { ...review, sentiment: "unknown" };
          }
        })
      );

      savedReviewsRef.current = [...freshReviewsWithSentiment, ...savedReviewsRef.current];
      setReviews(savedReviewsRef.current);

      setAnalyzing(false);
      setLoading(false);
    } catch (error) {
      console.error("Ошибка обновления отзывов:", error);
      setLoading(false);
      setAnalyzing(false);
    }
  };

  const handlePlaceSelected = (place) => {
    setSelectedBusiness(place);
    savedReviewsRef.current = [];
    setReviews([]);

    updateReviews(place.place_id);

    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = setInterval(() => {
      updateReviews(place.place_id);
    }, POLLING_INTERVAL);
  };

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Добро пожаловать, {user?.name}</h1>
      <img src={user?.picture} alt="User" style={{ borderRadius: "50%", width: 64, height: 64 }} />
      <p>Email: {user?.email}</p>
      <button onClick={handleLogout} style={{ padding: "0.5rem 1rem", marginTop: "1rem" }}>
        Выйти
      </button>

      <div style={{ marginTop: "2rem" }}>
        <MapSearch onPlaceSelected={handlePlaceSelected} />
      </div>

      {selectedBusiness && (
        <div style={{ marginTop: "2rem" }}>
          <BusinessCard business={selectedBusiness} reviews={reviews} />
          <div style={{ marginTop: "2rem" }}>
            <h2>График настроений</h2>
            <SentimentChart reviews={reviews} />
          </div>
        </div>
      )}

      {loading && <p>Загрузка отзывов...</p>}
      {analyzing && <p>Анализ сентимента отзывов...</p>}
    </div>
  );
};

export default Dashboard;
