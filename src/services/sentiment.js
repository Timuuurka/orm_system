import { HF_API_TOKEN } from "../config";

export async function analyzeSentiment(text) {
  const API_URL = "https://api-inference.huggingface.co/models/tabularisai/multilingual-sentiment-analysis";
  const API_TOKEN = HF_API_TOKEN; 

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs: text }),
  });

  if (!response.ok) {
    throw new Error(`Ошибка запроса к HuggingFace: ${response.statusText}`);
  }

  const data = await response.json();

  // Формат ответа: [{ label: "positive", score: 0.9 }, ...]
  if (Array.isArray(data) && data.length > 0) {
    return data[0].label.toLowerCase(); // Возвращаем label в нижнем регистре
  }

  return "unknown";
}
