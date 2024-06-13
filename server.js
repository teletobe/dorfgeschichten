//  "mongodb+srv://tobiashchristoph:4ShZFZtjWKgYCPFV@podcastcluster.qa6axf0.mongodb.net/?retryWrites=true&w=majority&appName=PodcastCluster";
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

const mongoUri = process.env.MONGODB_URI; // Update to use environment variable

// Replace your mongoose.connect line with this
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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
    res.status(500).send("Error reading comments");
  }
});

app.post("/comments", async (req, res) => {
  const newComment = new Comment(req.body);
  try {
    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).send("Error saving comment");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
