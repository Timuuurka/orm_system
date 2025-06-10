export const filterReviewsByPeriod = (reviews, period = "week") => {
  const now = Date.now();
  const msInDay = 24 * 60 * 60 * 1000;
  const threshold =
    period === "week" ? now - 7 * msInDay : now - 30 * msInDay;

  return reviews.filter((r) => (r.time * 1000) > threshold);
};
