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
                   avatar: doc.avatar,
                   createdAt: doc.created_at,
                   lastSeen: doc.last_seen,
                   isOnline: doc.is_online
                }
            );
            break;
        }

        ++place;
    }
};

export const get_portion_history_matches = (req: Request, res: Response) => {
    const selector = {
        "result.nickname": req.params.nickname
    };

    Models.MatchModel.count(selector)
        .then(totalMatches => {
            const skip = +req.params.page * 10 - 10;
        
            Models.MatchModel.find(selector)
                .sort(
                    {
                       created_at: -1 
                    }
                )
                .skip(skip)
                .limit(10)
                .select(
                    {
                        created_at: true,
                        map_id: true,
                        result: true,
                        id: true,
                        _id: false
                    }
                )
                .exec()
                .then(matches => {
                    res.json(
                        {
                            matches,
                            hasMoreMatches: (totalMatches - (matches.length + skip)) > 0
                        }
                    );
                });
        });
};
