("use strict");
import config from "../../conf";
import { generateResponse, parseBody } from "../../utilities";
import {
  editUser,
  getUserObj,
  saveUser,
  findAllUser,
  UserModel,
  UserSettingsModel,
} from "../../models/user";
import { generateAndSendOTP } from "./otp";
import { ROLES } from "../../utilities/constants";

export const registerUser = async (req, res) => {
  let body = parseBody(req);

  if (Object.keys(body).length === 0) {
    generateResponse(false, "Please provide input", null, res);
    return;
  }

  const checkEmail = await getUserObj({
    email: body.email,
  });
  if (checkEmail) {
    generateResponse(false, "Email already exist", null, res);
    return;
  }

  const checkUsername = await getUserObj({
    username: body.username,
  });
  if (checkUsername) {
    generateResponse(false, "Username already exist", null, res);
    return;
  }

  const userObj = await saveUser(body);
  if (!userObj) {
    generateResponse(false, "Unable to register user", null, res);
    return;
  }

  await generateAndSendOTP(userObj.email, userObj._id);
  generateResponse(true, "Success", userObj, res);
};

export const fetchUserProfile = async (req, res) => {
  const userId = req.user.id;
  const profile = await getUserObj({
    _id: userId,
  });
  if (profile)
    generateResponse(true, "Profile fetched successfully", profile, res);
  else generateResponse(false, "No profile found", null, res);
};

export const updateProfile = async (req, res) => {
  const userId = req.user.id;
  let body = parseBody(req);
  if (req.file) {
    let image = {
      fileName: `${config.app["baseurl"]}:${config.app["port"]}/users/${req.file.filename}`,
      originalName: req.file.originalname,
    };
    body.image = image;
  }
  const updatedProfile = await editUser(userId, body);
  if (updatedProfile) {
    generateResponse(true, "Updated successfully", updatedProfile, res);
  } else {
    generateResponse(false, "Unable to update", null, res);
  }
};

export const fetchAllUsers = async (req, res) => {
  const allUsers = await findAllUser({
    role: ROLES.USER,
  });

  if (allUsers.length > 0) {
    generateResponse(true, "Fetched successfully", allUsers, res);
  } else {
    generateResponse(false, "Not Found", null, res);
  }
};

export const fetchAllFirebaseUsers = async (req, res) => {
  const allUsers = await UserModel.find({
    firebaseToken: { $exists: true, $ne: null },
  });
  if (allUsers.length > 0) {
    generateResponse(true, "Fetched successfully", allUsers, res);
  } else {
    generateResponse(false, "Not Found", null, res);
  }
};

export const getUserById = async (req, res) => {
  const userId = req.query.id;

  const profile = await getUserObj({
    _id: userId,
  });
  if (profile)
    generateResponse(true, "Profile fetched successfully", profile, res);
  else generateResponse(false, "No profile found", null, res);
};

export const updateUserSettings = async (req, res) => {
  let body = parseBody(req);
  const userId = req.user.id;
  const settings = await UserSettingsModel.findOne({ userId });
  if (settings) {
    await UserSettingsModel.updateOne({ _id: settings._id }, { $set: body });
  } else {
    body.userId = userId;
    await UserSettingsModel.create(body);
  }

  let obj = await UserSettingsModel.findOne({ userId });
  if (obj) generateResponse(true, "Success", obj, res);
  else generateResponse(false, "Failure", null, res);
};

export const getUserSettings = async (req, res) => {
  let userId = req.user.id;
  let obj = await UserSettingsModel.findOne({ userId });
  if (obj) generateResponse(true, "Success", obj, res);
  else generateResponse(false, "No settings found", null, res);
};
