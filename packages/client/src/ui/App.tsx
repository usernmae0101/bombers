import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

import Routes from "./Routes";
import store from "./redux/store";
import * as UserSelectors from "./redux/selectors/user-selecrots";
import * as UserActions from "./redux/actions/user-actions";
import * as Shared from "@bombers/shared/src/idnex";
import * as SocketAppHandler from "../helpers/handlers/socket-app-handler";
import Loader from "./components/Loader";

const Main = () => {
    const dispatch = useDispatch();

    const isAuthViaSocial = useSelector(UserSelectors.select_user_auth_is_social);
    const authToken = useSelector(UserSelectors.select_user_auth_token);
    const userUid = useSelector(UserSelectors.select_user_social_uid);
    const userSocialType = useSelector(UserSelectors.select_user_social_type);
    const errorCode = useSelector(UserSelectors.select_user_error_code);
    const isAuth = useSelector(UserSelectors.select_user_auth);
    const socket = useSelector(UserSelectors.select_user_socket_instance);
    
    // Подписка на монтирование компонента. ComponentDidMonut.
    React.useEffect(() => {
        // Режим разработки. Задаём невалидные данные, чтобы создать новый аккаунт.
        if (isDevMode) {
            dispatch(UserActions.action_user_set_social_type("vk"));
            dispatch(UserActions.action_uesr_set_social_uid(Math.round(Math.random() * 10_000)));
            dispatch(UserActions.action_user_set_auth_is_social(true));
        }
    }, []);

    
    // Подписка на изменение свойства "isAuthViaSocial".
    React.useEffect(() => {
        // Авторизация выполнена через социальную сеть, получаем данные через API.
        if (isAuthViaSocial === true) {
            dispatch(UserActions.action_user_fetch_data_social({
                uid: userUid,
                social: userSocialType
            }));
        }

        if (isAuthViaSocial === false) { }
    }, [isAuthViaSocial]);
  
    // Подписка на измениение свойства "errorCode".  
    React.useEffect(() => {
        switch (errorCode) { 
            // Пользователь не был найден в базе данных - создаём.
            case Shared.Enums.ApiResponseCodes.USER_NOT_EXISTS_SOCIAL:
                dispatch(UserActions.action_user_create_social({
                    uid: userUid,
                    social: userSocialType,
                    data: {
                        nickname: `user${userUid}`
                    }
                }));
                break;
        }
    }, [errorCode]);

    // Подписка на измение свойства "isAuth".
    React.useEffect(() => {
        (async () => {
            if (isAuth) {
                // Подключение к веб-сокету по авторизационному токену.
                const _socket = io({
                    query: {
                        authToken
                    }
                });

                _socket.emit(String(Shared.Enums.SocketChannels.APP_ON_SET_ONLINE), (online: number) => {
                    SocketAppHandler.handle_socket_app_online(dispatch, online);
                });

                dispatch(UserActions.action_user_set_socket_instance(_socket));
            }
        })();
    }, [isAuth]);

    if (!isAuth || !socket) return (<Loader />);

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
