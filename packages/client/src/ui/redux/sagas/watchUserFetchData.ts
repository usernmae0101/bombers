import { call, put, takeEvery } from "@redux-saga/core/effects";

import { api_user_auth_social } from "../../../api/users";
import { AuthUserDataRsponseType } from "../../../api/users/types";
import * as UserActions from "../actions/user-actions";
import * as UserTypes from "../types/user-types";

function* userFetchDataSocail(action: UserTypes.UserFetchDataSocialActionType) {
    try {
        const response: AuthUserDataRsponseType = yield call(
            api_user_auth_social,
            action.payload.uid,
            action.payload.social
        );

        const { nickname, rating, avatar, token } = response;

        // Устанавливаем пользовательские данные.
        yield put(UserActions.action_user_set_data({ nickname, rating, avatar }));
        // Устанавливаем авторизационный токен.
        yield put(UserActions.action_user_set_auth_token(token))
        // Меняем статус авторизации на успешный.
        yield put(UserActions.action_user_set_auth(true));
    } catch (err) {
        // Сервер вернул код в диапазоне 300-599. Диспатчим код ошибки в стор.
        yield put(UserActions.action_user_set_error_code(err.response.data.code));
    }
};

export default function* watchUserFetchData() {
    yield takeEvery(UserTypes.ACTION_TYPE_USER_FETCH_DATA_SOCIAL, userFetchDataSocail);
};
