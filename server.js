const express = require("express");
const axios = require("axios");

const app = express();

const CLIENT_ID = "47d21f52-0c07-495e-de49-5c4ae83af8ab";
const CLIENT_SECRET = "0635f3f0-4f49-4e1c-c35b-84562b47d4b1";

const REDIRECT_URI = "https://oauth.pstmn.io/v1/callback";

app.get("/auth/k12net/login", (req, res) => {
  const url = `https://k12net.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
  res.redirect(url);
});

app.get("/auth/k12net/callback", async (req, res) => {
  const code = req.query.code;

  try {
    const tokenResponse = await axios.post("https://k12net.com/oauth/token", {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: code,
      grant_type: "authorization_code",
      redirect_uri: REDIRECT_URI
    });

    const accessToken = tokenResponse.data.access_token;

    const userResponse = await axios.get("https://k12net.com/api/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const user = userResponse.data;

    res.redirect(`https://siteniz.com/login-success?name=${user.name}`);

  } catch (err) {
    console.log(err);
    res.send("Login hata verdi");
  }
});

app.listen(3000, () => {
  console.log("Server çalışıyor");
});
