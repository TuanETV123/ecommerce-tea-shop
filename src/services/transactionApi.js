import { getStoredTokens, refreshTokenManual } from "./authApi";

const API_BASE_URL =
  "https://teashop-api-e7bbf0cydwe2c0ay.southeastasia-01.azurewebsites.net/api";

function ensureAuthenticated() {
  const { accessToken } = getStoredTokens();
  if (!accessToken) {
    throw new Error("Vui long dang nhap de xem giao dich.");
  }
}

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
  const { accessToken } = getStoredTokens();
  const hasBody = options?.body !== undefined;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(options?.headers || {}),
    },
  });

  if (response.status === 401 && retry) {
    const refreshed = await refreshTokenManual();
    return fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...(hasBody ? { "Content-Type": "application/json" } : {}),
        ...(refreshed?.accessToken
          ? { Authorization: `Bearer ${refreshed.accessToken}` }
          : {}),
        ...(options?.headers || {}),
      },
    });
  }

  return response;
}

async function request(path, options = {}) {
  const response = await requestWithAuth(path, options, true);
  const payload = await parseResponse(response);

  if (!response.ok || !payload?.isSucess) {
    const error = new Error(payload?.message || "Yeu cau API that bai.");
    error.payload = payload;
    throw error;
  }

  return payload;
}

export function getTransactionsApi() {
  ensureAuthenticated();
  return request("/Transaction", {
    method: "GET",
  });
}
