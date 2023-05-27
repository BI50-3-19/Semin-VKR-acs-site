import {
    NavIdProps, Panel, PanelHeader, PanelHeaderBack
} from "@vkontakte/vkui";
import { observer } from "mobx-react";
import { FC } from "react";

import Session from "@/TS/store/Session";

import CreateSecuritySession from "./CreateSession";
import SecuritySessionComponent from "./Session";

const SecuritySessionPage: FC<NavIdProps> = ({ id }) => {
    return (
        <Panel id={id}>
            <PanelHeader 
                separator={false}
                before={<PanelHeaderBack onClick={() => Session.setPanel(null)} />}
            >Смена</PanelHeader>
            {Session.securitySession === null && <CreateSecuritySession />}
            {Session.securitySession !== null && <SecuritySessionComponent session={Session.securitySession}/>}

        </Panel>
    );
};

export default observer(SecuritySessionPage);
