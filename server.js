import axios from "axios";
import express from "express";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// GitHub OAuth credentials
const REDIRECT_URL_WEB = process.env.GITHUB_WEB_REDIRECT;
const REDIRECT_URL_MOBILE = process.env.GITHUB_MOBILE_REDIRECT;

// Endpoint to handle GitHub web callback
app.get("/oauth/callback/web", async (req, res) => {
  const code = req.query.code;
  try {
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;
    const redirectURL = `${REDIRECT_URL_WEB}?access_token=${accessToken}`;

    res.redirect(redirectURL);
  } catch (error) {
    console.error(error);
    res.redirect(REDIRECT_URL_WEB);
  }
});

// Endpoint to handle GitHub mobile callback
app.get("/oauth/callback/mobile", (req, res) => {
  const code = req.query.code;
  const redirectURL = `${REDIRECT_URL_MOBILE}?code=${code}`;
  res.redirect(redirectURL);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
