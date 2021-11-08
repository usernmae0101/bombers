import { AppStateType } from "../store";

export const select_profile_avatar = (state: AppStateType): string => {
    return state.profile.avatar; 
};

export const select_profile_place = (state: AppStateType): number => {
    return state.profile.place; 
};

export const select_profile_rating = (state: AppStateType): number => {
    return state.profile.rating; 
};

export const select_profile_is_ready = (state: AppStateType): boolean => {
    return state.profile.isReady;
};
