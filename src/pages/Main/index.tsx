import Session from "@/TS/store/Session";
import { push } from "@itznevikat/router";
import { Icon56Users3Outline } from "@vkontakte/icons";

import {
    Button,
    ButtonGroup,
    NavIdProps, 
    Panel,
    PanelHeader,
    Placeholder
} from "@vkontakte/vkui";

import { FC } from "react";

import Profile from "./Profile";
import QRCode from "./QRCode";
import HeaderLeftButtons from "@/components/adaptivity/header-buttons";

import { AccountNotCreated } from "@/popouts";

const MainPage: FC<NavIdProps> = ({ nav }) => {
    if (Session.user === null) {
        return (
            <Panel nav={nav}>
                <PanelHeader separator={false} before={<HeaderLeftButtons />}>REA ACS</PanelHeader>
                <Placeholder
                    stretched
                    icon={<Icon56Users3Outline />}
                    header="Необходим аккаунт"
                    action={
                        <ButtonGroup mode="vertical">
                            <Button 
                                size="l" 
                                stretched
                                onClick={() => push("?modal=login-page")}
                            >Войти в аккаунт</Button>
                            <Button 
                                size="l" 
                                stretched 
                                mode="secondary"
                                appearance="overlay"
                                onClick={() => Session.setPopout(<AccountNotCreated />)}
                            >У меня нет аккаунта</Button>
                        </ButtonGroup>
                    }
                >
                Для продолжения работы необходимо авторизоваться
                </Placeholder>
            </Panel>
        );
    }

    return (
        <Panel nav={nav}>
            <PanelHeader separator={false} before={<HeaderLeftButtons />}>REA ACS</PanelHeader>
            <Profile user={Session.user}/>
            <QRCode />
        </Panel>
    );
};

export default MainPage;
