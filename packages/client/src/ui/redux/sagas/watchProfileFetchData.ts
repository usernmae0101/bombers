import { call, takeEvery, put } from "@redux-saga/core/effects";

import * as API from "@bombers/client/src/api/";
import * as ProfileActions from "../actions/profile-actions";
import * as ProfileTypes from "../types/profile-types";
import { debug } from "@bombers/shared/src/tools/debugger";

function* profileFetchData(action: ProfileTypes.FetchDataActionType) {
   try {
      const response: API.Profile.ProfileDataResponseType = yield call(
         API.Profile.api_profile_fetch_data,
         action.payload
      );
      
      const { avatar, rating, place } = response;

      yield put(
         ProfileActions.action_profile_set_rating(rating)  
      );
      yield put(
         ProfileActions.action_profile_set_place(place)  
      ); 
      yield put(
         ProfileActions.action_profile_set_avatar(avatar)  
      ); 
   } catch (err) {
       debug(
           "Error occured trying fetch profile data",
           err.response
       );
   } finally {
      yield put(
         ProfileActions.action_profile_set_data_fetching(false) 
      ); 
   }
}

export default function* watchProfileFetchData() {
    yield takeEvery(
      ProfileTypes.ACTION_TYPE_PROFILE_FETCH_DATA,
      profileFetchData
    );
}; 
