const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Specimen = require("../models/Specimen.model");
const Sighting = require("../models/Sighting.model");
const Actions = require("../models/Actions.model");
const User = require("../models/User.model");

const fileUploader = require("../config/cloudinary.config");

// POST image
router.post("/upload", fileUploader.single("imageUrl"), (req, res, next) => {
  console.log("file is: ", req.file);

  if (!req.file) {
    return res.status(400).json({ message: "no file uploaded" });
  }
  res.json({ fileUrl: req.file.path });
});

//GET all of the specimens in the database
router.get("/specimens", (req, res, next) => {
  Specimen.find()
    .populate("sightings")
    .then((specimens) => {
      res.status(200).json(specimens);
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/specimens", (req, res, next) => {
  Specimen.find({ typeId: { $lte: 8 } })
    .populate("sightings")
    .then((specimens) => {
      res.status(200).json(specimens);
    })
    .catch((err) => {
      next(err);
    });
});

//GET a specific specimen by the id
router.get("/specimens/:specimenId", (req, res, next) => {
  const { specimenId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(specimenId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Specimen.findById(specimenId)
    .populate("sightings")
    .populate("userId")
    .then((specimen) => {
      res.status(200).json(specimen);
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/specimens/:specimenId/sightings", (req, res, next) => {
  const { specimenId } = req.params;

  Specimen.findById(specimenId)
    .populate("sightings")

    .then((specimen) => {
      res.status(200).json(specimen);
    })
    .catch((err) => next(err));
});

//POST a new specimen to the database
router.post("/specimens", (req, res, next) => {
  const {
    username,
    userId,
    typeId,
    name,
    dangerLevel,
    edible,
    image,
    description,
    location,
  } = req.body;

  if (![1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].includes(typeId)) {
    return res.status(400).json({ message: "Invalid typeId" });
  }

  if (!name || !description || !location) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const newSpecimen = {
    username,
    userId,
    typeId,
    name,
    dangerLevel,
    edible,
    image,
    description,
    location,
  };

  Specimen.create(newSpecimen)
    .then((specimen) => {
      return User.findByIdAndUpdate(userId, {
        $push: { additions: specimen._id },
      }).then(() => specimen); // Pass the specimen down the chain
    })
    .then((specimen) => {
      return Actions.create({
        addition: specimen._id,
        user: specimen.userId,
      });
    })
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((err) => {
      next(err);
    });
});

router.put("/specimens/:specimenId", (req, res, next) => {
  const { specimenId } = req.params;
  const updatedData = req.body; // Contains the fields that need to be updated

  if (!mongoose.Types.ObjectId.isValid(specimenId)) {
    return res.status(400).json({ message: "Specified id is not valid" });
  }

  Specimen.findByIdAndUpdate(specimenId, updatedData, { new: true })
    .then((updatedSpecimen) => {
      if (!updatedSpecimen) {
        return res.status(404).json({ message: "Specimen not found" });
      }
      res.json(updatedSpecimen);
    })
    .catch((err) => {
      next(err);
    });
});

// DELETE  specimen
router.delete("/specimens/:specimenId", (req, res, next) => {
  const { specimenId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(specimenId)) {
    return res.status(400).json({ message: "Specified id is not valid" });
  }

  Specimen.findByIdAndDelete(specimenId)
    .then((deletedSpecimen) => {
      if (!deletedSpecimen) {
        return res.status(404).json({ message: "Specimen not found" });
      }

      // Optionally remove related sightings or actions
      return Sighting.deleteMany({ specimen: specimenId })
        .then(() => Actions.deleteMany({ addition: specimenId }))
        .then(() => {
          res.json({
            message: `Specimen with ID ${specimenId} and related data were removed successfully.`,
          });
        });
    })
    .catch((error) => {
      console.error("Error during specimen deletion:", error);
      res.status(500).json({ message: "An error occurred during deletion." });
    });
});

module.exports = router;

/* router.get("/plants", (req, res, next) => {
  Specimen.find()
    .populate("sightings")
    .then((plants) => {
      res.status(200).json(plants);
    })
    .catch((err) => {
      next(err);
    });
}); */

/* router.post("/plants", (req, res, next) => {
  const { typeId, name, dangerLevel, image, description, location } = req.body;

  if (![1, 2, 3, 4, 5, 6, 7, 8].includes(typeId)) {
    return res.status(400).json({ message: "Invalid typeId" });
  }

  if (!name || !description || !location) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const newSpecimen = {
    typeId,
    name,
    dangerLevel,
    image,
    description,
    location,
  };

  Specimen.create(newSpecimen)
    .then((specimen) => {
      res.status(201).json(specimen);
    })
    .catch((err) => {
      next(err);
    });
}); */

/* router.get("/plants/:specimenId", (req, res, next) => {
  const { specimenId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(specimenId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Specimen.findById(specimenId)
    .populate("sightings")
    .then((specimen) => {
      res.status(200).json(specimen);
    })
    .catch((err) => {
      next(err);
    });
}); */
