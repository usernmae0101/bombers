import { Request, Response } from "express";

import * as Shared from "@bombers/shared/src/idnex";
import { UserModel } from "../models/user-model";

/**
 * Авторизация через социальную сеть. 
 */
export const auth_user_social = (req: Request, res: Response) => {
    const uid = Number(req.params.uid);

    UserModel.findOne({ uid })
        .then(user => {
            if (!user) // if user === null
                res.status(404).json({
                    code: Shared.Enums.ApiResponseCodes.USER_NOT_EXISTS_SOCIAL
                });
            else 
                res.status(200).json({
                    nickname: user.nickname,
                    rating: user.rating,
                    avatar: user.avatar,
                    token: user._id
                })
        });
};

/**
 * Создание пользователя, подключенного через социальную сеть.
 */
export const create_user_social = (req: Request, res: Response) => {
    const social = req.header("X-Social");
    const uid = Number(req.header("X-Uid"));
    const nickname = req.body.nickname;
    
    UserModel.create({
        nickname,
        uid,
        social
    })
    .then(user => {
        res.status(201).json({
            nickname: user.nickname,
            avatar: user.avatar,
            rating: user.rating,
            token: user._id
        })
    })
    .catch(error => {
        res.status(401).json({
            message: error.message
        });
    });
};
