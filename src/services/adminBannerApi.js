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

export function getAdminBannersApi() {
  return request("/AdminBanner", {
    method: "GET",
  });
}

export function getPublicBannersApi() {
  return request("/Banner", {
    method: "GET",
  });
}

export function createAdminBannerApi({
  imageFile,
  redirectUrl,
  displayOrder,
  startDate,
  endDate,
}) {
  const formData = new FormData();
  if (imageFile) {
    formData.append("ImageUrl", imageFile);
  }
  formData.append("RedirectUrl", redirectUrl || "");
  formData.append("DisplayOrder", String(displayOrder || 1));
  formData.append("StartDate", startDate || "");
  formData.append("EndDate", endDate || "");

  return request("/AdminBanner", {
    method: "POST",
    body: formData,
  });
}

export function updateAdminBannerApi({
  bannerId,
  imageFile,
  redirectUrl,
  displayOrder,
  startDate,
  endDate,
  isActive,
}) {
  const formData = new FormData();
  if (imageFile) {
    formData.append("ImageUrl", imageFile);
  }
  formData.append("RedirectUrl", redirectUrl || "");
  formData.append("DisplayOrder", String(displayOrder || 1));
  formData.append("StartDate", startDate || "");
  formData.append("EndDate", endDate || "");
  formData.append("IsActive", String(Boolean(isActive)));

  return request(`/AdminBanner/${bannerId}`, {
    method: "PUT",
    body: formData,
  });
}

export function deleteAdminBannerApi(bannerId) {
  return request(`/AdminBanner/${bannerId}`, {
    method: "DELETE",
  });
}
