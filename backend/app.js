// const express = require("express");
// const bodyParser = require("body-parser");
// const apiRouter = require("./apiRouter").router;

// const cors = require("cors");

// const dotenv = require('dotenv');
// dotenv.config();

// const app = express();

// var corsOptions = {
//   origin: "http://localhost:3001"
// };

// app.use(cors(corsOptions));

// // parse requests of content-type - application/json
// app.use(bodyParser.json());

// // parse requests of content-type - application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }));

// // simple route
// app.get("/", (req, res) => {
//   res.json({ message: "Welcome to Groupomania backend !" });
// });

// app.use("./api/", apiRouter);

// // set port, listen for requests
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}.`);
// });

const express = require("express");
const bodyParser = require("body-parser");
const apiRouter = require("./apiRouter").router;
const cors = require("cors");

const app = express();
var corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Groupomania backend !" });
});

app.use("/api/", apiRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});