import React from "react";
import Sidebar from "./../../components/Sidebar";
import { Container } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import NewOrder from "../NewOrder";
import { Box } from "@mui/material";
import { UserAuth } from "../../context";
import Signin from "../../components/Login";
import TopBar from "../../components/TopBar";

const Layout = () => {
  const { user } = UserAuth();

  console.log(user);
  if (!user) {
    return <Signin />;
  }

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100vh",
      }}
    >
      {user && (
        <>
          <Sidebar />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "240px",
              width: "100%",
            }}
          >
            <TopBar user={user} />
            <div
              style={{
                flexGrow: 1,

                backgroundColor: "#f2f0f0",
              }}
            >
              <Routes>
                <Route path="/new-order" element={<NewOrder user={user} />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Layout;
