import axios, { AxiosResponse } from "axios";
import { TripRequest, RouteResponse, ApiResponse } from "./types";

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://spotter-trips-backend.vercel.app",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// API service class
class RouteService {
  /**
   * Calculate route with stops and fuel stops
   */
  async calculateRoute(
    tripRequest: TripRequest
  ): Promise<ApiResponse<RouteResponse>> {
    try {
      const response: AxiosResponse<RouteResponse> = await apiClient.post(
        "/api/calculate-route/",
        tripRequest
      );

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

      return {
        error: errorDetails.message,
        status: errorDetails.status,
      };
    }
  }
}

// Export singleton instance
export const routeService = new RouteService();
export default routeService;
