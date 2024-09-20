import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.CONNECTION_STRING);
    console.log("Host", connect.connection.host);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
