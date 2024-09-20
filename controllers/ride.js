import * as rideService from "../services/ride.js";

export const publishRide = async (req, res) => {
  try {
    const { from, to, totalSeatsAvailable, pricePerPassenger, departureDate, vehicleDetails } = req.body;

    const userId = req.user.userId;

    const response = await rideService.publishRide({ from, to, totalSeatsAvailable, pricePerPassenger, departureDate, userId, vehicleDetails });

    if (response.ok) {
      return res.status(response.status).json({ data: response.data });
    }

    return res.status(response.status).json({ err: response.err });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: "Something went wrong! Our team is working on it" });
  }
};

export const searchRide = async (req, res) => {
  try {
    const { from, to, date } = req.query;
    const response = await rideService.searchRide({ from, to, date });

    if (response.ok) {
      return res.status(response.status).json({ data: response.data });
    }

    return res.status(response.status).json({ err: response.err });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: "Something went wrong! Our team is working on it" });
  }
};
