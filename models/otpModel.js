import mongoose from "mongoose";

const otpSchema = mongoose.Schema(
  {
    userId: {
      type: String,
    },
    otp: {
      type: Number,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const otpModel = mongoose.model("Otp", otpSchema);

export const findByUserId = async ({ userId }) => {
  const otp = await otpModel.findOne({ userId });
  return otp;
};

export const saveOtp = async ({ userId, otp }) => {
  await otpModel.create({ userId, otp });
};

export const updateOtp = async ({ query, update, options }) => {
  const otp = await otpModel.findOneAndUpdate(query, update, options);
  return otp;
};
