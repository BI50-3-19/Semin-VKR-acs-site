import { FC, useMemo } from "react";
import {
    ModalRoot, View, matchPopout, useParams 
} from "@itznevikat/router";
import {
    Icon28HomeOutline,
    Icon28Users3
} from "@vkontakte/icons";
import { ScreenSpinner } from "@vkontakte/vkui";

import AdaptivityLayout, { TAdaptivityButton } from "@/components/adaptivity/layout";
import { observer } from "mobx-react";
import MainPage from "./pages/Main";
import { AccountNotCreated } from "./popouts";

import { LoginModalPage, ErrorCard } from "./modals";
import Session from "./TS/store/Session";
import UsersPage from "./pages/Users";

const Layout: FC = () => {
    const { popout = null } = useParams();

    const buttons = useMemo<TAdaptivityButton[]>(() => {
        const buttons: TAdaptivityButton[] = [
            {
                icon: <Icon28HomeOutline />,
                story: "/",
                text: "Главная"
            }
        ];

        if (Session.hasAccess("users:get")) {
            buttons.push({
                icon: <Icon28Users3 />,
                story: "/users",
                text: "Пользователи"
            });
        }
        
        if (buttons.length > 1) {
            return buttons;
        } else {
            return [];
        }
    }, []);

    return (
        <AdaptivityLayout
            modal={
                <ModalRoot>
                    <LoginModalPage nav="login-page" dynamicContentHeight />
                    <ErrorCard nav="error-card" />
                </ModalRoot>
            }
            popout={matchPopout(popout, [
                <ScreenSpinner id="screen-spinner" />,
                <AccountNotCreated nav="account-not-created" />
            ])}
            buttons={buttons}
        >
            <View nav="/">
                <MainPage nav="/" />
            </View>

            {Session.hasAccess("users:get") && (
                <View nav="/users">
                    <UsersPage nav="/" />
                </View>
            )}
        </AdaptivityLayout>
    );
};

export default observer(Layout);
