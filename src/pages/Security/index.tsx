import { FC } from "react";

import { Icon28CheckShieldOutline, Icon28ListNumberOutline } from "@vkontakte/icons";
import {
    CellButton,
    Group,
    NavIdProps, Panel, PanelHeader
} from "@vkontakte/vkui";

import Session from "@/TS/store/Session";
import { observer } from "mobx-react";

const SecurityPage: FC<NavIdProps> = ({ id }) => {
    return (
        <Panel id={id}>
            <PanelHeader separator={false}>Охрана</PanelHeader>
            <Group>
                <CellButton 
                    before={<Icon28CheckShieldOutline />}
                    onClick={() => Session.setPanel("/session")}
                >
                    Смена
                </CellButton>
                {Session.hasAccess("security:reasons") && (
                    <CellButton 
                        before={<Icon28ListNumberOutline />}
                        onClick={() => Session.setPanel("/reasons")}
                    >
                        Причины недопуска
                    </CellButton>
                )}
            </Group>
        </Panel>
    );
};

export default observer(SecurityPage);
