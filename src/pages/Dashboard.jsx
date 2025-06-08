import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import MapSearch from "../components/MapSearch";
import { fetchPlaceDetails } from "../services/googlePlaces";
import { GOOGLE_MAPS_API_KEY } from "../config";
import { analyzeSentiment } from "../services/sentiment";

const sentimentColors = {
  positive: "#4caf50",
  neutral: "#9e9e9e",
  negative: "#f44336",
  unknown: "#000000",
};

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

  // Функция обновления отзывов и сентимента
  const updateReviews = async (placeId) => {
    try {
      setLoading(true);
      setAnalyzing(false);

      const details = await fetchPlaceDetails(placeId, GOOGLE_MAPS_API_KEY);
      const newReviews = details.reviews || [];

      // Фильтруем только новые отзывы по уникальному идентификатору (например, time)
      const existingTimes = new Set(savedReviewsRef.current.map(r => r.time));
      const freshReviews = newReviews.filter(r => !existingTimes.has(r.time));

      if (freshReviews.length === 0) {
        setLoading(false);
        return; // Нет новых отзывов
      }

      setAnalyzing(true);

      // Анализируем сентимент новых отзывов
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

      // Обновляем локальное хранилище и стейт
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

  // Обработчик выбора бизнеса
  const handlePlaceSelected = (place) => {
    setSelectedBusiness(place);
    savedReviewsRef.current = []; // сброс локального кэша при выборе нового бизнеса
    setReviews([]);
    updateReviews(place.place_id);

    // Запускаем polling
    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = setInterval(() => {
      updateReviews(place.place_id);
    }, POLLING_INTERVAL);
  };

  // Очистка таймера при размонтировании компонента
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

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
      {analyzing && <p>Анализ сентимента отзывов...</p>}

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
      )}
    </div>
  );
};

export default Dashboard;
