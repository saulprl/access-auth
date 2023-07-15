import express from "express";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// GitHub OAuth credentials
const REDIRECT_URL_WEB = process.env.GITHUB_WEB_REDIRECT;
const REDIRECT_URL_MOBILE = process.env.GITHUB_MOBILE_REDIRECT;

// Endpoint to handle GitHub web callback
app.get("/oauth/callback/web", (req, res) => {
  const code = req.query.code;
  const redirectURL = `${REDIRECT_URL_WEB}?code=${code}`;
  res.redirect(redirectURL);
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
