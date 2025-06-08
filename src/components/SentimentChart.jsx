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

// reviews — массив отзывов, каждый должен иметь дату (review.time или review.date) и sentiment

export default function SentimentChart({ reviews }) {
  if (!reviews || reviews.length === 0) return <p>Нет данных для графика</p>;

  // Группируем отзывы по дате (например, по дню)
  const grouped = reviews.reduce((acc, review) => {
    // Предположим review.time — unix timestamp (в секундах)
    const date = new Date(review.time * 1000); 
    const day = date.toISOString().slice(0, 10); // YYYY-MM-DD

    if (!acc[day]) {
      acc[day] = { day, positive: 0, neutral: 0, negative: 0 };
    }

    const sentiment = review.sentiment;

    if (sentiment === "positive") acc[day].positive++;
    else if (sentiment === "neutral") acc[day].neutral++;
    else if (sentiment === "negative") acc[day].negative++;

    return acc;
  }, {});

  // Превращаем объект в массив и сортируем по дате
  const data = Object.values(grouped).sort((a, b) =>
    a.day.localeCompare(b.day)
  );

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="day" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey="positive" fill="#4caf50" />
        <Bar dataKey="neutral" fill="#9e9e9e" />
        <Bar dataKey="negative" fill="#f44336" />
      </BarChart>
    </ResponsiveContainer>
  );
}
