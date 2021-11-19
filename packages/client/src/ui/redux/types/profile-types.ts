export const ACTION_TYPE_PROFILE_SET_AVATAR = "PROFILE/SET_AVATAR"; 
export const ACTION_TYPE_PROFILE_SET_ONLINE = "PROFILE/SET_ONLINE"; 
export const ACTION_TYPE_PROFILE_SET_LAST_SEEN = "PROFILE/SET_LAST_SEEN"; 
export const ACTION_TYPE_PROFILE_SET_CREATED_AT = "PROFILE/SET_CREATED_AT"; 
export const ACTION_TYPE_PROFILE_SET_RATING = "PROFILE/SET_RATING"; 
export const ACTION_TYPE_PROFILE_SET_PLACE = "PROFILE/SET_PLACE"; 
export const ACTION_TYPE_PROFILE_FETCH_DATA = "PROFILE/FETCH_DATA"; 
export const ACTION_TYPE_PROFILE_SET_DATA_FETCHING = "PROFILE/SET_DATA_FETCHING"; 
export const ACTION_TYPE_PROFILE_SET_MATCHES_FETCHING = "PROFILE/SET_MATCHES_FETCHING"; 
export const ACTION_TYPE_PROFILE_SET_MATCHES_HAS_MORE = "PROFILE/SET_MATCHES_HAS_MORE"; 
export const ACTION_TYPE_PROFILE_SET_MATCHES = "PROFILE/SET_MATCHES"; 
export const ACTION_TYPE_PROFILE_ADD_MATCHES = "PROFILE/ADD_MATCHES"; 
export const ACTION_TYPE_PROFILE_FETCH_MATCHES = "PROFILE/FETCH_MATCHES"; 

export type MatchesType = {
	result: {
		place: number;
		rating: number;
		points: number;
	};
	id: number;
	created_at: number;
	map_id: number;
};

type QueryTypes = {
	isFetching: boolean;
	hasMore: boolean;
};

export type FetchMatchesType = {
	nickname: string;
	page: number;
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

export type SetMatchesIsFetchingActionType = {
	type: typeof ACTION_TYPE_PROFILE_SET_MATCHES_FETCHING;
	payload: boolean;
};

export type SetMatchesHasMoreActionType = {
	type: typeof ACTION_TYPE_PROFILE_SET_MATCHES_HAS_MORE;
	payload: boolean;
};

export type AddMatchesActionType = {
	type: typeof ACTION_TYPE_PROFILE_ADD_MATCHES;
	payload: MatchesType[];
};

export type SetMatchesActionType = {
	type: typeof ACTION_TYPE_PROFILE_SET_MATCHES;
	payload: MatchesType[];
};

export type FetchMatchesActionType = {
	type: typeof ACTION_TYPE_PROFILE_FETCH_MATCHES;
	payload: FetchMatchesType;
};

export type ProfileActionsType = SetRatingActionType | SetPlaceACtionType 
	| SetAvatarActionType | SetDataFetchingActionType | SetDataOnlineActionType 
	| SetDataLastSeenActionType | SetDataCreatedAtActionType | SetMatchesIsFetchingActionType
	| SetMatchesHasMoreActionType | SetMatchesActionType | AddMatchesActionType;
