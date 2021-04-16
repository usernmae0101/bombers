import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";

import Routes from "./Routes";
import store from "./redux/store";
import * as UserSelectors from "./redux/selectors/user-selecrots";
import * as UserActions from "./redux/actions/user-actions";
import { ApiResponseCodes, SocketChannels } from "@bombers/shared/src/idnex";
import { handle_socket_app_online, IOnline } from "../handlers/socket-app-handler";
import Loader from "./components/Loader";

const Main = () => {
    const dispatch = useDispatch();

    const isAuthViaSocial = useSelector(UserSelectors.select_user_auth_is_social);
    const authToken = useSelector(UserSelectors.select_user_auth_token);
    const userUid = useSelector(UserSelectors.select_user_social_uid);
    const userSocialType = useSelector(UserSelectors.select_user_social_type);
    const errorCode = useSelector(UserSelectors.select_user_error_code);
    const isAuth = useSelector(UserSelectors.select_user_auth);
    const nickname = useSelector(UserSelectors.select_user_data_nickname);
    const socket = useSelector(UserSelectors.select_user_socket_instance);
    const appRoom = useSelector(UserSelectors.select_user_socket_room_app);

    React.useEffect(() => {
        if (isDevMode) {
            dispatch(UserActions.action_user_set_social_type("vk"));
            dispatch(UserActions.action_uesr_set_social_uid(-1));
            dispatch(UserActions.action_user_set_auth_is_social(true));
        }
    }, []);

    React.useEffect(() => {
        if (isAuthViaSocial === true) {
            dispatch(UserActions.action_user_fetch_data_social({
                uid: userUid,
                social: userSocialType
            }));
        }

        if (isAuthViaSocial === false) { }
    }, [isAuthViaSocial]);

    React.useEffect(() => {
        switch (errorCode) {
            case ApiResponseCodes.USER_NOT_EXISTS_SOCIAL:
                dispatch(UserActions.action_user_create_social({
                    uid: isDevMode ? Math.round(Math.random() * 90000 + 2) : userUid,
                    social: userSocialType,
                    data: { nickname: Math.random().toString(32).slice(4) }
                }));
                break;
        }
    }, [errorCode]);

    React.useEffect(() => {
        (async () => {
            if (isAuth) {
                const _appRoom = await socket.joinOrCreate("app", {
                    nickname
                });

                _appRoom.onMessage(SocketChannels.APP_ON_SET_ONLINE, (online: IOnline) => {
                    handle_socket_app_online(dispatch, online);
                });

                dispatch(UserActions.action_user_set_socket_app_room(_appRoom));
            }
        })();
    }, [isAuth]);

    if (!isAuth || !appRoom) return <Loader />

    return (
        <BrowserRouter>
            <Routes />
        </BrowserRouter>
    );
};

const App = () => {
    return (
        <Provider store={store}>
            <Main />
        </Provider>
    );
};


export default App;
