const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
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

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.post("/login", (req, res) => {
  const { password } = req.body;
  if (password === PASSWORD) {
    res.status(200).json({ success: true });
  } else {
    res.status(401).json({ success: false });
  }
});

app.get("/comments", async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (err) {
    console.error("Error reading comments:", err);
    res.status(500).send("Error reading comments");
  }
});

app.post("/comments", async (req, res) => {
  const { name, comment } = req.body;
  const newComment = new Comment({ name, comment });

  try {
    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    console.error("Error saving comment:", err);
    res.status(500).send("Error saving comment");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
