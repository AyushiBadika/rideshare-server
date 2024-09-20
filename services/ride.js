import { createRide, findRides } from "../models/rideModel.js";

export async function publishRide({ from, to, totalSeatsAvailable, pricePerPassenger, departureDate, userId, vehicleDetails }) {
  try {
    await createRide({ from, to, totalSeatsAvailable, pricePerPassenger, departureDate, userId, vehicleDetails });

    return { ok: true, status: 200, data: "Ride published successfully!" };
  } catch (error) {
    return { ok: false, status: 500, err: "Something went wrong! Our team is working on it" };
  }
}
export async function searchRide({ from, to, date }) {
  try {
    const data = await findRides({ from, to, date });

    return { ok: true, status: 200, data: data };
  } catch (error) {
    console.log(error);
    return { ok: false, status: 500, err: "Something went wrong! Our team is working on it" };
  }
}
