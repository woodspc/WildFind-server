const { Schema, model } = require("mongoose");

const actionsSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    sighting: { type: Schema.Types.ObjectId, ref: "Sighting" },
    watchList: { type: Schema.Types.ObjectId, ref: "Watch" },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  {
    timestamps: true,
  }
);

const Actions = model("Actions", actionsSchema);

module.exports = Actions;
