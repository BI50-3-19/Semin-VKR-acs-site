import {
    Cell, Group, List, PanelHeader,
    SplitCol
} from "@vkontakte/vkui";
import { observer } from "mobx-react";
import { FC } from "react";

import { TAdaptivityButton } from "./layout";

type TAdaptivitySidebarProps = {
    buttons: TAdaptivityButton[];
};

import Session from "@/TS/store/Session";
import HeaderLeftButtons from "./header-buttons";

const AdaptivitySidebar: FC<TAdaptivitySidebarProps> = ({ buttons }) => {
    return (
        <SplitCol fixed width="280px" maxWidth="280px">
            <PanelHeader separator before={<HeaderLeftButtons />}>
                { /* // Logo?? */ }
            </PanelHeader>
            <Group>
                <List>
                    {buttons.map(({ story, icon, text }: TAdaptivityButton) => (
                        <Cell
                            key={story}
                            before={icon}
                            style={
                                Session.activeView === story
                                    ? {
                                        backgroundColor:
                        "var(--vkui--color_background_secondary)",
                                        borderRadius: 8
                                    }
                                    : {
                                    }
                            }
                            onClick={() => Session.activeView !== story && Session.setView(story)}
                        >
                            {text}
                        </Cell>
                    ))}
                </List>
            </Group>
        </SplitCol>
    );
};

export default observer(AdaptivitySidebar);
