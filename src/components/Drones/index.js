import { Box, Button, Card, Chip, Fab, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { makeStyles } from "@mui/material/styles";
import { db } from "./../../config";
import {
  collection,
  setDoc,
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

const drones = [
  {
    droneId: 234,
    status: "Active",
    orderId: "B302022",
    from: "Bhubaneswar",
    to: "Hyderabad",
  },
  {
    droneId: 233,
    status: "Active",
    orderId: "B302022",
    from: "Bhubaneswar",
    to: "Hyderabad",
  },
  {
    droneId: 236,
    status: "Free",
  },
  {
    droneId: 237,
    status: "Free",
  },
  {
    droneId: 231,
    status: "Active",
    orderId: "B302022",
    from: "Bhubaneswar",
    to: "Hyderabad",
  },
];

const center = { lat: 20.1469136, lng: 85.6727937 };

const Drone = () => {
  const [show, setShow] = useState(true);
  const [drones, setDrones] = useState(null);

  const addDrone = async () => {
    let random = Math.floor(Math.random() * 9000 + 1000);
    random = random.toString();
    const docRef = doc(db, "Drones", random);
    const data = {
      droneId: random,
      status: "Free",
      location: center,
    };

    const res = await setDoc(docRef, data);
    console.log(res);
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
    getDrones();
  }, []);
  return (
    <Box
      sx={{ padding: "20px 40px", display: "flex", flexDirection: "column" }}
    >
      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: "100px",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontSize: "25px", fontWeight: "bold" }}>
          Drone Details
        </Typography>

        <Fab
          sx={{
            position: "absolute",
            right: "30px",
            float: "right",
            margin: "auto",
            width: "40px",
            height: "40px",
          }}
          color="primary"
          aria-label="add"
          onClick={addDrone}
        >
          <AddIcon />
        </Fab>
      </Box>
      <Card
        style={{
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
          borderRadius: "10px",
        }}
      >
        <TableContainer>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow sx={{ padding: "20px", background: "#F7F9FC" }}>
                <TableCell
                  sx={{
                    padding: "20px",
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#435971",
                  }}
                >
                  Drone
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#435971",
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#435971",
                  }}
                >
                  Order Id
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#435971",
                  }}
                >
                  Source
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#435971",
                  }}
                >
                  Destination
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {drones &&
                drones.map((row, ind) => (
                  <TableRow key={ind} sx={{ position: "left" }}>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        padding: "20px",
                        color: "#364A61",
                        fontSize: "17px",
                        fontWeight: 550,
                      }}
                    >
                      {row.droneId}
                    </TableCell>
                    <TableCell align="left">
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
                      align="left"
                      sx={{
                        fontSize: "17px",
                        color: "#364A61",
                        fontWeight: 550,
                      }}
                    >
                      {row.orderId || ""}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        fontSize: "17px",
                        color: "#364A61",
                        fontWeight: 550,
                      }}
                    >
                      {row.from || ""}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        fontSize: "17px",
                        color: "#364A61",
                        fontWeight: 550,
                      }}
                    >
                      {row.to || ""}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default Drone;
