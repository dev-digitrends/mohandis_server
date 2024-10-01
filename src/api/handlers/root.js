"use strict";

import { generateResponse } from "../../utilities";

export function DefaultHandler(req, res) {
  generateResponse(true, "Default Handler", {}, res);
}
