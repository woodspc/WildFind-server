const mongoose = require("mongoose");
require("dotenv").config();

console.log("MONGODB_URI:", process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async () => {
  console.log("Connected to the database");

  try {
    const locations = await Location.find({
      placesOfInterest: { $exists: false },
    });

    for (const location of locations) {
      await Location.findOneAndUpdate(
        { _id: location._id },
        { $set: { sightings: [], placesOfInterest: [] } },
        { new: true, useFindAndModify: false }
      );
    }

    console.log("All locations have been updated");
  } catch (error) {
    console.error("Error updating locations", error);
  } finally {
    db.close();
  }
});
