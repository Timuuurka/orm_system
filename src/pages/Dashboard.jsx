import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import MapSearch from "../components/MapSearch";
import { fetchPlaceDetails } from "../services/googlePlaces";
import { analyzeSentiment } from "../services/sentiment";
import { GOOGLE_MAPS_API_KEY } from "../config";

const sentimentColors = {
  "Very Positive": "#2e7d32",
  "Positive": "#4caf50",
  "Neutral": "#9e9e9e",
  "Negative": "#f44336",
  "Very Negative": "#b71c1c",
  unknown: "#000000"
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handlePlaceSelected = async (place) => {
    setError(null);
    setSelectedBusiness(place);
    setLoading(true);
    setAnalyzing(false);
    setReviews([]);

    try {
      const details = await fetchPlaceDetails(place.place_id, GOOGLE_MAPS_API_KEY);
      const originalReviews = details.reviews || [];

      setReviews(originalReviews);
      setLoading(false);

      if (originalReviews.length === 0) {
        return;
      }

      setAnalyzing(true);
      const reviewsWithSentiment = await Promise.all(
        originalReviews.map(async (review) => {
          try {
            const sentiment = await analyzeSentiment(review.text);
            return { ...review, sentiment };
          } catch {
            return { ...review, sentiment: "unknown" };
          }
        })
      );
      setReviews(reviewsWithSentiment);
    } catch (err) {
      setError("Не удалось загрузить данные о месте.");
      console.error(err);
    } finally {
      setLoading(false);
      setAnalyzing(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <header style={{ marginBottom: "2rem" }}>
        <h1>Добро пожаловать, {user?.name}</h1>
        <img src={user?.picture} alt="User" style={{ borderRadius: "50%", width: 80 }} />
        <p>Email: {user?.email}</p>
        <button onClick={handleLogout} style={{ padding: "0.5rem 1rem", marginTop: "1rem" }}>
          Выйти
        </button>
      </header>

      <section style={{ marginBottom: "2rem" }}>
        <h2>🔍 Поиск по карте</h2>
        <MapSearch onPlaceSelected={handlePlaceSelected} />
      </section>

      {selectedBusiness && (
        <section style={{ marginBottom: "1rem" }}>
          <h2>🏢 {selectedBusiness.name}</h2>
          <p>{selectedBusiness.formatted_address}</p>
        </section>
      )}

      {loading && <p>⏳ Загрузка отзывов...</p>}
      {analyzing && <p>🧠 Анализ сентимента...</p>}
      {error && <p style={{ color: "red" }}>❌ {error}</p>}

      {reviews.length > 0 && (
        <section style={{ marginTop: "2rem" }}>
          <h2>📝 Отзывы</h2>
          {reviews.map((review, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ccc",
                padding: "1rem",
                marginBottom: "1rem",
                borderRadius: "8px"
              }}
            >
              <p>
                <strong>{review.author_name}</strong> — Оценка: {review.rating}
              </p>
              <p style={{ margin: "0.5rem 0" }}>{review.text}</p>
              <p style={{ color: sentimentColors[review.sentiment] || sentimentColors.unknown, fontWeight: "bold" }}>
                Сентимент: {review.sentiment}
              </p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default Dashboard;
