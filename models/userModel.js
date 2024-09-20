import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    userId: {
      type: String,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    phone: {
      type: Number,
    },
    image: {
      type: String,
    },
    rating: {
      type: Number,
      default: 0,
    },
    isEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const userModel = mongoose.model("User", userSchema);

export const findUserByEmailOrPhoneOrUserId = async ({ email, phone, userId }) => {
  const user = await userModel.findOne({ $or: [{ email }, { phone }, { userId }] });
  return user;
};

export const createUser = async ({ userId, name, email, phone, password }) => {
  const user = await userModel.create({ userId, name, email, phone, password });
  return user;
};

export const updateUser = async ({ query, update, options }) => {
  const user = await userModel.findOneAndUpdate(query, update, options);
  return user;
};
