"use strict";

const path = require("path");
const nodemailer = require("nodemailer");
const fs = require("fs");

const emailTemplatePath = path.join(
  __dirname,
  "../../../templates/emailTemplate.html"
);

import { generateResponse } from "../../utilities";

export function DefaultHandler(req, res) {
  generateResponse(true, "Default Handler", {}, res);
}

export async function sendEmail(req, res) {
  const emailTemplate = fs.readFileSync(emailTemplatePath, "utf-8");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "dev.test.digitrends@gmail.com", // Your email address
      pass: "zomdqqkrsbkmilie", // Your email password
    },
  });

  var mailOptions = {
    from: "developer.digitrends@gmail.com",
    to: req.email,
    subject: "OTP for Verification",
    html: emailTemplate.replace("[otp]", req.otp),
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}
