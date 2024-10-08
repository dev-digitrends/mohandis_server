"use strict";

import {
  addService,
  getService,
  updateService,
  getAllService,
} from "../../models/service";
import { generateResponse, parseBody } from "../../utilities";

export const save = async (req, res) => {
  const body = parseBody(req);
  const serviceObj = await getService({ name: body.name });
  if (serviceObj) {
    if (body._id) await updateService({ _id: body._id }, { $set: body });
    else generateResponse(false, "Already exist", serviceObj, res);

    generateResponse(true, "Operation successful", serviceObj, res);
  } else {
    const result = await addService(body);
    if (result) {
      generateResponse(true, "Operation successful", result, res);
    } else {
      generateResponse(false, "Operation failed", null, res);
    }
  }
};

export const fetchAll = async (req, res) => {
  const result = await getAllService({});
  generateResponse(true, "Operation successful", result, res);
};

export const fetch = async (req, res) => {
  const id = req.params.id;
  const result = await getService({ _id: id });
  generateResponse(true, "Operation successful", result, res);
};
