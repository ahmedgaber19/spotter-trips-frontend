// TypeScript interfaces matching the Django backend data classes

export interface Location {
  address: string;
  latitude: number;
  longitude: number;
}

// Alternative location format used in API responses
export interface LocationWithCoords {
  address: string;
  coordinates: [number, number]; // [longitude, latitude]
}

export interface TripRequest {
  current_location: string;
  pickup_location: string;
  dropoff_location: string;
  cycle_used: number;
}

export interface RouteData {
  distance: number;
  duration: number;
  coordinates: [number, number][]; // [longitude, latitude] pairs
}

export interface Stop {
  type: "pickup" | "dropoff" | "rest" | "fuel";
  location: {
    address: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  time: string; // ISO datetime string
  duration: number;
  description: string;
}

export interface ELDEntry {
  status: "driving" | "on_duty" | "sleeper" | "off_duty";
  start_time: string; // ISO datetime string
  end_time: string; // ISO datetime string
  location: string;
  duration: number;
}

export interface DailyLog {
  date: string; // ISO date string
  entries: ELDEntry[];
  total_drive_time: number;
  total_duty_time: number;
}

export interface HOSStatus {
  cycle_used: number;
  remaining_hours: number;
  drive_time_today: number;
  duty_time_today: number;
  next_reset: string; // ISO datetime string
  violations: string[];
}

export interface RouteResponse {
  route: RouteData;
  stops: Stop[];
  fuel_stops: Stop[];
  eld_logs: DailyLog[];
  hos_status: HOSStatus;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
}

// Form data interfaces
export interface TripFormData {
  currentLocation: string;
  pickupLocation: string;
  dropoffLocation: string;
  currentCycleUsed: number;
}

// UI State interfaces
export interface AppState {
  isLoading: boolean;
  routeData: RouteResponse | null;
  error: string | null;
}

// Map related interfaces
export interface MapMarker {
  id: string;
  position: [number, number];
  type: "current" | "pickup" | "dropoff" | "rest" | "fuel";
  title: string;
  description?: string;
}

// Location selection interface
export interface LocationSelection {
  coordinates: [number, number]; // [lat, lng]
  formattedAddress: string;
}

// ELD Log interfaces
export interface ELDLogEntry {
  timestamp: string;
  event: string;
  location: string;
  duration?: number;
  notes?: string;
}
