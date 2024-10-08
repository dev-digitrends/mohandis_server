var mongoose = require("mongoose");
var Schema = mongoose.Schema;

export const PromptModel = mongoose.model(
  "prompt",
  new Schema(
    {
      prompt: String,
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

export async function addPrompt(obj) {
  return PromptModel.create(obj);
}

export async function getPrompt(query) {
  return PromptModel.findOne(query);
}

export async function getAllPrompt(query) {
  return PromptModel.find(query);
}

export async function updatePrompt(query, obj) {
  return PromptModel.updateOne(query, obj);
}
