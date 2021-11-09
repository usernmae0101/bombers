import { call, put, takeEvery } from "@redux-saga/core/effects";

import * as API from "@bombers/client/src/api/";
import * as UserActions from "../actions/user-actions";
import * as UserTypes from "../types/user-types";
import { setUserData } from "./helpers";

function* userFetchDataSocail(action: UserTypes.UserFetchDataSocialActionType) {
    try {
        const response: API.Users.AuthUserDataRsponseType = yield call(
            API.Users.api_user_auth_social,
            action.payload.uid,
            action.payload.social
        );

		yield setUserData(response);
    } catch (err) {
        // Сервер вернул код в диапазоне 3xx-5xx. Диспатчим код ошибки в стор.
        yield put(
            UserActions.action_user_set_error_code(err.response.data.code)
        );
    }
};

export default function* watchUserFetchData() {
    yield takeEvery(
        UserTypes.ACTION_TYPE_USER_FETCH_DATA_SOCIAL, 
        userFetchDataSocail
    );
};
