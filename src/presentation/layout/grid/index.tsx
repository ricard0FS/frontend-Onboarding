import React from "react";
import { AppBar, Toolbar, Typography, Container } from "@mui/material";

const Grid: React.FC<{ title: string }> = ({ title }) => (
  <AppBar position="relative" color="default" elevation={1}>
    <Toolbar>
      <Container maxWidth="xl">
        <Typography variant="h6">{title}</Typography>
      </Container>
    </Toolbar>
  </AppBar>
);

export default Grid;
