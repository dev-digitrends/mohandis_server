"use strict";

import { Router } from "express";
import {
  getAllNotifications,
  saveNotifications,
  sendNotificationToAllUsers,
  sendTestNotification,
} from "./handlers/notification";
import { loggedIn } from "./middlewares/index";

export default class NotificationAPI {
  constructor() {
    this.router = Router();
    this.registerRoutes();
  }

  registerRoutes() {
    let router = this.router;

    router.put("/", loggedIn, saveNotifications);
    router.get("/", loggedIn, getAllNotifications);
    router.post("/", loggedIn, sendNotificationToAllUsers);
    router.post("/test", sendTestNotification);
  }

  getRouter() {
    return this.router;
  }

  getRouteGroup() {
    return "/notification";
  }
}
