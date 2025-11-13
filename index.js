const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.text({ type: 'application/xml' }));

// ENV VARS
const CLIENT_ID = process.env.SEF_CLIENT_ID;
const CLIENT_SECRET = process.env.SEF_CLIENT_SECRET;
const AUTH_CODE = process.env.SEF_AUTH_CODE;
const REDIRECT_URI = process.env.SEF_REDIRECT_URI;

let ACCESS_TOKEN = null;
let TOKEN_EXPIRE = 0;

// 1️⃣ FUNCTION: GET ACCESS TOKEN
async function getAccessToken() {
    const now = Date.now();

    // reuse token if still valid
    if (ACCESS_TOKEN && now < TOKEN_EXPIRE) {
        return ACCESS_TOKEN;
    }

    const data = new URLSearchParams({
        grant_type: "authorization_code",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: AUTH_CODE,
        redirect_uri: REDIRECT_URI
    });

    const res = await axios.post(
        "https://efaktura.mfin.gov.rs/api/publicApi/auth/oauth/token",
        data.toString(),
        {
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        }
    );

    ACCESS_TOKEN = res.data.access_token;
    TOKEN_EXPIRE = now + (res.data.expires_in * 1000);

    console.log("✔ Novi SEF token generisan");
    return ACCESS_TOKEN;
}


// 2️⃣ ENDPOINT: PRIMI JSON I GENERIŠI UBL XML
app.post("/send-invoice", async (req, res) => {
    try {
        const invoice = req.body;

        // TODO: PRETVORI JSON → UBL XML
        // Za test, šaljemo dummy XML
        const xml = `
        <Invoice>
            <cbc:ID>${invoice.invoiceNumber}</cbc:ID>
            <cbc:IssueDate>${invoice.invoiceDate}</cbc:IssueDate>
        </Invoice>
        `;

        const token = await getAccessToken();

        const sefRes = await axios.post(
            "https://efaktura.mfin.gov.rs/api/publicApi/sales-invoice/ubl/upload",
            xml,
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/xml"
                }
            }
        );

        res.json({
            status: "OK",
            sef_response: sefRes.data
        });

    } catch (err) {
        console.error(err.response?.data || err);
        res.status(500).json({
            error: "SEF error",
            details: err.response?.data || err.toString()
        });
    }
});


// 3️⃣ WEBHOOK endpointi koje SEF zove
app.post("/sef-in", (req, res) => {
    console.log("📥 SEF IN:", req.body);
    res.send("Primljeno");
});

app.post("/sef-out", (req, res) => {
    console.log("📤 SEF OUT:", req.body);
    res.send("Primljeno");
});


// START SERVER
app.listen(process.env.PORT || 10000, () => {
    console.log("SEF API Node server running...");
});
