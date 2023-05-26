import { FC } from "react";
import { push, useDeserialized } from "@itznevikat/router";
import {
    Cell, Group, List, SplitCol 
} from "@vkontakte/vkui";

import { TAdaptivityButton } from "./layout";

type TAdaptivitySidebarProps = {
    buttons: TAdaptivityButton[];
};

export const AdaptivitySidebar: FC<TAdaptivitySidebarProps> = ({ buttons }) => {
    const { view } = useDeserialized();

    return (
        <SplitCol fixed width="280px" maxWidth="280px">
            <Group>
                <List>
                    {buttons.map(({ story, icon, text }: TAdaptivityButton) => (
                        <Cell
                            key={story}
                            before={icon}
                            style={
                                view === story
                                    ? {
                                        backgroundColor:
                        "var(--vkui--color_background_secondary)",
                                        borderRadius: 8
                                    }
                                    : {
                                    }
                            }
                            onClick={() => view !== story && push(story)}
                        >
                            {text}
                        </Cell>
                    ))}
                </List>
            </Group>
        </SplitCol>
    );
};
