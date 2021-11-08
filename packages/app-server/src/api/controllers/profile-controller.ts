import { Request, Response } from "express";

import * as Models from "../models/";

//  TODO: добавить Redis? 
//  много потребления оперативной памяти при большом кол-ве документов в коллекции
//  используется cursor, но итерация через промис медленнее
export const get_profile_data = async (req: Request, res: Response) => {
    const cursor = Models.UserModel.find().sort({ rating: -1 }).cursor();
    
    for (let doc = await cursor.next(), place = 1; doc != null; doc = await cursor.next()) {
        if (doc.nickname === req.params.nickname) {
            res.json(
                {
                   place,
                   rating: doc.rating,
                   avatar: doc.avatar
                }
            );
            break;
        }

        ++place;
    }
};

export const get_portion_history_matches = (req: Request, res: Response) => {};

export const get_portion_notifications = (req: Request, res: Response) => {};
