// Dashboard.jsx

import React, { useState } from "react";
import MapSearch from "../components/MapSearch";
import { fetchPlaceDetails } from "../services/googlePlaces";
import { GOOGLE_MAPS_API_KEY } from "../config";
import { analyzeSentiment } from "../services/sentiment";
import { referenceSamples } from "../utils/constants";
import BusinessCard from "../components/BusinessCard";
import SentimentChart from "../components/SentimentChart";
import MainLayout from "../layouts/MainLayout";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CSVLink } from "react-csv";

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
  const [alerts, setAlerts] = useState([]);
  const [reportPeriod, setReportPeriod] = useState("week");

  const detectAlert = (allReviews) => {
    const now = Math.floor(Date.now() / 1000);
    const last24hReviews = allReviews.filter((r) => now - r.time <= 86400);
    const negativeCount = last24hReviews.filter((r) => r.sentiment === "negative").length;
    const alertTriggered =
      last24hReviews.length > 0 && negativeCount / last24hReviews.length > 0.3;
    if (alertTriggered) {
      const alert = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        message: `🚨 Более 30% негативных отзывов за последние 24 часа (${negativeCount}/${last24hReviews.length})`,
        handled: false,
      };
      setAlerts((prev) => [...prev, alert]);
    }
  };

  const markAlertHandled = (id) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, handled: true } : a)));
  };

  const handlePlaceSelected = async (place) => {
    setSelectedBusiness(place);
    setLoading(true);
    setAnalyzing(false);
    setFakeReviews([]);

    try {
      const details = await fetchPlaceDetails(place.place_id, GOOGLE_MAPS_API_KEY);
      const originalReviews = details.reviews || [];
      const firstFive = originalReviews.sort((a, b) => b.time - a.time).slice(0, 5);
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
      detectAlert(analyzed);
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
      setFakeReviews([
        ...fakeReviews,
        { ...nextFake, time: Math.floor(Date.now() / 1000) },
      ]);
    }
  };

  const displayedReviews = [...reviews, ...fakeReviews].sort((a, b) => b.time - a.time);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Отчёт по отзывам", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["Автор", "Оценка", "Настроение", "Отзыв"]],
      body: displayedReviews.map((r) => [
        r.author_name,
        r.rating,
        r.sentiment,
        r.text.slice(0, 100) + (r.text.length > 100 ? "..." : ""),
      ]),
    });

    doc.save("отчёт.pdf");
  };

  const csvData = displayedReviews.map((r) => ({
    author: r.author_name,
    rating: r.rating,
    sentiment: r.sentiment,
    text: r.text,
  }));

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
      <h2>
        Отзывы ({displayedReviews.length}){" "}
        <span style={{ fontWeight: "normal", fontSize: "0.9em", color: "#666" }}>
          (всего: {selectedBusiness.user_ratings_total || "?"}, средний рейтинг:{" "}
          {selectedBusiness.rating || "?"})
        </span>
      </h2>



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
                          color:
                            sentimentColors[review.sentiment] ||
                            sentimentColors.unknown,
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

            <div style={{ marginTop: 40 }}>
              {alerts.length === 0}
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  style={{
                    border: "1px solid #f44336",
                    padding: 15,
                    borderRadius: 8,
                    marginBottom: 10,
                    backgroundColor: alert.handled ? "#e0e0e0" : "#ffebee",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <strong>{alert.timestamp}</strong>
                    <p style={{ margin: 0 }}>{alert.message}</p>
                  </div>
                  {!alert.handled ? (
                    <button
                      onClick={() => markAlertHandled(alert.id)}
                      style={{
                        backgroundColor: "#4caf50",
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                        padding: "6px 12px",
                        cursor: "pointer",
                      }}
                    >
                      Обработано
                    </button>
                  ) : (
                    <span style={{ color: "#4caf50", fontWeight: "bold" }}>
                      ✅ Обработано
                    </span>
                  )}
                </div>
              ))}
            </div>
{/* 🛡️ Defender: Борьба с угрозами */}
<div style={{ marginTop: 40 }}>
  <h2>🛡️ Обнаруженные угрозы</h2>
  {displayedReviews.length === 0 ? (
    <p>Угрозы не обнаружены (отзывы отсутствуют).</p>
  ) : (
    <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
      {displayedReviews.map((review, index) => {
        const threats = [];

        const reviewText = review.text.toLowerCase();
        const now = Math.floor(Date.now() / 1000);

        // Fake Reviews: одинаковый автор более одного раза
        const sameAuthorCount = displayedReviews.filter(
          (r) => r.author_name === review.author_name
        ).length;
                const spamwords = [
          "making"
        ];
        if (spamwords.some((kw) => reviewText.includes(kw)) || (sameAuthorCount > 1) ){
          threats.push("Spam");
        }
      // Fake News (рус + англ)
        const fakeKeywords = [
          "враньё", "неправда", "фейк", "лживая", // рус/каз
          "fake", "lie", "false", "not true", "fake news", "scam", "misleading" // англ
        ];
        if (fakeKeywords.some((kw) => reviewText.includes(kw))) {
          threats.push("Фейковая информация (Fake News)");
        }

        // Cyberbullying (рус + англ)
        const toxicWords = [
          "тупой", "ненавижу", "отстой", "идиот", "мерзкий", // рус
          "stupid", "hate", "trash", "idiot", "disgusting", "ugly", "racist" // англ
        ];
        if (toxicWords.some((word) => reviewText.includes(word))) {
          threats.push("Насилие в комментариях (Cyberbullying)");
        }

        // Negative SEO (симуляция по ключевым словам)
        const seoKeywords = ["поисковик", "google", "ranking", "seo", "search engine"];
        if (seoKeywords.some((kw) => reviewText.includes(kw))) {
          threats.push("SEO-атака (Negative SEO)");
        }

        return (
          threats.length > 0 && (
            <div
              key={index}
              style={{
                border: "1px solid #ff9800",
                padding: 15,
                borderRadius: 8,
                backgroundColor: "#fff3e0",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <p>
                <strong>{review.author_name[0]}</strong> написал: {review.text}
              </p>
              <ul style={{ marginTop: 10 }}>
                {threats.map((threat, idx) => (
                  <li key={idx} style={{ color: "#e65100", fontWeight: "bold" }}>
                    ⚠️ {threat}
                  </li>
                ))}
              </ul>
            </div>
          )
        );
      })}
    </div>
  )}
</div>


            {/* 📄 Отчёты */}
            <div style={{ marginTop: 40 }}>
              <h2>Скачать отчёт</h2>
              <label>
                Период:
                <select
                  value={reportPeriod}
                  onChange={(e) => setReportPeriod(e.target.value)}
                  style={{ marginLeft: 10 }}
                >
                  <option value="week">Неделя</option>
                  <option value="month">Месяц</option>
                </select>
              </label>
              <div style={{ marginTop: 10 }}>
                <button
                  onClick={handleDownloadPDF}
                  style={{
                    marginRight: 10,
                    padding: "0.5rem 1rem",
                    backgroundColor: "#4caf50",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  Скачать PDF
                </button>
                <CSVLink
                  data={csvData}
                  filename={"отчёт.csv"}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "#1976d2",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    textDecoration: "none",
                  }}
                >
                  Скачать CSV
                </CSVLink>
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Dashboard;
