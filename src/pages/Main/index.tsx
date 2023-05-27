import Session from "@/TS/store/Session";
import { Icon56Users3Outline } from "@vkontakte/icons";

import {
    Button,
    ButtonGroup,
    Group,
    NavIdProps, 
    Panel,
    PanelHeader,
    Placeholder,
    useAdaptivityWithJSMediaQueries
} from "@vkontakte/vkui";

import { FC } from "react";

import Profile from "./Profile";
import QRCode from "./QRCode";
import HeaderLeftButtons from "@/components/adaptivity/header-buttons";

import { AccountNotCreated } from "@/popouts";

const MainPage: FC<NavIdProps> = ({ id }) => {
    const { isDesktop } = useAdaptivityWithJSMediaQueries();

    if (Session.user === null) {
        return (
            <Panel id={id}>
                <PanelHeader separator={false} before={<HeaderLeftButtons />}>REA ACS</PanelHeader>
                <Group>
                    <Placeholder
                        stretched
                        icon={<Icon56Users3Outline />}
                        header="Необходим аккаунт"
                        action={
                            <ButtonGroup mode="vertical">
                                <Button 
                                    size="l" 
                                    stretched
                                    onClick={() => Session.setModal("login-page")}
                                >Войти в аккаунт</Button>
                                <Button 
                                    size="l" 
                                    stretched 
                                    mode="secondary"
                                    appearance="accent"
                                    onClick={() => Session.setPopout(<AccountNotCreated />)}
                                >У меня нет аккаунта</Button>
                            </ButtonGroup>
                        }
                    >
                        Для продолжения работы необходимо авторизоваться
                    </Placeholder>
                </Group>
            </Panel>
        );
    }

    return (
        <Panel id={id}>
            <PanelHeader separator={false} before={!isDesktop && <HeaderLeftButtons />}>REA ACS</PanelHeader>
            <Profile user={Session.user}/>
            <QRCode />
        </Panel>
    );
};

export default MainPage;
