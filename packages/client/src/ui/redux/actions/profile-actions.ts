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

export const action_profile_set_ready = (
    isReady: boolean
): ProfileTypes.SetReadyActionType => ({
    type: ProfileTypes.ACTION_TYPE_PROFILE_SET_READY,
    payload: isReady
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
