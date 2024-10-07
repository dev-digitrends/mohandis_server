import { STATUS } from "../utilities/constants";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

export const ProjectModel = mongoose.model(
  "project",
  new Schema(
    {
      name: String,
      pdf: String,
      images: [String],
      categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
      },
    },
    {
      timestamps: true,
    }
  )
);

export async function addProject(obj) {
  return ProjectModel.create(obj);
}

export async function getProject(query) {
  return ProjectModel.findOne(query);
}

export async function getAllProject(query) {
  return ProjectModel.find(query);
}

export async function updateProject(query) {
  return ProjectModel.updateOne(query);
}
