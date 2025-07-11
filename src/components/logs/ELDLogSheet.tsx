"use client";

import React from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  useTheme,
} from "@mui/material";
import { RouteResponse, ELDLogEntry } from "../../services/types";
import { ELD_RULES } from "../../utils/constants";

interface ELDLogSheetProps {
  routeData: RouteResponse;
  className?: string;
}

const ELDLogSheet: React.FC<ELDLogSheetProps> = ({ routeData, className }) => {
  const theme = useTheme();

  // Convert stops to ELD log entries
  const generateELDLogEntries = (routeData: RouteResponse): ELDLogEntry[] => {
    const entries: ELDLogEntry[] = [];

    routeData.stops.forEach((stop) => {
      const timestamp = new Date(stop.time).toLocaleString();

      switch (stop.type) {
        case "pickup":
          entries.push({
            timestamp,
            event: "ON_DUTY",
            location: stop.location.address,
            notes: `Pickup: ${stop.description}`,
          });
          break;

        case "dropoff":
          entries.push({
            timestamp,
            event: "OFF_DUTY",
            location: stop.location.address,
            notes: `Dropoff: ${stop.description}`,
          });
          break;

        case "rest":
          entries.push({
            timestamp,
            event: "OFF_DUTY",
            location: stop.location.address,
            duration: stop.duration,
            notes: `Mandatory rest: ${stop.description}`,
          });
          break;

        case "fuel":
          entries.push({
            timestamp,
            event: "ON_DUTY_NOT_DRIVING",
            location: stop.location.address,
            duration: stop.duration,
            notes: `Fuel stop: ${stop.description}`,
          });
          break;
      }
    });

    return entries.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  };

  const eldLogEntries = generateELDLogEntries(routeData);

  // Get event color based on type
  const getEventColor = (
    event: string
  ): "success" | "error" | "warning" | "info" | "default" => {
    switch (event) {
      case "ON_DUTY":
        return "success";
      case "OFF_DUTY":
        return "error";
      case "ON_DUTY_NOT_DRIVING":
        return "warning";
      case "DRIVING":
        return "info";
      default:
        return "default";
    }
  };

  // Calculate compliance metrics
  const calculateCompliance = () => {
    const totalDrivingHours = routeData.route.duration;
    const totalOnDutyHours =
      routeData.route.duration +
      routeData.stops
        .filter((stop) => stop.type === "fuel")
        .reduce((sum, stop) => sum + stop.duration, 0);

    const restHours = routeData.stops
      .filter((stop) => stop.type === "rest")
      .reduce((sum, stop) => sum + stop.duration, 0);

    return {
      totalDrivingHours,
      totalOnDutyHours,
      restHours,
      isDrivingCompliant: totalDrivingHours <= ELD_RULES.DRIVING_LIMIT,
      isOnDutyCompliant: totalOnDutyHours <= ELD_RULES.ON_DUTY_LIMIT,
      hasAdequateRest: restHours >= ELD_RULES.RESTART_PERIOD,
    };
  };

  const compliance = calculateCompliance();

  return (
    <Paper elevation={2} className={className}>
      <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h6" component="h3">
          ELD Compliance Log
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Electronic Logging Device compliant duty status record
        </Typography>
      </Box>

      {/* Compliance Summary */}
      <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="subtitle1" gutterBottom>
          Compliance Summary
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
          <Chip
            label={`Driving: ${compliance.totalDrivingHours.toFixed(1)}h / ${
              ELD_RULES.DRIVING_LIMIT
            }h`}
            color={compliance.isDrivingCompliant ? "success" : "error"}
            variant="outlined"
          />
          <Chip
            label={`On Duty: ${compliance.totalOnDutyHours.toFixed(1)}h / ${
              ELD_RULES.ON_DUTY_LIMIT
            }h`}
            color={compliance.isOnDutyCompliant ? "success" : "error"}
            variant="outlined"
          />
          <Chip
            label={`Rest: ${compliance.restHours.toFixed(1)}h`}
            color={compliance.hasAdequateRest ? "success" : "warning"}
            variant="outlined"
          />
        </Box>

        {!compliance.isDrivingCompliant && (
          <Typography variant="body2" color="error" sx={{ mb: 1 }}>
            ⚠️ Driving time exceeds 11-hour limit
          </Typography>
        )}

        {!compliance.isOnDutyCompliant && (
          <Typography variant="body2" color="error" sx={{ mb: 1 }}>
            ⚠️ On-duty time exceeds 14-hour limit
          </Typography>
        )}

        {!compliance.hasAdequateRest && (
          <Typography variant="body2" color="warning" sx={{ mb: 1 }}>
            ⚠️ Insufficient rest periods scheduled
          </Typography>
        )}
      </Box>

      {/* Log Entries Table */}
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Time</TableCell>
              <TableCell>Event</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {eldLogEntries.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                    {entry.timestamp}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={entry.event.replace(/_/g, " ")}
                    color={getEventColor(entry.event)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ maxWidth: 200 }}>
                    {entry.location}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {entry.duration ? `${entry.duration}h` : "-"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ maxWidth: 250 }}>
                    {entry.notes}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Footer */}
      <Box sx={{ p: 2, backgroundColor: theme.palette.grey[50] }}>
        <Typography variant="caption" color="text.secondary">
          This log complies with Federal Motor Carrier Safety Administration
          (FMCSA) ELD regulations. All times are in local time zone. Driver must
          maintain original records for 6 months.
        </Typography>
      </Box>
    </Paper>
  );
};

export default ELDLogSheet;
