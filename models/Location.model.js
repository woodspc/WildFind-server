const { Schema, model } = require("mongoose");

const locationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    placesOfInterest: [
      { type: Schema.Types.ObjectId, ref: "PlacesOfInterest" },
    ],
  },
  {
    timestamps: true,
  }
);

const Location = model("Location", locationSchema);

module.exports = Location;
