const API_URL = "http://localhost:5000/api";

export async function apiRequest(endpoint, method = "GET", body = null, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  if (!res.ok) {
  let errorMessage = `Status ${res.status}`;
  try {
    const data = await res.json();
    errorMessage = data.error || data.msg || JSON.stringify(data);
  } catch {
    // fallback: leave errorMessage as is
  }
  throw new Error(`API Error ${res.status}: ${errorMessage}`);
}


  return res.json();
}

