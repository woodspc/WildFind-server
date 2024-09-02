const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const User = require("../models/User.model");

//GET all users
router.get("/users", (req, res, next) => {
  User.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      next(err);
    });
});

//GET a specific user
router.get("/users/:userId", (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .populate("sightings")
    .populate("watchList")
    .populate("additions")
    .populate("following")
    .populate("followers")
    .populate("receivedMessages")
    .populate("sentMessages")

    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      next(err);
    });
});

//Post a new follower after clicking follow user button
router.post("/users/:followedUserId/following", (req, res, next) => {
  const { userId } = req.body; //currently logged in userId
  const { followedUserId } = req.params; //Id of the user you want to follow, picked up from params

  //Add the current user to the "followers" array of the targeted user
  User.findByIdAndUpdate(
    followedUserId,
    {
      $push: { followers: userId },
    },
    { new: true }
  )

    //Add the new follower to the current user's following array
    .then((newFollower) => {
      return User.findByIdAndUpdate(userId, {
        $push: { following: newFollower._id },
      });
    })

    .then(() => {
      res.status(200).json({ message: "User followed successfully" });
    })
    .catch((err) => next(err));
});

module.exports = router;
