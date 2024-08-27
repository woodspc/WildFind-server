const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const SightingSchema = new Schema(
  {
    specimenId: {
      type: Schema.Types.ObjectId,
      ref: "Specimen",
      required: true,
    },
    image: String,
    description: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Sighting", SightingSchema);
