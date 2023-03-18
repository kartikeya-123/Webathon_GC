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
import TrackOrder from "./trackorder";
import HomeIcon from "@mui/icons-material/Home";
import React, { useEffect, useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import { Button, Modal, Typography, Card, Avatar, Chip } from "@mui/material";
import Geocode from "react-geocode";
import {
  collection,
  setDoc,
  doc,
  getDocs,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../config";

Geocode.setApiKey("AIzaSyAm8wWzqS9Rltn5WvhUGqGZPeJsmJkykNU");
Geocode.setLanguage("en");

const Order = ({ user }) => {
  const [value, setValue] = useState(1);
  const [open, setopen] = useState(false);

  const [orderData, setOrderData] = useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [activeStep, setActiveStep] = React.useState(3);
  const [selectedOrder, setSelectedOrder] = React.useState(null);
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
    setroutes([...routes, response.results[0].formatted_address]);
    return response.results[0].formatted_address;
  };
  const [orderdelivered, setorderdelivered] = useState(false);
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

  const getAllOrders = async () => {
    console.log(user.email);
    onSnapshot(collection(db, "Orders"), (snapshot) => {
      const documents = [];
      snapshot.forEach((doc) => {
        const orderData = doc.data();
        if (orderData.userId === user.email) {
          documents.push({ orderId: doc.id, ...orderData });
        }
      });
      console.log(documents);
      setOrderData(documents);
    });
  };

  useEffect(() => {
    if (route === null) {
      return;
    }
    get_routes();
  }, [route]);

  useEffect(() => {
    getAllOrders();
  }, []);

  return (
    <Box sx={{ padding: "20px 40px" }}>
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
          <Modal open={open}>
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
                  width: "22%",
                  height: "100%",
                  backgroundColor: "#EFEFEF",
                  display: "flex",
                  flexDirection: "column",
                  borderRight: "1px solid #D5D9D9",
                }}
              >
                <div
                  style={{
                    width: "100%",

                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  <Typography sx={{ fontWeight: "bold" }}>
                    ALL ACTIVITY
                  </Typography>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      gap: "30px",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "white",
                        height: "30px",
                        display: "flex",
                        flexDirection: "row",
                        gap: "10px",
                        alignItems: "center",
                        padding: "10px",
                        width: "180px",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"></path>
                      </svg>
                      <input
                        style={{
                          outline: "none",
                          border: "none",
                          height: "40px",
                          width: "100px",
                        }}
                        placeholder={"Search"}
                      ></input>
                    </div>
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        backgroundColor: "white",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 16c2.206 0 4-1.794 4-4s-1.794-4-4-4-4 1.794-4 4 1.794 4 4 4zm0-6c1.084 0 2 .916 2 2s-.916 2-2 2-2-.916-2-2 .916-2 2-2z"></path>
                        <path d="m2.845 16.136 1 1.73c.531.917 1.809 1.261 2.73.73l.529-.306A8.1 8.1 0 0 0 9 19.402V20c0 1.103.897 2 2 2h2c1.103 0 2-.897 2-2v-.598a8.132 8.132 0 0 0 1.896-1.111l.529.306c.923.53 2.198.188 2.731-.731l.999-1.729a2.001 2.001 0 0 0-.731-2.732l-.505-.292a7.718 7.718 0 0 0 0-2.224l.505-.292a2.002 2.002 0 0 0 .731-2.732l-.999-1.729c-.531-.92-1.808-1.265-2.731-.732l-.529.306A8.1 8.1 0 0 0 15 4.598V4c0-1.103-.897-2-2-2h-2c-1.103 0-2 .897-2 2v.598a8.132 8.132 0 0 0-1.896 1.111l-.529-.306c-.924-.531-2.2-.187-2.731.732l-.999 1.729a2.001 2.001 0 0 0 .731 2.732l.505.292a7.683 7.683 0 0 0 0 2.223l-.505.292a2.003 2.003 0 0 0-.731 2.733zm3.326-2.758A5.703 5.703 0 0 1 6 12c0-.462.058-.926.17-1.378a.999.999 0 0 0-.47-1.108l-1.123-.65.998-1.729 1.145.662a.997.997 0 0 0 1.188-.142 6.071 6.071 0 0 1 2.384-1.399A1 1 0 0 0 11 5.3V4h2v1.3a1 1 0 0 0 .708.956 6.083 6.083 0 0 1 2.384 1.399.999.999 0 0 0 1.188.142l1.144-.661 1 1.729-1.124.649a1 1 0 0 0-.47 1.108c.112.452.17.916.17 1.378 0 .461-.058.925-.171 1.378a1 1 0 0 0 .471 1.108l1.123.649-.998 1.729-1.145-.661a.996.996 0 0 0-1.188.142 6.071 6.071 0 0 1-2.384 1.399A1 1 0 0 0 13 18.7l.002 1.3H11v-1.3a1 1 0 0 0-.708-.956 6.083 6.083 0 0 1-2.384-1.399.992.992 0 0 0-1.188-.141l-1.144.662-1-1.729 1.124-.651a1 1 0 0 0 .471-1.108z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    overflowX: "hidden",
                  }}
                >
                  {console.log(document.getElementById("data"))}
                  {orderData &&
                    orderData.map((orderItem, ind) => (
                      <Box
                        sx={{
                          width: "100%",
                          // height: "30%",
                          backgroundColor: "white",
                          display: "flex",
                          flexDirection: "column",
                          padding: "20px 0px",
                          gap: "20px",
                          border: "1px solid #D5D9D9",
                          ":hover": {
                            backgroundColor: "lightgray",
                          },
                        }}
                        key={ind}
                        onClick={() => {
                          console.log("e");
                          setSelectedOrder(orderItem);
                        }}
                      >
                        <div
                          style={{
                            marginLeft: "10px",
                            display: "flex",
                            flexDirection: "row",
                            gap: "20px",
                            alignItems: "center",
                          }}
                        >
                          <Avatar
                            sx={{
                              width: "50px",
                              height: "50px",
                              backgroundColor: "white",
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="24"
                              width="24"
                            >
                              <path d="M12 17q2.075 0 3.538-1.463Q17 14.075 17 12t-1.462-3.538Q14.075 7 12 7 9.925 7 8.463 8.462 7 9.925 7 12q0 2.075 1.463 3.537Q9.925 17 12 17Zm0 5q-2.075 0-3.9-.788-1.825-.787-3.175-2.137-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175 1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138 1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175-1.35 1.35-3.175 2.137Q14.075 22 12 22Zm0-2q3.35 0 5.675-2.325Q20 15.35 20 12q0-3.35-2.325-5.675Q15.35 4 12 4 8.65 4 6.325 6.325 4 8.65 4 12q0 3.35 2.325 5.675Q8.65 20 12 20Zm0-8Z" />
                            </svg>
                          </Avatar>
                          <div>
                            <Typography>{orderItem.toAddress}</Typography>
                            <Typography
                              sx={{ color: "blue", fontSize: "10px" }}
                            >
                              Delivery
                            </Typography>
                          </div>
                        </div>
                        <div
                          style={{
                            marginLeft: "10px",
                            display: "flex",
                            flexDirection: "row",
                            gap: "20px",
                            alignItems: "center",
                          }}
                        >
                          <Avatar
                            sx={{
                              width: "50px",
                              height: "50px",
                              backgroundColor: "white",
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="24"
                              width="24"
                            >
                              <path d="M12 17q2.075 0 3.538-1.463Q17 14.075 17 12t-1.462-3.538Q14.075 7 12 7 9.925 7 8.463 8.462 7 9.925 7 12q0 2.075 1.463 3.537Q9.925 17 12 17Zm0 5q-2.075 0-3.9-.788-1.825-.787-3.175-2.137-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175 1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138 1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175-1.35 1.35-3.175 2.137Q14.075 22 12 22Zm0-2q3.35 0 5.675-2.325Q20 15.35 20 12q0-3.35-2.325-5.675Q15.35 4 12 4 8.65 4 6.325 6.325 4 8.65 4 12q0 3.35 2.325 5.675Q8.65 20 12 20Zm0-8Z" />
                            </svg>
                          </Avatar>
                          <div>
                            <Typography>{orderItem.fromAddress}</Typography>
                            <Typography
                              sx={{ color: "blue", fontSize: "10px" }}
                            >
                              Pick up
                            </Typography>
                          </div>
                        </div>
                        <div
                          style={{
                            marginLeft: "10px",
                            display: "flex",
                            flexDirection: "row",
                            gap: "20px",
                            alignItems: "center",
                          }}
                        >
                          <Avatar
                            sx={{
                              width: "50px",
                              height: "50px",
                              backgroundColor: "white",
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="24"
                              width="24"
                            >
                              <path d="M12 12q.825 0 1.413-.588Q14 10.825 14 10t-.587-1.413Q12.825 8 12 8q-.825 0-1.412.587Q10 9.175 10 10q0 .825.588 1.412Q11.175 12 12 12Zm0 7.35q3.05-2.8 4.525-5.088Q18 11.975 18 10.2q0-2.725-1.738-4.463Q14.525 4 12 4 9.475 4 7.737 5.737 6 7.475 6 10.2q0 1.775 1.475 4.062Q8.95 16.55 12 19.35ZM12 22q-4.025-3.425-6.012-6.363Q4 12.7 4 10.2q0-3.75 2.413-5.975Q8.825 2 12 2t5.587 2.225Q20 6.45 20 10.2q0 2.5-1.987 5.437Q16.025 18.575 12 22Zm0-11.8Z" />
                            </svg>
                          </Avatar>
                          <div>
                            <Typography>Arrival</Typography>
                            <Typography
                              sx={{ color: "blue", fontSize: "10px" }}
                            >
                              FC8X+MX9, Banana Island 106104
                            </Typography>
                          </div>
                        </div>
                      </Box>
                    ))}
                </div>
              </div>
              <div
                style={{
                  width: "78%",
                  height: "100%",
                  backgroundColor: "white",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    padding: "10px",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    height: "20px",
                    width: "100%",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "20px",
                      fontFamily: "monospace",
                      marginLeft: "25px",
                    }}
                  >
                    #Order ID :
                  </Typography>
                  <Typography sx={{ fontSize: "15px", opacity: 0.5 }}>
                    407-2510492-0729917
                  </Typography>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: "100px",
                    padding: "20px",
                  }}
                >
                  <div
                    style={{
                      width: "20%",
                      display: "flex",
                      flexDirection: "row",
                      borderRight: "1px solid lightgray",
                    }}
                  >
                    <div
                      style={{
                        width: "40%",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Avatar
                        sx={{
                          width: "50px",
                          height: "50px",
                          backgroundColor: "#AD7BE9",
                        }}
                      >
                        <PersonIcon></PersonIcon>
                      </Avatar>
                    </div>
                    <div>
                      <Typography sx={{ fontSize: "15px", fontWeight: "bold" }}>
                        {" "}
                        Jack
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "12px",
                          fontWeight: "light",
                          opacity: 0.8,
                        }}
                      >
                        Driver Name
                      </Typography>
                    </div>
                  </div>
                  <div
                    style={{
                      width: "20%",
                      display: "flex",
                      flexDirection: "row",
                      borderRight: "1px solid lightgray",
                    }}
                  >
                    <div
                      style={{
                        width: "40%",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Avatar
                        sx={{
                          width: "50px",
                          height: "50px",
                          backgroundColor: "#E90064",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ fill: "white" }}
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 13h2v3H8zm0 4h2v3H8zm3-2h2v3h-2zm0 4h2v3h-2zm3-6h2v3h-2zm0 4h2v3h-2z"></path>
                          <path d="M18.944 10.112C18.507 6.67 15.56 4 12 4 9.245 4 6.85 5.611 5.757 8.15 3.609 8.792 2 10.819 2 13c0 2.757 2.243 5 5 5v-2c-1.654 0-3-1.346-3-3 0-1.403 1.199-2.756 2.673-3.015l.582-.103.191-.559C8.149 7.273 9.895 6 12 6c2.757 0 5 2.243 5 5v1h1c1.103 0 2 .897 2 2s-.897 2-2 2h-1v2h1c2.206 0 4-1.794 4-4a4.008 4.008 0 0 0-3.056-3.888z"></path>
                        </svg>
                      </Avatar>
                    </div>
                    <div>
                      <Typography sx={{ fontSize: "15px", fontWeight: "bold" }}>
                        {" "}
                        23242443545
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "12px",
                          fontWeight: "light",
                          opacity: 0.8,
                        }}
                      >
                        Provider ID
                      </Typography>
                    </div>
                  </div>

                  <div
                    style={{
                      width: "20%",
                      display: "flex",
                      flexDirection: "row",
                      borderRight: "1px solid lightgray",
                    }}
                  >
                    <div
                      style={{
                        width: "40%",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Avatar
                        sx={{
                          width: "50px",
                          height: "50px",
                          backgroundColor: "#FFB84C",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ fill: "white" }}
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                        >
                          <path d="M15.661 15.549a1.315 1.315 0 0 0 1.185-1.386 1.363 1.363 0 0 0-1.35-1.302h-.048a1.352 1.352 0 0 0-1.303 1.397c.024.379.179.687.391.911-.827 1.609-2.07 2.794-3.954 3.788-1.266.663-2.604.912-3.905.734-1.089-.153-1.94-.64-2.463-1.421-.78-1.185-.852-2.462-.201-3.74a5.597 5.597 0 0 1 1.658-1.931 7.88 7.88 0 0 1-.331-1.218c-3.506 2.51-3.148 5.942-2.084 7.564.794 1.184 2.415 1.941 4.19 1.941.474 0 .972-.035 1.457-.154 3.077-.592 5.409-2.438 6.747-5.16l.011-.023z"></path>
                          <path d="M19.887 12.589c-1.834-2.154-4.533-3.337-7.611-3.337h-.403c-.2-.438-.661-.711-1.183-.711h-.036c-.744 0-1.325.64-1.301 1.385.023.71.627 1.302 1.35 1.302h.059a1.332 1.332 0 0 0 1.183-.828h.439c1.824 0 3.551.532 5.126 1.574 1.206.792 2.072 1.834 2.557 3.077.425 1.019.402 2.013-.035 2.843-.675 1.302-1.812 1.988-3.314 1.988-.947 0-1.871-.296-2.345-.509-.283.235-.758.626-1.102.863 1.042.473 2.096.746 3.113.746 2.309 0 4.023-1.302 4.676-2.557.709-1.422.651-3.813-1.161-5.859l-.012.023z"></path>
                          <path d="M7.647 15.975c.023.71.626 1.302 1.35 1.302h.048a1.334 1.334 0 0 0 1.302-1.397c0-.71-.616-1.301-1.338-1.301h-.048c-.048 0-.118 0-.178.022-.982-1.657-1.397-3.434-1.242-5.349.094-1.445.567-2.7 1.42-3.742.71-.888 2.048-1.326 2.96-1.35 2.556-.048 3.622 3.138 3.704 4.404l1.184.354C16.536 5.036 14.122 3 11.813 3 9.647 3 7.647 4.574 6.842 6.884c-1.102 3.077-.379 6.036.971 8.404-.118.154-.189.426-.166.687z"></path>
                        </svg>
                      </Avatar>
                    </div>
                    <div>
                      <Typography sx={{ fontSize: "15px", fontWeight: "bold" }}>
                        {" "}
                        Door Dash
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "12px",
                          fontWeight: "light",
                          opacity: 0.8,
                        }}
                      >
                        Provider
                      </Typography>
                    </div>
                  </div>

                  <div
                    style={{
                      width: "20%",
                      display: "flex",
                      flexDirection: "row",
                      marginRight: "20px",
                    }}
                  >
                    <div
                      style={{
                        width: "40%",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Avatar
                        sx={{
                          width: "50px",
                          height: "50px",
                          backgroundColor: "#73A9AD",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          style={{ fill: "white" }}
                          height="24"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17.707 12.293a.999.999 0 0 0-1.414 0l-1.594 1.594c-.739-.22-2.118-.72-2.992-1.594s-1.374-2.253-1.594-2.992l1.594-1.594a.999.999 0 0 0 0-1.414l-4-4a.999.999 0 0 0-1.414 0L3.581 5.005c-.38.38-.594.902-.586 1.435.023 1.424.4 6.37 4.298 10.268s8.844 4.274 10.269 4.298h.028c.528 0 1.027-.208 1.405-.586l2.712-2.712a.999.999 0 0 0 0-1.414l-4-4.001zm-.127 6.712c-1.248-.021-5.518-.356-8.873-3.712-3.366-3.366-3.692-7.651-3.712-8.874L7 4.414 9.586 7 8.293 8.293a1 1 0 0 0-.272.912c.024.115.611 2.842 2.271 4.502s4.387 2.247 4.502 2.271a.991.991 0 0 0 .912-.271L17 14.414 19.586 17l-2.006 2.005z"></path>
                        </svg>
                      </Avatar>
                    </div>
                    <div>
                      <Typography sx={{ fontSize: "15px", fontWeight: "bold" }}>
                        {" "}
                        (455) 555-23343
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "12px",
                          fontWeight: "light",
                          opacity: 0.8,
                        }}
                      >
                        Phone
                      </Typography>
                    </div>
                  </div>
                </div>
                <TrackOrder
                  setdata={setdata}
                  setroute={setroute}
                  setorderdelivered={setorderdelivered}
                  selectedOrder={selectedOrder}
                ></TrackOrder>
                <br></br>
                <div style={{ width: "95%", paddingLeft: "20px" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      height: "20px",
                    }}
                  >
                    <Typography
                      sx={{ fontSize: "15px", fontFamily: "monospace" }}
                    >
                      PICK UP :
                    </Typography>
                    <Typography sx={{ fontSize: "12px", opacity: 0.5 }}>
                      7 Unity Cres, Akesan Igando 101245, Lagos, Nigeria
                    </Typography>
                  </div>
                  <br></br>

                  <div
                    style={{
                      height: "40px",
                      padding: "20px",
                      width: "70%",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderLeft: "4px solid #2192FF",
                      borderRight: "1px solid #D5D9D9",
                      borderTop: "1px solid #D5D9D9",
                      borderBottom: "1px solid #D5D9D9",
                    }}
                  >
                    <div
                      style={{
                        height: "80%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <Typography>Milden warren</Typography>
                      <Typography style={{ fontSize: "12px", opacity: "0.5" }}>
                        Name
                      </Typography>
                    </div>
                    <div
                      style={{
                        height: "80%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <Typography>(239) 555 -1080</Typography>
                      <Typography style={{ fontSize: "12px", opacity: "0.5" }}>
                        Phone Number
                      </Typography>
                    </div>
                    <div
                      style={{
                        height: "80%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <Typography>Flower Shop</Typography>
                      <Typography style={{ fontSize: "12px", opacity: "0.5" }}>
                        Bussiness Name
                      </Typography>
                    </div>
                    <div
                      style={{
                        height: "80%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <Typography>23 sep 2021</Typography>
                      <Typography style={{ fontSize: "12px", opacity: "0.5" }}>
                        Pickup Date
                      </Typography>
                    </div>
                    <div
                      style={{
                        height: "80%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <Typography>12.30PM</Typography>
                      <Typography style={{ fontSize: "12px", opacity: "0.5" }}>
                        Time
                      </Typography>
                    </div>
                  </div>
                </div>
                <br></br>
                <div style={{ width: "95%", paddingLeft: "20px" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      height: "20px",
                    }}
                  >
                    <Typography
                      sx={{ fontSize: "15px", fontFamily: "monospace" }}
                    >
                      Arrival :
                    </Typography>
                    <Typography sx={{ fontSize: "12px", opacity: 0.5 }}>
                      FC8X+MX9, Banana Island 106104, Lagos, Nigeria
                    </Typography>
                  </div>
                  <br></br>

                  <div
                    style={{
                      height: "40px",
                      padding: "20px",
                      width: "70%",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderLeft: "4px solid #2192FF",
                      borderRight: "1px solid #D5D9D9",
                      borderTop: "1px solid #D5D9D9",
                      borderBottom: "1px solid #D5D9D9",
                    }}
                  >
                    <div
                      style={{
                        height: "80%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <Typography>Milden warren</Typography>
                      <Typography style={{ fontSize: "12px", opacity: "0.5" }}>
                        Name
                      </Typography>
                    </div>
                    <div
                      style={{
                        height: "80%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <Typography>(239) 555 -1080</Typography>
                      <Typography style={{ fontSize: "12px", opacity: "0.5" }}>
                        Phone Number
                      </Typography>
                    </div>
                    <div
                      style={{
                        height: "80%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <Typography>Grocery Shop</Typography>
                      <Typography style={{ fontSize: "12px", opacity: "0.5" }}>
                        Bussiness Name
                      </Typography>
                    </div>
                    <div
                      style={{
                        height: "80%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <Typography>26 sep 2021</Typography>
                      <Typography style={{ fontSize: "12px", opacity: "0.5" }}>
                        Pickup Date
                      </Typography>
                    </div>
                    <div
                      style={{
                        height: "80%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <Typography>2.30PM</Typography>
                      <Typography style={{ fontSize: "12px", opacity: "0.5" }}>
                        Time
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
          <TableContainer
            component={Paper}
            style={{
              boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
              borderRadius: "10px",
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ padding: "20px", background: "#F7F9FC" }}>
                  <TableCell
                    sx={{
                      padding: "20px",
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#435971",
                    }}
                    align="left"
                  >
                    Order ID
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#435971",
                    }}
                    align="left"
                  >
                    Delivery Date
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#435971",
                    }}
                    align="left"
                  >
                    TOTAL
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#435971",
                    }}
                    align="left"
                  >
                    Status
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#435971",
                    }}
                    align="left"
                  >
                    Track
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderData &&
                  orderData.map((row, ind) => (
                    <TableRow
                      hover={true}
                      key={ind}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        sx={{
                          padding: "20px",
                          color: "#364A61",
                          fontSize: "17px",
                          fontWeight: 550,
                        }}
                      >
                        {row.orderId}
                      </TableCell>

                      <TableCell
                        sx={{
                          padding: "20px",
                          color: "#364A61",
                          fontSize: "17px",
                          fontWeight: 550,
                        }}
                      >
                        {row["ORDER PLACED"]}
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: "20px",
                          color: "#364A61",
                          fontSize: "17px",
                          fontWeight: 550,
                        }}
                      >
                        {row.items}
                      </TableCell>

                      <TableCell
                        sx={{
                          padding: "20px",
                          color: "#364A61",
                          fontSize: "17px",
                          fontWeight: 550,
                        }}
                      >
                        <Chip
                          label={row.status}
                          variant="contained"
                          sx={{
                            background:
                              row.status === "Active" ? "#ACE60C" : "#07a0ad",
                            color:
                              row.status === "Active" ? "#523B10" : "#faffe8",
                            fontSize: "17px",
                            fontWeight: 550,
                            width: "100px",
                            borderRadius: "10px",
                          }}
                        />
                      </TableCell>

                      <TableCell
                        sx={{
                          padding: "20px",
                          color: "#364A61",
                          fontSize: "17px",
                          fontWeight: 550,
                        }}
                      >
                        <Button
                          // disabled={row.status === " Active" ? false : true}
                          variant="contained"
                          onClick={() => {
                            setSelectedOrder(row);
                            setopen(true);
                          }}
                          sx={{ borderRadius: "10px" }}
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
