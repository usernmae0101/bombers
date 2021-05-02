import { all } from "redux-saga/effects";

import watchUserCreate from "./watchUserCreate";
import watchUserFetchData from "./watchUserFetchData";

export default function* rootSaga() {
    yield all([
        watchUserFetchData(),
        watchUserCreate()
    ]);
}