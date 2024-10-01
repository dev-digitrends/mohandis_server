"use strict";

import { Router } from "express";
import { log } from "./middlewares/index";
import { verifyOTP, resendOTP } from "./handlers/otp";

export default class OtpAPI {
  constructor() {
    this.router = Router();
    this.registerRoutes();
  }

  registerRoutes() {
    let router = this.router;

    router.put("/resend", log, resendOTP);
    router.put("/verify", log, verifyOTP);
  }

  getRouter() {
    return this.router;
  }

  getRouteGroup() {
    return "/otp";
  }
}
