import React from "react";
import Sidebar from "./../../components/Sidebar";
import { Container } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import NewOrder from "../NewOrder";
import Order from "./order"
import { Box } from "@mui/material";
const Layout = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "flex-start",
        width: "100%",
        height: "100vh",
      }}
    >
      <Sidebar />

      <div
        style={{
          flexGrow: 1,
          marginLeft:"200px"
         
        }}
      >
        <Routes>
          {/* <Route path="/profile" element={<NewOrder />} /> */}
          <Route path="/orders" element={<Order />} />
        </Routes>
      </div>
    </div>
  );
};

export default Layout;
