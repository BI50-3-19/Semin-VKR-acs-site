import Session from "@/TS/store/Session";
import HeaderLeftButtons from "@/components/adaptivity/header-buttons";
import { push } from "@itznevikat/router";
import { Icon56Users3Outline } from "@vkontakte/icons";
import {
    NavIdProps, Panel, Button, Placeholder, ButtonGroup, Group, PanelHeader 
} from "@vkontakte/vkui";
import { FC } from "react";

const MainPage: FC<NavIdProps> = ({ nav }) => {
    if (Session.user === null) {
        return (
            <Panel nav={nav}>
                <Placeholder
                    stretched
                    icon={<Icon56Users3Outline />}
                    header="REA ACS"
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
                                onClick={() => push("/?popout=account-not-created")}
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
            <PanelHeader>REA ACS</PanelHeader>
            <Group>
                <Placeholder
                    stretched
                    icon={<Icon56Users3Outline />}
                    header={Session.user.role}
                >
                    {Session.user.surname} {Session.user.name} {Session.user.patronymic}
                </Placeholder>
            </Group>
        </Panel>
    );
};

export default MainPage;
