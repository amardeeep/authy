const { Router } = require("express");
const passport = require("passport");
const indexRouter = Router();
indexRouter.get("/", (req, res) => {
  res.render("index", { user: req.user });
});
indexRouter.get("/login", (req, res) => {
  res.render("index", { user: req.user });
});
indexRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);
module.exports = indexRouter;
