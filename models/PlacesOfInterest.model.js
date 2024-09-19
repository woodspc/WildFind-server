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
    locationId: { type: Schema.Types.ObjectId, ref: "Location" },
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

const PlacesOfInterest = model("PlacesOfInterest", placesOfInterestSchema);

module.exports = PlacesOfInterest;
