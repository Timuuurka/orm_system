import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import MapSearch from "../components/MapSearch";
import { fetchPlaceDetails } from "../services/googlePlaces";
import { analyzeSentiment } from "../services/sentiment";
import { GOOGLE_MAPS_API_KEY } from "../config";

const sentimentColors = {
  positive: "#4caf50",
  neutral: "#9e9e9e",
  negative: "#f44336",
  unknown: "#000000",
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handlePlaceSelected = async (place) => {
    setSelectedBusiness(place);
    setLoading(true);
    setAnalyzing(false);
    setReviews([]);

    try {
      console.log("📍 Выбранное место:", place);
      const details = await fetchPlaceDetails(place.place_id, GOOGLE_MAPS_API_KEY);
      const originalReviews = details.reviews || [];

      console.log("💬 Получено отзывов:", originalReviews.length);

      setReviews(originalReviews); // сначала показываем без анализа
      setLoading(false);
      setAnalyzing(true);

      const reviewsWithSentiment = await Promise.all(
        originalReviews.map(async (review) => {
          try {
            const sentiment = await analyzeSentiment(review.text);
            console.log(`🔎 Отзыв: "${review.text}" -> Сентимент: ${sentiment}`);
            return { ...review, sentiment };
          } catch (err) {
            console.error("❌ Ошибка анализа сентимента:", err);
            return { ...review, sentiment: "unknown" };
          }
        })
      );

      console.log("✅ Отзывы с сентиментом:", reviewsWithSentiment);
      setReviews(reviewsWithSentiment);
    } catch (err) {
      console.error("❌ Ошибка загрузки деталей места:", err.message);
    } finally {
      setLoading(false);
      setAnalyzing(false);
    }
  };

  return (
<div style={{ marginTop: "2rem", textAlign: "center" }}>
  <h2 style={{ color: "#e91e63", fontSize: "2rem", fontWeight: "bold" }}>
    Я тебя люблю АЙЗЕРЕ<span style={{ color: "red", fontSize: "2.5rem" }}>❤️</span>
  </h2>
</div>

  );
};

export default Dashboard;
