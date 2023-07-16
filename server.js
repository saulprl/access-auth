import axios from "axios";
import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// GitHub OAuth credentials
// const REDIRECT_URL_WEB = process.env.GITHUB_WEB_REDIRECT;
const REDIRECT_URL_WEB = "http://localhost:5173/oauth/callback";
const REDIRECT_URL_MOBILE = process.env.GITHUB_MOBILE_REDIRECT;

// Endpoint to handle GitHub web callback
app.get("/oauth/callback/web", async (req, res) => {
  const code = req.query.code;
  const redirectURL = `${REDIRECT_URL_WEB}?code=${code}`;
  res.redirect(redirectURL);
});

// Endpoint to exchange code for access token
app.post("/oauth/callback/web", async (req, res) => {
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

    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong during the exhange.",
      error,
    });
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
