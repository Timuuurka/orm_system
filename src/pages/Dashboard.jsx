import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import MapSearch from "../components/MapSearch";
import { fetchPlaceDetails } from "../services/googlePlaces";
import { GOOGLE_MAPS_API_KEY } from "../config";
import { analyzeSentiment } from "../services/sentiment";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handlePlaceSelected = async (place) => {
    try {
      console.log("Выбранный бизнес:", place);
      setSelectedBusiness(place);
      setLoading(true);

      const details = await fetchPlaceDetails(place.place_id, GOOGLE_MAPS_API_KEY);
      const originalReviews = details.reviews || [];

      // Анализируем сентимент каждого отзыва
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
      setLoading(false);
    } catch (error) {
      console.error("Ошибка при загрузке деталей места:", error.message);
      setLoading(false);
    }
  };

  // Функция для цветного отображения сентимента
  const sentimentColor = (sentiment) => {
    switch (sentiment) {
      case "positive":
        return "green";
      case "negative":
        return "red";
      case "neutral":
        return "gray";
      default:
        return "black";
    }
  };

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
        <div style={{ marginTop: "2rem" }}>
          <h2>{selectedBusiness.name}</h2>
          <p>{selectedBusiness.formatted_address}</p>
        </div>
      )}

      {loading && <p>Загрузка отзывов...</p>}

      {reviews.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Отзывы:</h2>
          {reviews.map((review, index) => (
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
                <strong>{review.author_name}</strong> (оценка: {review.rating}) —{" "}
                <span style={{ color: sentimentColor(review.sentiment), fontWeight: "bold" }}>
                  {review.sentiment?.toUpperCase() || "N/A"}
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
