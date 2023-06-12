import { Icon28AddOutline, Icon28DevicesOutline } from "@vkontakte/icons";
import {
    CellButton, Group, NavIdProps, Panel, PanelHeader
} from "@vkontakte/vkui";

import session from "@/TS/store/Session";

const DevicesPage = ({ id }: NavIdProps) => {
    return (
        <Panel id={id}>
            <PanelHeader separator={false}>Устройства контроля доступа</PanelHeader>
            <Group>
                <CellButton 
                    before={<Icon28DevicesOutline />}
                    onClick={() => session.setPanel("/list")}
                >
                    Список устройств
                </CellButton>
                <CellButton 
                    before={<Icon28AddOutline />}
                    onClick={() => session.setPanel("/add")}
                >
                    Добавить устройство
                </CellButton>
            </Group>
        </Panel>
    );
};

export default DevicesPage;
