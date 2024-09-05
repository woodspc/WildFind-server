const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Message = require("../models/Message.model");
const User = require("../models/User.model");
const Conversation = require("../models/Conversation.model");

//Post a new message between 2 specific users
router.post("/messages/:receiver", (req, res, next) => {
  const { sender, text } = req.body; //currently logged in userId
  const { receiver } = req.params; //Id of the user that will receive the message

  Conversation.findOne({
    //check to see if a conversation exists between two users
    $or: [
      { user1Id: sender, user2Id: receiver },
      { user2Id: sender, user1Id: receiver },
    ],
  })
    .then((conversation) => {
      //if a conversation doesnt exist between users, create one
      if (!conversation) {
        return Conversation.create({
          user1Id: sender,
          user2Id: receiver,
          messages: [],
        }).then((newConversation) => {
          //update both users' conversations array at the same time with Promise.all
          return Promise.all([
            User.findByIdAndUpdate(sender, {
              $push: { conversations: newConversation._id },
            }),
            User.findByIdAndUpdate(receiver, {
              $push: { conversations: newConversation._id },
            }),
          ]).then(() => newConversation);
        });
      }
      return conversation; //return the conversation if found or return the newly created conversation
    })
    .then((conversation) => {
      return Message.create({
        sender,
        receiver,
        text,
        conversationId: conversation._id,
      }).then((newMessage) => {
        return Conversation.findByIdAndUpdate(
          conversation._id,
          {
            $push: { messages: newMessage._id },
          },
          { new: true }
        ).then(() => newMessage);
      });
    })
    .then((newMessage) => {
      return Promise.all([
        User.findByIdAndUpdate(sender, {
          $push: { sentMessages: newMessage._id },
        }),
        User.findByIdAndUpdate(receiver, {
          $push: { receivedMessages: newMessage._id },
          $push: { notifications: newMessage._id },
        }),
      ]).then(() => newMessage);
    })
    .then((newMessage) => res.status(200).json(newMessage))
    .catch((err) => next(err));
});

//Clear notifications
router.put("/users/:userId/notifications", (req, res, next) => {
  const { userId } = req.params;

  User.findByIdAndUpdate(
    userId,
    {
      // Clear the notifications array
      $set: { notifications: [] },
    },
    { new: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "Notifications cleared successfully" });
    })
    .catch((err) => {
      next(err);
    });
});

/* 
Message.create({
    sender,
    receiver,
    text,
  })
    .then((newMessage) => {
      //add message to sender's sentMessages array
      if (newMessage) {
        return User.findByIdAndUpdate(
          sender,
          {
            $push: { sentMessages: newMessage._id },
          },
          { new: true }
        ).then(() => newMessage);
      }
    })
    //add message to receiver's receivedMessages array
    .then((newMessage) => {
      return User.findByIdAndUpdate(
        receiver,
        {
          $push: { receivedMessages: newMessage._id },
        },
        { new: true }
      ).then(() => newMessage);
    })
    .then((newMessage) => {
      return Conversation.findByIdAndUpdate(
        receiver,
        {
          $push: { messages: newMessage._id },
        },
        { new: true }
      ).then(() => newMessage);
    })
    .then((newMessage) => res.json(newMessage))
    .catch((err) => res.json(err)); */

module.exports = router;
