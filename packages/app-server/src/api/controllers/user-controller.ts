import { Request, Response } from "express";

import * as Shared from "@bombers/shared/src/idnex";
import * as Models from "../models/";

/**
 * Авторизация через социальную сеть. 
 */
export const auth_user_social = (req: Request, res: Response) => {
    Models.UserModel.findOne(
        {
            uid: +req.header("X-Uid")
        },
        "nickname rating avatar _id"
    )
        .then(user => {
            if (!user) { 
                res.status(404).json(
                    {
                        code: Shared.Enums.ApiResponseCodes.USER_NOT_EXISTS_SOCIAL
                    }
                );
            }
            else {
                res.status(200).json(
                    {
                        nickname: user.nickname,
                        rating: user.rating,
                        avatar: user.avatar,
                        token: user._id
                    }
                );
            }
        });
};

/**
 * Создание пользователя, подключенного через социальную сеть.
 */
export const create_user_social = (req: Request, res: Response) => {
    Models.UserModel.create(
        {
            nickname: req.body.nickname,
            social: req.header("X-Social"),
            uid: +req.header("X-Uid")
        }
    )
        .then(user => {
            res.status(201).json(
                {
                    nickname: user.nickname,
                    rating: user.rating,
                    avatar: user.avatar,
                    token: user._id
                }
            );
        })
        .catch(error => {
            res.status(401).json(
                {
                    message: error.message
                }
            );
        });
};


export const auth_user_native = (req: Request, res: Response) => {};

export const create_user_native = (req: Request, res: Response) => {};
