const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    actionId: { type: Schema.Types.ObjectId, ref: "Action", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: {
      type: String,
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Comment = model("Comment", commentSchema);
module.exports = Comment;
