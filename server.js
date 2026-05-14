const express = require("express");
const axios = require("axios");

const app = express();

const CLIENT_ID = "47d21f52-0c07-495e-de49-5c4ae83af8ab";

const CLIENT_SECRET = "0635f3f0-4f49-4e1c-c35b-84562b47d4b1";

const BASE_URL = "https://api.k12net.com";

const REDIRECT_URI =
  "https://k12net-sso-production.up.railway.app/auth/k12net/callback";


// LOGIN
app.get("/auth/k12net/login", (req, res) => {

  const authUrl =
    `${BASE_URL}/oauth/authorize` +
    `?client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=code` +
    `&scope=openid profile email`;

  res.redirect(authUrl);
});


// CALLBACK
app.get("/auth/k12net/callback", async (req, res) => {

  const code = req.query.code;

  if (!code) {
    return res.send("Authorization code bulunamadı");
  }

  try {

    // TOKEN AL
    const tokenResponse = await axios.post(
      `${BASE_URL}/oauth/token`,
      new URLSearchParams({
        grant_type: "authorization_code",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
        redirect_uri: REDIRECT_URI
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // USER INFO
    const userResponse = await axios.get(
      `${BASE_URL}/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    const user = userResponse.data;

    console.log(user);

    // TEST AMAÇLI
    res.send(`
      <h1>Giriş Başarılı 🎉</h1>
      <pre>${JSON.stringify(user, null, 2)}</pre>
    `);

  } catch (error) {

    console.log("HATA:", error.response?.data || error.message);

    res.send(`
      <h1>Hata Oluştu ❌</h1>
      <pre>${JSON.stringify(error.response?.data || error.message, null, 2)}</pre>
    `);
  }
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server çalışıyor");
});
