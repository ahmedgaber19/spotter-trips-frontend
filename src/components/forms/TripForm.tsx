"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Box,
  Slider,
  Typography,
  Alert,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Send, MyLocation, Map, Edit } from "@mui/icons-material";
import { TripFormData } from "../../services/types";
import { FORM_VALIDATION } from "../../utils/constants";
import LocationSelectorWrapper from "../maps/LocationSelectorWrapper";

interface TripFormProps {
  onSubmit: (data: TripFormData) => void;
  isLoading?: boolean;
  error?: string | null;
}

interface LocationData {
  lat: number;
  lng: number;
  address: string;
}

export default function TripForm({
  onSubmit,
  isLoading = false,
  error,
}: TripFormProps) {
  const [formData, setFormData] = useState<TripFormData>({
    currentLocation: "",
    pickupLocation: "",
    dropoffLocation: "",
    currentCycleUsed: 0,
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [inputMode, setInputMode] = useState<"text" | "map">("text");

  // Store map-selected locations
  const [mapLocations, setMapLocations] = useState<{
    current?: LocationData;
    pickup?: LocationData;
    dropoff?: LocationData;
  }>({});

  const handleInputChange = (
    field: keyof TripFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleMapLocationSelect = (
    locationType: "current" | "pickup" | "dropoff",
    location: LocationData
  ) => {
    setMapLocations((prev) => ({
      ...prev,
      [locationType]: location,
    }));

    // Update form data with the selected location
    const fieldMap = {
      current: "currentLocation",
      pickup: "pickupLocation",
      dropoff: "dropoffLocation",
    };

    handleInputChange(
      fieldMap[locationType] as keyof TripFormData,
      location.address
    );
  };

  const handleInputModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: "text" | "map"
  ) => {
    if (newMode !== null) {
      setInputMode(newMode);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Required fields validation
    FORM_VALIDATION.REQUIRED_FIELDS.forEach((field) => {
      const value = formData[field as keyof TripFormData];
      if (!value || (typeof value === "string" && value.trim() === "")) {
        errors[field] = "This field is required";
      }
    });

    // Location length validation
    const locationFields = [
      "currentLocation",
      "pickupLocation",
      "dropoffLocation",
    ];
    locationFields.forEach((field) => {
      const value = formData[field as keyof TripFormData] as string;
      if (value && value.length < FORM_VALIDATION.LOCATION_MIN_LENGTH) {
        errors[
          field
        ] = `Must be at least ${FORM_VALIDATION.LOCATION_MIN_LENGTH} characters`;
      }
      if (value && value.length > FORM_VALIDATION.LOCATION_MAX_LENGTH) {
        errors[
          field
        ] = `Must be no more than ${FORM_VALIDATION.LOCATION_MAX_LENGTH} characters`;
      }
    });

    // Cycle hours validation
    if (formData.currentCycleUsed < FORM_VALIDATION.MIN_CYCLE_USED) {
      errors.currentCycleUsed = `Must be at least ${FORM_VALIDATION.MIN_CYCLE_USED} hours`;
    }
    if (formData.currentCycleUsed > FORM_VALIDATION.MAX_CYCLE_USED) {
      errors.currentCycleUsed = `Must be no more than ${FORM_VALIDATION.MAX_CYCLE_USED} hours`;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // Try to get a readable address
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=16&addressdetails=1`
            );
            const data = await response.json();

            let locationString = `${latitude.toFixed(6)}, ${longitude.toFixed(
              6
            )}`;

            if (data.address) {
              const address = data.address;
              const city =
                address.city ||
                address.town ||
                address.village ||
                address.municipality;
              const state = address.state;
              const country = address.country;

              // Format for US addresses (city, state)
              if (country === "United States" && city && state) {
                const stateAbbrev = getStateAbbreviation(state) || state;
                locationString = `${city}, ${stateAbbrev}`;
              } else if (city && state) {
                locationString = `${city}, ${state}`;
              } else if (data.display_name) {
                const parts = data.display_name.split(",");
                if (parts.length >= 2) {
                  locationString = `${parts[0].trim()}, ${parts[1].trim()}`;
                }
              }
            }

            handleInputChange("currentLocation", locationString);
          } catch (error) {
            console.error("Reverse geocoding failed:", error);
            // Fallback to coordinates
            const locationString = `${latitude.toFixed(6)}, ${longitude.toFixed(
              6
            )}`;
            handleInputChange("currentLocation", locationString);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          alert(
            "Unable to get your current location. Please enter it manually."
          );
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // Helper function to get state abbreviations
  const getStateAbbreviation = (stateName: string): string | null => {
    const stateMap: Record<string, string> = {
      Alabama: "AL",
      Alaska: "AK",
      Arizona: "AZ",
      Arkansas: "AR",
      California: "CA",
      Colorado: "CO",
      Connecticut: "CT",
      Delaware: "DE",
      Florida: "FL",
      Georgia: "GA",
      Hawaii: "HI",
      Idaho: "ID",
      Illinois: "IL",
      Indiana: "IN",
      Iowa: "IA",
      Kansas: "KS",
      Kentucky: "KY",
      Louisiana: "LA",
      Maine: "ME",
      Maryland: "MD",
      Massachusetts: "MA",
      Michigan: "MI",
      Minnesota: "MN",
      Mississippi: "MS",
      Missouri: "MO",
      Montana: "MT",
      Nebraska: "NE",
      Nevada: "NV",
      "New Hampshire": "NH",
      "New Jersey": "NJ",
      "New Mexico": "NM",
      "New York": "NY",
      "North Carolina": "NC",
      "North Dakota": "ND",
      Ohio: "OH",
      Oklahoma: "OK",
      Oregon: "OR",
      Pennsylvania: "PA",
      "Rhode Island": "RI",
      "South Carolina": "SC",
      "South Dakota": "SD",
      Tennessee: "TN",
      Texas: "TX",
      Utah: "UT",
      Vermont: "VT",
      Virginia: "VA",
      Washington: "WA",
      "West Virginia": "WV",
      Wisconsin: "WI",
      Wyoming: "WY",
      "District of Columbia": "DC",
    };

    return stateMap[stateName] || null;
  };

  return (
    <Card elevation={3}>
      <CardHeader
        title="Trip Details"
        subheader="Enter your trip information to calculate route and ELD compliance"
      />
      <CardContent>
        <form onSubmit={handleSubmit}>
          {/* Input Mode Toggle */}
          <Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
            <ToggleButtonGroup
              value={inputMode}
              exclusive
              onChange={handleInputModeChange}
              aria-label="input mode"
              size="small"
            >
              <ToggleButton value="text" aria-label="text input">
                <Edit sx={{ mr: 1 }} />
                Text Input
              </ToggleButton>
              <ToggleButton value="map" aria-label="map selection">
                <Map sx={{ mr: 1 }} />
                Map Selection
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {inputMode === "map" ? (
            /* Map Mode */
            <Box sx={{ mb: 3 }}>
              <LocationSelectorWrapper
                onLocationSelect={handleMapLocationSelect}
                currentLocation={mapLocations.current}
                pickupLocation={mapLocations.pickup}
                dropoffLocation={mapLocations.dropoff}
              />
            </Box>
          ) : (
            /* Text Input Mode */
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 3, mb: 3 }}
            >
              {/* Current Location */}
              <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1 }}>
                <TextField
                  fullWidth
                  label="Current Location"
                  value={formData.currentLocation}
                  onChange={(e) =>
                    handleInputChange("currentLocation", e.target.value)
                  }
                  error={!!validationErrors.currentLocation}
                  helperText={validationErrors.currentLocation}
                  placeholder="Enter city, state or address"
                  required
                />
                <Button
                  variant="outlined"
                  onClick={handleGetCurrentLocation}
                  sx={{ minWidth: "auto", p: 1 }}
                  title="Get current location"
                >
                  <MyLocation />
                </Button>
              </Box>

              {/* Pickup Location */}
              <TextField
                fullWidth
                label="Pickup Location"
                value={formData.pickupLocation}
                onChange={(e) =>
                  handleInputChange("pickupLocation", e.target.value)
                }
                error={!!validationErrors.pickupLocation}
                helperText={validationErrors.pickupLocation}
                placeholder="Enter pickup address"
                required
              />

              {/* Dropoff Location */}
              <TextField
                fullWidth
                label="Dropoff Location"
                value={formData.dropoffLocation}
                onChange={(e) =>
                  handleInputChange("dropoffLocation", e.target.value)
                }
                error={!!validationErrors.dropoffLocation}
                helperText={validationErrors.dropoffLocation}
                placeholder="Enter dropoff address"
                required
              />
            </Box>
          )}

          {/* Current Cycle Used */}
          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom>
              Current Cycle Used: {formData.currentCycleUsed} hours
            </Typography>
            <Slider
              value={formData.currentCycleUsed}
              onChange={(_, value) =>
                handleInputChange("currentCycleUsed", value as number)
              }
              min={FORM_VALIDATION.MIN_CYCLE_USED}
              max={FORM_VALIDATION.MAX_CYCLE_USED}
              step={0.5}
              marks={[
                { value: 0, label: "0h" },
                { value: 14, label: "14h" },
                { value: 60, label: "60h" },
                { value: 70, label: "70h" },
              ]}
              valueLabelDisplay="auto"
              sx={{ mt: 1 }}
            />
            {validationErrors.currentCycleUsed && (
              <Typography color="error" variant="caption">
                {validationErrors.currentCycleUsed}
              </Typography>
            )}
          </Box>

          {/* Error Display */}
          {error && (
            <Box sx={{ mb: 3 }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}

          {/* Submit Button */}
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : <Send />}
              sx={{ minWidth: 150 }}
            >
              {isLoading ? "Calculating..." : "Calculate Route"}
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
}
