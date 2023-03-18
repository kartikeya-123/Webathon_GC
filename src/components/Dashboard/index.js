import {
  Box,
  Grid,
  Typography,
  Paper,
  IconButton,
  Chip,
  Button,
  Snackbar,
  Alert,
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
  DirectionsRenderer,
} from "@react-google-maps/api";
import { styled } from "@mui/material/styles";
import LocalAirportIcon from "@mui/icons-material/LocalAirport";
import {
  collection,
  setDoc,
  doc,
  getDocs,
  updateDoc,
  onSnapshot,
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
  height: "85px",
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

const Dashboard = () => {
  const [tab, setTab] = useState(0);
  const [orderData, setOrderData] = useState(null);
  const [markers, setMarkers] = useState(null);
  const [showMessage, setShowMessage] = useState(0);
  const [drones, setDrones] = useState(null);
  const [directions, setDirections] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAm8wWzqS9Rltn5WvhUGqGZPeJsmJkykNU",
    libraries: ["places"],
  });

  const center = { lat: 20.1469136, lng: 85.6727937 };

  const getAllOrders = async () => {
    onSnapshot(collection(db, "Orders"), (snapshot) => {
      const documents = [];
      snapshot.forEach((doc) => {
        documents.push({ orderId: doc.id, ...doc.data() });
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
      getPath(data[0]);
    });
  };

  const getPath = async (activeOrders) => {
    try {
      const directionResponses = [];

      for (let i = 0; i < activeOrders.length; i++) {
        const directionsService = new window.google.maps.DirectionsService();
        const response = await directionsService.route({
          origin: activeOrders[i].from,
          destination: activeOrders[i].to,
          travelMode: window.google.maps.TravelMode.DRIVING,
        });

        directionResponses.push(response);
        const path = response.routes[0].overview_path;

        // if (activeOrders[i].droneId)
        //   simulateDrones(activeOrders[i].droneId, path);
      }
      setDirections(directionResponses);

      for (let i = 0; i < activeOrders.length; i++) {
        if (activeOrders[i].droneId) {
          console.log("ddef");
          simulateDrones(
            activeOrders[i].orderId,
            activeOrders[i].droneId,
            directionResponses[i].routes[0].overview_path
          );
        }
      }
    } catch (err) {}
  };

  const simulateDrones = (orderId, droneId, path) => {
    console.log(typeof droneId);
    const droneRef = doc(db, "Drones", droneId);
    const orderRef = doc(db, "Orders", orderId);
    console.log("nex");

    let start = 0;
    let end = path.length - 1;

    const interval = setInterval(async () => {
      try {
        const droneLocation = {
          lat: path[start].lat(),
          lng: path[start].lng(),
        };
        await updateDoc(droneRef, { location: droneLocation });
        start = start + 1;
        if (start >= end) {
          await updateDoc(orderRef, { status: "Finished" });
          await updateDoc(droneRef, { status: "Free", order: null });
          clearInterval(interval);
        }
      } catch (err) {
        clearInterval(interval);
      }
    }, [1000]);
  };
  const getDrones = () => {
    onSnapshot(collection(db, "Drones"), (snapshot) => {
      const documents = [];
      snapshot.forEach((doc) => {
        documents.push(doc.data());
      });
      console.log(documents);
      setDrones(documents);
    });
  };

  useEffect(() => {
    getAllOrders();
    getDrones();
  }, []);

  const acceptShipment = (order) => {
    const freeDrones = drones.filter((drone) => {
      return drone.status === "Free";
    });
    if (freeDrones.length > 0) {
      const selectedDrone = freeDrones[0];

      const docRef = doc(db, "Orders", order.orderId);
      const droneRef = doc(db, "Drones", selectedDrone.droneId);

      updateDoc(docRef, { status: "Active", droneId: selectedDrone.droneId })
        .then((res) => {
          console.log(res);
          setShowMessage(1);
        })
        .catch((err) => {
          setShowMessage(-1);
          console.log(err);
        });

      updateDoc(droneRef, { status: "Active", order, location: order.from })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setShowMessage(-1);
    }
  };

  const generateMessage = () => {
    if (showMessage === 0) return;
    let message = "Accepting order has been successfully created";
    if (showMessage == -1) message = "There are no active drones available";

    return (
      <Snackbar
        open={true}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={() => {
          setShowMessage(0);
        }}
      >
        <Alert
          severity={showMessage === 1 ? "success" : "error"}
          sx={{ width: "100%", background: "#94e35b", fontWeight: 600 }}
        >
          {message}
        </Alert>
      </Snackbar>
    );
  };

  if (!isLoaded) {
    return <div>Loading</div>;
  }
  return (
    <Box sx={{ padding: "20px 50px" }}>
      {/* <Typography sx={{ color: "black", fontSize: "30px", fontWeight: 600 }}>
        Dashboard
      </Typography> */}

      <Box style={{ height: "300px", width: "100%", justifyContent: "center" }}>
        <GoogleMap
          center={center}
          zoom={10}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            streetViewControl: false,
            zoomControl: false,
          }}
        >
          {drones &&
            drones.map((drone, ind) => {
              if (drone.status !== "Active") return;
              return <Marker position={drone.location} key={ind} />;
            })}
          {directions &&
            directions.map((direction, ind) => {
              return <DirectionsRenderer directions={direction} key={ind} />;
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
                    {tab !== 1 ? (
                      <BorderLinearProgress
                        variant="determinate"
                        value={order.progress}
                      />
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          float: "right",
                          paddingBottom: "20px",
                        }}
                      >
                        <Button
                          variant="contained"
                          sx={{ background: "#41c4b9", marginBottom: "10px" }}
                          onClick={() => acceptShipment(order)}
                        >
                          Accept
                        </Button>
                      </Box>
                    )}
                  </Box>
                </GridItem>
              ))}
          </Grid>
        </Grid>
      </Box>
      {generateMessage()}
    </Box>
  );
};

export default Dashboard;
