

import {
    Button,
    ButtonGroup,
    Div,
    PanelHeaderButton,
    unstable_Popover as Popover,
    useAdaptivityWithJSMediaQueries,
} from "@vkontakte/vkui";

import {
    Icon28ComputerOutline,
    Icon28MoonOutline,
    Icon28SmartphoneOutline,
    Icon28SunOutline,
} from "@vkontakte/icons";

import Session from "@/TS/store/Session";
import useForceUpdate from "@/hooks/useForceUpdate";

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
