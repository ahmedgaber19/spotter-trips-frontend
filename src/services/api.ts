import axios, { AxiosResponse } from "axios";
import {
  TripRequest,
  RouteResponse,
  HealthResponse,
  ApiResponse,
} from "./types";

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://spotter-trips-backend.vercel.app/",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    // Log response data for debugging (limit size)
    if (response.data) {
      const dataString = JSON.stringify(response.data).substring(0, 200);
      console.log(`Response data preview: ${dataString}...`);
    }
    return response;
  },
  (error) => {
    const errorInfo = {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      data: error.response?.data,
      message: error.message,
    };

    console.error("❌ API Response Error:", errorInfo);

    // Add more specific error messages
    if (error.response?.status === 404) {
      console.error("❌ Endpoint not found - check URL and server status");
    } else if (error.response?.status === 500) {
      console.error("❌ Server error - check backend logs");
    } else if (error.code === "NETWORK_ERROR") {
      console.error("❌ Network error - check backend server status");
    }

    return Promise.reject(error);
  }
);

// API service class
class RouteService {
  /**
   * Calculate route with stops and fuel stops
   */
  async calculateRoute(
    tripRequest: TripRequest
  ): Promise<ApiResponse<RouteResponse>> {
    try {
      console.log("🚀 Starting route calculation with:", tripRequest);

      const response: AxiosResponse<RouteResponse> = await apiClient.post(
        "/api/calculate-route/",
        tripRequest
      );

      console.log("✅ Route calculation successful:", {
        status: response.status,
        routeDistance: response.data.route?.distance,
        routeDuration: response.data.route?.duration,
        stopsCount: response.data.stops?.length,
        fuelStopsCount: response.data.fuel_stops?.length,
        eldLogsCount: response.data.eld_logs?.length,
      });

      return {
        data: response.data,
        status: response.status,
      };
    } catch (error: unknown) {
      const axiosError = error as {
        response?: {
          data?: { error?: string };
          status?: number;
          statusText?: string;
        };
        message?: string;
        code?: string;
      };

      const errorDetails = {
        status: axiosError.response?.status || 500,
        message:
          axiosError.response?.data?.error ||
          axiosError.message ||
          "Route calculation failed",
        statusText: axiosError.response?.statusText,
        code: axiosError.code,
      };

      console.error("❌ Route calculation failed:", errorDetails);

      return {
        error: errorDetails.message,
        status: errorDetails.status,
      };
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<ApiResponse<HealthResponse>> {
    try {
      const response: AxiosResponse<HealthResponse> = await apiClient.get(
        "/api/health/"
      );

      return {
        data: response.data,
        status: response.status,
      };
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { error?: string }; status?: number };
        message?: string;
      };
      return {
        error:
          axiosError.response?.data?.error ||
          axiosError.message ||
          "Health check failed",
        status: axiosError.response?.status || 500,
      };
    }
  }

  /**
   * Test connectivity to backend
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.healthCheck();
      return response.status === 200;
    } catch (error) {
      console.error("Backend connection test failed:", error);
      return false;
    }
  }
}

// Export singleton instance
export const routeService = new RouteService();
export default routeService;
