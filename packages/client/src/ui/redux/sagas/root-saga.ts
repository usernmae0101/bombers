import { all } from "redux-saga/effects";

import watchUserCreate from "./watchUserCreate";
import watchUserFetchData from "./watchUserFetchData";
import watchRatingFetchUsers from "./watchRatingFetchUsers";

export default function* rootSaga() {
    yield all([
        watchUserFetchData(),
        watchUserCreate(),
        watchRatingFetchUsers()
    ]);
};
