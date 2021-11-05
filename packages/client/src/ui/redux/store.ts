import { createStore, combineReducers, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";

import chatReducer from "./reducers/chat-reducer";
import dashboardReducer from "./reducers/dashboard-reducer";
import gameReducer from "./reducers/game-reducer";
import lobbyReducer from "./reducers/lobby-reducer";
import userReducer from "./reducers/user-reducer";
import ratingReducer from "./reducers/rating-reducer";
import rootSaga from "./sagas/root-saga";

const reducer = combineReducers({
    chat: chatReducer,
    lobby: lobbyReducer,
    dashboard: dashboardReducer,
    user: userReducer,
    game: gameReducer,
    rating: ratingReducer
});

export type AppStateType = ReturnType<typeof reducer>;

const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSaga);

export default store;
