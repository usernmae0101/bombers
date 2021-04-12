import { call, put, takeEvery } from "@redux-saga/core/effects";

import { api_user_auth_social } from "../../../api/users";
import { FetchUserDataRsponseType } from "../../../api/users/types";
import { action_user_set_data, action_user_set_auth, action_user_set_error_code } from "../actions/user-actions";
import { ACTION_TYPE_USER_FETCH_DATA_SOCIAL, UserFetchDataSocialActionType } from "../types/user-types";

function* userFetchDataSocail(action: UserFetchDataSocialActionType) {
    try {
        const userData: FetchUserDataRsponseType = yield call(
            api_user_auth_social,
            action.payload.uid,
            action.payload.social
        );

        yield put(action_user_set_data(userData));
        yield put(action_user_set_auth(true));
    } catch (err) {
        yield put(action_user_set_error_code(err.response.data.code));
    }
};

export default function* watchUserFetchData() {
    yield takeEvery(ACTION_TYPE_USER_FETCH_DATA_SOCIAL, userFetchDataSocail);
};
