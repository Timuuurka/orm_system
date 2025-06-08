import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import MapSearch from "../components/MapSearch";
import { fetchPlaceDetails } from "../services/googlePlaces";
import { GOOGLE_MAPS_API_KEY } from "../config";
import { analyzeSentiment } from "../services/sentiment";

import BusinessCard from "../components/BusinessCard";
import SentimentChart from "../components/SentimentChart";

const sentimentColors = {
  positive: "#4caf50",
  neutral: "#9e9e9e",
  negative: "#f44336",
  unknown: "#000000",
};

// 🔥 Подготовленный фейковый отзыв
const fakeReview = {
  author_name: "Тимур",
  rating: 5,
  text: "Очень хороший сервис! Все понравилось. Спасибо!",
  time: Math.floor(Date.now() / 1000), // текущее время в UNIX
  sentiment: "positive",
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [showFakeReview, setShowFakeReview] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handlePlaceSelected = async (place) => {
    try {
      setSelectedBusiness(place);
      setLoading(true);
      setAnalyzing(false);

      const details = await fetchPlaceDetails(place.place_id, GOOGLE_MAPS_API_KEY);
      const originalReviews = details.reviews || [];

      setReviews(originalReviews);
      setLoading(false);
      setAnalyzing(true);

      const reviewsWithSentiment = await Promise.all(
        originalReviews.map(async (review) => {
          try {
            const sentiment = await analyzeSentiment(review.text);
            return { ...review, sentiment };
          } catch (error) {
            console.error("Ошибка анализа сентимента:", error);
            return { ...review, sentiment: "unknown" };
          }
        })
      );

      setReviews(reviewsWithSentiment);
      setAnalyzing(false);
    } catch (error) {
      console.error("Ошибка при загрузке деталей места:", error.message);
      setLoading(false);
      setAnalyzing(false);
    }
  };

  // 🔄 Вставка фейкового отзыва
  const handleAddFakeReview = () => {
    setShowFakeReview(true);
  };

  // 📅 Отсортированные по времени + только 5 самых свежих
  const displayedReviews = [...(showFakeReview ? [fakeReview] : []), ...reviews]
    .sort((a, b) => b.time - a.time)
    .slice(0, 5);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Добро пожаловать, {user?.name}</h1>
      <img src={user?.picture} alt="User" style={{ borderRadius: "50%" }} />
      <p>Email: {user?.email}</p>
      <button onClick={handleLogout} style={{ padding: "0.5rem 1rem", marginTop: "1rem" }}>
        Выйти
      </button>

      <div style={{ marginTop: "2rem" }}>
        <MapSearch onPlaceSelected={handlePlaceSelected} />
      </div>

      {selectedBusiness && (
        <>
          <div style={{ marginTop: "2rem" }}>
            <BusinessCard business={selectedBusiness} reviews={reviews} />
          </div>

          <div style={{ marginTop: "2rem" }}>
            <SentimentChart reviews={displayedReviews} />
          </div>

          <div style={{ marginTop: "2rem" }}>
            <h2>Отзывы:</h2>
            <button onClick={handleAddFakeReview} style={{ marginBottom: "1rem" }}>
              🔄 Обновить отзывы
            </button>
            {loading && <p>Загрузка отзывов...</p>}
            {analyzing && <p>Анализ сентимента отзывов...</p>}
            {displayedReviews.length === 0 && !loading && <p>Отзывы не найдены.</p>}

            {displayedReviews.map((review, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #ccc",
                  padding: "1rem",
                  marginBottom: "1rem",
                  borderRadius: "8px",
                }}
              >
                <p>
                  <strong>{review.author_name ? review.author_name[0] : "?"}</strong> (оценка: {review.rating}) —{" "}
                  <span
                    style={{
                      color: sentimentColors[review.sentiment] || sentimentColors.unknown,
                      fontWeight: "bold",
                      textTransform: "capitalize",
                    }}
                  >
                    {review.sentiment || "unknown"}
                  </span>
                </p>
                <p>{review.text}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
