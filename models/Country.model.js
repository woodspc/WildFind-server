const { Schema, model } = require("mongoose");

const countrySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    districts: [{ type: Schema.Types.ObjectId, ref: "District" }],
    placesOfInterest: [{ type: Schema.Types.ObjectId, ref: "PlaceOfInterest" }],
    sightings: [{ type: Schema.Types.ObjectId, ref: "Sighting" }],
  },
  {
    timestamps: true,
  }
);

const Country = model("Country", countrySchema);

module.exports = Country;
