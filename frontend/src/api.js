import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api"
});

export async function requestWithLog({
  method,
  url,
  data,
  token,
  setLastExchange
}) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const started = performance.now();
  try {
    const response = await api.request({ method, url, data, headers });
    const duration = (performance.now() - started).toFixed(2);
    console.log("[api]", method.toUpperCase(), url, response.status, `${duration}ms`);
    setLastExchange({
      request: { method: method.toUpperCase(), url, data, headers },
      response: {
        status: response.status,
        data: response.data,
        durationMs: duration
      }
    });
    return response.data;
  } catch (err) {
    const duration = (performance.now() - started).toFixed(2);
    const status = err.response?.status || 500;
    const dataOut = err.response?.data || { error: "Request failed" };
    console.log("[api]", method.toUpperCase(), url, status, `${duration}ms`);
    setLastExchange({
      request: { method: method.toUpperCase(), url, data, headers },
      response: { status, data: dataOut, durationMs: duration }
    });
    throw err;
  }
}

export default api;
