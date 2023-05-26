import { Icon56Users3Outline } from "@vkontakte/icons";
import {
    NavIdProps, Panel, Button, Placeholder, ButtonGroup 
} from "@vkontakte/vkui";
import { FC } from "react";

const MainPage: FC<NavIdProps> = ({ nav }) => {
    return (
        <Panel nav={nav}>
            <Placeholder
                stretched
                icon={<Icon56Users3Outline />}
                header="REA ACS"
                action={
                    <ButtonGroup mode="vertical">
                        <Button size="l" stretched>Войти в аккаунт</Button>
                        <Button 
                            size="l" 
                            stretched 
                            mode="secondary"
                            appearance="overlay"
                        >У меня нет аккаунта</Button>
                    </ButtonGroup>
                }
            >
                Для продолжения работы необходимо авторизоваться
            </Placeholder>
        </Panel>
    );
};

export default MainPage;
