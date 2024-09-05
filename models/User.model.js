const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    username: {
      type: String,
      required: [true, "Username is required."],
      unique: true,
    },
    image: String,
    bio: String,
    banner: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    watchList: [{ type: Schema.Types.ObjectId, ref: "Watch" }],
    sightings: [{ type: Schema.Types.ObjectId, ref: "Sighting" }],
    additions: [{ type: Schema.Types.ObjectId, ref: "Specimen" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    sentMessages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
    receivedMessages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
    conversations: [{ type: Schema.Types.ObjectId, ref: "Conversation" }],
    notifications: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
