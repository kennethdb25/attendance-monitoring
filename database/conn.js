const mongoose = require("mongoose");
const keys = require("../config/keys");

mongoose
  .connect(keys.mongoURI)
  .then(() => console.log("Database Connected"))
  .catch((error) => {
    console.log(error);
  });
