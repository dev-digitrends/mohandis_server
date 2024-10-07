var mongoose = require("mongoose");
var Schema = mongoose.Schema;

export const CategoryModel = mongoose.model(
  "category",
  new Schema(
    {
      name: String,
      parentId: String,
      serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "service",
      },
    },
    {
      timestamps: true,
    }
  )
);

export async function addCategory(obj) {
  return CategoryModel.create(obj);
}

export async function getCategory(query) {
  return CategoryModel.findOne(query);
}

export async function getAllCategory(query) {
  return CategoryModel.find(query);
}

export async function updateCategory(query) {
  return CategoryModel.updateOne(query);
}
