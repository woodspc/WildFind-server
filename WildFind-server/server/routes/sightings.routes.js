const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Sighting = require("../models/Sighting.model");
const Specimen = require("../models/Specimen.model");

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
  res.json({ image: req.file.path });
});

//GET specific sighting by sighting id
router.get("/sightings/:sightingId", (req, res, next) => {
  const { sightingId } = req.params;

  Sighting.findById(sightingId)
    .then((sight) => {
      res.status(200).json(sight);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// POST new sighting
router.post("/sightings", (req, res, next) => {
  const { specimenId, image, description, location, date } = req.body;

  // Validate specimenId
  if (!mongoose.isValidObjectId(specimenId)) {
    return res.status(400).json({ message: "Invalid Id" });
  }

  // Create the new sighting
  Sighting.create({ specimenId, image, description, location, date })
    .then((createdSighting) => {
      return Specimen.findByIdAndUpdate(specimenId, {
        $push: { sightings: createdSighting._id },
      });
    })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

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

// animalId: { type: Schema.Types.ObjectId, ref: "Animal", required: true },
//     image: String,
//     description: { type: String, required: true },
//     location: { type: String, required: true },
//     date: { type: Date, default: Date.now },
