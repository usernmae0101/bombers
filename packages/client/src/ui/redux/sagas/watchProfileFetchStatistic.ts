import { call, takeEvery, put } from "@redux-saga/core/effects";

import * as API from "@bombers/client/src/api/";
import * as ProfileActions from "../actions/profile-actions";
import * as ProfileTypes from "../types/profile-types";
import { debug } from "@bombers/shared/src/tools/debugger";

function* profileFetchStatistic(action: ProfileTypes.FetchStatisticActionType) {
   try {
      const response: API.Profile.ProfileStatisticResponseType = yield call(
         API.Profile.api_profile_fetch_statistic,
         action.payload,
      );
      
      yield put(
         ProfileActions.action_profile_set_statistic(response)
      ); 
   } catch (err) {
       debug(
           "Error occured trying fetch profile statistic",
           err.response
       );
   } finally {
      yield put(
         ProfileActions.action_profile_set_statistic_is_fetching(false)
      ); 
   }
}

export default function* watchProfileFetchStatistic() {
    yield takeEvery(
      ProfileTypes.ACTION_TYPE_PROFILE_FETCH_STATISTIC,
      profileFetchStatistic
    );
}
