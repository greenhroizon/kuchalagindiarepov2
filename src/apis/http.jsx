import axios from "axios";
import toast from "../utils/toast";
import { baseUrl, showConsole } from "./env";

// Get CSRF token from cookies
// function getCSRFToken() {
//   const match = document.cookie.match(/(^| )csrfToken=([^;]+)/);
//   return match ? match[2] : null;
// }

const axiosInstance = axios.create({
  baseURL: baseUrl,
});

/* ============================
   PUBLIC ROUTES (NO TOKEN)
============================ */

const PUBLIC_PATHS = [
  "login",
  "forgot-password",
  "reset-password",
  "sendOtp",
  "verify-otp",
  "verify-reset-otp",
  "google-login",
];

/* ============================
   REQUEST INTERCEPTOR
============================ */

axiosInstance.interceptors.request.use(
  (config) => {
    const url = (config.url || "").replace(/^\//, "");

    // Public routes (no auth header)
    const isPublic = PUBLIC_PATHS.some((path) => url.startsWith(path));

    if (!isPublic) {
      const rawToken =
        sessionStorage.getItem("userLoggedIn") ||
        sessionStorage.getItem("token");

      if (rawToken) {
        config.headers = {
          ...config.headers,
          Authorization: rawToken.startsWith("Bearer ")
            ? rawToken
            : `Bearer ${rawToken}`,
        };
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);


axiosInstance.interceptors.response.use(
  (response) => {
    const method = response.config.method?.toLowerCase();
    const showSuccess = response.config?.showSuccessToast !== false;

    const successMessage = response.data?.message || "Operation successful";

    // show success only for write operations
    if (showSuccess && ["post", "put", "patch", "delete"].includes(method)) {
      if (successMessage !== "Address updated successfully") {
        toast.success(successMessage);
      }
    }

    return response;
  },
  (error) => {
    const status = error?.response?.status;
    const errorMsg = error?.response?.data?.message || "Something went wrong!";

    const url = (error?.config?.url || "").replace(/^\//, "");
    const isPublicRequest = PUBLIC_PATHS.some((p) => url.startsWith(p));

    if (status === 401 && !isPublicRequest) {
      // sessionStorage.clear();
      toast.error("Login Required");
    } else if ([400, 404, 500].includes(status)) {
      toast.error(errorMsg);
    } else if (
      error.message === "Network Error" ||
      error.message?.includes("ERR_INTERNET_DISCONNECTED")
    ) {
      toast.error("Network Error Occurred");
    } else {
      toast.error(errorMsg);
    }

    return Promise.reject(error);
  },
);


const http = {
  get: (path) => axiosInstance.get(path).then((res) => res.data),

  post: (path, body) => axiosInstance.post(path, body).then((res) => res.data),

  put: (path, body) => axiosInstance.put(path, body).then((res) => res.data),

  patch: (path, body) =>
    axiosInstance.patch(path, body).then((res) => res.data),

  delete: (path, data) =>
    axiosInstance.delete(path, { data }).then((res) => res.data),

  /* ---------- FORM DATA ---------- */

  postFormData: (path, body) =>
    axiosInstance
      .post(path, body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => res.data),

  putFormData: (path, body) =>
    axiosInstance
      .put(path, body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => res.data),

  patchFormData: (path, body) =>
    axiosInstance
      .patch(path, body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => res.data),

  /* ---------- SPECIAL CASE ---------- */

  resetPassword: (path, body) =>
    axiosInstance
      .patch(path, body, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("verifyToken")}`,
        },
      })
      .then((res) => res.data),
};

const errorResponseHandler = (error) => {
  if (
    showConsole &&
    error &&
    error.response &&
    error.response.data &&
    error.response.data.message
  ) {
    console.log(error.response.data.message);
  }
};

export { http, errorResponseHandler };
