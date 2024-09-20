const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const specimenSchema = new Schema(
  {
    name: { type: String, required: true },
    typeId: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    },
    dangerLevel: String,
    edible: String,
    image: String,
    description: { type: String, required: true },
    location: [{ type: Schema.Types.ObjectId, ref: "Location" }],
    sightings: [{ type: Schema.Types.ObjectId, ref: "Sighting" }],
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

module.exports = model("Specimen", specimenSchema);
