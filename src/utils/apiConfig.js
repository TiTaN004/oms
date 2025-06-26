// src/utils/apiConfig.js
const API_BASE_URL = "http://localhost/freelancing/oms-api";

// API endpoints
export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login.php`,
  VERIFY_TOKEN: `${API_BASE_URL}/auth/verify-token.php`,
  LOGOUT: `${API_BASE_URL}/auth/logout.php`,

  // Password Reset
  FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password.php`,
  RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password.php`,

  // Orders
  ORDERS: `${API_BASE_URL}/order/order.php`,

  // casting orders
  CASTING_ORDERS: `${API_BASE_URL}/casting-order/casting-order.php`,

  // Master data
  WEIGHT_TYPES: `${API_BASE_URL}/weight-types.php`,

  //products
  PRODUCTS: `${API_BASE_URL}/product/product.php`,

  //client master
  CLIENTS: `${API_BASE_URL}/client-master/client-master.php`,
  
  //users
  USERS: `${API_BASE_URL}/user/user.php`,

  //operations apis
  OPERATIONS: `${API_BASE_URL}/operation/operation-type.php`,

  //weight apis
  WEIGHT: `${API_BASE_URL}/weight/weight.php`,
  
  // Dashboard
  DASHBOARD_STATS: `${API_BASE_URL}/dashboard-stats.php`,
  
  //report
  REPORT: `${API_BASE_URL}/report/report.php`,

  //report
  DASHBOARD: `${API_BASE_URL}/report/dashboard.php`,

};

// API utility functions
export class ApiService {
  static async request(url, options = {}) {
    const token = localStorage.getItem("authToken");

    const defaultOptions = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    const config = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      // Handle token expiration
      if (data.statusCode === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        window.location.href = "/";
        return null;
      }

      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  static async get(url) {
    return this.request(url, { method: "GET" });
  }

  static async post(url, data) {
    return this.request(url, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async put(url, data) {
    return this.request(url, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  static async delete(url) {
    return this.request(url, { method: "DELETE" });
  }
}

// Response handler utility
export const handleApiResponse = (response) => {
  if (response.statusCode === 200 && response.outVal === 1) {
    return response.data;
  } else {
    throw new Error(response.message || "API request failed");
  }
};

export default API_ENDPOINTS;
