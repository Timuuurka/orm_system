import React from "react";

const sentimentColors = {
  positive: "#4caf50",
  neutral: "#9e9e9e",
  negative: "#f44336",
};

const ReportSummary = ({ reviews }) => {
  const total = reviews.length;
  const counts = reviews.reduce(
    (acc, r) => {
      acc[r.sentiment] = (acc[r.sentiment] || 0) + 1;
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0 }
  );

  return (
    <div className="bg-white p-4 border rounded shadow">
      <p>
        <strong>Всего отзывов:</strong> {total}
      </p>
      <p>
        <strong>Позитивных:</strong>{" "}
        <span style={{ color: sentimentColors.positive }}>
          {counts.positive || 0}
        </span>
      </p>
      <p>
        <strong>Нейтральных:</strong>{" "}
        <span style={{ color: sentimentColors.neutral }}>
          {counts.neutral || 0}
        </span>
      </p>
      <p>
        <strong>Негативных:</strong>{" "}
        <span style={{ color: sentimentColors.negative }}>
          {counts.negative || 0}
        </span>
      </p>
      <p className="mt-2">
        <strong>Пример:</strong> {reviews[0]?.text || "Нет отзывов"}
      </p>
    </div>
  );
};

export default ReportSummary;
