"use strict";

import { getUserObj, updateUserProfile } from "../../models/user";
import { addOTP, deleteAllOTPs, verifyUserOTP } from "../../models/otp";
import {
  addMinutes,
  generateResponse,
  generateVerificationCode,
} from "../../utilities";
import { sendEmail } from "./root";

export async function resendOTP(req, res) {
  const email = req.query.email;
  if (email) {
    const userObj = await getUserObj({
      email,
    });
    if (userObj) {
      const otpObj = await generateAndSendOTP(email, userObj._id);
      const emailObj = { email: email, otp: userObj.otp };
      sendEmail(emailObj);
      console.log(otpObj);
      generateResponse(true, "OTP resend successfully", otpObj, res);
    } else {
      generateResponse(false, "User doesn't exist", null, res);
    }
  } else {
    generateResponse(false, "Please provide email address", null, res);
  }
}

export async function verifyOTP(req, res) {
  const otp = req.query.otp;
  if (otp) {
    const otpObj = await verifyUserOTP(otp);
    console.log(otpObj, "==> isVerified");
    if (otpObj) {
      const verifiedProfile = await updateUserProfile(otpObj.userId, {
        isVerified: true,
      });
      console.log(verifiedProfile, "==> verifiedProfile");
      if (verifiedProfile.isVerified) {
        generateResponse(
          true,
          "Profile verified successfully",
          verifiedProfile,
          res
        );
      } else {
        generateResponse(false, "Please verify OTP again", null, res);
      }
    } else {
      generateResponse(false, "Please insert valid OTP", null, res);
    }
  } else {
    generateResponse(false, "Please provide OTP", null, res);
  }
}

export const generateAndSendOTP = async (email, userId) => {
  await deleteAllOTPs(userId);
  const expiry = addMinutes(10);
  const otp = await generateVerificationCode();
  console.log(otp);
  const otpObj = addOTP({
    otp,
    userId,
    expiry,
  });
  if (otpObj) {
    const emailObj = { email: email, otp: otp };
    sendEmail(emailObj);
  }

  return otpObj;
};
