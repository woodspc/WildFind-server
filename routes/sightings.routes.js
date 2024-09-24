const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Sighting = require("../models/Sighting.model");
const Specimen = require("../models/Specimen.model");
const Actions = require("../models/Actions.model");
const User = require("../models/User.model");
const Location = require("../models/Location.model");
const PlacesOfInterest = require("../models/PlacesOfInterest.model");

// ********* require fileUploader in order to use it *********
const fileUploader = require("../config/cloudinary.config");

// GET all sightings
// router.get("/sightings", (req, res, next) => {
//   const { animalId } = req.params;
//   if (!mongoose.isValidObjectId(animalId)) {
//     res.status(400).json({ message: "Invalid Id" });
//     return;
//   }
//   Sighting.findById(animalId)
//     .then((sightings) => {
//       if (!sightings)
//         return res.status(404).json({ message: "sightings not found" });
//       res.status(200).json(sightings);
//     })
//     .catch((err) => res.status(500).json({ error: err.message }));
// });

// POST image
router.post("/upload", fileUploader.single("imageUrl"), (req, res, next) => {
  console.log("file is: ", req.file);

  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }
  res.json({ fileUrl: req.file.path });
});

//GET specific sightings by the location
//Made this route to be able to access all of the sightings in a specific location, for the map
router.get("/sightings/locations/:locationId", (req, res, next) => {
  const { locationId } = req.params;
  Sighting.find({ locationId })
    .populate("specimenId")
    .then((sight) => {
      res.status(200).json(sight);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

//GET specific sighting by sighting id
router.get("/sightings/:sightingId", (req, res, next) => {
  const { sightingId } = req.params;

  Sighting.findById(sightingId)
    .populate("userId")
    .then((sight) => {
      res.status(200).json(sight);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// POST new sighting
router.post("/sightings", (req, res, next) => {
  const {
    username,
    userId,
    specimenId,
    image,
    description,
    locationId,
    placeOfInterestId,
    date,
  } = req.body;

  // Validate specimenId
  if (!mongoose.isValidObjectId(specimenId)) {
    return res.status(400).json({ message: "Invalid Id" });
  }

  // Create the new sighting
  Sighting.create({
    username,
    userId,
    specimenId,
    image,
    description,
    locationId,
    placeOfInterestId,
    date,
  })
    //Add the sighting to specific animal
    .then((createdSighting) => {
      return Specimen.findByIdAndUpdate(specimenId, {
        $push: { sightings: createdSighting._id },
      }).then(() => createdSighting);
    })
    .then((createdSighting) => {
      return User.findByIdAndUpdate(userId, {
        $push: { sightings: createdSighting._id },
      }).then(() => createdSighting);
    })
    //add specimen to the identifiedSpecies array in locations and point of interest
    .then((createdSighting) => {
      return Location.findByIdAndUpdate(locationId, {
        $push: { sightings: createdSighting._id },
      }).then(() => createdSighting);
    })
    .then((createdSighting) => {
      return PlacesOfInterest.findByIdAndUpdate(placeOfInterestId, {
        $push: { sightings: createdSighting._id },
      }).then(() => createdSighting);
    })
    //Add the created sighting to Actions collection
    .then((createdSighting) => {
      return Actions.create({
        sighting: createdSighting._id,
        user: createdSighting.userId,
      });
    })
    .then((response) => res.json(response))
    .catch((err) => res.json("Server error creating sighting", err));
});

//Log items into actions
const loggerFunction = ({
  userId,
  sightingId,
  specimenId,
  watchListId,
  commentId,
}) => {
  return Actions.create({
    user: userId,
    sighting: sightingId,
    addition: specimenId,
    watchList: watchListId,
    comments: commentId,
  });
};

module.exports = router;

/* return loggerFunction({
  userId: createdSighting._id,
  sighting: createdSighting._id,
}); */
/* 
return Actions.create({
  sighting: createdSighting._id,
  user: createdSighting.userId,
}); */

// router.post("/tasks", (req, res, next) => {
//     const { title, description, projectId } = req.body;

//     Task.create({ title, description, project: projectId })
//       .then((newTask) => {
//         return Project.findByIdAndUpdate(projectId, {
//           $push: { tasks: newTask._id },
//         });
//       })
// .then((response) => res.json(response))
// .catch((err) => res.json(err));
//   });

// animalId: { type: Schema.Types.ObjectId, ref: "Animal", required: true },
//     image: String,
//     description: { type: String, required: true },
//     location: { type: String, required: true },
//     date: { type: Date, default: Date.now },
