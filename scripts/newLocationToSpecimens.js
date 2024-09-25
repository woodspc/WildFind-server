const mongoose = require("mongoose");
require("dotenv").config();

const Specimen = require("../models/Specimen.model");
const Country = require("../models/Country.model");

mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async () => {
  console.log("Connected to the database");

  try {
    const portugal = await Country.findOne({ name: "Portugal" });
    if (!portugal) {
      throw new Error("Portugal country not found");
    }

    const specimens = await Specimen.find();

    for (const specimen of specimens) {
      await Specimen.findOneAndUpdate(
        { _id: specimen._id },
        { $set: { country: portugal._id } }
      );
    }
    console.log("All specimens have been updated");
  } catch (error) {
    console.error("Error updating specimens", error);
  } finally {
    db.close();
  }
});
