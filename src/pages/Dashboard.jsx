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
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Добро пожаловать, {user?.name}</h1>
      <img src={user?.picture} alt="User" style={{ width: 80, borderRadius: "50%" }} />
      <p>Email: {user?.email}</p>
      <button onClick={handleLogout} style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}>
        Выйти
      </button>

      <div style={{ marginTop: "2rem" }}>
        <MapSearch onPlaceSelected={handlePlaceSelected} />
      </div>

      {selectedBusiness && (
        <div style={{ marginTop: "2rem" }}>
          <h2>{selectedBusiness.name}</h2>
          <p>{selectedBusiness.formatted_address}</p>
        </div>
      )}

      {loading && <p>Загрузка отзывов...</p>}
      {analyzing && <p>Анализ сентимента отзывов...</p>}

      {reviews.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Отзывы:</h2>
          {reviews.map((review, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "1rem",
              }}
            >
              <p>
                <strong>{review.author_name}</strong> (оценка: {review.rating}) —
                <span
                  style={{
                    color: sentimentColors[review.sentiment] || sentimentColors.unknown,
                    marginLeft: "0.5rem",
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
      )}
    </div>
  );
};

export default Dashboard;
