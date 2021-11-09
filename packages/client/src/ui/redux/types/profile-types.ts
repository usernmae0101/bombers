export const ACTION_TYPE_PROFILE_SET_AVATAR = "PROFILE/SET_AVATAR"; 
export const ACTION_TYPE_PROFILE_SET_ONLINE = "PROFILE/SET_ONLINE"; 
export const ACTION_TYPE_PROFILE_SET_LAST_SEEN = "PROFILE/SET_LAST_SEEN"; 
export const ACTION_TYPE_PROFILE_SET_CREATED_AT = "PROFILE/SET_CREATED_AT"; 
export const ACTION_TYPE_PROFILE_SET_RATING = "PROFILE/SET_RATING"; 
export const ACTION_TYPE_PROFILE_SET_PLACE = "PROFILE/SET_PLACE"; 
export const ACTION_TYPE_PROFILE_FETCH_DATA = "PROFILE/FETCH_DATA"; 
export const ACTION_TYPE_PROFILE_SET_DATA_FETCHING = "PROFILE/SET_DATA_FETCHING"; 

export type NotificationType = {};

export type MatchesType = {};

type QueryTypes = {
	isFetching: boolean;
	hasMore: boolean;
};

export type ProfileStateType = {
	data: {
		avatar: string;
		rating: number;
		place: number;
		createdAt: number;
		lastSeen: number;
		isOnline: boolean;
		isFetching: boolean;
	};
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

export type SetDataFetchingActionType = {
	type: typeof ACTION_TYPE_PROFILE_SET_DATA_FETCHING;
	payload: boolean;
};

export type SetDataOnlineActionType = {
	type: typeof ACTION_TYPE_PROFILE_SET_ONLINE;
	payload: boolean;
};

export type SetDataLastSeenActionType = {
	type: typeof ACTION_TYPE_PROFILE_SET_LAST_SEEN;
	payload: number;
};

export type SetDataCreatedAtActionType = {
	type: typeof ACTION_TYPE_PROFILE_SET_CREATED_AT;
	payload: number;
};

export type ProfileActionsType = SetRatingActionType | SetPlaceACtionType 
	| SetAvatarActionType | SetDataFetchingActionType | SetDataOnlineActionType 
	| SetDataLastSeenActionType | SetDataCreatedAtActionType;
