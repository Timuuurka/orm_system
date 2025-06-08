import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Преобразуем отзывы в данные для графика (подсчёт по датам)
function groupReviewsByDate(reviews) {
  const groups = {};

  reviews.forEach(({ sentiment, time }) => {
    const date = new Date(time * 1000).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = { date, positive: 0, neutral: 0, negative: 0, unknown: 0 };
    }
    const s = sentiment || "unknown";
    groups[date][s] = (groups[date][s] || 0) + 1;
  });

  return Object.values(groups).sort((a, b) =>
    new Date(a.date) - new Date(b.date)
  );
}

const SentimentChart = ({ reviews }) => {
  const data = groupReviewsByDate(reviews);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 0 }}>
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey="positive" stackId="a" fill="#4caf50" />
        <Bar dataKey="neutral" stackId="a" fill="#9e9e9e" />
        <Bar dataKey="negative" stackId="a" fill="#f44336" />
        <Bar dataKey="unknown" stackId="a" fill="#000000" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SentimentChart;
