import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TrackOrder from "../NewOrder/trackorder";
import HomeIcon from "@mui/icons-material/Home";
import React, { useEffect, useState } from "react";
import DoneIcon from "@mui/icons-material/Done";
import PendingIcon from "@mui/icons-material/Pending";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {
  Button,
  Modal,
  Typography,
  Card,
} from "@mui/material";
import ScheduleIcon from '@mui/icons-material/Schedule';
import NavigationIcon from '@mui/icons-material/Navigation';
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import Geocode from "react-geocode";
Geocode.setApiKey("AIzaSyAm8wWzqS9Rltn5WvhUGqGZPeJsmJkykNU");
Geocode.setLanguage("en");

const Order = () => {
  const [value, setValue] = useState(1);
  const [open, setopen] = useState(false);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [activeStep, setActiveStep] = React.useState(3);
  const [route, setroute] = useState(null);
  const x = 1;

  const steps = [
    "order placed sucessfully",
    "order confirmed",
    "drone on delivery",
    "order delivered",
  ];
  const [data, setdata] = useState({
    time: -1,
    distance: -1,
    from: "",
    to: "",
  });

  const [add, setadd] = useState();
  const getAddress = async (coordinates) => {
    var response = await Geocode.fromLatLng(coordinates.lat, coordinates.lng);
    setroutes([...routes, res.results[0].formatted_address]);
    return res.results[0].formatted_address;
  };
  const [orderdelivered,setorderdelivered]=useState(false)
  const [routes, setroutes] = useState([]);
  const get_routes = () => {
    var x = [];

    {
      route.map(async (r) => {
        var z = { lat: r.start_location.lat(), lng: r.start_location.lng() };

        getAddress(z);
      });
    }
  };
  useEffect(() => {
    if (route === null) {
      return;
    }
    get_routes();
  }, [route]);

  const [order, setorder] = useState([
    {
      "ORDER PLACED": "6 March 2023",
      "TOTAL:": "1,999.00",
      "Delivered ": "10-Mar-2023",
      status: "in delivary",
      id: " #407-2510492-0729917",
      path: {
        from: "1park avenue",
        to: "stree avenue",
      },
    },
    {
      "ORDER PLACED": "6 March 2023",
      "TOTAL:": "1,999.00",
      "Delivered ": "10-Mar-2023",
      status: "delivaerd",
      id: "# 407-2510492-0729917",
    },
    {
      "ORDER PLACED": "6 March 2023",
      "TOTAL:": "1,999.00",
      "Delivered ": "10-Mar-2023",
      status: "in delivary",
      id: "# 407-2510492-0729917",
    },
  ]);

  return (
    <Box sx={{ marginLeft: "100px", padding: "20px" }}>
      <Box>
        <Typography> Your orders</Typography>
      </Box>
      <TabContext value={value}>
        <Box>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Orders" sx={{ marginRight: "20px" }} value={1} />

            <Tab
              label="Not Yet Shipped"
              sx={{ marginRight: "20px" }}
              value="2"
            />

            <Tab label="shipped" value="3" />
          </TabList>
        </Box>
        <TabPanel
          value={1}
          sx={{ display: "flex", flexDirection: "column", gap: "40px" }}
        >
          <Modal open={open} >
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                height: "100%",
                
              }}
            >
              <div
                style={{
                  width: "40%",
                  height: "100%",
                  backgroundColor: "white",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <KeyboardBackspaceIcon
                  sx={{ cursor: "pointer", fontSize: "30px" }}
                  onClick={() => setopen(false)}
                  fontSize="large"
                ></KeyboardBackspaceIcon>

                <div
                  style={{
                    width: "100%",
                    height: "40%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: "80%",
                      height: "80%",
                      boxShadow: " rgba(0, 0, 0, 0.35) 0px 5px 15px",
                      padding:"20px",
                      display:"flex",
                      flexDirection:"column",
                      justifyContent:"space-between",
                      gap:"20px",
                      marginBottom:"20px"
              
                    
                    }}
                  >
                    <div  style={{display:"flex",flexDirection:"row",gap:"20px",alignItems:"center",}}>
                      <div><NavigationIcon fontSize="large" sx={{transform:"rotate(180deg)"}}></NavigationIcon></div>
                      <div>
                      <Typography sx={{fontSize:"10px",opacity:0.5}}>From</Typography>
                      <Typography >
                        7 Unity Cres, Akesan Igando 101245, Lagos, Nigeria
                      </Typography>
                      </div>
                    </div>
                    <div style={{display:"flex",flexDirection:"row",gap:"20px",alignItems:"center"}}>
                      <div>
                        <LocationOnIcon fontSize="large"></LocationOnIcon>
                      </div>
                      <div>
                      <Typography sx={{fontSize:"10px",opacity:0.5}}>TO</Typography>
                      <Typography >
                      FC8X+MX9, Banana Island 106104, Lagos, Nigeria

                      </Typography>
                      </div>
                    </div>
                       <div style={{display:"flex",flexDirection:"row",gap:"20px",alignItems:"center"}}>
                      <div>
                        <ScheduleIcon fontSize="large"></ScheduleIcon>
                      </div>
                      <div>
                      <Typography sx={{fontSize:"10px",opacity:0.5}}>Estimated Time</Typography>
                      <Typography >
                     {data.time}

                      </Typography>
                      </div>
                    </div>
                   
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    minHeight: "40%",
                    display: "flex",
                    gap: "40px",
                    paddingBottom: "10px",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  {steps.map((r, y) => (
                    <Card
                      sx={{
                        width: "90%",
                        "height": "30px",
                        borderRadius: "20px",
                        gap: "10px",
                        backgroundColor: x >= y || orderdelivered ? "#00e676" : "gray",
                        display: "flex",
                        alignItems: "center",
                        padding: "10px",
                        transition:"all 0.5s linear"
                      }}
                    >
                      {x >= y  || orderdelivered ? (
                        <>
                          <DoneIcon
                            fontSize="large"
                            sx={{ color: "white",      transition:"all 0.5s linear" }}
                          ></DoneIcon>
                        </>
                      ) : (
                        <>
                          <PendingIcon
                            fontSize="large"
                            sx={{ color: "white" }}
                          ></PendingIcon>
                        </>
                      )}

                      <Typography sx={{ color: "white" }}>{r}</Typography>
                    </Card>
                  ))}
                </div>
              </div>
              <div style={{ width: "60%", height: "100%" }}>
                <TrackOrder setdata={setdata} setroute={setroute} setorderdelivered={setorderdelivered}></TrackOrder>
              </div>
            </div>
          </Modal>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Delivery Date</TableCell>
                  <TableCell>TOTAL</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Track</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.map((row) => (
                  <TableRow
                    hover={true}
                    key={row["ORDER PLACED"] + row["id"]}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>{row.id}</TableCell>

                    <TableCell>{row["ORDER PLACED"]}</TableCell>
                    <TableCell>{row["TOTAL:"]}</TableCell>

                    <TableCell>{row.status}</TableCell>

                    <TableCell>
                      <Button
                        disabled={row.status === "delivaerd" ? true : false}
                        variant="contained"
                        onClick={() => setopen(true)}
                      >
                        Track
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        <TabPanel value="2">Item Two</TabPanel>
        <TabPanel value="3">Item Three</TabPanel>
      </TabContext>
    </Box>
  );
};
export default Order;
