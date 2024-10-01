"use strict";

import { Router } from "express";
import { log, loggedIn } from "../api/middlewares/index";

import {
  fetchAllFirebaseUsers,
  fetchAllUsers,
  fetchUserProfile,
  getUserById,
  getUserSettings,
  registerUser,
  updateProfile,
  updateUserSettings,
} from "./handlers/user";

const crypto = require("crypto");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/users");
  },
  filename: function (req, file, cb) {
    let customFileName = crypto.randomBytes(18).toString("hex"),
      fileExtension =
        file.originalname.split(".")[file.originalname.split(".").length - 1]; // get file extension from original file name
    cb(null, customFileName + "." + fileExtension);
  },
});
var upload = multer({ storage: storage });

export default class UserAPI {
  constructor() {
    this.router = Router();
    this.registerRoutes();
  }
  registerRoutes() {
    const router = this.router;

    router.get("/", log, loggedIn, fetchUserProfile);
    router.get("/allUsers", log, loggedIn, fetchAllUsers);
    router.get("/settings", log, loggedIn, getUserSettings);
    router.get("/:id", log, loggedIn, getUserById);

    router.post("/", log, registerUser);

    router.put("/", log, loggedIn, upload.single("image"), updateProfile);
    router.put("/settings", log, loggedIn, updateUserSettings);

    router.get("/all/firebase", log, loggedIn, fetchAllFirebaseUsers);
  }
  getRouter() {
    return this.router;
  }

  getRouteGroup() {
    return "/user";
  }
}
