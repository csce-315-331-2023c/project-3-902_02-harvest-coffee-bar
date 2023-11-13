const express = require("express");
//const fetch = require('node-fetch');

const { Pool } = require("pg");
const dotenv = require("dotenv").config();

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");

// Create express app
const app = express();
const port = 3000;

var firstName = null;
var lastName = null;
var isAdmin = false;
var isServer = false;
var isCustomer = false;

// Create pool
const pool = new Pool({
  user: process.env.PSQL_USER,
  host: process.env.PSQL_HOST,
  database: process.env.PSQL_DATABASE,
  password: process.env.PSQL_PASSWORD,
  port: process.env.PSQL_PORT,
  ssl: { rejectUnauthorized: false },
});

/**
 * Handles the SIGINT signal to gracefully shutdown the application.
 */
process.on("SIGINT", function () {
  pool.end();
  console.log("Application successfully shutdown");
  process.exit(0);
});

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/views"));

app.use(
  session({
    secret: "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",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

/**
 * Authenticates the user using Google OAuth 2.0.
 */
passport.use(
    new GoogleStrategy(
      {
        clientID:
          "122918420851-fk99jiamqafbov1rd3godvipp6mur69b.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL:
          "https://project-3-harvest-coffee-bar-web-service.onrender.com/.",
      },
      function (accessToken, refreshToken, profile, done) {
        // This function will be called after successful authentication
        // You can use the "profile" object to get information about the authenticated user
        firstName = profile.name.givenName.toLowerCase();
        lastName = profile.name.familyName.toLowerCase();
        pool
          .query(
            `SELECT * FROM employees WHERE LOWER(firstname)='${firstName}' AND LOWER(lastname)='${lastName}'`
          )
          .then((result) => {
            if (result.rowCount > 0 && result.rows[0].isadmin) {
              isAdmin = true;
            } else if (result.rowCount > 0 && result.rows[0].isadmin == false) {
              isServer = true;
            } else {
              isCustomer = true;
            }
            done(null, profile);
          })
          .catch((error) => {
            console.error(error);
            done(error);
          });
      }
    )
  );
  
  /**
   * Serializes the authenticated user.
   */
  passport.serializeUser(function (user, done) {
    done(null, user);
  });
  
  /**
   * Serializes the authenticated user.
   */
  passport.deserializeUser(function (user, done) {
    done(null, user);
  });
  
  /**
   * Authenticates the user with Google OAuth 2.0.
   */
  app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile"] })
  );
  
  /**
   * Authenticates the user with Google OAuth 2.0.
   */
  app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    function (req, res) {
      // This function will be called after successful authentication
      // Redirect the user to the home page or some other page
      if (isAdmin) {
        res.redirect("/manager");
      } else if (isServer) {
        res.redirect("/order");
      }else if (isCustomer) {
        res.redirect("/customer");
      }
    }
  );