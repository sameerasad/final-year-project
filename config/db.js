const moongoose = require("moongoose");
const config = require("config");
const db = config.get("mongoURI");

const connectDb = async () => {
  try {
    await moongoose.connect(db);

    console.log("mongoDB connected...");
  } catch (err) {
    console.error(err.message);
    //process exit in case of failure
    process.exit(1);
  }
};

module.exports = connectDb;
