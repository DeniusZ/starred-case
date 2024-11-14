var createError = require("http-errors");
var express = require("express");
var cookieParser = require("cookie-parser");
var cors = require("cors");
const bodyParser = require("body-parser");
const jobsRouter = require("./routes/jobs");

var usersRouter = require("./routes/users");

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use(bodyParser.json());
app.use("/users", usersRouter);

app.use("/jobs", jobsRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err.message);
});

module.exports = app;
