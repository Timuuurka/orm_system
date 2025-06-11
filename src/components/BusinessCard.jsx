import React from "react";

const sentimentColors = {
  positive: "#4caf50",
  neutral: "#9e9e9e",
  negative: "#f44336",
  unknown: "#000000",
};

function BusinessCard({ business, reviews }) {
  if (!business) return null;

  const averageRating =
    business.rating !== undefined ? business.rating.toFixed(1) : "N/A";

  const sentimentCounts = reviews.reduce(
    (acc, review) => {
      const sentiment = review.sentiment || "unknown";
      if (!acc[sentiment]) acc[sentiment] = 0;
      acc[sentiment]++;
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0, unknown: 0 }
  );

  const total = reviews.length || 1;

  return (
    <div className="p-4 rounded-lg shadow-md border border-gray-300 max-w-md">
      <h2 className="text-xl font-semibold">{business.name}</h2>
      <p className="text-gray-600">{business.formatted_address}</p>
      <p className="mt-2">
        <strong>Средний рейтинг:</strong> {averageRating} ⭐
      </p>
      <p className="mt-1">
        <strong>Всего отзывов:</strong> {business.user_ratings_total || "?"}
      </p>
      <div className="mt-2 flex space-x-4">
        <div>
          <span
            className="font-semibold"
            style={{ color: sentimentColors.positive }}
          >
            Позитивных:{" "}
            {((sentimentCounts.positive / total) * 100).toFixed(0)}%
          </span>
        </div>
        <div>
          <span
            className="font-semibold"
            style={{ color: sentimentColors.neutral }}
          >
            Нейтральных:{" "}
            {((sentimentCounts.neutral / total) * 100).toFixed(0)}%
          </span>
        </div>
        <div>
          <span
            className="font-semibold"
            style={{ color: sentimentColors.negative }}
          >
            Негативных:{" "}
            {((sentimentCounts.negative / total) * 100).toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default BusinessCard;
