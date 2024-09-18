const { Schema, model } = require("mongoose");

const placesOfInterestSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    location: { type: Schema.Types.ObjectId, ref: "Location" },
    billboard: {
      type: Schema.Types.Mixed,
    },
    identifiedSpecies: [{ type: Schema.Types.ObjectId, ref: "Specimen" }],
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
  },
  {
    timestamps: true,
  }
);

const PlacesOfInterest = model("PlacesOfInterest", placesOfInterestSchema);

module.exports = PlacesOfInterest;
