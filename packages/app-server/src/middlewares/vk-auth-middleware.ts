import { Response, Request, NextFunction } from "express";

export const middleware_vk_auth = (req: Request, res: Response, next: NextFunction) => {
    if (req.header("X-Social") === "vk") {
        // bearer === app_id + uid + secret
    } 
    
    next();
};
