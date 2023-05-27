import { FC } from "react";

import {
    NavIdProps, Panel, PanelHeader 
} from "@vkontakte/vkui";

import Session from "@/TS/store/Session";

import CreateSecuritySession from "./CreateSession";
import { observer } from "mobx-react";
import SecuritySessionPage from "./Session";

const SecurityPage: FC<NavIdProps> = ({ nav }) => {
    return (
        <Panel nav={nav}>
            <PanelHeader separator={false}>Охрана</PanelHeader>
            {Session.securitySession === null && <CreateSecuritySession />}
            {Session.securitySession !== null && <SecuritySessionPage session={Session.securitySession}/>}
        </Panel>
    );
};

export default observer(SecurityPage);
