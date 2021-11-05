import { call, takeEvery, put } from "@redux-saga/core/effects";

import { api_user_create_social } from "../../../api/users";
import { AuthUserDataRsponseType } from "../../../api/users/types";
import * as UserActions from "../actions/user-actions";
import * as UserTypes from "../types/user-types";

function* userCreateSocial(action: UserTypes.UserCreateSocialActionType) {
	try {
		const response: AuthUserDataRsponseType = yield call(
			api_user_create_social,
			action.payload.uid,
			action.payload.social,
			action.payload.data
		);

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

