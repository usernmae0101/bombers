import { Router } from "express";

import socialRouter from "./social-router";
import nativeRouter from "./native-router";

const apiRouter = Router();

// routes
apiRouter.use('/social', socialRouter);
apiRouter.use('/native', nativeRouter);

export default apiRouter;
