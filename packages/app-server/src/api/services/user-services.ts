import { Request } from "express";

import * as Models from "../models";
import * as Shared from "@bombers/shared/src/idnex";

/**
 * Извлекат из документа пользователя  данные, которые вернутся 
 * после успешной авторизации или создания нового документа в базе данных.
 * 
 * @param user - документ пользователя в базе данных
 * @returns объект с данными
 */
export const response_fetch_user_data = (user: Models.IDocumentUser) => {
    return {
        nickname: user.nickname,
        rating: user.rating,
        avatar: user.avatar,
        token: user._id
    };
};

/**
 * Генерирует ответ при неудачной попытке авторизации через социальную сеть.
 * 
 * @returns объект с кодом ошибки
 */
export const response_auth_user_social_error = () => {
    return {
        code: Shared.Enums.ApiResponseCodes.USER_NOT_EXISTS_SOCIAL
    };
};

/**
 * Генерирует ответ при неудачной попытке создать пользователя в базе данных,
 * который подключился через социальную сеть.
 * 
 * @param error - ошибка, которую вернул документ
 * @returns объект с сообщением ошибки
 */
export const response_create_user_social_error = (error: any) => {
    return {
        message: error.message
    }
};

/**
 * Генерирует объект с данными для создания документа в базе данных на
 * основе данных, полученных с веб-запроса.
 * 
 * @param req - данные веб-запроса
 * @returns объект с данными для создания документа в базе
 */
export const request_select_create_user_socail_data = (req: Request) => {
    return  {
        social: req.header("X-Social"),
        uid: Number(req.header("X-Uid")),
        nickname: req.body.nickname
    };
};

/**
 * Генерирует объект с данными для поиска документа
 * в базе данных на основе данных, полученных с веб-запроса.
 * 
 * @param req - данные веб-запроса
 * @returns объект с данными для поиска документа в базе
 */
export const request_select_auth_user_socail_data = (req: Request) => {
    return {
        uid: Number(req.header("X-Uid"))
    }
};
