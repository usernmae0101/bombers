import { call, takeEvery, put } from "@redux-saga/core/effects";

import * as API from "@bombers/client/src/api/";
import * as UserActions from "../actions/user-actions";
import * as UserTypes from "../types/user-types";
import { setUserData } from "./utils";

function* userCreateSocial(action: UserTypes.UserCreateSocialActionType) {
	try {
		const response: API.Users.AuthUserDataRsponseType = yield call(
			API.Users.api_user_create_social,
			action.payload.uid,
			action.payload.social,
			action.payload.data
		);
		
		yield setUserData(response);
	} catch (err) {
		// Сервер вернул код в диапазоне 3xx-5xx. Диспатчим сообщение об ошибке в стор.
		yield put(
			UserActions.action_user_set_error_message(err.response.data.message)
		);
	}
}

export default function* watchUserCreate() {
	yield takeEvery(
		UserTypes.ACTION_TYPE_USER_CREATE_SOCIAL, 
		userCreateSocial
	);
}

