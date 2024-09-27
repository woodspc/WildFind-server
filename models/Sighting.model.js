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
    country: {
      type: Schema.Types.ObjectId,
      ref: "Country",
      required: true,
    },
    district: {
      type: Schema.Types.ObjectId,
      ref: "District",
      required: true,
    },
    placeOfInterest: {
      type: Schema.Types.ObjectId,
      ref: "PlaceOfInterest",
    },
    date: { type: Date, default: Date.now },
    username: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Sighting", SightingSchema);
