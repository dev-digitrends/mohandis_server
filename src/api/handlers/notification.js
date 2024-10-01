"use strict";

import {
  generateResponse,
  parseBody,
  sendFirebaseNotification,
} from "../../utilities";
import { UserModel } from "../../models/user";
import { NotificationModel } from "../../models/notification";

export const sendTestNotification = async (req, res) => {
  const body = parseBody(req);
  const token = body.token;
  const notification = await sendFirebaseNotification(
    "Notification",
    "Notification received",
    token
  );
  generateResponse(true, "Notification", notification, res);
};

export const saveNotifications = async (req, res) => {
  const body = parseBody(req);
  const result = await NotificationModel.updateOne(
    body,
    { $set: body },
    { upsert: true }
  );
  generateResponse(true, "Operation successful", result, res);
};

export const getAllNotifications = async (req, res) => {
  const result = await NotificationModel.find({}).sort({ createdAt: -1 });
  generateResponse(true, "Operation successful", result, res);
};

export const sendNotificationToAllUsers = async (req, res) => {
  const body = parseBody(req);
  let title = body.title;
  let message = body.message;

  if (body.notificationId) {
    let notificationObj = await NotificationModel.findOne({
      _id: notificationId,
    });

    if (notificationObj) {
      title = notificationObj.title;
      message = notificationObj.message;
    }
  }

  const users = await UserModel.find({ _id: { $in: body.users } });

  for (let i in users) {
    let user = users[i];
    if (user.firebaseToken) {
      await sendFirebaseNotification(title, message, user.firebaseToken);
    }
  }
  generateResponse(true, "Operation successful", null, res);
};
