"use strict";

import { Router } from "express";
import RootAPI from "./root";
import UserAPI from "./user";
import AuthAPI from "./auth";
import OtpAPI from "./otp";
import NotificationAPI from "./notification";

export default class Api {
  constructor(app) {
    this.app = app;
    this.router = Router();
    this.routeGroups = [];
  }

  loadRouteGroups() {
    this.routeGroups.push(new RootAPI());
    this.routeGroups.push(new UserAPI());
    this.routeGroups.push(new AuthAPI());
    this.routeGroups.push(new OtpAPI());
    this.routeGroups.push(new NotificationAPI());
  }

  setContentType(req, resp, next) {
    resp.set("Content-Type", "text/json");
    next();
  }

  registerGroup() {
    this.loadRouteGroups();
    this.routeGroups.forEach((rg) => {
      let setContentType = rg.setContentType
        ? rg.setContentType
        : this.setContentType;
      this.app.use("/api" + rg.getRouteGroup(), setContentType, rg.getRouter());
    });
  }
}
