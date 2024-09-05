const { Schema, model } = require("mongoose");

const conversationSchema = new Schema(
  {
    messages: [{ type: Schema.Types.ObjectId, ref: "Message", required: true }],
    user1Id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    user2Id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

const Conversation = model("Conversation", conversationSchema);

module.exports = Conversation;
