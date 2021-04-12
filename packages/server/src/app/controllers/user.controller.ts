import { Request, Response } from "express";

import { ApiResponseCodes } from "@bombers/shared/src/idnex";
import { SocialType, UserModel } from "../models/user.model";

interface IUser {
    nickname: string;
    uid?: number;
    social?: SocialType;
}

export const auth_user_social = (req: Request, res: Response) => {
    const uid = Number(req.params.uid);

    UserModel.exists({ uid })
        .then(doesUserExist => {
            if (doesUserExist) {
                UserModel.findBySocialVk(uid)
                    .then(user => {
                        res.status(200).json({
                            nickname: user.nickname,
                            rating: user.rating,
                            avatar: user.avatar
                        })
                    });
            } else {
            	res.status(404).json({
                	code: ApiResponseCodes.USER_NOT_EXISTS_SOCIAL
            	});
            }
        });
};

export const create_user = (req: Request, res: Response) => {
    const social = req.header("X-Social");
    const uid = req.header("X-Uid");

    const userData: IUser = {
        nickname: req.body.nickname,
    }

    uid && (userData.uid = Number(uid));
    social && (userData.social = social as SocialType);

    const user = new UserModel(userData);
    user.save()
        .then(user => {
            res.status(201).json({
                nickname: user.nickname,
                avatar: user.avatar,
                rating: user.rating
            })
        })
        .catch(error => {
            res.status(401).json({
                message: error.message
            });
        })
};
