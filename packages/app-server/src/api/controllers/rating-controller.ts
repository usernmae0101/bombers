import { Request, Response } from "express";

import * as Models from "../models/";

export const get_sorted_portion = (req: Request, res: Response) => {
    Models.UserModel.count({})
        .then(totalUsers => {
            const skip = +req.params.page * 10 - 10;

            Models.UserModel.find()
                .skip(skip)
                .limit(10)
                .sort(
                    { 
                        rating: -1 
                    }
                )
                .select(
                    {
                        nickname: true,
                        avatar: true,
                        rating: true,
                        _id: false
                    }
                )
                .exec()
                .then(users => {
                    res.json(
                        {
                            users,
                            hasMoreUsers: (totalUsers - (users.length + skip)) > 0 
                        }
                    );
                });
        });
};
