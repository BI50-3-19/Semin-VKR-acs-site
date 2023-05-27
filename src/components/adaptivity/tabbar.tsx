import { FC } from "react";
import { Tabbar, TabbarItem } from "@vkontakte/vkui";

import { TAdaptivityButton } from "./layout";
import Session from "@/TS/store/Session";

type TAdaptivityTabbarProps = {
    buttons: TAdaptivityButton[];
};

export const AdaptivityTabbar: FC<TAdaptivityTabbarProps> = ({ buttons }) => {
    return (
        <Tabbar>
            {buttons.map(({ story, icon, text }: TAdaptivityButton) => (
                <TabbarItem
                    key={story}
                    selected={story === Session.activeView}
                    text={text}
                    onClick={() => Session.activeView !== story && Session.setView(story)}
                >
                    {icon}
                </TabbarItem>
            ))}
        </Tabbar>
    );
};
