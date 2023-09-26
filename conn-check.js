const mongoose = require("mongoose");

// Replace 'mongodb://localhost/your-database-name' with your MongoDB connection string
const mongoURI = "mongodb://127.0.0.1:27017/db_staycation_dev";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

db.once("open", () => {
  console.log("Connected to MongoDB successfully!");
});
