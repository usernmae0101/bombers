import { all } from "redux-saga/effects";

import watchUserCreateSocial from "./watchUserCreateSocial";
import watchUserFetchData from "./watchUserFetchData";

export default function* rootSaga() {
    yield all([
        watchUserFetchData(),
        watchUserCreateSocial()
    ]);
}