import { Router } from "express";

import { middleware_ok_auth } from "../middlewares/ok-auth.middleware";
import { middleware_vk_auth } from "../middlewares/vk-auth.middleware";
import userRouter from "./user.router";

const apiRouter = Router();

apiRouter.use(middleware_vk_auth);
apiRouter.use(middleware_ok_auth);
apiRouter.use('/users', userRouter);

export default apiRouter;
