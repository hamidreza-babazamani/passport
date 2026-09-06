const { hashSync } = require("bcrypt");
const { userModel } = require("../model/user.model");
const { redirectIfIAuth, checkAuthentication } = require("../middleware");
const router = require("express").Router();
function initRoutes(passport) {
  router.get("/", (req, res) => {
    res.render("index.ejs", { title: "home" });
  });
  router.get("/login", redirectIfIAuth, (req, res) => {
    res.render("login.ejs", { title: "login" });
  });
  router.get("/register", checkAuthentication, (req, res) => {
    res.render("register.ejs", { title: "register" });
  });
  router.get("/profile", (req, res) => {
    const user = req.user;
    res.render("profile.ejs", {
      title: "profile",
      user,
    });
  });
  router.get("/logout", checkAuthentication, (req, res) => {
    req.logOut({ keepSessionInfo: false }, (err) => {
      if (err) console.log(err);
    });
    res.redirect("/login");
  });
  router.post("/register", redirectIfIAuth, async (req, res) => {
    try {
      const { fullname: fullName, username, password } = req.body;
      const hashPassword = hashSync(password, 10);
      const user = await userModel.findOne({ username });
      if (user) {
        const referrer = req?.header("Referrer") ?? req.headers.referer;
        req.flash("error", "this username already exist");
        return res.redirect(referrer ?? "/register");
      }
      await userModel.create({
        fullName,
        username,
        password: hashPassword,
      });
      (res, redirect("/login"));
    } catch (error) {
      next(error);
    }
  });
  router.post(
    "/login",
    redirectIfIAuth,
    passport.authenticate("local", {
      successRedirect: "/profile",
      failureRedirect: "/login",
      failureFlash: true,
    }),
    async (req, res) => {
      res.redirect("/profile");
    },
  );
  return router;
}

module.exports = initRoutes;
