import { Router } from "express";

import * as ProfileControllers from "../controllers/profile-controller";

const profileRouter = Router();

profileRouter.get("/:nickname", ProfileControllers.get_profile_data);
profileRouter.get("/:nickname/statistic", ProfileControllers.get_profile_statistic);
profileRouter.get("/:nickname/matches/:page", ProfileControllers.get_portion_history_matches);

export default profileRouter;
