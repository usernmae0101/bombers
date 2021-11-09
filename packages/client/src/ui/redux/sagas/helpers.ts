import { put } from "@redux-saga/core/effects";

import * as UserActions from "../actions/user-actions";
import * as API from "@bombers/client/src/api/";

export function* setUserData(response: API.Users.AuthUserDataRsponseType) {
    const { nickname, rating, avatar, token } = response;

    // Устанавливаем пользовательские данные.
    yield put(
        UserActions.action_user_set_data({ 
            nickname, 
            rating, 
            avatar 
        })
    );
    yield put(
        UserActions.action_user_set_auth_token(token)
    );
    yield put(
        UserActions.action_user_set_auth(true)
    );
} 
