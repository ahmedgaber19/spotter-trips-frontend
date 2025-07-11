"use client";

import React, { useState } from "react";
import { Box, Paper, Typography, Chip, useTheme } from "@mui/material";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MAP_CONFIG } from "../../utils/constants";

// Custom icons for different location types
const createCustomIcon = (color: string, letter: string) => {
  return new L.DivIcon({
    html: `
      <div style="
        background-color: ${color};
        border: 2px solid white;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
        font-size: 14px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ">
        ${letter}
      </div>
    `,
    className: "custom-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

const locationIcons = {
  current: createCustomIcon("#2196f3", "C"),
  pickup: createCustomIcon("#4caf50", "P"),
  dropoff: createCustomIcon("#f44336", "D"),
};

interface LocationData {
  lat: number;
  lng: number;
  address: string;
}

interface LocationSelectorProps {
  onLocationSelect: (
    locationType: "current" | "pickup" | "dropoff",
    location: LocationData
  ) => void;
  currentLocation?: LocationData;
  pickupLocation?: LocationData;
  dropoffLocation?: LocationData;
  className?: string;
}

interface MapClickHandlerProps {
  onMapClick: (lat: number, lng: number) => void;
}

const MapClickHandler: React.FC<MapClickHandlerProps> = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const LocationSelector: React.FC<LocationSelectorProps> = ({
  onLocationSelect,
  currentLocation,
  pickupLocation,
  dropoffLocation,
  className,
}) => {
  const theme = useTheme();
  const [selectedLocationType, setSelectedLocationType] = useState<
    "current" | "pickup" | "dropoff"
  >("current");
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);

  // Simple reverse geocoding function
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
      );
      const data = await response.json();
      console.log("Reverse geocode data:", data);

      // Extract city and state
      let city = "";
      let state = "";

      if (data.address) {
        // Try to get city name
        if (data.address.city) {
          city = data.address.city;
        } else if (data.address.town) {
          city = data.address.town;
        } else if (data.address.village) {
          city = data.address.village;
        } else if (data.address.county) {
          city = data.address.county;
        }

        // Get state
        if (data.address.state) {
          state = data.address.state;
        }
      }

      // If we have both city and state, format as "City, State"
      if (city && state) {
        return `${city}, ${state}`;
      }

      // If we only have state, use it
      if (state) {
        return state;
      }

      // If we only have city, use it
      if (city) {
        return city;
      }

      // Fallback to first part of display name
      if (data.display_name) {
        return data.display_name.split(",")[0];
      }

      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };

  const handleMapClick = async (lat: number, lng: number) => {
    setIsReverseGeocoding(true);

    try {
      const address = await reverseGeocode(lat, lng);
      const locationData: LocationData = {
        lat,
        lng,
        address,
      };

      onLocationSelect(selectedLocationType, locationData);
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  // Calculate map center based on existing locations
  const getMapCenter = (): [number, number] => {
    const locations = [currentLocation, pickupLocation, dropoffLocation].filter(
      Boolean
    );
    if (locations.length > 0) {
      const avgLat =
        locations.reduce((sum, loc) => sum + loc!.lat, 0) / locations.length;
      const avgLng =
        locations.reduce((sum, loc) => sum + loc!.lng, 0) / locations.length;
      return [avgLat, avgLng];
    }
    return [39.8283, -98.5795]; // Center of USA
  };

  return (
    <Paper elevation={3} className={className}>
      <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h6" component="h3" gutterBottom>
          Select Locations on Map
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Click on the map to set your locations, or use the buttons below.
        </Typography>

        {/* Location Type Selector */}
        <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
          <Chip
            label="Current Location"
            color={selectedLocationType === "current" ? "primary" : "default"}
            onClick={() => setSelectedLocationType("current")}
            variant={selectedLocationType === "current" ? "filled" : "outlined"}
            sx={{
              "&:before": {
                content: '""',
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#2196f3",
                display: "inline-block",
                marginRight: 0.5,
              },
            }}
          />
          <Chip
            label="Pickup Location"
            color={selectedLocationType === "pickup" ? "primary" : "default"}
            onClick={() => setSelectedLocationType("pickup")}
            variant={selectedLocationType === "pickup" ? "filled" : "outlined"}
            sx={{
              "&:before": {
                content: '""',
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#4caf50",
                display: "inline-block",
                marginRight: 0.5,
              },
            }}
          />
          <Chip
            label="Dropoff Location"
            color={selectedLocationType === "dropoff" ? "primary" : "default"}
            onClick={() => setSelectedLocationType("dropoff")}
            variant={selectedLocationType === "dropoff" ? "filled" : "outlined"}
            sx={{
              "&:before": {
                content: '""',
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#f44336",
                display: "inline-block",
                marginRight: 0.5,
              },
            }}
          />
        </Box>

        {/* Selected Locations Display */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {currentLocation && (
            <Typography variant="caption" color="text.secondary">
              <strong>Current:</strong> {currentLocation.address}
            </Typography>
          )}
          {pickupLocation && (
            <Typography variant="caption" color="text.secondary">
              <strong>Pickup:</strong> {pickupLocation.address}
            </Typography>
          )}
          {dropoffLocation && (
            <Typography variant="caption" color="text.secondary">
              <strong>Dropoff:</strong> {dropoffLocation.address}
            </Typography>
          )}
        </Box>
      </Box>

      <Box sx={{ height: 400, width: "100%" }}>
        <MapContainer
          center={getMapCenter()}
          zoom={6}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url={MAP_CONFIG.TILE_LAYER_URL}
            attribution={MAP_CONFIG.ATTRIBUTION}
          />

          <MapClickHandler onMapClick={handleMapClick} />

          {/* Current Location Marker */}
          {currentLocation && (
            <Marker
              position={[currentLocation.lat, currentLocation.lng]}
              icon={locationIcons.current}
            >
              <Popup>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    Current Location
                  </Typography>
                  <Typography variant="body2">
                    {currentLocation.address}
                  </Typography>
                </Box>
              </Popup>
            </Marker>
          )}

          {/* Pickup Location Marker */}
          {pickupLocation && (
            <Marker
              position={[pickupLocation.lat, pickupLocation.lng]}
              icon={locationIcons.pickup}
            >
              <Popup>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    Pickup Location
                  </Typography>
                  <Typography variant="body2">
                    {pickupLocation.address}
                  </Typography>
                </Box>
              </Popup>
            </Marker>
          )}

          {/* Dropoff Location Marker */}
          {dropoffLocation && (
            <Marker
              position={[dropoffLocation.lat, dropoffLocation.lng]}
              icon={locationIcons.dropoff}
            >
              <Popup>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    Dropoff Location
                  </Typography>
                  <Typography variant="body2">
                    {dropoffLocation.address}
                  </Typography>
                </Box>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </Box>

      {isReverseGeocoding && (
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Getting address information...
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default LocationSelector;
