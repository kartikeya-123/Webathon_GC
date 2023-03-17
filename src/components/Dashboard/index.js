import {
  Box,
  Grid,
  Typography,
  Paper,
  IconButton,
  Chip,
  Button,
} from "@mui/material";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";

import React, { useState, useEffect } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  Autocomplete,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import { styled } from "@mui/material/styles";
import LocalAirportIcon from "@mui/icons-material/LocalAirport";
import {
  collection,
  setDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  borderRadius: "0px",
  height: "100px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "20px",
  cursor: "pointer",
}));

const GridItem = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: "10px 30px",
  textAlign: "left",
  color: theme.palette.text.secondary,
  borderRadius: "0px",
  height: "80px",
  display: "flex",
  justifyContent: "flexStart",
  alignItems: "left",
  gap: "20px",
  margin: "1px 0",
  borderRadius: "5px",
}));

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "light" ? "#a1eeff" : "#a1eeff",
  },
}));

const shipmentData = [
  {
    icon: <LocalAirportIcon sx={{ color: "#c060d1" }} />,
    total: 20,
    type: "Active Shipment",
  },
  {
    icon: <LocalAirportIcon sx={{ color: "light blue" }} />,
    total: 20,
    type: "Pending Shipment",
  },
  {
    icon: <LocalAirportIcon sx={{ color: "#c060d1" }} />,
    total: 20,
    type: "Finished Shipment",
  },
];

const orderData = [
  [
    {
      from: "Hyderabad",
      to: "Tirupati",
      weight: 10,
      items: 5,
      orderId: 20,
      progress: 30,
    },
    {
      from: "Hyderabad",
      to: "Tirupati",
      weight: 10,
      items: 5,
      orderId: 20,
      progress: 40,
    },
    {
      from: "Hyderabad",
      to: "Tirupati",
      weight: 10,
      items: 5,
      orderId: 20,
      progress: 10,
    },
  ],
  [
    {
      from: "Hyderabad",
      to: "Tirupati",
      weight: 10,
      items: 5,
      orderId: 20,
      progress: 0,
    },
    {
      from: "Hyderabad",
      to: "Tirupati",
      weight: 10,
      items: 5,
      orderId: 20,
      progress: 0,
    },
  ],
  [
    {
      from: "Hyderabad",
      to: "Tirupati",
      weight: 10,
      items: 5,
      orderId: 20,
      progress: 100,
    },
  ],
];
const Dashboard = () => {
  const [tab, setTab] = useState(0);
  const [orderData, setOrderData] = useState(null);
  const [markers, setMarkers] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAm8wWzqS9Rltn5WvhUGqGZPeJsmJkykNU",
    libraries: ["places"],
  });

  const center = { lat: 20.1469136, lng: 85.6727937 };

  const getAllOrders = async () => {
    const snapshot = await getDocs(collection(db, "Orders"));
    const documents = [];
    snapshot.forEach((doc) => {
      documents.push(doc.data());
    });

    let data = [[], [], []];
    let marks = [];

    documents.forEach((doc) => {
      doc.fromAddress = doc.fromAddress.split(",").slice(-3, -1).join(",");
      doc.toAddress = doc.toAddress.split(",").slice(-3, -1).join(",");
      if (doc.status === "Active") {
        data[0].push(doc);
        marks.push([doc.from, doc.to]);
      } else if (doc.status === "Pending") data[1].push(doc);
      else data[2].push(doc);
    });
    console.log(marks);
    setMarkers(marks);
    setOrderData(data);
  };

  useEffect(() => {
    getAllOrders();
  }, []);

  if (!isLoaded) {
    return <div>Loading</div>;
  }
  return (
    <Box sx={{ padding: "20px 50px" }}>
      {/* <Typography sx={{ color: "black", fontSize: "30px", fontWeight: 600 }}>
        Dashboard
      </Typography> */}

      <Box sx={{ height: "340px", borderRadius: "40px" }}>
        <GoogleMap
          center={center}
          zoom={10}
          mapContainerStyle={{
            width: "100%",
            height: "100%",
            borderRadius: "10px",
          }}
          options={{
            streetViewControl: false,
            zoomControl: false,
          }}
        >
          {markers &&
            markers.map((marker, ind) => {
              return (
                <>
                  <Marker position={marker[0]} />
                  <Marker position={marker[1]} />
                  <Polyline
                    path={marker}
                    strokeColor="#0000FF"
                    strokeOpacity={0.8}
                    strokeWeight={2}
                  />
                </>
              );
            })}
        </GoogleMap>
      </Box>
      <Box sx={{ height: "100px" }}>
        <Grid container>
          {orderData &&
            shipmentData.map((shipment, ind) => (
              <Grid
                item
                xs={4}
                key={ind}
                onClick={() => {
                  setTab(ind);
                }}
              >
                <Item sx={{ background: ind === tab ? "#e8f9ff" : "white" }}>
                  <IconButton sx={{ background: "pink" }}>
                    {shipment.icon}
                  </IconButton>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      flexStart: "left",
                      //   background: "red",
                      textAlign: "left",
                    }}
                  >
                    <Typography sx={{ fontSize: "35px", fontWeight: "bold" }}>
                      {orderData[ind].length}
                    </Typography>
                    <Typography sx={{ fontSize: "15px", fontWeight: "bold" }}>
                      {shipment.type}
                    </Typography>
                  </Box>
                </Item>
              </Grid>
            ))}
        </Grid>
      </Box>
      <Box sx={{ marginTop: "50px" }}>
        <Grid container>
          <Grid item xs={12}>
            {orderData &&
              orderData[tab] &&
              orderData[tab].map((order, ind) => (
                <GridItem
                  sx={{
                    flexDirection: "column",
                    flexStart: "left",
                    alignItems: "left",
                    justifyContent: "flex-start",
                    left: "20px",
                    gap: "20px",
                  }}
                  key={ind}
                >
                  <Box sx={{ display: "flex" }}>
                    <Button
                      sx={{
                        height: "30px",
                        background: "yellow",
                        color: "green",
                      }}
                    >
                      #22
                    </Button>
                    <Box
                      sx={{ marginLeft: "20px", display: "flex", gap: "20px" }}
                    >
                      <Typography sx={{ fontWeight: "bold", fontSize: "18px" }}>
                        {order.fromAddress}
                      </Typography>
                      <Typography> - </Typography>
                      <Typography sx={{ fontWeight: "bold", fontSize: "18px" }}>
                        {order.toAddress}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ marginLeft: "auto", display: "flex", gap: "20px" }}
                    >
                      <Typography sx={{ fontWeight: 600 }}>
                        Items - {order.items}
                      </Typography>
                      <Typography sx={{ fontWeight: 600 }}>
                        Weight - {order.weight}KG
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <BorderLinearProgress
                      variant="determinate"
                      value={order.progress}
                    />
                  </Box>
                  <Box></Box>
                </GridItem>
              ))}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
