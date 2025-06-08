import { HF_API_TOKEN } from "../config";
export const analyzeSentiment = async (text) => {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/tabularisai/multilingual-sentiment-analysis",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: text }),
    }
  );

  const result = await response.json();

  if (Array.isArray(result) && result[0]) {
    const label = result[0][0].label.toLowerCase(); // "Positive", "Negative", "Neutral"
    return label;
  } else {
    throw new Error("Ошибка при анализе сентимента");
  }
};
