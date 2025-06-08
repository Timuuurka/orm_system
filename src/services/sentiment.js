import { HF_API_TOKEN } from "../config";

const API_URL = "https://api-inference.huggingface.co/models/tabularisai/multilingual-sentiment-analysis";

const HF_TOKEN = HF_API_TOKEN 
export async function analyzeSentiment(text) {
  if (!text || text.trim() === "") return "unknown";

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HF_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs: text }),
  });

  if (!response.ok) {
    console.error("Ошибка Hugging Face API:", response.statusText);
    return "unknown";
  }

  const data = await response.json();

  try {
    const result = Array.isArray(data) ? data[0] : null;
    if (!result || !result.label) return "unknown";

    const label = result.label;
    // Модель возвращает один из: "Very Negative", "Negative", "Neutral", "Positive", "Very Positive"
    if (label.includes("Negative")) return "negative";
    if (label.includes("Positive")) return "positive";
    if (label.includes("Neutral")) return "neutral";

    return "unknown";
  } catch (err) {
    console.error("Ошибка при разборе ответа:", err);
    return "unknown";
  }
}
