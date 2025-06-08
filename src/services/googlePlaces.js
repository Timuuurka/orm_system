export const fetchPlaceDetails = async (placeId, apiKey) => {
  const endpoint = `https://corsproxy.io/?https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`;
  const response = await fetch(endpoint);
  const data = await response.json();

  if (data.status !== "OK") {
    throw new Error(data.error_message || "Не удалось получить детали места");
  }

  return data.result;
};
