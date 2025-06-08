import { HUGGINGFACE_API_KEY } from "../config";

export async function analyzeSentiment(text) {
  const response = await fetch(
    "https://router.huggingface.co/hf-inference/models/tabularisai/multilingual-sentiment-analysis",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer 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`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: text }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Hugging Face API error: ${errorText}`);
  }

  const result = await response.json();

  // Проверяем, что ответ корректный и парсим лейбл
  if (!Array.isArray(result) || !result[0] || !result[0][0]) {
    return "unknown";
  }

  const label = result[0][0].label.toLowerCase(); // "POSITIVE", "NEUTRAL", "NEGATIVE"

  return ["positive", "neutral", "negative"].includes(label) ? label : "unknown";
}
