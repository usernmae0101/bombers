export const ACTION_TYPE_RATING_ADD_USERS = "RATING/ADD_USERS";
export const ACTION_TYPE_RATING_SET_HAS_MORE_USERS = "RATING/SET_HAS_MORE_USERS";
export const ACTION_TYPE_RATING_SET_IS_FETCHING = "RATING/SET_IS_FETCHING";
export const ACTION_TYPE_RATING_FETCH_USERS = "RATING/FETCH_USERS";
export const ACTION_TYPE_RATING_SET_USERS = "RATING/SET_USERS";

export type UserRatingType = {
	avatar: string;
	nickname: string;
	rating: number;
};

export type RatingStateType = {
	users: UserRatingType[];
	hasMoreUsers: boolean;
	isFetching: boolean;
};

export type SetHasMoreUsersActionType = {
	type: typeof ACTION_TYPE_RATING_SET_HAS_MORE_USERS;
	payload: boolean;
};

export type SetIsFetchingActionType = {
	type: typeof ACTION_TYPE_RATING_SET_IS_FETCHING;
	payload: boolean;
};

export type AddUsersActionType = {
	type: typeof ACTION_TYPE_RATING_ADD_USERS;
	payload: UserRatingType[];
};

export type FetchUsersActionType = {
	type: typeof ACTION_TYPE_RATING_FETCH_USERS;
	payload: number;
};

export type SetUsersActionType = {
	type: typeof ACTION_TYPE_RATING_SET_USERS;
	payload: UserRatingType[];
};

export type RatingActionTypes = SetHasMoreUsersActionType | AddUsersActionType
	| SetIsFetchingActionType | FetchUsersActionType | SetUsersActionType;
