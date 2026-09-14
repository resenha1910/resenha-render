export const loadNews = async () => {
  const response = await fetch(
    "http://localhost:3001/data/news.json"
  );

  return await response.json();
};