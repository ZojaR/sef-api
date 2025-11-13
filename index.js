const express = require("express");
const app = express();

app.use(express.json());

// Test ruta
app.get("/", (req, res) => {
  res.send({ message: "SEF API radi!" });
});

// SEF – izlazne fakture
app.post("/sef-out", (req, res) => {
  console.log("📤 SEF OUTGOING NOTIFIKACIJA:");
  console.log(JSON.stringify(req.body, null, 2));
  res.status(200).send("OK");
});

// SEF – ulazne fakture
app.post("/sef-in", (req, res) => {
  console.log("📥 SEF INCOMING NOTIFIKACIJA:");
  console.log(JSON.stringify(req.body, null, 2));
  res.status(200).send("OK");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server radi na portu " + port);
});
