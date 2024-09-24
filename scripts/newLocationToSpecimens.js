const mongoose = require("mongoose");
require("dotenv").config();

const Specimen = require("../models/Specimen.model");

mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async () => {
  console.log("Connected to the database");

  try {
    const specimens = await Specimen.find();

    for (const specimen of specimens) {
      await Specimen.findOneAndUpdate(
        { _id: specimen._id },
        { $set: { country: [""] } }
      );
    }
    console.log("All specimens have been updated");
  } catch (error) {
    console.error("Error updating specimens", error);
  } finally {
    db.close();
  }
});
