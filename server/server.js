const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

// MongoDB connection setup
const mongoUri = process.env.MONGODB_URI;
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const commentSchema = new mongoose.Schema({
  episode: { type: Number, required: true },
  name: String,
  comment: String,
});

const Comment = mongoose.model("Comment", commentSchema);

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.get("/comments", async (req, res) => {
  const episode = parseInt(req.query.episode, 10);
  try {
    let comments;
    if (episode === 1) {
      comments = await Comment.find({
        $or: [{ episode: 1 }, { episode: { $exists: false } }],
      });
    } else {
      comments = await Comment.find({ episode });
    }
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
