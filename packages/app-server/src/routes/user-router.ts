import { Router } from "express";
import { create_user, auth_user_social } from "../controllers/user-controller";

const userRouter = Router();

userRouter.post("/", create_user);
userRouter.get("/auth/social/:uid", auth_user_social);

export default userRouter;
