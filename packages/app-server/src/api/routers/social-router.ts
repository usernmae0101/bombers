import { Router } from "express";

import * as Middlewares from "../middlewares/";
import * as UserControllers from "../controllers/user-controller";

const socialRouter = Router();

// middlewares
socialRouter.use(Middlewares.middleware_vk_auth);
socialRouter.use(Middlewares.middleware_ok_auth);

// users routes
socialRouter.post("/users/create/", UserControllers.create_user_social);
socialRouter.get("/users/auth/", UserControllers.auth_user_social);

export default socialRouter;
