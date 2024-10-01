"use strict";
import { verifyUserOTP } from "../../models/otp";
import {
  getUserObj,
  socialSignIn,
  saveUser,
  updateUserPassword,
  userSignIn,
} from "../../models/user";
import {
  generateResponse,
  getAppleSigningKey,
  parseBody,
  verifyJWT,
} from "../../utilities";
const _ = require("lodash");
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
  const { email, password } = parseBody(req);
  if (email && password) {
    const userObj = await getUserObj({ email });
    if (!userObj) {
      generateResponse(false, "No email found", null, res);
      return;
    }

    const loginObj = await userSignIn(password, userObj);

    generateResponse(loginObj.success, loginObj.message, loginObj.data, res);
  } else {
    generateResponse(false, "Please provide complete info", null, res);
  }
};

export const changePassword = async (req, res) => {
  const { newPassword } = parseBody(req);
  const { id: userId } = req.user;

  if (newPassword) {
    let updatedPass = await updateUserPassword(newPassword, userId);

    generateResponse(
      updatedPass.success,
      updatedPass.message,
      updatedPass.data,
      res
    );
  } else {
    generateResponse(false, "Please provide complete info", null, res);
  }
};

export const loginWithGoogle = async (req, res) => {
  try {
    const { name, email } = parseBody(req);
    let userObj = await getUserObj({ email });

    if (!userObj)
      userObj = await saveUser({ name, username: name, email, password: "" });

    // user already exists
    const data = await socialSignIn(userObj);
    generateResponse(true, "User signed in successfully", data, res);
  } catch (error) {
    generateResponse(false, error.message, null, res);
  }
};

export const loginWithApple = async (req, res) => {
  try {
    const { name, email, user, identityToken } = parseBody(req);

    const json = jwt.decode(identityToken, { complete: true });
    if (!json) {
      return generateResponse(false, "Invalid identityToken", null, res);
    }

    const kid = json.header.kid;

    const publicKey = await getAppleSigningKey(kid);
    if (!publicKey)
      return generateResponse(
        false,
        "Something went wrong - publicKey",
        null,
        res
      );

    const payload = await verifyJWT(identityToken, publicKey);
    if (!payload)
      return generateResponse(
        false,
        "Invalid identityToken - payload",
        null,
        res
      );

    if (payload.sub === user && payload.aud === process.env.APPLE_CLIENT_ID) {
      console.log("success identityToken auth");

      // check user if exists
      let user = await getUserObj({ apple_id: payload.sub });

      // create user if not exists
      if (!user)
        user = await saveUser({
          name,
          username: name,
          email,
          apple_id: payload.sub,
          password: "",
        });

      const data = await socialSignIn(user);
      return generateResponse(true, "User signed in successfully", data, res);
    } else
      return generateResponse(
        false,
        "Invalid identityToken - payload",
        null,
        res
      );
  } catch (error) {
    generateResponse(false, error.message, null, res);
  }
};
export const resetPassword = async (req, res) => {
  const { newPassword, otp } = parseBody(req);

  if (newPassword && otp) {
    const otpObj = await verifyUserOTP(otp);
    if (otpObj) {
      let updatedPass = await updateUserPassword(newPassword, userId);

      generateResponse(
        updatedPass.success,
        updatedPass.message,
        updatedPass.data,
        res
      );
    } else {
      generateResponse(false, "Invalid OTP", null, res);
    }
  }
  generateResponse(false, "Please provide complete info", null, res);
};
