const { Schema, model } = require("mongoose");

const passwordResetSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  resetToken: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const PasswordReset = model("PasswordReset", passwordResetSchema);

module.exports = PasswordReset;
