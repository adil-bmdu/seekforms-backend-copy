const mongoose = require("mongoose");
require("dotenv").config();
class Database {
  constructor() {
    this._connect();
  }
  _connect() {
    mongoose
      .connect(process.env.MONGO_SRV_URI, {
        // useNewUrlParser: true,
        // useUnifiedTopology:true
      })
      .then(() => {
        console.log("Database connected successful");
      })
      .catch((err) => {
        console.error("Database connection error::" + err);
      });
  }
}
module.exports = new Database();
