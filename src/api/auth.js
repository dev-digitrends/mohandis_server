"use strict";

import { Router } from "express";
import { log, loggedIn } from "./middlewares/index";
import {
  changePassword,
  loginUser,
  loginWithGoogle,
  loginWithApple,
  resetPassword,
} from "./handlers/auth";

export default class AuthAPI {
  constructor() {
    this.router = Router();
    this.registerRoutes();
  }

  registerRoutes() {
    let router = this.router;
    router.put("/user", log, loginUser);
    router.put("/changePassword", log, loggedIn, changePassword);

    router.post("/google", loginWithGoogle);
    router.post("/apple", loginWithApple);

    router.put("/resetPassword", log, resetPassword);
  }

  getRouter() {
    return this.router;
  }

  getRouteGroup() {
    return "/auth";
  }
}
