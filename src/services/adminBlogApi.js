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

export function getAdminBlogsApi({ pageNumber = 1, pageSize = 10 } = {}) {
  return request(
    `/AdminBlog/list?pageNumber=${pageNumber}&pageSize=${pageSize}`,
    {
      method: "GET",
    },
  );
}

export function createAdminBlogApi({
  title,
  content,
  publishDate,
  isPublished,
  thumbnail,
}) {
  const formData = new FormData();
  formData.append("Title", title || "");
  formData.append("Content", content || "");

  if (publishDate) {
    formData.append("PublishDate", publishDate);
  }

  formData.append("IsPublished", String(Boolean(isPublished)));

  if (thumbnail) {
    formData.append("Thumbnail", thumbnail);
  }

  return request("/AdminBlog/create", {
    method: "POST",
    body: formData,
  });
}

export function updateAdminBlogApi({
  blogId,
  title,
  content,
  publishDate,
  isPublished,
  thumbnail,
}) {
  const formData = new FormData();
  formData.append("Title", title || "");
  formData.append("Content", content || "");

  if (publishDate) {
    formData.append("PublishDate", publishDate);
  }

  formData.append("IsPublished", String(Boolean(isPublished)));

  if (thumbnail) {
    formData.append("Thumbnail", thumbnail);
  }

  return request(`/AdminBlog/update/${blogId}`, {
    method: "PUT",
    body: formData,
  });
}

export function deleteAdminBlogApi(blogId) {
  return request(`/AdminBlog/delete/${blogId}`, {
    method: "DELETE",
  });
}
