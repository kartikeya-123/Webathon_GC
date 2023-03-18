import React, { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { Button, Hidden } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import logo from "./../../assests/images/logo.png";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../context";
const drawerWidth = 230;

const options = [
  {
    title: "Home",
    icon: AssignmentIcon,
    route: "",
    adming: true,
  },

  {
    title: "Orders",
    icon: AssignmentIcon,
    route: "orders",
    admin: false,
  },
  {
    title: "New Order",
    icon: AssignmentIcon,
    route: "new-order",
    admin: false,
  },

  {
    title: "Dashboard",
    icon: AssignmentIcon,
    route: "dashboard",
    admin: true,
  },
  {
    title: "Drones",
    icon: AssignmentIcon,
    route: "drones",
    admin: true,
  },
];
export default function PermanentDrawerLeft({ user }) {
  const [active, setActive] = useState("Home");
  const navigate = useNavigate();
  const { logOut } = UserAuth();

  return (
    <Box>
      <Hidden smDown implementation="css">
        <Drawer
          variant="permanent"
          anchor="left"
          open
          PaperProps={{
            sx: {
              backgroundColor: "#fbfcfb",
              padding: "10px 10px",
              width: drawerWidth,
            },
            elevation: 10,
          }}
        >
          <Box>
            {" "}
            <img
              alt={"img"}
              style={{ width: "200px", height: "130px", borderRadius: "100%" }}
              src={logo}
            />
          </Box>
          <List
            style={{
              marginTop: "2rem",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {options.map((option, ind) => {
              if (user.role === "admin" && option.admin === false) return;
              else if (user.role === "user" && option.admin) return;

              let tabActive = false;
              if (active === option.title) tabActive = true;

              return (
                <ListItemButton
                  key={ind}
                  onClick={() => {
                    setActive(option.title);
                    navigate(option.route);
                  }}
                  sx={{
                    flexGrow: 0,
                    backgroundColor: tabActive ? "#C9CAF9" : "none",
                    borderRadius: "10px",
                    "&:hover": {
                      backgroundColor: tabActive ? "#C9CAF9" : "none",
                    },
                  }}
                >
                  <ListItemIcon
                    style={{
                      minWidth: "36px",
                      color: tabActive ? "#2C0FA3" : "black",
                    }}
                  >
                    <AssignmentIcon />
                  </ListItemIcon>
                  <Typography
                    style={{
                      fontSize: "16px",
                      color: tabActive ? "#2C0FA3" : "black",
                      fontWeight: 600,
                    }}
                  >
                    {option.title}
                  </Typography>
                </ListItemButton>
              );
            })}
          </List>
          <Box sx={{ marginBottom: "40px", textAlign: "center" }}>
            <Button
              onClick={logOut}
              sx={{ background: "#2C0FA3", color: "white" }}
            >
              Logout
            </Button>
          </Box>
        </Drawer>
      </Hidden>
    </Box>
  );
}
