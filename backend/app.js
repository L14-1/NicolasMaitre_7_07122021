const express = require("express");
// const bodyParser = require("body-parser");
const path = require('path');
const apiRouter = require("./apiRouter").router;
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());


app.use('/images', express.static(path.join(__dirname, 'images')));

app.use("/api/", apiRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});