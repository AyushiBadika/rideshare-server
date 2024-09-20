import { comparePassword } from "../utils/passwordUtils.js";
import jwt from "jsonwebtoken";

export const login = async ({ user, otp, password }) => {
  // compare passwords
  const requestedPassword = password;
  const originalPassword = user.password;
  if (await comparePassword({ requestedPassword, originalPassword })) {
    // generate jwt token
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
        userId: user.userId,
        isVerified: otp.isVerified,
      },
      process.env.AUTH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
    return {
      ok: true,
      status: 200,
      data: {
        user: {
          name: user.name,
          email: user.email,
        },
        token,
      },
    };
  }

  return {
    ok: false,
    status: 401,
    err: "Email/Password is incorrect",
  };
};
