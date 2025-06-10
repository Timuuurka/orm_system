import React, { useState, useEffect } from "react";
import MapSearch from "../components/MapSearch";
import { fetchPlaceDetails } from "../services/googlePlaces";
import { GOOGLE_MAPS_API_KEY } from "../config";
import { analyzeSentiment } from "../services/sentiment";
import { referenceSamples } from "../utils/constants";
import BusinessCard from "../components/BusinessCard";
import SentimentChart from "../components/SentimentChart";
import MainLayout from "../layouts/MainLayout";

const sentimentColors = {
  positive: "#4caf50",
  neutral: "#9e9e9e",
  negative: "#f44336",
  unknown: "#000000",
};

const Dashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [fakeReviews, setFakeReviews] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const [alerts, setAlerts] = useState([]); // 🔥 список алертов

  const handlePlaceSelected = async (place) => {
    setSelectedBusiness(place);
    setLoading(true);
    setAnalyzing(false);
    setFakeReviews([]);
    setAlerts([]); // 🔥 сброс алертов при смене бизнеса

    try {
      const details = await fetchPlaceDetails(place.place_id, GOOGLE_MAPS_API_KEY);
      const originalReviews = details.reviews || [];

      const firstFive = originalReviews
        .sort((a, b) => b.time - a.time)
        .slice(0, 5);

      setReviews(firstFive);
      setLoading(false);
      setAnalyzing(true);

      const analyzed = await Promise.all(
        firstFive.map(async (review) => {
          try {
            const sentiment = await analyzeSentiment(review.text);
            return { ...review, sentiment };
          } catch {
            return { ...review, sentiment: "unknown" };
          }
        })
      );

      setReviews(analyzed);
    } catch (e) {
      console.error("Ошибка при загрузке отзывов:", e);
      setReviews([]);
    } finally {
      setLoading(false);
      setAnalyzing(false);
    }
  };

  const handleAddFakeReview = () => {
    if (fakeReviews.length < referenceSamples.length) {
      const nextFake = referenceSamples[fakeReviews.length];
      setFakeReviews([...fakeReviews, { ...nextFake, time: Math.floor(Date.now() / 1000) }]);
    }
  };

  const displayedReviews = [...reviews, ...fakeReviews].sort((a, b) => b.time - a.time);

  // 🔥 АНОМАЛИЯ: проверка при изменении отзывов
  useEffect(() => {
    const detectAnomaly = () => {
      const now = Date.now() / 1000;
      const last24h = displayedReviews.filter((r) => now - r.time <= 86400);
      if (last24h.length < 3) return; // минимум 3 отзыва для статистики

      const negativeCount = last24h.filter((r) => r.sentiment === "negative").length;
      const ratio = negativeCount / last24h.length;

      if (ratio > 0.3) {
        const alert = {
          id: Date.now(),
          message: `За последние 24ч зафиксирован пик негатива (${(ratio * 100).toFixed(1)}%)`,
          timestamp: new Date().toLocaleString(),
        };
        setAlerts((prev) => [...prev.filter((a) => a.message !== alert.message), alert]);
      }
    };

    detectAnomaly();
  }, [displayedReviews]); // 🔥 пересчитывать при изменении отзывов

  // 🔥 удаление алерта
  const handleDismissAlert = (id) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  return (
    <MainLayout title="Dashboard">
      <div style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", marginBottom: 20 }}>Dashboard</h1>

        <div className="w-screen h-screen overflow-hidden m-0 p-0">
          <MapSearch onPlaceSelected={handlePlaceSelected} />
        </div>

        {selectedBusiness && (
          <>
            <BusinessCard business={selectedBusiness} reviews={displayedReviews} />

            <div style={{ marginTop: 30 }}>
              <h2>Отзывы ({displayedReviews.length})</h2>
              {loading && <p>Загрузка отзывов...</p>}
              {analyzing && <p>Анализ сентимента...</p>}
              {!loading && displayedReviews.length === 0 && <p>Отзывы не найдены.</p>}

              <button
                onClick={handleAddFakeReview}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#1976d2",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  marginBottom: 20,
                  cursor: "pointer",
                }}
                disabled={fakeReviews.length >= referenceSamples.length}
                title={
                  fakeReviews.length >= referenceSamples.length
                    ? "Все фейковые отзывы подгружены"
                    : "Добавить ещё фейковый отзыв"
                }
              >
                Reload
              </button>

              <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
                {displayedReviews.map((review, i) => (
                  <div
                    key={i}
                    style={{
                      border: "1px solid #ddd",
                      padding: 15,
                      borderRadius: 8,
                      backgroundColor: review.alert ? "#ffebee" : "white",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    <p>
                      <strong>{review.author_name[0]}</strong> — рейтинг: {review.rating}{" "}
                      <span
                        style={{
                          color: sentimentColors[review.sentiment] || sentimentColors.unknown,
                          fontWeight: "bold",
                          textTransform: "capitalize",
                          marginLeft: 10,
                        }}
                      >
                        {review.sentiment || "unknown"}
                      </span>
                    </p>
                    <p>{review.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 40 }}>
              <h2>Статистика по настроениям</h2>
              <SentimentChart reviews={displayedReviews} />
            </div>

            {/* 🔥 UI: АЛЕРТЫ */}
            {alerts.length > 0 && (
              <div style={{ marginTop: 40 }}>
                <h2 style={{ color: "#d32f2f" }}>⚠️ Алерты</h2>
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    style={{
                      backgroundColor: "#ffebee",
                      padding: 15,
                      borderRadius: 8,
                      marginBottom: 15,
                      border: "1px solid #f44336",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    <p style={{ marginBottom: 5 }}>{alert.message}</p>
                    <p style={{ fontSize: 12, color: "#999" }}>{alert.timestamp}</p>
                    <button
                      onClick={() => handleDismissAlert(alert.id)}
                      style={{
                        marginTop: 10,
                        backgroundColor: "#d32f2f",
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                        padding: "0.3rem 0.8rem",
                        cursor: "pointer",
                      }}
                    >
                      Пометить как обработанный
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Dashboard;
