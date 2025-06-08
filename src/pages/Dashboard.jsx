import React, { useState } from "react";
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
  const [reviews, setReviews] = useState([]); // реальные из Google
  const [fakeReviews, setFakeReviews] = useState([]); // фейки вручную подгружаемые
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  // Загружаем реальные отзывы
  const handlePlaceSelected = async (place) => {
    setSelectedBusiness(place);
    setLoading(true);
    setAnalyzing(false);
    setFakeReviews([]); // сброс фейков при смене бизнеса

    try {
      const details = await fetchPlaceDetails(place.place_id, GOOGLE_MAPS_API_KEY);
      const originalReviews = details.reviews || [];

      // Ограничиваем только первыми 5 реальными отзывами (сортируем по времени, последние сверху)
      const firstFive = originalReviews
        .sort((a, b) => b.time - a.time)
        .slice(0, 5);

      setReviews(firstFive);
      setLoading(false);
      setAnalyzing(true);

      // Анализ сентимента реальных отзывов
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

  // Добавляем фейковые отзывы по кнопке Reload
  const handleAddFakeReview = () => {
    if (fakeReviews.length < referenceSamples.length) {
      const nextFake = referenceSamples[fakeReviews.length];
      setFakeReviews([...fakeReviews, { ...nextFake, time: Math.floor(Date.now() / 1000) }]);
    }
  };

  // Итоговый список для отображения — сначала реальные (до 5), потом фейки в хронологическом порядке
  const displayedReviews = [...reviews, ...fakeReviews]
    .sort((a, b) => b.time - a.time);

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
                    {review.alert && (
                      <p style={{ color: "#d32f2f", fontWeight: "bold" }}>
                        ⚠️ Внимание! Подозрительный отзыв
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 40 }}>
              <h2>Статистика по настроениям</h2>
              <SentimentChart reviews={displayedReviews} />
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Dashboard;
