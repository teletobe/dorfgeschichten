const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors"); // Add CORS package

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const PASSWORD = process.env.PASSWORD;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MongoDB URI not found in environment variables.");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

const commentSchema = new mongoose.Schema({
  name: String,
  comment: String,
});

const Comment = mongoose.model("Comment", commentSchema);

app.use(cors()); // Enable CORS for all routes

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Your routes and other middleware...

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
