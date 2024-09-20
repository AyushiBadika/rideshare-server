import jwt from "jsonwebtoken";
import { findUserByEmailOrPhoneOrUserId } from "../models/userModel.js";
import { isEmailValid } from "../utils/typeValidators.js";
import { findByUserId } from "../models/otpModel.js";

export const verifyToken = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    const { userId, isVerified } = jwt.verify(token, process.env.AUTH_TOKEN_SECRET);

    if (!isVerified) {
      return res.status(403).json({ err: "Email not verified!" });
    }

    const response = await isUserEnabled({ userId });

    if (response.ok) {
      req.user = response.data;
      next();
    } else {
      return res.status(response.status).json({ err: response.err });
    }
  } catch (err) {
    res.clearCookie("token");
    return res.status(401).json({ err: "Invalid token! Please login again" });
  }
};

export const verifyUser = async (req, res, next) => {
  const { email } = req.body;

  if (email && !isEmailValid(email)) {
    return res.status(400).json({ err: "Invalid email!" });
  }

  const response = await isUserEnabled({ email });

  if (response.ok) {
    const otp = await findByUserId({ userId: response.data.userId });

    if (req.url === "/login") {
      if (!otp.isVerified) {
        return res.status(403).json({ err: "Email not verified!" });
      }
    } else if (req.url === "/resend-otp") {
      if (otp.isVerified) {
        return res.status(403).json({ err: "Email already verified!" });
      }
    }

    req.user = response.data;
    req.otp = otp;
    next();
  } else {
    return res.status(response.status).json({ err: response.err });
  }
};

export const isUserEnabled = async ({ email = "", userId = "" }) => {
  const user = await findUserByEmailOrPhoneOrUserId({ email, userId });

  if (!user) {
    return { ok: false, status: 404, err: "User not found!" };
  }

  if (!user.isEnabled) {
    return { ok: false, status: 403, err: "Account disabled! Contact us at ayratechs@gmail.com" };
  }

  return { ok: true, data: user };
};
