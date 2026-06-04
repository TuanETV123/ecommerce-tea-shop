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
      message: `Không đọc được dữ liệu (HTTP ${response.status}).`,
      data: null,
      businessCode: 0,
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
    const error = new Error(payload?.message || "Yêu cầu API thất bại.");
    error.payload = payload;
    throw error;
  }

  return payload;
}

export function getAdminUsersApi({ pageNumber = 1, pageSize = 10 } = {}) {
  return request(`/AdminUser?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
    method: "GET",
  });
}

export function getAdminUserDetailApi(userId) {
  return request(`/AdminUser/${userId}`, {
    method: "GET",
  });
}

export function getAdminUserStatsApi() {
  return request(`/AdminUser/stats`, {
    method: "GET",
  });
}

export function getAdminUserReviewsApi({ pageNumber = 1, pageSize = 10 } = {}) {
  return request(`/AdminUser/reviews?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
    method: "GET",
  });
}

async function actionWithFallback(path) {
  try {
    return await request(path, { method: "PUT" });
  } catch (error) {
    const message = String(error?.message || "");
    if (!message.includes("405")) {
      throw error;
    }

    return request(path, { method: "POST" });
  }
}

export function blockAdminUserApi(userId) {
  return actionWithFallback(`/AdminUser/block/${userId}`);
}

export function unblockAdminUserApi(userId) {
  return actionWithFallback(`/AdminUser/unblock/${userId}`);
}
