import { HUGGINGFACE_API_KEY  } from "../config";
// services/sentiment.js
export async function analyzeSentiment(text) {
  const response = await fetch("https://api-inference.huggingface.co/tabularisai/multilingual-sentiment-analysis", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HUGGINGFACE_API_KEY }`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs: text }),
  });

  if (!response.ok) {
    throw new Error(`Hugging Face API error: ${response.statusText}`);
  }

  const result = await response.json();

  if (!Array.isArray(result) || !result[0]) {
    return "unknown";
  }

  const label = result[0][0].label.toLowerCase(); // "POSITIVE", "NEUTRAL", "NEGATIVE"

  return label === "positive" || label === "neutral" || label === "negative"
    ? label
    : "unknown";
}
