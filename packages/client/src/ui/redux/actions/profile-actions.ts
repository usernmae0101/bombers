import * as ProfileTypes from "../types/profile-types";

export const action_profile_set_rating = (
    rating: number
): ProfileTypes.SetRatingActionType => ({
    type: ProfileTypes.ACTION_TYPE_PROFILE_SET_RATING,
    payload: rating
});

export const action_profile_fetch_data = (
    nickname: string
): ProfileTypes.FetchDataActionType => ({
    type: ProfileTypes.ACTION_TYPE_PROFILE_FETCH_DATA,
    payload: nickname
});

export const action_profile_set_data_fetching = (
    isFetching: boolean
): ProfileTypes.SetDataFetchingActionType => ({
    type: ProfileTypes.ACTION_TYPE_PROFILE_SET_DATA_FETCHING,
    payload: isFetching
});

export const action_profile_set_place = (
    place: number
): ProfileTypes.SetPlaceACtionType => ({
    type: ProfileTypes.ACTION_TYPE_PROFILE_SET_PLACE,
    payload: place
});

export const action_profile_set_avatar = (
    avatar: string
): ProfileTypes.SetAvatarActionType => ({
    type: ProfileTypes.ACTION_TYPE_PROFILE_SET_AVATAR,
    payload: avatar
});

export const action_profile_set_online = (
    isOnline: boolean
): ProfileTypes.SetDataOnlineActionType => ({
    type: ProfileTypes.ACTION_TYPE_PROFILE_SET_ONLINE,
    payload: isOnline
});

export const action_profile_set_last_seen = (
    timestamp: number
): ProfileTypes.SetDataLastSeenActionType => ({
    type: ProfileTypes.ACTION_TYPE_PROFILE_SET_LAST_SEEN,
    payload: timestamp
});

export const action_profile_set_created_at = (
    timestamp: number
): ProfileTypes.SetDataCreatedAtActionType => ({
    type: ProfileTypes.ACTION_TYPE_PROFILE_SET_CREATED_AT,
    payload: timestamp
});
