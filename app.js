const express = require("express");
const { Pool } = require("pg");
const session = require("express-session");
const passport = require("passport");
const indexRouter = require("./routes/indexRouter");
const LocalStrategy = require("passport-local").Strategy;

//create pool connection
const pool = new Pool({
  connectionString: "postgresql://deetsy4455:ADEEPS7315@localhost:5432/authy",
});
//create app
const app = express();
//set views path
app.set("views", __dirname);
//set view engine as ejs
app.set("view engine", "ejs");
//parse url encoded data
app.use(express.urlencoded({ extended: false }));
//middlewares for authentication
app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
//sign up form
app.get("/sign-up", (req, res) => res.render("sign-up"));
app.post("/sign-up", async (req, res, next) => {
  try {
    await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
      req.body.username,
      req.body.password,
    ]);
    res.redirect("/");
  } catch (err) {
    return next(err);
  }
});
//authentication
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
      );
      const user = rows[0];

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      if (user.password !== password) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    const user = rows[0];

    done(null, user);
  } catch (err) {
    done(err);
  }
});
/*
app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);*/
app.use("/", indexRouter);
app.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
app.listen(3000, () => {
  console.log(`LIstening on Port 3000`);
});
