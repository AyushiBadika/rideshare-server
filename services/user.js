import { createUser, findUserByEmailOrPhoneOrUserId } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { sendOtpEmail } from "./mail.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { findByUserId, updateOtp } from "../models/otpModel.js";

export async function signUp({ name, email, phone, password }) {
  const existingUser = await findUserByEmailOrPhoneOrUserId({ email, phone });

  if (existingUser) {
    return { ok: false, status: 400, err: "Email/Phone already registered!" };
  }

  // hashing password using bcrypt
  const hash = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));

  const userId = v4();
  await createUser({ userId, name, email, phone, password: hash });
  await sendOtpEmail({ userId, userEmail: email });

  const otpToken = jwt.sign(
    {
      name,
      email,
      userId,
    },
    process.env.AUTH_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );

  return { ok: true, status: 200, data: { message: "User registered successfully! Login to continue", otpToken } };
}

export async function verifyOtp({ otp, userId }) {
  const user = await findUserByEmailOrPhoneOrUserId({ userId });

  if (!user) {
    return { ok: false, status: 404, err: "User not found!" };
  }

  if (!user.isEnabled) {
    return { ok: false, status: 403, err: "Account disabled! Contact us at ayratechs@gmail.com" };
  }

  const otpModel = await findByUserId({ userId });

  if (otpModel.isVerified) {
    return { ok: false, status: 400, err: "Email already verified!" };
  } else if (Number(otpModel.otp) === Number(otp)) {
    await updateOtp({ query: { userId }, update: { $set: { isVerified: true } }, options: { upsert: false } });

    return { ok: true, status: 200, data: "Email verified successfully! Login to continue" };
  } else {
    return { ok: false, status: 400, err: "Invalid OTP! Please try again" };
  }
}

export async function resendOtp({ user }) {
  await sendOtpEmail({ userId: user.userId, userEmail: user.email, isResend: true });
  const otpToken = jwt.sign(
    {
      name: user.name,
      email: user.email,
      userId: user.userId,
    },
    process.env.AUTH_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );
  return { ok: true, status: 200, data: { message: "OTP sent successfully!", otpToken } };
}
