import { call, takeEvery, put } from "@redux-saga/core/effects";
import { api_user_create_social } from "../../../api/users";
import { AuthUserDataRsponseType } from "../../../api/users/types";
import { action_user_set_data, action_user_set_auth, action_user_set_error_message } from "../actions/user-actions";
import { ACTION_TYPE_USER_CREATE_SOCIAL, UserCreateSocialActionType } from "../types/user-types";

function* userCreateSocial(action: UserCreateSocialActionType) {
	try {
		const userData: AuthUserDataRsponseType = yield call(
			api_user_create_social,
			action.payload.uid,
			action.payload.social,
			action.payload.data
		);

		yield put(action_user_set_data(userData));
		yield put(action_user_set_auth(true));
	} catch (err) {
		yield put(action_user_set_error_message(err.response.data.message));
	}
}

export default function* watchUserCreateSocial() {
	yield takeEvery(ACTION_TYPE_USER_CREATE_SOCIAL, userCreateSocial);
}

