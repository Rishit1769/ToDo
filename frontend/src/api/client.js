const RUNTIME_API_BASE_URL = window.__APP_CONFIG__?.API_BASE_URL;
const API_BASE_URL = RUNTIME_API_BASE_URL || process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

function createApiError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

async function request(path, { method = "GET", token, body } = {}) {
  // Centralized request helper keeps auth and JSON handling consistent.
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) {
    return null;
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch (error) {
    payload = null;
  }

  if (!response.ok) {
    throw createApiError(payload?.message || "Request failed.", response.status);
  }

  return payload;
}

export function registerUser(credentials) {
  return request("/api/auth/register", {
    method: "POST",
    body: credentials,
  });
}

export function loginUser(credentials) {
  return request("/api/auth/login", {
    method: "POST",
    body: credentials,
  });
}

export function getTodos(token) {
  return request("/api/todos", { token });
}

export function createTodo(token, task) {
  return request("/api/todos", {
    method: "POST",
    token,
    body: { task },
  });
}

export function toggleTodo(token, id) {
  return request(`/api/todos/${id}`, {
    method: "PUT",
    token,
  });
}

export function deleteTodo(token, id) {
  return request(`/api/todos/${id}`, {
    method: "DELETE",
    token,
  });
}
