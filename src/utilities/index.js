import moment from "moment";
const path = require("path");
import jwksClient from "jwks-rsa";
import jwt from "jsonwebtoken";
const admin = require("firebase-admin");
const pathToServiceAccount = path.resolve("./src/utilities/firebase.json");
const serviceAccount = require(pathToServiceAccount);

const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const sendFirebaseNotification = async (title, body, token) => {
  const message = {
    notification: {
      title,
      body,
    },
    token,
  };

  try {
    const response = await firebaseApp.messaging().send(message);
    console.log("Successfully sent message:", response);
    return response;
  } catch (error) {
    console.error("Error sending message:", error);
    return error;
  }
};

export const STATUS_CODE = {
  NOT_FOUND: 404,
  OK: 200,
  BAD_GATEWAY: 502,
};

export function parseBody(req) {
  let obj;
  if (typeof req.body === "object") {
    obj = req.body;
  } else {
    obj = JSON.parse(req.body);
  }
  return obj;
}

export function parseBodyData(req) {
  let obj;
  if (typeof req.body.data === "object") {
    obj = req.body.data;
  } else {
    console.log(req.body.data);
    obj = JSON.parse(req.body.data);
  }

  return obj;
}

export function isAllStatusResolved(itemArray, element) {
  let flag = false;
  for (var i = 0; i < itemArray.length; i++) {
    if (itemArray[i][element] == false) {
      flag = false;
      break;
    } else {
      flag = true;
    }
  }
  return flag;
}

export function generateResponse(success, message, data, res) {
  res.json({
    success,
    message,
    data,
  });
}

export function getCurrentTimestamp() {
  let date = new Date();
  return date.getTime();
}

export function calculateEndDate(date) {
  let d = new Date(date);
  let year = d.getFullYear();
  let month = d.getMonth();
  let day = d.getDate();
  let c = new Date(year + 1, month, day);
  c = moment(c).format("YYYY MM DD");
  c = c.replace(/\s+/g, "-");
  return c;
}

export function formatDate(date) {
  let d = moment(date).format("YYYY MM DD");
  d = d.replace(/\s+/g, "-");
  return d;
}

export async function generateVerificationCode() {
  var val = Math.floor(1000 + Math.random() * 9000);
  return val;
}

export function get24HoursAheadTime(count) {
  let finalTime;
  let minutes = count * 24 * 60;
  console.log(minutes);
  let CurrentDate = moment().valueOf();
  console.log(CurrentDate);
  let date = moment(CurrentDate);
  let finalDate = date.add(minutes, "minute");
  finalTime = moment(finalDate).valueOf();
  console.log("time calculated", finalTime);
  return finalTime;
}

export function addMinutes(minutes) {
  let finalTime;
  let CurrentDate = moment().valueOf();
  let date = moment(CurrentDate);
  let finalDate = date.add(minutes, "minute");
  finalTime = moment(finalDate).valueOf();
  return finalTime;
}

export function getCurrentTime() {
  let time = moment().valueOf();
  return time;
}

export function generateRandomString(size) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < size; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

export function titleCase(word) {
  return word.toLowerCase().replace(/\b(\w)/g, (s) => s.toUpperCase());
}

export function findInArray(arr, value) {
  for (let i in arr) {
    let item = arr[i];
    if (item == value) {
      return true;
    }
  }
  return false;
}

export function getStartAndEndDateOfWeek(year, month, week) {
  const startOfWeek = week * 7;
  const d = new Date(year, month, 1);
  const noOfDays = moment(d).daysInMonth();
  const weekDays = week !== 3 ? 7 : noOfDays - startOfWeek;
  const startMonthDate = moment(d).startOf("month").format();
  const startDate = moment(startMonthDate).add(startOfWeek, "days").format();
  let endDate = moment(startDate)
    .add(weekDays - 1, "days")
    .format();
  endDate = moment(endDate).endOf("day").format();
  return {
    startDate,
    endDate,
  };
}

export function enumerateDaysBetweenDates(startDate, endDate) {
  let date = [];
  while (moment(startDate) <= moment(endDate)) {
    date.push(startDate);
    startDate = moment(startDate).add(1, "days").format();
  }
  return date;
}

export function getStartAndEndOfDay() {
  const start = moment().utc().startOf("day").format();
  const end = moment().utc().endOf("day").format();
  return { start, end };
}

export const getAppleSigningKey = (kid) => {
  const client = jwksClient({ jwksUri: "https://appleid.apple.com/auth/keys" });
  return new Promise((resolve) => {
    client.getSigningKey(kid, (err, key) => {
      if (err) {
        console.log("client.getSigningKey err >>> ", err);
        resolve(null);
      }

      const signingKey = key.getPublicKey();
      resolve(signingKey);
    });
  });
};

export const verifyJWT = (identityToken, publicKey) => {
  return new Promise((resolve) => {
    jwt.verify(identityToken, publicKey, (err, decoded) => {
      if (err) {
        console.log("error verifying identityToken: ", err);
        return resolve(null);
      }

      resolve(decoded);
    });
  });
};

export const removeHashAndEmoticon = (str) => {
  // Regular expression to match symbols, emojis, and hashtags
  const symbolEmojiRegex = /[\p{S}\p{So}\p{C}\p{Zl}\p{Zp}\p{Cc}]/gu;
  const hashtagRegex = /#\w+/g;

  // List of words to remove
  const wordsToRemove = [
    "probable",
    "expected",
    "possible",
    "believable",
    "reasonable",
    "plausible",
    "anticipated",
    "foreseeable",
    "potential",
    "apparent",
    "likely",
  ];

  // Create a regular expression to match any of the words to remove
  const wordsToRemoveRegex = new RegExp(
    `\\b(${wordsToRemove.join("|")})\\b`,
    "gi"
  );

  // Remove symbols, emojis, and hashtags
  const withoutSymbolsAndEmojis = str.replace(symbolEmojiRegex, "");
  const cleanedString = withoutSymbolsAndEmojis.replace(hashtagRegex, "");

  // Remove the specified words
  const finalString = cleanedString.replace(wordsToRemoveRegex, "");

  // Remove extra spaces that might be left after removing hashtags, symbols, and words
  return finalString.replace(/\s+/g, " ").trim();
};
