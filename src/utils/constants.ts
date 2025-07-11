// Application constants

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000",
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};

export const MAP_CONFIG = {
  DEFAULT_CENTER: [39.8283, -98.5795] as [number, number], // Geographic center of US
  DEFAULT_ZOOM: 4,
  MARKER_ZOOM: 12,
  DEFAULT_HEIGHT: 400,
  TILE_LAYER_URL: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  ATTRIBUTION:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
};

export const COLORS = {
  primary: "#1976d2",
  secondary: "#dc004e",
  success: "#2e7d32",
  warning: "#ed6c02",
  error: "#d32f2f",
  info: "#0288d1",
  text: {
    primary: "#212121",
    secondary: "#757575",
  },
};

export const MARKER_COLORS = {
  current: "#2196f3", // Blue
  pickup: "#4caf50", // Green
  dropoff: "#f44336", // Red
  rest: "#ff9800", // Orange
  fuel: "#9c27b0", // Purple
};

export const FORM_VALIDATION = {
  REQUIRED_FIELDS: ["currentLocation", "pickupLocation", "dropoffLocation"],
  MIN_CYCLE_USED: 0,
  MAX_CYCLE_USED: 14 * 24, // 14 days in hours
  LOCATION_MIN_LENGTH: 3,
  LOCATION_MAX_LENGTH: 200,
};

export const ELD_RULES = {
  DRIVING_LIMIT: 11, // 11 hours of driving
  ON_DUTY_LIMIT: 14, // 14 hours on duty
  RESTART_PERIOD: 10, // 10 hour rest period
  WEEKLY_LIMIT: 60, // 60 hours in 7 days
  EIGHT_DAY_LIMIT: 70, // 70 hours in 8 days
};

export const ANIMATION_DURATION = 300;

export const DEBOUNCE_DELAY = 500;

export const BREAKPOINTS = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
};

export const STORAGE_KEYS = {
  LAST_TRIP: "spotter_last_trip",
  USER_PREFERENCES: "spotter_preferences",
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR:
    "Network connection failed. Please check your internet connection.",
  BACKEND_ERROR: "Backend service unavailable. Please try again later.",
  VALIDATION_ERROR: "Please check your input and try again.",
  LOCATION_NOT_FOUND: "Location could not be found. Please check the address.",
  ROUTE_CALCULATION_FAILED: "Route calculation failed. Please try again.",
  GENERIC_ERROR: "An unexpected error occurred. Please try again.",
};

export const SUCCESS_MESSAGES = {
  ROUTE_CALCULATED: "Route calculated successfully!",
  LOCATIONS_VALIDATED: "All locations are valid.",
  BACKEND_CONNECTED: "Connected to backend service.",
};

export const LOADING_MESSAGES = {
  CALCULATING_ROUTE: "Calculating route...",
  VALIDATING_LOCATIONS: "Validating locations...",
  LOADING_MAP: "Loading map...",
  CONNECTING: "Connecting to backend...",
};
