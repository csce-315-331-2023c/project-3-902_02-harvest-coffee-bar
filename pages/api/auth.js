const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { Pool } = require("../backend/database");

passport.use(
  new GoogleStrategy(
    {
        clientID: "122918420851-fk99jiamqafbov1rd3godvipp6mur69b.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:3000/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      // Customize this based on your database structure
      const firstName = profile.name.givenName.toLowerCase();
      const lastName = profile.name.familyName.toLowerCase();

      pool
        .query(
          `SELECT * FROM employees WHERE LOWER(firstname)='${firstName}' AND LOWER(lastname)='${lastName}'`
        )
        .then((result) => {
          // Add your logic to handle the result
          done(null, profile);
        })
        .catch((error) => {
          console.error(error);
          done(error);
        });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

module.exports = { passport };