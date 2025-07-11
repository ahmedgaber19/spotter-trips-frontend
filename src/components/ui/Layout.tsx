"use client";

import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AppBar, Toolbar, Typography, Container, Box } from "@mui/material";
import { LocalShipping } from "@mui/icons-material";
import theme from "../../theme";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        {/* Header */}
        <AppBar position="static" elevation={2}>
          <Toolbar>
            <LocalShipping sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Spotter - Trucking Route & ELD Manager
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container
          maxWidth="xl"
          sx={{
            flexGrow: 1,
            py: 3,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {children}
        </Container>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            py: 2,
            px: 3,
            mt: "auto",
            backgroundColor: theme.palette.grey[100],
            borderTop: "1px solid",
            borderColor: theme.palette.divider,
          }}
        >
          <Typography variant="body2" color="text.secondary" align="center">
            © 2025 Spotter Trucking Route & ELD Manager. Built with Next.js and
            Django.
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
