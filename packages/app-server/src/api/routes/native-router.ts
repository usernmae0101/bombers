import { Router } from "express";

import { middleware_native_auth } from "../middlewares/";
import * as UserControllers from "../controllers/user-controller";

const nativeRouter = Router();

// middlewares
nativeRouter.use(middleware_native_auth);

// users routes
nativeRouter.post("/users/create/", UserControllers.create_user_native);
nativeRouter.get("/users/auth/", UserControllers.auth_user_native);

export default nativeRouter;
