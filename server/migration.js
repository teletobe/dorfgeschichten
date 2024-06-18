const mongoose = require("mongoose");
require("dotenv").config();

const mongoUri = process.env.MONGODB_URI;

const commentSchema = new mongoose.Schema({
  episode: { type: Number, required: true },
  name: String,
  comment: String,
});

const Comment = mongoose.model("Comment", commentSchema);

async function migrateComments() {
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    const result = await Comment.updateMany(
      { episode: { $exists: false } },
      { $set: { episode: 1 } }
    );
    console.log(`${result.nModified} comments migrated successfully`);
  } catch (err) {
    console.error("Error migrating comments:", err);
  } finally {
    mongoose.connection.close();
  }
}

migrateComments();
