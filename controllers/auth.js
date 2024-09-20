import * as authServices from "../services/auth.js";

export const login = async (req, res) => {
  try {
    const { password } = req.body;
    const user = req.user;
    const otp = req.otp;

    if (!password) {
      return res.status(400).json({ err: "All fields are mandatory!" });
    }

    const response = await authServices.login({ user, otp, password });

    if (response.ok) {
      res.cookie("token", response.data?.token, {
        expires: new Date(Date.now() + 86400000),
        secure: true,
        httpOnly: true,
      });

      return res.status(response.status).json({ data: response.data.user });
    } else {
      return res.status(response.status).json({ err: response.err });
    }
  } catch (err) {
    return res.status(500).json({ err: "Something went wrong! Our team is working on it" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ data: "Logged out successfully!" });
  } catch (err) {
    return res.status(500).json({ err: "Something went wrong! Our team is working on it" });
  }
};
