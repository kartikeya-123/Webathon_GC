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
import { Hidden } from "@mui/material";
import { makeStyles } from "@mui/styles";
import AssignmentIcon from "@mui/icons-material/Assignment";
import logo from "./../../assests/images/logo.png";

const useStyles = makeStyles(() => ({
  listRoot: {
    marginTop: "2rem",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  listItemRoot: {
    display: "flex",
    fontSize: ".9rem",
    color: "red",
    padding: ".65rem 1.5rem !important",
    "&:hover": {
      color: "blue",
    },
    paper: {
      background: "blue",
    },
  },
  logoClasses: {
    width: "200px",
    height: "130px",
    borderRadius: "100%",
  },
}));
const drawerWidth = 230;

const options = [
  {
    title: "Home",
    icon: AssignmentIcon,
  },

  {
    title: "Profile",
    icon: AssignmentIcon,
  },
  {
    title: "Orders",
    icon: AssignmentIcon,
  },
  {
    title: "Place-Order",
    icon: AssignmentIcon,
  },
];
export default function PermanentDrawerLeft() {
  const classes = useStyles();
  const [active, setActive] = useState("Home");

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
              width: drawerWidth,
              padding: "10px",
            },
            elevation: 5,
          }}
        >
          <Box paddingTop="1rem" paddingBottom="1rem">
            {" "}
            <img alt={"img"} className={classes.logoClasses} src={logo} />
          </Box>
          <List classes={{ root: classes.listRoot }}>
            {options.map((option) => {
              let tabActive = false;
              if (active === option.title) tabActive = true;

              return (
                <ListItemButton
                  onClick={() => {
                    setActive(option.title);
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
        </Drawer>
      </Hidden>
    </Box>
  );
}
