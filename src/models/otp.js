import { getCurrentTime } from "../utilities";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const moment = require("moment");

export const OtpModel = mongoose.model(
  "otp",
  new Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
      otp: Number,
      expiry: String,
    },
    {
      timestamps: true,
    }
  )
);

export async function addOTP(obj) {
  return OtpModel.create(obj);
}

export async function getOTP(query) {
  return OtpModel.findOne(query);
}

export async function verifyUserOTP(otp) {
  const currentDate = getCurrentTime();
  const otpObj = await OtpModel.findOne({
    otp,
  });

  if (currentDate < otpObj.expiry) {
    await OtpModel.deleteMany({
      userId: otpObj.userId,
    });
    return otpObj;
  }

  return false;
}

export async function deleteAllOTPs(userId) {
  return OtpModel.deleteMany({
    userId,
  });
}
