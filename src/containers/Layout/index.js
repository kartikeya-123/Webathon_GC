import React from "react";
import Sidebar from "./../../components/Sidebar";
import { Container } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import NewOrder from "../NewOrder";
import { Box } from "@mui/material";
const Layout = () => {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100vh",
      }}
    >
      <Sidebar />

      <div
        style={{
          flexGrow: 1,
          marginLeft: "240px",
          backgroundColor: "#f2f0f0",
        }}
      >
        <Routes>
          <Route path="/profile" element={<NewOrder />} />
        </Routes>
      </div>
    </div>
  );
};

export default Layout;
