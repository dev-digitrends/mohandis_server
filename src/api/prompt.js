"use strict";

import { Router } from "express";

import { loggedIn } from "./middlewares/index";
import { fetch, fetchAll, save } from "./handlers/prompt";

export default class PromptAPI {
  constructor() {
    this.router = Router();
    this.registerRoutes();
  }

  registerRoutes() {
    let router = this.router;

    router.put("/", loggedIn, save);
    router.get("/", loggedIn, fetchAll);
    router.get("/:id", loggedIn, fetch);
  }

  getRouter() {
    return this.router;
  }

  getRouteGroup() {
    return "/prompt";
  }
}
