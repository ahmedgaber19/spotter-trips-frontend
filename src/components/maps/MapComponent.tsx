"use client";

import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapMarker, LocationSelection } from "../../services/types";
import { MAP_CONFIG } from "../../utils/constants";

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as unknown as { _getIconUrl: unknown })
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom icons for different marker types
const createCustomIcon = (color: string, type: string) => {
  return new L.DivIcon({
    html: `
      <div style="
        background-color: ${color};
        border: 2px solid white;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
        font-size: 12px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ">
        ${
          type === "current"
            ? "C"
            : type === "pickup"
            ? "P"
            : type === "dropoff"
            ? "D"
            : type === "rest"
            ? "R"
            : "F"
        }
      </div>
    `,
    className: "custom-marker",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

const markerIcons = {
  current: createCustomIcon("#2196f3", "current"),
  pickup: createCustomIcon("#4caf50", "pickup"),
  dropoff: createCustomIcon("#f44336", "dropoff"),
  rest: createCustomIcon("#ff9800", "rest"),
  fuel: createCustomIcon("#9c27b0", "fuel"),
};

// Component to fit map bounds to show all markers
const MapBoundsController: React.FC<{ markers: MapMarker[] }> = ({
  markers,
}) => {
  const map = useMap();

  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map((marker) => marker.position));
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [map, markers]);

  return null;
};

interface MapComponentProps {
  markers: MapMarker[];
  routeCoordinates: [number, number][];
  onLocationSelect?: (location: LocationSelection) => void;
  isSelectionEnabled?: boolean;
}

const MapComponent: React.FC<MapComponentProps> = ({
  markers,
  routeCoordinates,
}) => {
  // Validate and convert coordinates
  const validMarkers = markers.filter(
    (marker) =>
      marker.position &&
      !isNaN(marker.position[0]) &&
      !isNaN(marker.position[1])
  );

  const validRouteCoordinates = routeCoordinates.filter(
    (coord) => coord && !isNaN(coord[0]) && !isNaN(coord[1])
  );

  // Calculate map center from valid markers
  const mapCenter: [number, number] =
    validMarkers.length > 0
      ? [
          validMarkers.reduce((sum, marker) => sum + marker.position[0], 0) /
            validMarkers.length,
          validMarkers.reduce((sum, marker) => sum + marker.position[1], 0) /
            validMarkers.length,
        ]
      : [39.8283, -98.5795]; // Center of USA as fallback

  return (
    <MapContainer
      center={mapCenter}
      zoom={MAP_CONFIG.DEFAULT_ZOOM}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url={MAP_CONFIG.TILE_LAYER_URL}
        attribution={MAP_CONFIG.ATTRIBUTION}
      />

      {/* Route polyline */}
      {validRouteCoordinates.length > 1 && (
        <Polyline
          positions={validRouteCoordinates}
          color="#2196f3"
          weight={4}
          opacity={0.7}
        />
      )}

      {/* Markers for all stops */}
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={marker.position}
          icon={markerIcons[marker.type]}
        >
          <Popup>
            <Box sx={{ minWidth: 200 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                {marker.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{ mb: 1, textTransform: "capitalize" }}
              >
                Type: {marker.type}
              </Typography>
              {marker.description && (
                <Typography variant="body2" color="text.secondary">
                  {marker.description}
                </Typography>
              )}
            </Box>
          </Popup>
        </Marker>
      ))}

      {/* Auto-fit bounds to show all markers */}
      <MapBoundsController markers={markers} />

      {/* Location selection handler */}
    </MapContainer>
  );
};

export default MapComponent;
