const { Schema, model } = require("mongoose");

const placeOfInterestSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    country: {
      type: Schema.Types.ObjectId,
      ref: "Country",
      required: true,
    },
    district: {
      type: Schema.Types.ObjectId,
      ref: "Disctrict",
      required: true,
    },
    billboard: {
      type: Schema.Types.Mixed,
    },
    sightings: [{ type: Schema.Types.ObjectId, ref: "Specimen" }],
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
  },
  {
    timestamps: true,
  }
);

const PlaceOfInterest = model("PlaceOfInterest", placeOfInterestSchema);

module.exports = PlaceOfInterest;
