const API_BASE_URL =
  "https://teashop-api-e7bbf0cydwe2c0ay.southeastasia-01.azurewebsites.net/api/auth";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

function canUseStorage() {
  return typeof window !== "undefined";
}

export function setStoredTokens(accessToken, refreshToken) {
  if (!canUseStorage()) {
    return;
  }

  if (accessToken) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }

  if (refreshToken) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
}

export function getStoredTokens() {
  if (!canUseStorage()) {
    return {
      accessToken: null,
      refreshToken: null,
    };
  }

  return {
    accessToken: window.localStorage.getItem(ACCESS_TOKEN_KEY),
    refreshToken: window.localStorage.getItem(REFRESH_TOKEN_KEY),
  };
}

export function clearStoredTokens() {
  if (!canUseStorage()) {
    return;
  }
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
}

async function request(path, options = {}) {
  const { headers: customHeaders, ...restOptions } = options;
  const hasBody = restOptions.body !== undefined;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...restOptions,
    headers: {
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
      ...(customHeaders || {}),
    },
  });

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

  if (!response.ok || !payload?.isSucess) {
    const error = new Error(
      payload?.message || "Yeu cau khong thanh cong. Vui long thu lai.",
    );
    error.payload = payload;
    throw error;
  }

  return payload;
}

export function loginApi(body) {
  return request("/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function googleLoginApi(body) {
  return request("/google", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function registerApi(body) {
  return request("/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function verifyOtpApi(body) {
  return request("/verify-otp", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function resendOtpApi(body) {
  return request("/resend-otp", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function forgotPasswordApi(body) {
  return request("/forgot-password", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function resetPasswordApi(body) {
  return request("/reset-password", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function changePasswordApi({ accessToken, currentPassword, newPassword }) {
  return request("/change-password", {
    method: "POST",
    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function logoutApi({ accessToken, refreshToken }) {
  const payload = { refreshToken };
  console.log("[Auth] Logout payload:", payload);

  return request("/logout", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function refreshTokenManual() {
  const { refreshToken } = getStoredTokens();

  console.log("[Auth] Manual refresh: start");
  if (!refreshToken) {
    console.log("[Auth] Manual refresh: no refreshToken in localStorage");
    throw new Error("Khong tim thay refresh token.");
  }

  const response = await request("/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });

  const data = response?.data || {};
  setStoredTokens(data.accessToken, data.refreshToken);
  console.log("[Auth] Manual refresh: success, tokens updated");

  return data;
}
