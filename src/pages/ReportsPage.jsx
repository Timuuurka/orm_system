import React, { useState } from "react";
import PeriodSelector from "../components/PeriodSelector";
import ReportSummary from "../components/ReportSummary";
import { exportPDF, exportCSV } from "../utils/exportReport";
import { filterReviewsByPeriod } from "../utils/reportHelpers";
import { useReviews } from "../context/ReviewsContext"; // Предположим, контекст с отзывами уже есть

const ReportsPage = () => {
  const { reviews } = useReviews();
  const [period, setPeriod] = useState("week");

  const filteredReviews = filterReviewsByPeriod(reviews, period);

  const handleDownload = (type) => {
    if (type === "pdf") exportPDF(filteredReviews, period);
    else if (type === "csv") exportCSV(filteredReviews, period);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Генерация отчётов</h1>
      <PeriodSelector period={period} setPeriod={setPeriod} />
      <ReportSummary reviews={filteredReviews} />
      <div className="flex gap-4 mt-4">
        <button onClick={() => handleDownload("pdf")} className="btn-blue">
          Скачать PDF
        </button>
        <button onClick={() => handleDownload("csv")} className="btn-outline">
          Скачать CSV
        </button>
      </div>
    </div>
  );
};

export default ReportsPage;
