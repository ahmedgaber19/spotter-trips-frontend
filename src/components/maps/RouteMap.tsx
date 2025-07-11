"use client";

import React from "react";
import { Box, Paper, Typography, useTheme } from "@mui/material";
import dynamic from "next/dynamic";
import { RouteResponse, MapMarker } from "../../services/types";
import { MAP_CONFIG } from "../../utils/constants";

// Dynamically import the MapComponent to avoid SSR issues
const DynamicMapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <Box
      sx={{
        height: MAP_CONFIG.DEFAULT_HEIGHT,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Typography>Loading map...</Typography>
    </Box>
  ),
}) as React.ComponentType<{
  markers: MapMarker[];
  routeCoordinates: [number, number][];
}>;

interface RouteMapProps {
  routeData: RouteResponse;
  className?: string;
}

const RouteMap: React.FC<RouteMapProps> = ({ routeData, className }) => {
  const theme = useTheme();

  // Convert route data to markers
  const markers: MapMarker[] = [];

  // Add markers for all stops
  routeData.stops.forEach((stop, index) => {
    // Extract coordinates from the array format [longitude, latitude]
    const coordinates = stop.location.coordinates;
    if (coordinates && coordinates.length >= 2) {
      markers.push({
        id: `stop-${index}`,
        position: [coordinates[1], coordinates[0]], // Convert [lng, lat] to [lat, lng] for Leaflet
        type: stop.type,
        title: stop.location.address,
        description: stop.description,
      });
    }
  });

  // Add markers for fuel stops
  routeData.fuel_stops.forEach((stop, index) => {
    // Extract coordinates from the array format [longitude, latitude]
    const coordinates = stop.location.coordinates;
    if (coordinates && coordinates.length >= 2) {
      markers.push({
        id: `fuel-${index}`,
        position: [coordinates[1], coordinates[0]], // Convert [lng, lat] to [lat, lng] for Leaflet
        type: stop.type,
        title: stop.location.address,
        description: stop.description,
      });
    }
  });

  // Convert route coordinates to Leaflet format (swap lng/lat to lat/lng)
  const routeCoordinates: [number, number][] = routeData.route.coordinates.map(
    (coord) => [coord[1], coord[0]] // Convert [lng, lat] to [lat, lng]
  );

  return (
    <Paper elevation={2} className={className}>
      <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h6" component="h3">
          Route Map
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {routeData.route.distance.toFixed(1)} miles •{" "}
          {routeData.route.duration.toFixed(1)} hours
        </Typography>
      </Box>

      <Box sx={{ height: MAP_CONFIG.DEFAULT_HEIGHT, width: "100%" }}>
        <DynamicMapComponent
          markers={markers}
          routeCoordinates={routeCoordinates}
        />
      </Box>
    </Paper>
  );
};

export default RouteMap;
