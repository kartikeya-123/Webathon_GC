import {
  Box,
  Button,
  Card,
  CardHeader,
  Container,
  FormControl,
  InputLabel,
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
const NewOrder = () => {
  // Variables
  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");

  const [fromLatLong, setFromLatLong] = useState(null);
  const [toLatLong, setToLatLong] = useState(null);

  const [items, setItems] = useState(null);
  const [weight, setWeight] = useState(null);
  const [active, setActive] = useState(0);

  const [show, setShow] = useState(true);

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
  return (
    <Box sx={{ width: "100%", height: "100vh" }}>
      <Box sx={{ width: "100%", height: "100vh" }}>
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
                    onChange={(event) => handleChange(event.target.value, "to")}
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
              >
                Order
              </Button>
            </Box>
          </Card>
        )}
        {!show && (
          <Fab color="primary" aria-label="add" onClick={() => setShow(true)}>
            <AddIcon />
          </Fab>
        )}
      </Box>
    </Box>
  );
};

export default NewOrder;
