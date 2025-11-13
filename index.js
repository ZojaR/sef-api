const express = require("express");
const app = express();

app.use(express.json());

// -----------------------------
// TEST ruta
// -----------------------------
app.get("/", (req, res) => {
    res.send({ message: "SEF API radi!" });
});

// -----------------------------
// CALLBACK – izlazne fakture
// -----------------------------
app.post("/sef-out", (req, res) => {
    console.log("📨 SEF OUTGOING callback:");
    console.log(JSON.stringify(req.body, null, 2));

    // SEF očekuje odgovor 200 + "OK"
    res.status(200).send("OK");
});

// -----------------------------
// CALLBACK – ulazne fakture
// -----------------------------
app.post("/sef-in", (req, res) => {
    console.log("📨 SEF INCOMING callback:");
    console.log(JSON.stringify(req.body, null, 2));

    res.status(200).send("OK");
});

// -----------------------------
// TEST – da ti simuliramo SEF POST bez SEF-a
// -----------------------------
app.post("/test-out", (req, res) => {
    console.log("🔥 TEST OUT simulacija:");
    console.log(JSON.stringify(req.body, null, 2));
    res.send("Primljeno");
});

app.post("/test-in", (req, res) => {
    console.log("🔥 TEST IN simulacija:");
    console.log(JSON.stringify(req.body, null, 2));
    res.send("Primljeno");
});

// -----------------------------
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server radi na portu " + port);
});
