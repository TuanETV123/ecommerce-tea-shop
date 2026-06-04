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
    ...(hasBody && !isFormDataBody
      ? { "Content-Type": "application/json" }
      : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers || {}),
  });

  const requestAnonymous = () =>
    fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: buildHeaders(null),
    });

  // If there is no access token, call as anonymous directly.
  if (!accessToken) {
    return requestAnonymous();
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: buildHeaders(accessToken),
  });

  if (response.status === 401 && retry) {
    // Do not try refresh flow when refresh token is absent.
    if (!refreshToken) {
      return response;
    }

    console.log(`[ProductApi] 401 at ${path}. Trying refresh...`);
    try {
      const refreshed = await refreshTokenManual();
      const retried = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: buildHeaders(refreshed?.accessToken),
      });

      if (retried.status === 401) {
        // Endpoint may require auth and refreshed token is still invalid.
        return retried;
      }

      return retried;
    } catch (error) {
      console.log(
        "[ProductApi] Refresh failed while requesting product/category API.",
      );
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

async function get(path) {
  return request(path, { method: "GET" });
}

export function getProductsApi({ pageNumber = 1, pageSize = 10 } = {}) {
  return get(`/product?pageNumber=${pageNumber}&pageSize=${pageSize}`);
}

export function getProductDetailApi(productId) {
  return get(`/product/${productId}`);
}

export function searchProductsApi({ keyword, pageNumber = 1, pageSize = 10 }) {
  const params = new URLSearchParams({
    keyword: keyword || "",
    pageNumber: pageNumber.toString(),
    pageSize: pageSize.toString(),
  });

  return get(`/product/search?${params.toString()}`);
}

export function getProductsByCategoryApi({
  categoryId,
  pageNumber = 1,
  pageSize = 10,
}) {
  return get(
    `/product/category/${categoryId}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
  );
}

export function getCategoriesApi({ pageNumber = 1, pageSize = 10 } = {}) {
  return get(`/category?pageNumber=${pageNumber}&pageSize=${pageSize}`);
}

export function searchCategoriesApi({
  keyword,
  pageNumber = 1,
  pageSize = 10,
}) {
  const encodedKeyword = encodeURIComponent(keyword || "");
  return get(
    `/category/search?keyword=${encodedKeyword}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
  );
}

export function getAdminProductsApi({ pageNumber = 1, pageSize = 10 } = {}) {
  return get(
    `/AdminProduct/list?pageNumber=${pageNumber}&pageSize=${pageSize}`,
  );
}

export function getAdminCategoriesApi({ pageNumber = 1, pageSize = 10 } = {}) {
  return get(`/admin/category?pageNumber=${pageNumber}&pageSize=${pageSize}`);
}

export function getAdminCategoryDetailApi(categoryId) {
  return get(`/admin/category/${categoryId}`);
}

export function createAdminCategoryApi({ name, image }) {
  const formData = new FormData();
  formData.append("Name", name || "");
  if (image) {
    formData.append("Image", image);
  }

  return request(`/admin/category`, {
    method: "POST",
    body: formData,
  });
}

export function updateAdminCategoryApi({ categoryId, name, image }) {
  const formData = new FormData();
  formData.append("Name", name || "");
  if (image) {
    formData.append("Image", image);
  }

  return request(`/admin/category/${categoryId}`, {
    method: "PUT",
    body: formData,
  });
}

export function deleteAdminCategoryApi(categoryId) {
  return request(`/admin/category/${categoryId}`, {
    method: "DELETE",
  });
}

export function getAdminProductDetailApi(productId) {
  return get(`/AdminProduct/detail/${productId}`);
}

export function createAdminProductApi({
  name,
  description,
  categoryId,
  variants = [],
  images = [],
}) {
  const formData = new FormData();
  formData.append("Name", name || "");
  formData.append("Description", description || "");
  formData.append("CategoryId", categoryId || "");
  formData.append("Variants", JSON.stringify(variants || []));

  (images || []).forEach((file) => {
    if (file) {
      formData.append("Images", file);
    }
  });

  return request("/AdminProduct/create", {
    method: "POST",
    body: formData,
  });
}

export function updateAdminProductApi({
  productId,
  name,
  description,
  categoryId,
  isActive,
  newImages = [],
}) {
  const formData = new FormData();
  formData.append("Name", name || "");
  formData.append("Description", description || "");
  formData.append("CategoryId", categoryId || "");
  formData.append("IsActive", String(Boolean(isActive)));

  (newImages || []).forEach((file) => {
    if (file) {
      formData.append("NewImages", file);
    }
  });

  return request(`/AdminProduct/update/${productId}`, {
    method: "PUT",
    body: formData,
  });
}

export function updateAdminProductVariantApi({
  variantId,
  price,
  stockQuantity,
}) {
  return request(`/AdminProduct/update-variant/${variantId}`, {
    method: "PUT",
    body: JSON.stringify({
      price: Number(price),
      stockquantity: Number(stockQuantity),
    }),
  });
}

export function setAdminProductMainImageApi(imageId) {
  return request(`/AdminProduct/set-main-image/${imageId}`, {
    method: "PUT",
  });
}

export function deleteAdminProductImageApi(imageId) {
  return request(`/AdminProduct/delete-image/${imageId}`, {
    method: "DELETE",
  });
}

export function deleteAdminProductApi(productId) {
  return request(`/AdminProduct/delete/${productId}`, {
    method: "DELETE",
  });
}
