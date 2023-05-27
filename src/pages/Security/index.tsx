import { FC } from "react";

import {
    NavIdProps, Panel, PanelHeader
} from "@vkontakte/vkui";

import Session from "@/TS/store/Session";

import { observer } from "mobx-react";
import CreateSecuritySession from "./CreateSession";
import SecuritySessionPage from "./Session";

const SecurityPage: FC<NavIdProps> = ({ id }) => {
    return (
        <Panel id={id}>
            <PanelHeader separator={false}>Охрана</PanelHeader>
            {Session.securitySession === null && <CreateSecuritySession />}
            {Session.securitySession !== null && <SecuritySessionPage session={Session.securitySession}/>}
        </Panel>
    );
};

export default observer(SecurityPage);
