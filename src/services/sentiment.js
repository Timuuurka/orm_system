import { HUGGINGFACE_API_KEY } from "../config";

export async function analyzeSentiment(text) {
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
    console.error("Hugging Face API error response:", errorText);
    throw new Error(`Hugging Face API error: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  console.log("Hugging Face API result:", result);

  if (!Array.isArray(result) || !result[0] || !result[0][0]) {
    return "unknown";
  }

  const label = result[0][0].label.toLowerCase();

  return ["positive", "neutral", "negative"].includes(label) ? label : "unknown";
}

