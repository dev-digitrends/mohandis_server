"use strict";

import {
  addPrompt,
  getPrompt,
  updatePrompt,
  getAllPrompt,
} from "../../models/prompt";
import { generateResponse, parseBody } from "../../utilities";

export const save = async (req, res) => {
  const body = parseBody(req);
  const obj = await getPrompt({
    prompt: body.prompt,
    categoryId: body.categoryId,
  });

  if (obj) {
    if (body._id) await updatePrompt({ _id: body._id }, { $set: body });
    else generateResponse(false, "Already exist", obj, res);

    generateResponse(true, "Operation successful", obj, res);
  } else {
    const result = await addPrompt(body);
    if (result) {
      generateResponse(true, "Operation successful", result, res);
    } else {
      generateResponse(false, "Operation failed", null, res);
    }
  }
};

export const fetchAll = async (req, res) => {
  const result = await getAllPrompt({});
  generateResponse(true, "Operation successful", result, res);
};

export const fetch = async (req, res) => {
  const id = req.params.id;
  const result = await getPrompt({ _id: id });
  generateResponse(true, "Operation successful", result, res);
};
