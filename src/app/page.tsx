"use client";

import React, { useState } from "react";
import { Box, Typography, Paper } from "@mui/material";
import Layout from "../components/ui/Layout";
import TripForm from "../components/forms/TripForm";
import RouteMap from "../components/maps/RouteMap";
import ELDLogSheet from "../components/logs/ELDLogSheet";
import { TripFormData, RouteResponse } from "../services/types";
import { routeService } from "../services/api";
import { ERROR_MESSAGES } from "../utils/constants";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [routeData, setRouteData] = useState<RouteResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTripSubmit = async (formData: TripFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Convert form data to API format
      const tripRequest = {
        current_location: formData.currentLocation,
        pickup_location: formData.pickupLocation,
        dropoff_location: formData.dropoffLocation,
        cycle_used: formData.currentCycleUsed,
      };

      // Call the API
      const response = await routeService.calculateRoute(tripRequest);

      if (response.error) {
        setError(response.error);
        setRouteData(null);
      } else if (response.data) {
        setRouteData(response.data);
        setError(null);
      }
    } catch {
      setError(ERROR_MESSAGES.GENERIC_ERROR);
      setRouteData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Header */}
        <Paper elevation={1} sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Trucking Route & ELD Compliance Calculator
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Calculate optimal routes with mandatory rest stops and ELD
            compliance for professional truckers
          </Typography>
        </Paper>

        {/* Trip Form */}
        <TripForm
          onSubmit={handleTripSubmit}
          isLoading={isLoading}
          error={error}
        />

        {/* Results Section */}
        {routeData && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Route Summary */}
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Route Summary
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: 2,
                  mb: 3,
                }}
              >
                <Box>
                  <Typography variant="h6" color="primary">
                    {routeData.route.distance.toFixed(1)} miles
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Distance
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" color="primary">
                    {routeData.route.duration.toFixed(1)} hours
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Estimated Duration
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" color="primary">
                    {routeData.stops.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Stops
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" color="primary">
                    {routeData.fuel_stops.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Fuel Stops
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Map and ELD Log Layout */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", lg: "row" },
                gap: 3,
              }}
            >
              <Box sx={{ flex: { xs: 1, lg: "1 1 58%" } }}>
                <RouteMap routeData={routeData} />
              </Box>

              <Box sx={{ flex: { xs: 1, lg: "1 1 42%" } }}>
                <ELDLogSheet routeData={routeData} />
              </Box>
            </Box>

            {/* Detailed Stops List */}
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Detailed Stop Schedule
              </Typography>
              {routeData.stops.map((stop, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    border: "1px solid #e0e0e0",
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold", textTransform: "capitalize" }}
                  >
                    {stop.type} - {stop.location.address}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stop.description} • Duration: {stop.duration} hours
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Scheduled: {new Date(stop.time).toLocaleString()}
                  </Typography>
                </Box>
              ))}
            </Paper>
          </Box>
        )}

        {/* Info Section */}
        <Paper elevation={1} sx={{ p: 3, backgroundColor: "#f5f5f5" }}>
          <Typography variant="h6" gutterBottom>
            About This Tool
          </Typography>
          <Typography variant="body2" paragraph>
            This tool calculates trucking routes with mandatory rest stops
            according to Federal Motor Carrier Safety Administration (FMCSA)
            Hours of Service (HOS) regulations. It provides ELD-compliant
            scheduling to help drivers maintain legal compliance.
          </Typography>
          <Typography variant="body2">
            Features include: Route optimization, Rest stop planning, Fuel stop
            recommendations, and ELD compliance tracking.
          </Typography>
        </Paper>
      </Box>
    </Layout>
  );
}
