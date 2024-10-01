const mongoose = require("mongoose");
const Schema = mongoose.Schema;

export const NotificationModel = mongoose.model(
  "notifications",
  new Schema(
    {
      title: String,
      message: String,
      isActive: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  )
);
