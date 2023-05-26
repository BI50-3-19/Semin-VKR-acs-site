import { FC } from "react";
import { push, useDeserialized } from "@itznevikat/router";
import { Tabbar, TabbarItem } from "@vkontakte/vkui";

import { TAdaptivityButton } from "./layout";

type TAdaptivityTabbarProps = {
    buttons: TAdaptivityButton[];
};

export const AdaptivityTabbar: FC<TAdaptivityTabbarProps> = ({ buttons }) => {
    const { view } = useDeserialized();

    return (
        <Tabbar>
            {buttons.map(({ story, icon, text }: TAdaptivityButton) => (
                <TabbarItem
                    key={story}
                    selected={story === view}
                    text={text}
                    onClick={() => view !== story && push(story)}
                >
                    {icon}
                </TabbarItem>
            ))}
        </Tabbar>
    );
};
