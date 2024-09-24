const { Schema, model } = require("mongoose");

const districtSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    country: {
      type: Schema.Types.ObjectId,
      ref: "Country",
      required: true,
    },
    placesOfInterest: [{ type: Schema.Types.ObjectId, ref: "PlaceOfInterest" }],
    sightings: [{ type: Schema.Types.ObjectId, ref: "Sighting" }],
  },
  {
    timestamps: true,
  }
);

const District = model("District", districtSchema);

module.exports = District;
