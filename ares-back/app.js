const fs = require("fs");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

//IMPORT HTTP ERROR
const HttpError = require("./models/common/http-error");

//IMPORT ROUTES
const userRoute = require("./routes/user-route");
const categoryRoute = require("./routes/category-route");
const productRoute = require("./routes/product-route");

//EXPRESS APP
const app = express();

//BACKUP
// app.use(
//   cors({
//     origin: "*",
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     preflightContinue: false,
//     optionsSuccessStatus: 204,
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
app.use("/api/product", productRoute);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    //If the saving was not successful, the file would be deleted.
    //This is to ensure it wont create uneeded files.
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }

  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);

  if (process.env.CURRENT_STATUS === "development" && error.code === 500)
    res.json({
      error: error.message || "Something went wrong!",
      stackTrace: error.stackTrace,
    });
  else
    res.json({
      error: error.message || "Something went wrong!",
    });
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
