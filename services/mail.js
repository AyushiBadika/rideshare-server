import nodemailer from "nodemailer";
import "dotenv/config";
import { saveOtp, updateOtp } from "../models/otpModel.js";

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000);
}

function getMailBody({ otp }) {
  return `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Your OTP Code - Rideshare</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            background-color: #ffffff;
                            padding: 20px;
                            border-radius: 10px;
                            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            text-align: center;
                            background-color: #4CAF50;
                            color: #ffffff;
                            padding: 20px;
                            border-radius: 10px 10px 0 0;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 24px;
                        }
                        .content {
                            padding: 20px;
                            text-align: center;
                        }
                        .otp {
                            font-size: 24px;
                            color: #4CAF50;
                            font-weight: bold;
                            margin: 20px 0;
                        }
                        .message {
                            font-size: 16px;
                            color: #333333;
                            margin-bottom: 20px;
                        }
                        .footer {
                            text-align: center;
                            font-size: 12px;
                            color: #888888;
                            margin-top: 20px;
                            padding-top: 10px;
                            border-top: 1px solid #dddddd;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Rideshare - OTP Verification</h1>
                        </div>
                        <div class="content">
                            <p class="message">Hello,</p>
                            <p class="message">To verify your Rideshare account, please use the following One-Time Password (OTP).</p>
                            <div class="otp">${otp}</div>
                            <p class="message">This code is valid for the next 10 minutes. Please do not share this code with anyone.</p>
                        </div>
                        <div class="footer">
                            <p>Thank you for choosing Rideshare for your carpool needs!</p>
                            <p>&copy; 2024 Rideshare, Inc. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
`;
}

export async function sendOtpEmail({ userId, userEmail, isResend = false }) {
  const otp = generateOtp();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: "ayratechs@gmail.com",
    to: userEmail,
    subject: "Verify Rideshare Account",
    html: getMailBody({ otp }),
  };

  if (isResend) {
    updateOtp({ query: { userId }, update: { $set: { otp } }, options: { upsert: false } });
  } else {
    saveOtp({ userId, otp });
  }

  await transporter.sendMail(mailOptions);
}
