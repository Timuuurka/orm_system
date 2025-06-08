export async function analyzeSentiment(text) {
  const response = await fetch(
    "https://router.huggingface.co/hf-inference/models/tabularisai/multilingual-sentiment-analysis",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer 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`, // или из конфига
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

  // Проверяем корректность ответа
  if (!Array.isArray(result) || !result[0] || !Array.isArray(result[0])) {
    return "unknown";
  }

  // Находим объект с максимальным score
  const maxScoreObj = result[0].reduce((maxObj, current) => {
    return current.score > maxObj.score ? current : maxObj;
  }, { score: -Infinity });

  if (!maxScoreObj || !maxScoreObj.label) return "unknown";

  // Нормализуем лейбл
  const labelRaw = maxScoreObj.label.toLowerCase();

  if (labelRaw.includes("positive")) return "positive";
  if (labelRaw.includes("neutral")) return "neutral";
  if (labelRaw.includes("negative")) return "negative";

  return "unknown";
}
