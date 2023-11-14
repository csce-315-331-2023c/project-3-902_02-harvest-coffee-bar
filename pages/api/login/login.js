const express = require("express");
const passport = require("./auth").passport;
const session = require("express-session");
const dotenv = require("dotenv").config();

const app = express();
const port = 3000;

// const pool = new Pool({
//   user: process.env.PSQL_USER,
//   host: process.env.PSQL_HOST,
//   database: process.env.PSQL_DATABASE,
//   password: process.env.PSQL_PASSWORD,
//   port: process.env.PSQL_PORT,
//   ssl: { rejectUnauthorized: false },
// });

// process.on("SIGINT", function () {
//   pool.end();
//   console.log("Application successfully shutdown");
//   process.exit(0);
// });

// app.set("view engine", "ejs");

// app.use(express.static(__dirname + "/views"));

app.use(
  session({
    secret: "harvest315331",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: "122918420851-fk99jiamqafbov1rd3godvipp6mur69b.apps.googleusercontent.com",
//       clientSecret: "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",
//       callbackURL: "http://localhost:3000/auth/google/callback",
//     },
//     function (accessToken, refreshToken, profile, done) {
//       // Customize this based on your database structure
//       const firstName = profile.name.givenName.toLowerCase();
//       const lastName = profile.name.familyName.toLowerCase();

//       pool
//         .query(
//           `SELECT * FROM employees WHERE LOWER(firstname)='${firstName}' AND LOWER(lastname)='${lastName}'`
//         )
//         .then((result) => {
//           // Add your logic to handle the result
//           done(null, profile);
//         })
//         .catch((error) => {
//           console.error(error);
//           done(error);
//         });
//     }
//   )
// );

// passport.serializeUser(function (user, done) {
//   done(null, user);
// });

// passport.deserializeUser(function (user, done) {
//   done(null, user);
// });

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
  res.render("index");
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
