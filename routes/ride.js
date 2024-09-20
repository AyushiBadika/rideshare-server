import { Router } from "express";
import { publishRide, searchRide } from "../controllers/ride.js";
import { verifyToken } from "../middleware/authHandler.js";

const router = Router();

router.route("/ride").post(verifyToken, publishRide);
router.route("/ride").get(searchRide);

export default router;
