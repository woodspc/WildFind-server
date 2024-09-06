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
    .populate("followers")
    .populate("following")
    .populate({
      path: "conversations",
      populate: [
        { path: "user1Id", select: "username" },
        { path: "user2Id", select: "username" },
        {
          path: "messages",
          populate: {
            path: "sender",
            select: "username",
          },
        },
      ],
    })

    /*  .populate({
      path: "receivedMessages",
      populate: { path: "sender", select: "username" },
    })
    .populate({
      path: "sentMessages",
      populate: { path: "receiver", select: "username" },
    }) */
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      next(err);
    });
});

//PUT --> edit user
// router.put("/users/:userId", (req, res, next) => {
//   const { userId } = req.params;
//   const updatedData = req.body;

//   if (!mongoose.Types.ObjectId.isValid(userId)) {
//     return res.status(400).json({ message: "Specified id is not valid" });
//   }

//   User.findByIdAndUpdate(userId, updatedData, { new: true })
//     .then((updatedUser) => {
//       if (!updatedUser) {
//         return res.status(404).json({ message: "User not found" });
//       }
//       res.json(updatedUser);
//     })
//     .catch((err) => {
//       next(err);
//     });
// });
router.put("/users/:userId", async (req, res, next) => {
  const { userId } = req.params;
  const { username, email, ...rest } = req.body; // Extract username and email separately

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Specified id is not valid" });
  }

  try {
    // Find the user to be updated
    const userToUpdate = await User.findById(userId);

    if (!userToUpdate) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the new username or email already exists (ignoring the current user)
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
      _id: { $ne: userId }, // Exclude the current user from the search
    });

    if (existingUser && existingUser._id.toString() !== userId) {
      if (existingUser.username === username) {
        return res.status(400).json({ message: "Username already taken." });
      }
      if (existingUser.email === email) {
        return res.status(400).json({ message: "Email already taken." });
      }
    }

    // If no conflicts, update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email, ...rest }, // Update with the new data
      { new: true } // Return the updated document
    );

    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
});

// DELETE  user
router.delete("/users/:userId", (req, res, next) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Specified id is not valid" });
  }

  User.findByIdAndDelete(userId)
    .then((deletedUser) => {
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }
    })
    .catch((error) => {
      console.error("Error during user deletion:", error);
      res.status(500).json({ message: "An error occurred during deletion." });
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
