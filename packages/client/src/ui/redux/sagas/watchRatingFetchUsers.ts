import { call, put, takeEvery } from "@redux-saga/core/effects";

import { api_rating_fetch_users } from "../../../api/rating";
import { FetchRatingUsersReposnseType } from "../../../api/rating/types";
import * as RatingActions from "@bombers/client/src/ui/redux/actions/rating-actions";
import * as RatingTypes from "@bombers/client/src/ui/redux/types/rating-types";
import { debug } from "@bombers/shared/src/tools/debugger";

function* ratingFetchUsers(action: RatingTypes.FetchUsersActionType) {
    try {
        yield put(
            RatingActions.action_rating_set_is_fetching(true)
        );

        const response: FetchRatingUsersReposnseType = yield call(
            api_rating_fetch_users,
            action.payload
        );

        const { users, hasMoreUsers } = response;
        
        // Добавляем пользователей в список (не устанавливаем)
        yield put(
            RatingActions.action_rating_add_users(users)
        );
        yield put(
            RatingActions.action_rating_set_has_more_users(hasMoreUsers)
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
