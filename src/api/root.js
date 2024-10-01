"use strict";

import { Router } from "express";
import { log } from "./middlewares/index";
import { DefaultHandler } from "./handlers/root";

export default class RootAPI {
  constructor() {
    this.router = Router();
    this.registerRoutes();
  }

  registerRoutes() {
    let router = this.router;

    router.get("/", log, DefaultHandler);
  }

  getRouter() {
    return this.router;
  }

  getRouteGroup() {
    return "/";
  }
}
