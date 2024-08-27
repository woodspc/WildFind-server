const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const sightingSchema = new Schema(
  {
    title: String,
    description: String,
    imageUrl: String,
  },
  {
    timestamps: true,
  }
);

module.exports = model("Sighting", sightingSchema);
