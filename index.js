const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;

const app = express();

// load config !important
dotenv.config({ path: "./config/config.env" });

// google api key
const key = require("./config/config.env");
const { oauth2Client } = require("./config/config.env");

// Create OAuth2 client
const oAuth2 = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

// Set access token
oauth2Client.setCredentials({
  access_token: process.env.GOOGLE_ACCESS_TOKEN,
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

// google api scopes
const scopes = [
  //"https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/calendar"
];

// create google auth client
const client = new google.auth.OAuth2(key.web.client_id, key.web.client_secret, key.web.redirect_uris[0]);

// create google auth url
app.get("/auth/google", (req, res) => {
const googleAuthUrl = client.generateAuthUrl({
  access_type: "offline",
  scope: scopes,
});
res.redirect(googleAuthUrl);
});

//
app.get("/auth/google", (req, res) => {
  res.send("Google Auth");
});
  
// export google auth url
exports.googleAuthUrl = googleAuthUrl;

// export google auth client
exports.client = client;

// export google api key
exports.key = key;

// export port
const PORT = process.env.PORT || 5000;

app.set("view engine", "ejs");

// bodyparser to extra data from forms
app.use(express.urlencoded({ extended: false }));

// use public folder
app.use(express.static("public"));

// user morgan to log requests
app.use(morgan("dev"));

// routes
app.use("/", require("./routes/index"));

app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));
