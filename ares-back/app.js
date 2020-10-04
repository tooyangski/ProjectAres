const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

require("dotenv").config();

//IMPORT HTTP ERROR
const HttpError = require("./models/common/http-error");

//IMPORT ROUTES
const userRoute = require("./routes/user-route");
const categoryRoute = require("./routes/category-route");

//EXPRESS APP
const app = express();

// app.use(
//   cors({
//     origin: "http://localhost:3000",
//   })
// );

//MIDDLEWARES
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());

//HEADERS CONFIGURATIONS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

//ROUTES MIDDLEWARE
app.use("/api/user", userRoute);
app.use("/api/category", categoryRoute);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ error: error.message || "Something went wrong!" });
});

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const MONGO_URI = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@developmentcluster.dd9gc.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

//DATABASE CONNECTION
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    app.listen(process.env.PORT || 8000);
  })
  .catch((err) => {
    console.log(err);
  });
