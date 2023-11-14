const express = require("express");
const passport = require("../auth").passport;
const { pool } = require("../backend/database");
const session = require("express-session");
const dotenv = require("dotenv").config();

const app = express();
const port = 3000;

app.use(
  session({
    secret: "harvest315331",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  function (req, res) {
    console.log("Callback route accesssed");
    // This function will be called after successful authentication
    // Redirect the user to the home page or some other page
    res.redirect("/"); // Change the destination based on your application flow
  }
);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the home page" });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
