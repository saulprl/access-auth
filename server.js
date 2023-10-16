import axios from "axios";
import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

// GitHub OAuth credentials
const REDIRECT_URL_MIGRATION = process.env.GITHUB_MIGRATION_REDIRECT;
const REDIRECT_URL_WEB = process.env.GITHUB_WEB_REDIRECT;
const REDIRECT_URL_MOBILE = process.env.GITHUB_MOBILE_REDIRECT;

app.get("/oauth/callback/web", async (req, res) => {
  const code = req.query.code;
  const redirectUrl = `${REDIRECT_URL_WEB}?code=${code}`;
  res.redirect(redirectUrl);
});

// Endpoint to handle GitHub web callback
app.get("/oauth/callback/migration", async (req, res) => {
  const code = req.query.code;
  const redirectURL = `${REDIRECT_URL_MIGRATION}?code=${code}`;
  res.redirect(redirectURL);
});

app.get("/oauth/callback/migration/link", async (req, res) => {
  const code = req.query.code;
  const redirectURL = `${REDIRECT_URL_MIGRATION}/link?code=${code}`;
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

app.post("/passcode-encrypt", async (req, res) => {
  const { passcode } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const encryptedPasscode = await bcrypt.hash(passcode, salt);

    res.status(200).json({ encryptedPasscode });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong during the encryption.",
      error,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
