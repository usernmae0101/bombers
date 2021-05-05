import { Request, Response } from "express";

import * as Models from "../models/";
import * as Services from "../services/";

/**
 * Авторизация через социальную сеть. 
 */
export const auth_user_social = (req: Request, res: Response) => {
    Models.UserModel.findOne(Services.request_select_auth_user_socail_data(req))
        .then(user => {
            if (!user) // if user === null
                res.status(404).json(Services.response_auth_user_social_error());
            else
                res.status(200).json(Services.response_fetch_user_data(user));
        });
};

/**
 * Создание пользователя, подключенного через социальную сеть.
 */
export const create_user_social = (req: Request, res: Response) => {
    Models.UserModel.create(Services.request_select_create_user_socail_data(req))
        .then(user => {
            res.status(201).json(Services.response_fetch_user_data(user));
        })
        .catch(error => {
            res.status(401).json(Services.response_create_user_social_error(error));
        });
};
