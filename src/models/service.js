var mongoose = require("mongoose");
var Schema = mongoose.Schema;

export const ServiceModel = mongoose.model(
  "service",
  new Schema(
    {
      name: String,
    },
    {
      timestamps: true,
    }
  )
);

export async function addService(obj) {
  return ServiceModel.create(obj);
}

export async function getService(query) {
  return ServiceModel.findOne(query);
}

export async function getAllService(query) {
  return ServiceModel.find(query);
}

export async function updateService(query,obj) {
  return ServiceModel.updateOne(query,obj);
}
