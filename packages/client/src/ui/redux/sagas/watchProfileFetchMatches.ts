import { call, takeEvery, put } from "@redux-saga/core/effects";

import * as API from "@bombers/client/src/api/";
import * as ProfileActions from "../actions/profile-actions";
import * as ProfileTypes from "../types/profile-types";
import { debug } from "@bombers/shared/src/tools/debugger";

function* profileFetchMatches(action: ProfileTypes.FetchMatchesActionType) {
   try {
      yield put(
         ProfileActions.action_profile_set_matches_is_fetching(true) 
      ); 

      const response: API.Profile.ProfileMatchesResponseType = yield call(
         API.Profile.api_profile_fetch_matches,
         action.payload.nickname,
         action.payload.page
      );
      
      const { matches, hasMoreMatches } = response;

      yield put(
         ProfileActions.action_profile_set_matches_has_more(hasMoreMatches) 
      ); 
      yield put(
         ProfileActions.action_profile_add_matches(matches) 
      ); 
   } catch (err) {
       debug(
           "Error occured trying fetch profile matches",
           err.response
       );
   } finally {
      yield put(
         ProfileActions.action_profile_set_matches_is_fetching(false) 
      ); 
   }
}

export default function* watchProfileFetchMatches() {
    yield takeEvery(
      ProfileTypes.ACTION_TYPE_PROFILE_FETCH_MATCHES,
      profileFetchMatches
    );
}; 
