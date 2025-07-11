"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import dynamic from "next/dynamic";

// Dynamically import the LocationSelector to avoid SSR issues
const DynamicLocationSelector = dynamic(() => import("./LocationSelector"), {
  ssr: false,
  loading: () => (
    <Box
      sx={{
        height: 500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        borderRadius: 1,
      }}
    >
      <Typography>Loading location selector...</Typography>
    </Box>
  ),
}) as React.ComponentType<{
  onLocationSelect: (
    locationType: "current" | "pickup" | "dropoff",
    location: {
      lat: number;
      lng: number;
      address: string;
    }
  ) => void;
  currentLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  pickupLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  dropoffLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  className?: string;
}>;

export default DynamicLocationSelector;
