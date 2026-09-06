const express = require("express");
var expressLayouts = require("express-ejs-layouts");
const { default: mongoose, connect } = require("mongoose");
const AllRouters = require("./routes/app");
const flash = require("express-flash");
const session = require("express-session");
const { passportInit } = require("./passport.config");

const passport = require("passport");
const { notFoundError, errorHandler } = require("./err-handling");
const app = express();
mongoose.connect("mongodb://localhost:27017/passport-js", {}).then(() => {
  console.log("connected to mongodb");
});

// set up application
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(flash());
//setup view engine and layout
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("layout", "./layout/main.ejs");

// set up session
app.use(
  session({
    secret: "secret key",
    resave: false,
    saveUninitialized: false,
  }),
);
// set up passport
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());
//routers
app.use(AllRouters(passport));
app.use(notFoundError);
app.use(errorHandler);
const PORT = process.env.PORT || 3000;

// set up express server
app.listen(PORT, () => {
  console.log("listening on port ${PORT}");
});
