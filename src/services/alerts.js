// services/alerts.js

export const detectAnomalyAlert = (reviews) => {
  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;

  const last24hReviews = reviews.filter(
    (r) => r.time * 1000 >= oneDayAgo
  );

  const total = last24hReviews.length;
  const negativeCount = last24hReviews.filter(
    (r) => r.sentiment === "negative"
  ).length;

  const negativeRatio = total > 0 ? negativeCount / total : 0;

  if (negativeRatio > 0.3) {
    return {
      id: Date.now(),
      type: "anomaly",
      message: `🚨 Внимание: За последние 24 часа доля негативных отзывов составила ${(negativeRatio * 100).toFixed(0)}%`,
      timestamp: new Date().toISOString(),
      resolved: false,
    };
  }

  return null;
};
