import { HUGGINGFACE_API_KEY  } from "../config";
// services/sentiment.js
export const analyzeSentiment = async (text) => {

  const response = await fetch(
    "https://router.huggingface.co/hf-inference/models/tabularisai/multilingual-sentiment-analysis",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
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
  return result;
};
