export const ACTION_TYPE_PROFILE_SET_AVATAR = "PROFILE/SET_AVATAR"; 
export const ACTION_TYPE_PROFILE_SET_RATING = "PROFILE/SET_RATING"; 
export const ACTION_TYPE_PROFILE_SET_PLACE = "PROFILE/SET_PLACE"; 
export const ACTION_TYPE_PROFILE_FETCH_DATA = "PROFILE/FETCH_DATA"; 
export const ACTION_TYPE_PROFILE_SET_READY = "PROFILE/SET_READY"; 

export type NotificationType = {};

export type MatchesType = {};

type QueryTypes = {
	isFetching: boolean;
	hasMore: boolean;
};

export type ProfileStateType = {
	avatar: string;
	rating: number;
	place: number;
	isReady: boolean;
	notifications: QueryTypes & {
		list: NotificationType[];
	};
	matches: QueryTypes & {
		list: MatchesType[];
	};
};

export type SetRatingActionType = {
	type: typeof ACTION_TYPE_PROFILE_SET_RATING;
	payload: number;
};

export type SetPlaceACtionType = {
	type: typeof ACTION_TYPE_PROFILE_SET_PLACE;
	payload: number;
};

export type SetAvatarActionType = {
	type: typeof ACTION_TYPE_PROFILE_SET_AVATAR;
	payload: string;
};

export type FetchDataActionType = {
	type: typeof ACTION_TYPE_PROFILE_FETCH_DATA;
	payload: string;
};

export type SetReadyActionType = {
	type: typeof ACTION_TYPE_PROFILE_SET_READY;
	payload: boolean;
};

export type ProfileActionsType = SetRatingActionType | SetPlaceACtionType 
	| SetAvatarActionType | SetReadyActionType;
