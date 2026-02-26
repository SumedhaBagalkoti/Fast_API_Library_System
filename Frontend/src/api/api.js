const API_URL = "http://127.0.0.1:8000";

export async function apiGet(endpoint) {
  const res = await fetch(`${API_URL}${endpoint}`);
  return res.json();
}

export async function apiPost(endpoint, data) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },  
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function apiPut(endpoint, data) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function apiDelete(endpoint) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "DELETE",
  });
  return res.json();
}