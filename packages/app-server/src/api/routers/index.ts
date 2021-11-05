import { Router } from "express";

import socialRouter from "./social-router";
import nativeRouter from "./native-router";
import profileRouter from "./profile-router";
import ratingRouter from "./rating-router";

const apiRouter = Router();

// auth, etc.
apiRouter.use("/social", socialRouter);
apiRouter.use("/native", nativeRouter);

apiRouter.use("/profile", profileRouter);
apiRouter.use("/rating", ratingRouter);

export default apiRouter;
