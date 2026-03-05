const BASE_URL = "https://mcq-backend-f1oz.onrender.com";

async function apiFetch(path, options = {}) {
  const res = await fetch(BASE_URL + path, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
