import { Request, Response } from "express";

import * as Shared from "@bombers/shared/src/idnex";
import { UserModel } from "../models/user-model";

/**
 * Авторизация через социальную сеть. 
 * Получаем данные пользователя из базы данных.
 */
export const auth_user_social = (req: Request, res: Response) => {
    /**
     * Идентификатор пользователя в социальной сети.
     */
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
 * Создание пользователя в базе данных через социальную сеть.
 */
export const create_user_social = (req: Request, res: Response) => {
    /**
     * Тип социальной сети: "vk" | "ok" | "fb".
     */
    const social: string = req.header("X-Social");
    /**
     * Идентификатор пользователя в социальной сети.
     */
    const uid: number = Number(req.header("X-Uid"));
    /**
     * Никнейм пользователя.
     */
    const nickname: string = req.body.nickname;
    
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
