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

async function request(path) {
  const response = await fetch(`${API_BASE_URL}${path}`);
  const payload = await parseResponse(response);

  if (!response.ok || !payload?.isSucess) {
    const error = new Error(payload?.message || "Yêu cầu API thất bại.");
    error.payload = payload;
    throw error;
  }

  return payload;
}

export function getBlogsApi({ pageNumber = 1, pageSize = 10 } = {}) {
  return request(`/Blog/list?pageNumber=${pageNumber}&pageSize=${pageSize}`);
}

export function getBlogDetailApi(blogId) {
  return request(`/Blog/${blogId}`);
}
