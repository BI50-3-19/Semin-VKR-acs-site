import {
    Icon28CheckShieldOutline,
    Icon28HomeOutline,
    Icon28Users3
} from "@vkontakte/icons";
import { FC, useMemo } from "react";

import AdaptivityLayout, { TAdaptivityButton } from "@/components/adaptivity/layout";
import { observer } from "mobx-react";

import {
    LoginModalPage,
    SessionsModalPage,
    ErrorModalCard,
    SecurityErrorModalCard
} from "./modals";
import Session from "./TS/store/Session";

import MainPage from "./pages/Main";
import SecurityPage from "./pages/Security";
import UsersPage from "./pages/Users";
import { ModalRoot, View } from "@vkontakte/vkui";

const Layout: FC = () => {
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
    }, [Session.user]);

    return (
        <AdaptivityLayout
            modal={
                <ModalRoot activeModal={Session.activeModal} onClose={() => Session.setModal(null)}>
                    <LoginModalPage id="login-page" dynamicContentHeight />
                    <SessionsModalPage id="sessions-list" dynamicContentHeight />
                    <ErrorModalCard id="error-card" />
                    <SecurityErrorModalCard id="security-error-card" />
                </ModalRoot>
            }
            popout={Session.popout}
            buttons={buttons}
        >
            <View id="/" activePanel={Session.activePanel}>
                <MainPage id="/" />
            </View>

            {Session.hasAccess("users:manage") && (
                <View id="/users" activePanel={Session.activePanel}>
                    <UsersPage id="/" />
                </View>
            )}
            {Session.hasAccess("security") && (
                <View id="/security" activePanel={Session.activePanel}>
                    <SecurityPage id="/" />
                </View>
            )}
        </AdaptivityLayout>
    );
};

export default observer(Layout);
