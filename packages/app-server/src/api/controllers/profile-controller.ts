import { Request, Response } from "express";

import * as Models from "../models/";

export const get_profile_data = (req: Request, res: Response) => {
    Models.UserModel.findOne(
        { 
            nickname: req.params.nicname 
        },
        "avatar rating nickname created_at"
    )
        .then(user => {
            // matches
            res.json(user); 
        });
};
