import { STATUS } from "../utilities/constants";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

export const ProjectResultModel = mongoose.model(
  "project-result",
  new Schema(
    {
      projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "projectId",
      },
      status: {
        type: String,
        enum: [STATUS.INPROGRESS, STATUS.REJECTED, STATUS.COMPLETED],
        default: STATUS.INPROGRESS,
      },
      prompt: String,
      data: String,
      rejectionReason: String,
    },
    {
      timestamps: true,
    }
  )
);

export async function addProjectResult(obj) {
  return ProjectResultModel.create(obj);
}

export async function getProjectResult(query) {
  return ProjectResultModel.findOne(query);
}

export async function getAllProjectResult(query) {
  return ProjectResultModel.find(query);
}

export async function updateProjectResult(query) {
  return ProjectResultModel.updateOne(query);
}
