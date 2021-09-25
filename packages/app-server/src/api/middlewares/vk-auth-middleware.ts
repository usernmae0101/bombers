import { Response, Request, NextFunction } from "express";
import * as crypto from "crypto";

// https://vk.com/dev/games_launch_params

export const middleware_vk_auth = (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    if (req.header("X-Social") === "vk" && process.env.NODE_ENV !== "development") {
        const URL_PARAMS = req.header("X-Query");
        const urlParams = new URLSearchParams(URL_PARAMS);
        const signKeys = urlParams.get("sign_keys").split(",");

        const ordered: { [key: string]: string; } = {};

        signKeys.forEach((key: string) => ordered[key] = urlParams.get(key));
        
        const stringParams = (new URLSearchParams(ordered)).toString();

        const paramsHash = crypto
            .createHmac("sha256", process.env.VK_APP_SECRET)
            .update(stringParams)
            .digest()
            .toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=$/, "");   

        if (paramsHash !== urlParams.get("sign"))
           res.status(401).send("Auth error!");
    } 
    
    next();
};
