import { Router } from "express";

import * as RatingControllers from "../controllers/rating-controller";

const ratingRouter = Router();

ratingRouter.get("/:page", RatingControllers.get_sorted_portion)

export default ratingRouter;
