import { getStoredTokens, refreshTokenManual } from "./authApi";

const API_BASE_URL =
  "https://teashop-api-e7bbf0cydwe2c0ay.southeastasia-01.azurewebsites.net/api";

async function parseResponse(response) {
  let payload = null;
  try {
    payload = await response.json();
  } catch (error) {
    payload = {
      isSucess: false,
      data: null,
      businessCode: 0,
      message: `Yeu cau that bai (HTTP ${response.status}).`,
    };
  }

  return payload;
}

async function requestWithAuth(path, options = {}, retry = true) {
  const { accessToken, refreshToken } = getStoredTokens();
  const hasBody = options?.body !== undefined;
  const isFormDataBody =
    typeof FormData !== "undefined" && options?.body instanceof FormData;

  const buildHeaders = (token) => ({
    ...(hasBody && !isFormDataBody ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers || {}),
  });

  const requestAnonymous = () =>
    fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: buildHeaders(null),
    });

  if (!accessToken) {
    return requestAnonymous();
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: buildHeaders(accessToken),
  });

  if (response.status === 401 && retry) {
    if (!refreshToken) {
      return response;
    }

    try {
      const refreshed = await refreshTokenManual();
      return fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: buildHeaders(refreshed?.accessToken),
      });
    } catch (error) {
      return response;
    }
  }

  return response;
}

async function request(path, options = {}) {
  const response = await requestWithAuth(path, options, true);
  const payload = await parseResponse(response);

  if (!response.ok || !payload?.isSucess) {
    const error = new Error(payload?.message || "Khong the thuc hien yeu cau add-on.");
    error.payload = payload;
    throw error;
  }

  return payload;
}

async function requestAnonymous(path, options = {}) {
  const hasBody = options?.body !== undefined;
  const isFormDataBody =
    typeof FormData !== "undefined" && options?.body instanceof FormData;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(hasBody && !isFormDataBody ? { "Content-Type": "application/json" } : {}),
      ...(options?.headers || {}),
    },
  });

  const payload = await parseResponse(response);

  if (!response.ok || !payload?.isSucess) {
    const error = new Error(payload?.message || "Khong the thuc hien yeu cau add-on.");
    error.payload = payload;
    throw error;
  }

  return payload;
}

export async function getAddonsApi() {
  try {
    return await request("/Addon", {
      method: "GET",
    });
  } catch (error) {
    const message = String(error?.message || "").toLowerCase();
    const shouldRetryAnonymous = message.includes("403") || message.includes("forbidden");

    if (!shouldRetryAnonymous) {
      throw error;
    }

    return requestAnonymous("/Addon", {
      method: "GET",
    });
  }
}

export function createAddonApi({ name, price }) {
  return request("/Addon", {
    method: "POST",
    body: JSON.stringify({
      name: name || "",
      price: Number(price || 0),
    }),
  });
}

export function updateAddonApi({ addonId, name, price }) {
  return request(`/Addon/${addonId}`, {
    method: "PUT",
    body: JSON.stringify({
      name: name || "",
      price: Number(price || 0),
    }),
  });
}

export function deleteAddonApi(addonId) {
  return request(`/Addon/${addonId}`, {
    method: "DELETE",
  });
}
