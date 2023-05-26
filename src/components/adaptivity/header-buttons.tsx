
import React, { useState } from "react";

import {
    Button,
    ButtonGroup,
    Div,
    PanelHeaderButton,
    useAdaptivityWithJSMediaQueries,
} from "@vkontakte/vkui";
import {  unstable_Popover as Popover } from "@vkontakte/vkui";

import {
    Icon28MoonOutline,
    Icon28SunOutline,
    Icon28ComputerOutline,
    Icon28SmartphoneOutline,
} from "@vkontakte/icons";

import { observer } from "mobx-react";
import Session from "@/TS/store/Session";

const useForceUpdate = (): (() => void) => {
    const [value, setValue] = useState(false);
    return () => setValue(!value);
};

const HeaderLeftButtons = (): JSX.Element => {
    const { isDesktop } = useAdaptivityWithJSMediaQueries();

    const forceUpdate = useForceUpdate();

    const DropdownContent = (): JSX.Element => {
        const prefersColorScheme =
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light";

        return (
            <Div>
                <ButtonGroup mode="vertical" gap="s" stretched>
                    <Button
                        size="m"
                        disabled={Session["_appearance"] === "dark"}
                        stretched
                        before={<Icon28MoonOutline />}
                        onClick={(): void => {
                            Session.setAppearance("dark");
                            forceUpdate();
                        }}
                    >
                        Тёмная
                    </Button>
                    <Button
                        size="m"
                        disabled={Session["_appearance"] === "light"}
                        stretched
                        before={<Icon28SunOutline />}
                        onClick={(): void => {
                            Session.setAppearance("light");
                            forceUpdate();
                        }}
                    >
                        Светлая
                    </Button>
                    <Button
                        size="m"
                        disabled={Session["_appearance"] === "auto"}
                        stretched
                        before={
                            isDesktop ? (
                                <Icon28ComputerOutline />
                            ) : (
                                <Icon28SmartphoneOutline />
                            )
                        }
                        onClick={(): void => {
                            Session.setAppearance("auto");
                            forceUpdate();
                        }}
                    >
                        Системная ({prefersColorScheme === "dark" ? "Тёмная" : "Светлая"})
                    </Button>
                </ButtonGroup>
            </Div>
        );
    };

    return (
        <>
            <Popover
                action={isDesktop ? "hover" : "click"}
                content={<DropdownContent />}
            >
                <PanelHeaderButton
                    hasActive={!isDesktop}
                    hasHover={false}
                >
                    {Session.appearance === "light" ? (
                        <Icon28SunOutline />
                    ) : (
                        <Icon28MoonOutline />
                    )}
                </PanelHeaderButton>
            </Popover>
        </>
    );
};

export default HeaderLeftButtons;
