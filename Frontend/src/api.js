const getApiBaseUrl = () => {
  const configuredUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const normalizedUrl = configuredUrl.replace(/\/+$/, "");

  return normalizedUrl.endsWith("/api") ? normalizedUrl : `${normalizedUrl}/api`;
};

const API_BASE_URL = getApiBaseUrl();

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

export default request;
