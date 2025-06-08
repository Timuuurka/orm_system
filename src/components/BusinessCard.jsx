import React from "react";

const sentimentColors = {
  positive: "#4caf50",
  neutral: "#9e9e9e",
  negative: "#f44336",
};

export default function BusinessCard({ business, reviews }) {
  if (!business) return null;

  const total = reviews.length;
  const counts = { positive: 0, neutral: 0, negative: 0 };

  reviews.forEach((review) => {
    if (review.sentiment && counts.hasOwnProperty(review.sentiment)) {
      counts[review.sentiment]++;
    }
  });

  const percent = (count) => (total === 0 ? 0 : ((count / total) * 100).toFixed(1));

  const averageRating =
    total === 0
      ? 0
      : (reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1);

  return (
    <div className="border p-4 rounded shadow-md bg-white max-w-md">
      <h2 className="text-xl font-semibold mb-2">{business.name}</h2>
      <p className="mb-2">{business.formatted_address || business.address}</p>
      <p className="mb-2">
        Средний рейтинг: <strong>{averageRating}</strong> из 5 ({total} отзывов)
      </p>
      <div className="flex space-x-4">
        <div>
          <span
            style={{ color: sentimentColors.positive, fontWeight: "bold" }}
          >
            Позитивные:
          </span>{" "}
          {counts.positive} ({percent(counts.positive)}%)
        </div>
        <div>
          <span style={{ color: sentimentColors.neutral, fontWeight: "bold" }}>
            Нейтральные:
          </span>{" "}
          {counts.neutral} ({percent(counts.neutral)}%)
        </div>
        <div>
          <span style={{ color: sentimentColors.negative, fontWeight: "bold" }}>
            Негативные:
          </span>{" "}
          {counts.negative} ({percent(counts.negative)}%)
        </div>
      </div>
    </div>
  );
}
