const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const watchSchema = new Schema(
  {
    specimenId: {
      type: Schema.Types.ObjectId,
      ref: "Specimen",
      required: true,
    },
    name: { type: String, required: true },
    typeId: { type: Number, enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] },
    dangerLevel: String,
    edible: String,
    image: String,
    note: { type: String, default: "" },
    description: { type: String, required: true },
    locationId: [{ type: Schema.Types.ObjectId, ref: "Location" }],
    sightings: [{ type: Schema.Types.ObjectId, ref: "Sighting" }],
    userId: {
      type: String,
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

module.exports = model("Watch", watchSchema);
