const mongoose = require("mongoose");
import config from "../conf/index";
const Cryptr = require("cryptr");
import { sign } from "jsonwebtoken";
import { ROLES } from "../utilities/constants";
const Schema = mongoose.Schema;

// secrect key of encryption
const cryptr = new Cryptr(config.app["cryptr_password_user"]);

export const UserModel = mongoose.model(
  "users",
  new Schema(
    {
      apple_id: String,
      email: String,
      password: String,
      phoneNumber: String,
      username: String,
      token: String,
      firebaseToken: { type: String, default: null },
      role: {
        type: String,
        enum: [ROLES.USER, ROLES.ADMIN],
        default: ROLES.USER,
      },
      image: { fileName: String, originalName: String },
      isActive: { type: Boolean, default: true },
      isVerified: { type: Boolean, default: false },
    },
    { timestamps: true }
  )
);

export const UserSettingsModel = mongoose.model(
  "users_settings",
  new Schema(
    {
      userId: { type: Schema.Types.ObjectId, ref: "users" },
      darkMode: { type: Boolean, default: false },
    },
    { timestamps: true }
  )
);

export async function saveUser(obj) {
  let hashVal = cryptr.encrypt(obj.password);
  if (hashVal) {
    obj.password = hashVal;
    return UserModel.create(obj);
  } else {
    return null;
  }
}

export async function findAllUser(query) {
  return UserModel.find(query).exec();
}

export async function getUserObj(query) {
  return UserModel.findOne(query).exec();
}

export async function editUser(_id, obj) {
  const updateObj = await UserModel.findByIdAndUpdate(
    {
      _id,
    },
    {
      $set: obj,
    },
    {}
  );
  if (updateObj)
    return UserModel.findOne({
      _id,
    });
}

export async function userSignIn(password, userObj) {
  const plainPassword = cryptr.decrypt(userObj.password);
  console.log("plainPassword >>> ", plainPassword.length);
  if (plainPassword === password) {
    let tokenObj = {
      id: userObj._id,
      name: userObj.name,
      email: userObj.email,
      username: userObj.username,
      role: ROLES.USER,
    };
    let token = await sign({ user: tokenObj }, `${config.app["jwtsecret"]}`, {
      expiresIn: "1y",
    });

    userObj.token = token;

    const updateUser = await UserModel.updateOne(
      { _id: userObj._id },
      { $set: { token } }
    );

    if (updateUser) {
      return {
        success: true,
        message: "Login Successfully",
        data: userObj,
      };
    } else {
      return {
        success: true,
        message: "Can't Log In",
        data: null,
      };
    }
  } else {
    return {
      success: false,
      message: "Invalid credentials",
      data: null,
    };
  }
}

export async function updateUserPassword(newPassword, userId) {
  const hashedPassword = cryptr.encrypt(newPassword);
  if (hashedPassword) {
    const updateObj = await UserModel.updateOne(
      {
        _id: userId,
      },
      {
        $set: {
          password: hashedPassword,
        },
      }
    );

    if (updateObj)
      return {
        success: true,
        message: "Password changed successfully",
        data: null,
      };
    else
      return {
        success: false,
        message: "Unable to change password",
        data: null,
      };
  } else
    return {
      success: false,
      message: "Unable to change password",
      data: null,
    };
}

export async function updateUserProfile(_id, obj) {
  const updateObj = await UserModel.updateOne(
    {
      _id,
    },
    {
      $set: obj,
    }
  );
  if (updateObj)
    return UserModel.findOne({
      _id,
    });
}

export async function socialSignIn(userObj) {
  let tokenObj = {
    id: userObj._id,
    name: userObj.name,
    email: userObj.email,
    username: userObj.username,
    role: ROLES.USER,
  };

  let token = await sign({ user: tokenObj }, `${config.app["jwtsecret"]}`, {
    expiresIn: "1y",
  });

  userObj.token = token;

  const updateUser = await UserModel.updateOne(
    { _id: userObj._id },
    { $set: { token } }
  );

  if (updateUser) {
    return {
      success: true,
      message: "Login Successfully",
      data: userObj,
    };
  } else {
    return {
      success: true,
      message: "Can't Log In",
      data: null,
    };
  }
}
