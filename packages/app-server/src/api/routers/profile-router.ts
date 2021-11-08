import { Router } from "express";

import * as ProfileControllers from "../controllers/profile-controller";

const profileRouter = Router();

profileRouter.get("/:nickname", ProfileControllers.get_profile_data);

export default profileRouter;
