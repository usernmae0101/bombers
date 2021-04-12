import React from "react";
import {BrowserRouter} from "react-router-dom";
import {Provider, useDispatch, useSelector} from "react-redux";

import Routes from "./Routes";
import store from "./redux/store";
import {select_user_auth, select_user_auth_is_social, select_user_auth_token, select_user_data_nickname, select_user_error_code, select_user_social_type, select_user_social_uid, select_user_socket_instance, select_user_socket_room_app} from "./redux/selectors/user-selecrots";
import {action_uesr_set_social_uid, action_user_create_social, action_user_fetch_data_social, action_user_set_auth_is_social, action_user_set_social_type, action_user_set_socket_app_room} from "./redux/actions/user-actions";
import {ApiResponseCodes, SocketChannels} from "@bombers/shared/src/idnex";
import {handle_socket_app_online, IOnline} from "../handlers/socket-app-handler";
import Loader from "./components/Loader";

const Main = () => {
    const dispatch = useDispatch();

    const isAuthViaSocial = useSelector(select_user_auth_is_social);
    const authToken = useSelector(select_user_auth_token);
    const userUid = useSelector(select_user_social_uid);
    const userSocialType = useSelector(select_user_social_type);
    const errorCode = useSelector(select_user_error_code);
    const isAuth = useSelector(select_user_auth);
    const nickname = useSelector(select_user_data_nickname);
    const socket = useSelector(select_user_socket_instance);
    const appRoom = useSelector(select_user_socket_room_app);

    React.useEffect(() => {
        if (isDevMode) {
            dispatch(action_user_set_social_type("vk"));
            dispatch(action_uesr_set_social_uid(-1));
            dispatch(action_user_set_auth_is_social(true));
        }
    }, []);

    React.useEffect(() => {
        if (isAuthViaSocial === true) {
            dispatch(action_user_fetch_data_social({
                uid: userUid,
                social: userSocialType
            }));
        }

        if (isAuthViaSocial === false) {}
    }, [isAuthViaSocial]);

    React.useEffect(() => {
        switch (errorCode) {
            case ApiResponseCodes.USER_NOT_EXISTS_SOCIAL:
                dispatch(action_user_create_social({
                    uid: isDevMode ? Math.round(Math.random() * 90000 + 2) : userUid,
                    social: userSocialType,
                    data: {nickname: Math.random().toString(32).slice(4)}
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

                dispatch(action_user_set_socket_app_room(_appRoom));
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
