import { Router } from "express";

import * as Middlewares from "../middlewares/";
import userRouter from "./user-router";

const apiRouter = Router();

// middlewares
apiRouter.use(Middlewares.middleware_vk_auth);
apiRouter.use(Middlewares.middleware_ok_auth);

// routes
apiRouter.use('/users', userRouter);

export default apiRouter;
