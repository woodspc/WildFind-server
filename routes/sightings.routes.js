const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const Sighting = require("../models/Sighting.model");
const Specimen = require("../models/Specimen.model");
const Actions = require("../models/Actions.model");
const User = require("../models/User.model");
const Country = require("../models/Country.model");
const District = require("../models/District.model");
const PlaceOfInterest = require("../models/PlaceOfInterest.model");

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

// POST new sighting
router.post("/sightings", (req, res, next) => {
  const {
    username,
    userId,
    specimenId,
    image,
    description,
    country,
    district,
    placeOfInterest,
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
    country,
    district,
    placeOfInterest,
    date,
  })
    //Add the sighting to specific animal
    .then((createdSighting) => {
      return Specimen.findByIdAndUpdate(specimenId, {
        $push: { sightings: createdSighting._id },
      }).then(() => createdSighting);
    })
    //Add the sighting to the user
    .then((createdSighting) => {
      return User.findByIdAndUpdate(userId, {
        $push: { sightings: createdSighting._id },
      }).then(() => createdSighting);
    })
    //add sighting to the country and district
    .then((createdSighting) => {
      return Country.findByIdAndUpdate(country, {
        $push: { sightings: createdSighting._id },
      }).then(() => createdSighting);
    })
    //add sighting to the district
    .then((createdSighting) => {
      return District.findByIdAndUpdate(district, {
        $push: { sightings: createdSighting._id },
      }).then(() => createdSighting);
    })
    //add sighting to the place of interest
    .then((createdSighting) => {
      return PlaceOfInterest.findByIdAndUpdate(placeOfInterest, {
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

//GET sightings of a specific country, district or place of interest by using query params
//example: /sightings?country=5f9f1f3b9f4b1b0017f3b3b1&district=5f9f1f3b9f4b1b0017f3b3b1&placeOfInterest=5f9f1f3b9f4b1b0017f3b3b1
router.get("/sightings", (req, res, next) => {
  const { country, district, placeOfInterest } = req.query;
  let query = {};

  if (country) {
    query.country = country;
  }

  if (district) {
    query.district = district;
  }

  if (placeOfInterest) {
    query.placeOfInterest = placeOfInterest;
  }

  Sighting.find(query)
    .populate("country", "name")
    .populate("district", "name")
    .populate("placeOfInterest", "name")
    .populate("specimenId", "name image")
    .then((sightings) => {
      res.status(200).json(sightings);
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
