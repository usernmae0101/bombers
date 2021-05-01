import { Response, Request, NextFunction } from "express";

export const middleware_ok_auth = (req: Request, res: Response, next: NextFunction) => {
    if (req.header("X-Social") === "ok") {
        // make sure auth is valid
    } 
    
    next();
};
