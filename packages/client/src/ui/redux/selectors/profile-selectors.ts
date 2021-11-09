import { AppStateType } from "../store";

export const select_profile_data_avatar = (state: AppStateType): string => {
    return state.profile.data.avatar; 
};

export const select_profile_data_place = (state: AppStateType): number => {
    return state.profile.data.place; 
};

export const select_profile_data_rating = (state: AppStateType): number => {
    return state.profile.data.rating; 
};

export const select_profile_data_is_fetching = (state: AppStateType): boolean => {
    return state.profile.data.isFetching;
};

export const select_profile_data_last_seen = (state: AppStateType): number => {
    return state.profile.data.lastSeen;
};

export const select_profile_data_created_at = (state: AppStateType): number => {
    return state.profile.data.createdAt;
};

export const select_profile_data_is_online = (state: AppStateType): boolean => {
    return state.profile.data.isOnline;
};
