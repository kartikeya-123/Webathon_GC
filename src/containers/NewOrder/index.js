import {
  Alert,
  Box,
  Button,
  Card,
  CardHeader,
  Container,
  FormControl,
  InputLabel,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  Autocomplete,
  Marker,
} from "@react-google-maps/api";
import Geocode from "react-geocode";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";

import { db } from "./../../config";
import { collection, setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { CheckCircleOutline } from "@mui/icons-material";

const NewOrder = ({ user }) => {
  // Variables
  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [fromLatLong, setFromLatLong] = useState(null);
  const [toLatLong, setToLatLong] = useState(null);

  const [items, setItems] = useState(null);
  const [weight, setWeight] = useState(null);
  const [active, setActive] = useState(0);

  const [show, setShow] = useState(false);
  const [showMessage, setShowMessage] = useState(0);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAm8wWzqS9Rltn5WvhUGqGZPeJsmJkykNU",
    libraries: ["places"],
  });

  Geocode.setApiKey("AIzaSyAm8wWzqS9Rltn5WvhUGqGZPeJsmJkykNU");
  Geocode.setLanguage("en");

  if (!isLoaded) {
    return <div>Loading</div>;
  }

  const center = { lat: 20.1469136, lng: 85.6727937 };

  const userSelect = (res) => {
    let latX = res.latLng.lat();
    let latY = res.latLng.lng();
    console.log(latX, latY);
    const coordinates = { lat: latX.toString(), long: latY.toString() };

    if (active === 0) getAddress(coordinates, setFromAddress, setFromLatLong);
    else if (active === 1) getAddress(coordinates, setToAddress, setToLatLong);
  };

  const getAddress = (coordinates, setAddress, setCoordinates) => {
    console.log(coordinates.lat, coordinates.long);
    Geocode.fromLatLng(coordinates.lat, coordinates.long).then(
      (response) => {
        const address = response.results[0].formatted_address;
        setAddress(address);
        setCoordinates({
          lat: Number(coordinates.lat),
          lng: Number(coordinates.long),
        });
      },
      (error) => {
        console.error(error);
      }
    );
  };
  const getLatLong = (address, setCoordinates) => {
    Geocode.fromAddress(address).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        console.log(lat, lng);
        setCoordinates({ lat: lat, lng: lng });
      },
      (error) => {
        console.error(error);
        setCoordinates(null);
      }
    );
  };

  const clearData = () => {
    setFromAddress("");
    setFromLatLong(null);
    setToAddress("");
    setToLatLong(null);
    setItems(null);
    setWeight(null);
  };
  const handleChange = (value, type) => {
    console.log(value);
    if (type === "from") {
      setFromAddress(value);
      getLatLong(value, setFromLatLong);
    } else {
      setToAddress(value);
      getLatLong(value, setToLatLong);
    }
  };

  const submit = async () => {
    const data = {
      from: fromLatLong,
      fromAddress: fromAddress,
      to: toLatLong,
      toAddress: toAddress,
      items: items,
      weight: weight,
      userId: user.email,
      status: "Pending",
      progress: 0,
    };

    // Firebase request to db
    console.log(data);
    const orderId = uuidv4();

    const orderRef = doc(db, "Orders", orderId);
    try {
      const order = await setDoc(orderRef, data);

      let orders = user.orders || [];
      orders.push(orderId);

      const userRef = doc(db, "Users", user.email);
      await updateDoc(userRef, {
        orders: orders,
      });

      setShowMessage(1);
      clearData();
    } catch (err) {
      setShowMessage(-1);
      console.log(err);
    }
  };

  const generateMessage = () => {
    if (showMessage === 0) return;
    let message = "Your order request has been successfully created";
    if (showMessage == -1)
      message = "There was an error while creating your order request";

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
  return (
    <>
      <Box sx={{ width: "100%", height: "100%" }}>
        <Box sx={{ width: "100%", height: "100%" }}>
          <GoogleMap
            center={center}
            zoom={10}
            mapContainerStyle={{ width: "100%", height: "100%" }}
            options={{
              streetViewControl: false,
              zoomControl: false,
            }}
            onClick={userSelect}
          >
            {fromLatLong && <Marker position={fromLatLong} label="Source" />}
            {toLatLong && <Marker position={toLatLong} label="Destination" />}
          </GoogleMap>
        </Box>
        <Box sx={{ position: "absolute", bottom: "40px", right: "20px" }}>
          {show && (
            <Card
              raised={true}
              sx={{
                width: 500,
                background: "#F4F5FA ",
                borderRadius: "20px",
                paddingBottom: "20px  ",
                // display: "flex",
                // justifyContent: "center",
                // alignItems: "center",
              }}
            >
              <Box sx={{ position: "absolute", right: "0px", top: "10px" }}>
                <Button
                  sx={{ padding: "0px", margin: "0px" }}
                  onClick={() => setShow(false)}
                >
                  X
                </Button>
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontSize: 24,
                    fontWeight: 600,
                    textAlign: "center",
                    marginTop: "10px",
                  }}
                >
                  Details
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "20px ",
                  marginTop: "20px",
                }}
              >
                <Box>
                  <InputLabel sx={{ fontWeight: 600 }}>From</InputLabel>
                  <Autocomplete>
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      sx={{ width: "220px" }}
                      value={fromAddress}
                      onChange={(event) =>
                        handleChange(event.target.value, "from")
                      }
                      focused={active == 0}
                      onClick={() => setActive(0)}
                    />
                  </Autocomplete>
                </Box>
                <Box>
                  <InputLabel sx={{ fontWeight: 600 }}>To</InputLabel>
                  <Autocomplete
                    onClick={(event) => {
                      console.log(event);
                    }}
                  >
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      sx={{ width: "220px" }}
                      value={toAddress}
                      onChange={(event) =>
                        handleChange(event.target.value, "to")
                      }
                      focused={active == 1}
                      onClick={() => setActive(1)}
                    />
                  </Autocomplete>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "20px ",
                  marginTop: "20px",
                }}
              >
                <Box>
                  <InputLabel sx={{ fontWeight: 600 }}>Items</InputLabel>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    sx={{ width: "220px" }}
                    value={items}
                    onChange={(event) => setItems(event.target.value)}
                    onClick={() => setActive(2)}
                  />
                </Box>
                <Box>
                  <InputLabel sx={{ fontWeight: 600 }}>Weight</InputLabel>

                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    sx={{ width: "220px" }}
                    value={weight}
                    onChange={(event) => setWeight(event.target.value)}
                    onClick={() => setActive(3)}
                  />
                </Box>
              </Box>
              <Box sx={{ textAlign: "center", marginTop: "20px" }}>
                <Button
                  sx={{
                    background: "#1abda2",
                    borderRadius: "20px",
                    padding: "5px 20px",
                    color: "white",
                    "&:hover": {
                      background: "#1db9db",
                    },
                    "&:disabled": {
                      background: "#74d3e8",
                      color: "white",
                    },
                  }}
                  disabled={
                    !(
                      fromLatLong &&
                      toLatLong &&
                      Number(weight) > 0 &&
                      Number(items) > 0
                    )
                  }
                  onClick={submit}
                >
                  Order
                </Button>
              </Box>
            </Card>
          )}
          {generateMessage()}
          {!show && (
            <Fab color="primary" aria-label="add" onClick={() => setShow(true)}>
              <AddIcon />
            </Fab>
          )}
        </Box>
      </Box>
    </>
  );
};

export default NewOrder;
