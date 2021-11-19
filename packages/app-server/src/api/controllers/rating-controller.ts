import { Request, Response } from "express";

import * as Models from "../models/";

export const get_sorted_portion_users = (req: Request, res: Response) => {
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
                        nickname: 1,
                        avatar: 1,
                        rating: 1,
                        _id: 0
                    }
                )
                .exec()
                .then(users => {
                    res.json(
                        {
                            users,
                            hasMoreUsers: (totalUsers - (users.length + skip)) > 0,
                            totalUsers
                        }
                    );
                });
        });
};
