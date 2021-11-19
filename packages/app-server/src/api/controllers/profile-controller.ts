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
    Models.MatchModel.count({ "result.nickname": req.params.nickname })
        .then(totalMatches => {
            const skip = +req.params.page * 10 - 10;
       
            Models.MatchModel.aggregate([
                { $unwind: "$result" },
                { $match: { "result.nickname": req.params.nickname } },
                { $project: { _id: 0, "result.nickname": 0, __v: 0 } },
                { $sort: { created_at: -1 } },
                { $skip: skip },
                { $limit: 10 }
            ])
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

export const get_profile_statistic = (req: Request, res: Response) => {
    Models.MatchModel.count({ "result.nickname": req.params.nickname })
        .then(totalMatches => {
            Models.MatchModel.aggregate([
                { $unwind: "$result" },
                { $match: { "result.nickname": req.params.nickname } },
                { $group: { _id: "$result.place", count: { $sum: 1 } } }
            ])
                .then(places => {
                    Models.MatchModel.aggregate([
                        { $unwind: "$result" },
                        { $match: { "result.nickname": req.params.nickname } },
                        { $sort: { created_at: 1 } },
                        { $group: { _id: null, rating: { $push: "$result.rating" } } },
                        { $skip: totalMatches > 100 ? totalMatches - 100 : 0 },
                        { $limit: 100 }
                    ]) 
                        .then(rating => {
                            const placesDataset = Array(4).fill(0);
                            for (let {_id, count} of places) {
                                placesDataset[_id - 1] = count;
                            }

                            res.json(
                                {
                                    placesDataset,
                                    ratingDataset: rating[0]?.rating || [],
                                    totalMatches
                                }
                            )
                        });
                });
        });
};
