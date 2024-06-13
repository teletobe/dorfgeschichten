const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error("MONGO_URI environment variable is not set");
  process.exit(1);
}

mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
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
  const newComment = new Comment(req.body);
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
