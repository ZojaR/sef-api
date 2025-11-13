const express = require("express");
const app = express();

// Omogućava API-ju da prima JSON iz SEF-a
app.use(express.json());

// Test ruta (GET)
app.get("/", (req, res) => {
  res.send({ message: "SEF API radi!" });
});

// 🟢 Ruta za notifikacije izlaznih faktura (OUT)
app.post("/sef-out", (req, res) => {
  console.log("📤 SEF OUTGOING NOTIFIKACIJA:", req.body);
  res.status(200).send("OK");
});

// 🟢 Ruta za notifikacije ulaznih faktura (IN)
app.post("/sef-in", (req, res) => {
  console.log("📥 SEF INCOMING NOTIFIKACIJA:", req.body);
  res.status(200).send("OK");
});

// Pokretanje servera
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server radi na portu " + port);
});
