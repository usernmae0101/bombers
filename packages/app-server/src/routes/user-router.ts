import { Router } from "express";
import * as UserControllers from "../controllers/user-controller";

const userRouter = Router();

// routes
userRouter.post("/create/soсial", UserControllers.create_user_social);
userRouter.get("/auth/social/:uid", UserControllers.auth_user_social);

export default userRouter;
