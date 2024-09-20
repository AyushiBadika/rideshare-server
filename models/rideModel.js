import mongoose from "mongoose";

const rideSchema = mongoose.Schema(
  {
    from: {
      type: String,
      required: [true, "Please add your location"],
    },
    to: {
      type: String,
      required: [true, "Please add your destination"],
    },
    totalSeatsAvailable: {
      type: Number,
      required: [true, "Please add vacant seats"],
    },
    bookedSeats: {
      type: Number,
      default: 0,
    },
    userId: {
      type: String,
    },
    pricePerPassenger: {
      type: Number,
      required: [true, "Please add price"],
    },
    departureDate: {
      type: Date,
      required: [true, "Please add departure date"],
    },
    vehicleDetails: {
      company: { type: String, required: [true, "Please add vehicle company name"] },
      model: { type: String, required: [true, "Please add vehicle company name"] },
      makeYear: { type: String, required: [true, "Please add vehicle make year"] },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const rideModel = mongoose.model("rides", rideSchema);

export const createRide = async ({ from, to, totalSeatsAvailable, pricePerPassenger, departureDate, userId, vehicleDetails }) => {
  await rideModel.create({ from, to, totalSeatsAvailable, pricePerPassenger, departureDate, userId, vehicleDetails });
};

export const findRides = async ({ from, to, date }) => {
  const result = await rideModel.aggregate([
    {
      $match: {
        from: { $regex: from, $options: "i" },
        to: { $regex: to, $options: "i" },
        departureDate: new Date(date),
        isActive: true,
      },
    },
    {
      $lookup: {
        from: "users", // The collection to join (name should match the 'users' collection in MongoDB)
        localField: "userId", // Field from the 'rideModel'
        foreignField: "userId", // Field from the 'userModel'
        as: "userDetails", // Alias for the result
      },
    },
    {
      $unwind: "$userDetails", // Unwind the array to get individual user details
    },
    {
      $project: {
        __v: 0, // Exclude __v
        createdAt: 0, // Exclude createdAt
        updatedAt: 0, // Exclude updatedAt
        vehicleDetails: 0, // Exclude vehicleDetails if you don't want to include them
        isActive: 0, // Exclude isActive if not needed
        "userDetails._id": 0, // Exclude user _id if not needed
        "userDetails.email": 0, // Exclude any other unnecessary fields
        "userDetails.password": 0, // Exclude password field
        "userDetails.phone": 0, // Exclude phone field
        "userDetails.isEnabled": 0, // Exclude isEnabled field
        "userDetails.createdAt": 0, // Exclude createdAt
        "userDetails.updatedAt": 0, // Exclude updatedAt
        "userDetails.__v": 0, // Exclude __v
        "userDetails.userId": 0, // Exclude userId field
      },
    },
  ]);

  return result;
};
