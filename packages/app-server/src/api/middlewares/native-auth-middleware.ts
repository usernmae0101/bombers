import { Response, Request, NextFunction } from "express";

export const middleware_native_auth = (req: Request, res: Response, next: NextFunction) => {
    next();
};
