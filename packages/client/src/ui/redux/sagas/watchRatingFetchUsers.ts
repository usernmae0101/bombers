import { call, put, takeEvery } from "@redux-saga/core/effects";

import * as API from "@bombers/client/src/api/";
import * as RatingActions from "@bombers/client/src/ui/redux/actions/rating-actions";
import * as RatingTypes from "@bombers/client/src/ui/redux/types/rating-types";
import { debug } from "@bombers/shared/src/tools/debugger";

function* ratingFetchUsers(action: RatingTypes.FetchUsersActionType) {
    try {
        yield put(
            RatingActions.action_rating_set_is_fetching(true)
        );

        const response: API.Rating.FetchRatingUsersReposnseType = yield call(
            API.Rating.api_rating_fetch_users,
            action.payload
        );

        const { users, hasMoreUsers, totalUsers } = response;
        
        // Добавляем пользователей в список (не устанавливаем)
        yield put(
            RatingActions.action_rating_add_users(users)
        );
        yield put(
            RatingActions.action_rating_set_has_more_users(hasMoreUsers)
        );
        yield put(
            RatingActions.action_rating_set_total_users(totalUsers)
        );
    } catch (err) {
        debug(
            "Error occured trying fetch rating users",
            err.response
        );
    } finally {
        yield put(
            RatingActions.action_rating_set_is_fetching(false)
        );
    }
};

export default function* watchRatingFetchUsers() {
    yield takeEvery(
        RatingTypes.ACTION_TYPE_RATING_FETCH_USERS,
        ratingFetchUsers
    );
}; 
