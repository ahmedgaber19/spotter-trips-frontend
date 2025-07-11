"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
} from "@mui/material";
import MapComponent from "./MapComponent";

interface LocationPickerProps {
  open: boolean;
  onClose: () => void;
  onLocationSelect: (location: string) => void;
  title?: string;
  currentValue?: string;
}

const LocationPickerMap: React.FC<LocationPickerProps> = ({
  open,
  onClose,
  onLocationSelect,
  title = "Select Location",
  currentValue = "",
}) => {
  const [selectedLocation, setSelectedLocation] = useState(currentValue);
  const [manualInput, setManualInput] = useState(currentValue);

  const handleConfirm = () => {
    const finalLocation = manualInput.trim();
    if (finalLocation) {
      onLocationSelect(finalLocation);
      onClose();
    }
  };

  const handleCancel = () => {
    setSelectedLocation(currentValue);
    setManualInput(currentValue);
    onClose();
  };

  const handleManualInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setManualInput(event.target.value);
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { height: "80vh" },
      }}
    >
      <DialogTitle>{title}</DialogTitle>

      <DialogContent sx={{ p: 0, display: "flex", flexDirection: "column" }}>
        {/* Manual input field */}
        <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0" }}>
          <TextField
            fullWidth
            label="Location (City, State format)"
            value={manualInput}
            onChange={handleManualInputChange}
            placeholder="e.g., Los Angeles, CA"
            helperText="You can type manually or click on the map to select"
            variant="outlined"
            size="small"
          />
        </Box>

        {/* Info alert */}

        {/* Map container */}
        <Box sx={{ flex: 1, minHeight: 400, p: 2, pt: 0 }}>
          <MapComponent markers={[]} routeCoordinates={[]} />
        </Box>

        {/* Selected location display */}
        {selectedLocation && (
          <Box
            sx={{
              p: 2,
              pt: 1,
              borderTop: "1px solid #e0e0e0",
              backgroundColor: "#f5f5f5",
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
              Selected Location:
            </Typography>
            <Typography variant="body1" sx={{ color: "primary.main" }}>
              {selectedLocation}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={!manualInput.trim()}
        >
          Use This Location
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LocationPickerMap;
