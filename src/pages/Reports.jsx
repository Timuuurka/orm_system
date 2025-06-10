import React, { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";
import { useReviews } from "../context/ReviewsContext";

const periods = {
  week: 7 * 24 * 60 * 60,
  month: 30 * 24 * 60 * 60,
};

const Reports = () => {
  const { reviews, selectedBusiness } = useReviews();
  const [period, setPeriod] = useState("week");

  const now = Math.floor(Date.now() / 1000);
  const filtered = reviews.filter(
    (r) => now - r.time <= periods[period]
  );

  const total = filtered.length;
  const stats = {
    positive: filtered.filter((r) => r.sentiment === "positive").length,
    neutral: filtered.filter((r) => r.sentiment === "neutral").length,
    negative: filtered.filter((r) => r.sentiment === "negative").length,
    unknown: filtered.filter((r) => r.sentiment === "unknown").length,
  };

  const downloadCSV = () => {
    const header = ["Автор", "Оценка", "Сентимент", "Текст"];
    const rows = filtered.map((r) => [
      r.author_name,
      r.rating,
      r.sentiment,
      r.text.replace(/\n/g, " "),
    ]);
    const csvContent = [header, ...rows]
      .map((e) => e.map((v) => `"${v}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `report_${period}.csv`);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Отчёт по отзывам", 14, 20);
    doc.setFontSize(12);
    doc.text(
      `Организация: ${selectedBusiness?.name || "Не выбрана"}`,
      14,
      28
    );
    doc.text(`Период: ${period === "week" ? "Неделя" : "Месяц"}`, 14, 36);
    doc.text(`Всего отзывов: ${total}`, 14, 44);
    doc.text(`Позитивных: ${stats.positive}`, 14, 52);
    doc.text(`Нейтральных: ${stats.neutral}`, 14, 60);
    doc.text(`Негативных: ${stats.negative}`, 14, 68);

    autoTable(doc, {
      startY: 78,
      head: [["Автор", "Оценка", "Сентимент", "Текст"]],
      body: filtered.map((r) => [
        r.author_name,
        r.rating,
        r.sentiment,
        r.text,
      ]),
    });

    doc.save(`report_${period}.pdf`);
  };

  return (
    <MainLayout title="Reports">
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem" }}>
        <h1>Отчёты</h1>

        {!selectedBusiness ? (
          <p>Выберите бизнес на Dashboard, чтобы создать отчёт.</p>
        ) : (
          <>
            <div style={{ marginBottom: 20 }}>
              <label style={{ marginRight: 10 }}>Период:</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                style={{ padding: "0.5rem", fontSize: "1rem" }}
              >
                <option value="week">Последние 7 дней</option>
                <option value="month">Последние 30 дней</option>
              </select>
            </div>

            <p>Всего отзывов: <strong>{total}</strong></p>
            <ul>
              <li>😊 Позитивных: {stats.positive}</li>
              <li>😐 Нейтральных: {stats.neutral}</li>
              <li>😠 Негативных: {stats.negative}</li>
              <li>❓ Неопределённых: {stats.unknown}</li>
            </ul>

            <div style={{ marginTop: 30 }}>
              <button
                onClick={downloadPDF}
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

              <button
                onClick={downloadCSV}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#1976d2",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                Скачать CSV
              </button>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Reports;
