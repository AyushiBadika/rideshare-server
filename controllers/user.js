import * as userServices from "../services/user.js";
import "dotenv/config";
import jwt from "jsonwebtoken";
import { isAlphanumeric, isEmailValid, isNumbericalOnly } from "../utils/typeValidators.js";

export const signUp = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // name validation
    if (!isAlphanumeric(name) || name.length < 3) {
      return res.status(400).json({
        err: "Invalid name!",
      });
    }

    // password validation
    if (password.length < 6) {
      return res.status(400).json({
        err: "Password length should be greater than 6 characters!",
      });
    }

    // email validation
    if (!isEmailValid(email)) {
      return res.status(400).json({
        err: "Invalid email!",
      });
    }

    // phone validation
    if (phone.length !== 10 || !isNumbericalOnly(phone)) {
      return res.status(400).json({
        err: "Invalid phone number!",
      });
    }

    const response = await userServices.signUp({ name, email, phone, password });

    if (response.ok) {
      return res.status(response.status).json({ data: response.data });
    } else {
      return res.status(response.status).json({ err: response.err });
    }
  } catch (err) {
    return res.status(500).json({ err: "Something went wrong! Our team is working on it" });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const user = req.user;

    const response = await userServices.resendOtp({ user });

    if (response.ok) {
      return res.status(response.status).json({ data: response.data });
    } else {
      return res.status(response.status).json({ err: response.err });
    }
  } catch (error) {
    return res.status(500).json({ err: "Something went wrong! Our team is working on it" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { otp, otpToken } = req.body;
    const { userId } = jwt.verify(otpToken, process.env.AUTH_TOKEN_SECRET);

    if (Number(otp) > 99999 && Number(otp) < 1000000) {
      const response = await userServices.verifyOtp({ otp, userId });

      if (response.ok) {
        return res.status(response.status).json({ data: response.data });
      } else {
        return res.status(response.status).json({ err: response.err });
      }
    } else {
      return res.status(400).json({ err: "Invalid OTP! Please try again" });
    }
  } catch (error) {
    return res.status(500).json({ err: "Something went wrong! Our team is working on it" });
  }
};

export const getUser = async (req, res) => {
  const user = req.user;

  res.status(200).json({
    data: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      rating: user.rating,
    },
  });
};
