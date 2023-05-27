import {
    matchPopout,
    ModalRoot,
    useParams,
    View
} from "@itznevikat/router";
import {
    Icon28CheckShieldOutline,
    Icon28HomeOutline,
    Icon28Users3
} from "@vkontakte/icons";
import { ScreenSpinner } from "@vkontakte/vkui";
import { FC, useMemo } from "react";

import AdaptivityLayout, { TAdaptivityButton } from "@/components/adaptivity/layout";
import { observer } from "mobx-react";
import { AccountNotCreated } from "./popouts";

import {
    ErrorCard,
    LoginModalPage,
    SessionsPage
} from "./modals";
import Session from "./TS/store/Session";

import MainPage from "./pages/Main";
import SecurityPage from "./pages/Security";
import UsersPage from "./pages/Users";
import { SecurityErrorCard } from "./modals/security-error-card";

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

        if (Session.hasAccess("users:manage")) {
            buttons.push({
                icon: <Icon28Users3 />,
                story: "/users",
                text: "Пользователи"
            });
        }

        if (Session.hasAccess("security")) {
            buttons.push({
                icon: <Icon28CheckShieldOutline />,
                story: "/security",
                text: "Охрана"
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
                    <SecurityErrorCard nav="security-error-card" />
                    <SessionsPage nav="sessions-list" dynamicContentHeight />
                </ModalRoot>
            }
            popout={Session.popout}
            buttons={buttons}
        >
            <View nav="/">
                <MainPage nav="/" isOnePage={buttons.length === 0} />
            </View>

            {Session.hasAccess("users:manage") && (
                <View nav="/users">
                    <UsersPage nav="/" />
                </View>
            )}
            {Session.hasAccess("security") && (
                <View nav="/security">
                    <SecurityPage nav="/" />
                </View>
            )}
        </AdaptivityLayout>
    );
};

export default observer(Layout);
