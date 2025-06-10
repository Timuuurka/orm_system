import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";

export const exportPDF = (reviews, period) => {
  const doc = new jsPDF();
  doc.text(`Отчёт по отзывам (${period})`, 14, 16);

  autoTable(doc, {
    head: [["Автор", "Оценка", "Сентимент", "Отзыв"]],
    body: reviews.map((r) => [
      r.author_name,
      r.rating,
      r.sentiment,
      r.text.slice(0, 100),
    ]),
    startY: 20,
  });

  doc.save(`report_${period}.pdf`);
};

export const exportCSV = (reviews, period) => {
  const headers = ["Автор", "Оценка", "Сентимент", "Текст"];
  const rows = reviews.map((r) => [
    r.author_name,
    r.rating,
    r.sentiment,
    r.text.replace(/\n/g, " "),
  ]);

  const csvContent = [headers, ...rows]
    .map((e) => e.join(","))
    .join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  saveAs(blob, `report_${period}.csv`);
};
