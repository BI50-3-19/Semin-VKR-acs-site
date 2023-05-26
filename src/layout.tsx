import { FC, useMemo } from "react";
import {
    ModalRoot, View, matchPopout, useParams 
} from "@itznevikat/router";
import {
    Icon28EditOutline,
    Icon28HomeOutline,
    Icon28Profile,
    Icon28ServicesOutline,
    Icon28StatisticsOutline
} from "@vkontakte/icons";
import {
    ScreenSpinner,
    useAdaptivityWithJSMediaQueries
} from "@vkontakte/vkui";

import AdaptivityLayout from "@/components/adaptivity/layout";
import { observer } from "mobx-react";
import MainPage from "./pages/Main";
import { AccountNotCreated } from "./popouts";

const Layout: FC = () => {
    const { popout = null } = useParams();

    const { isDesktop } = useAdaptivityWithJSMediaQueries();

    const buttons = useMemo(() => {
        return [];
    }, []);

    return (
        <AdaptivityLayout
            modal={
                <ModalRoot>
                    
                </ModalRoot>
            }
            popout={matchPopout(popout, [
                <ScreenSpinner id="screen-spinner" />,
                <AccountNotCreated nav="account-not-created" />
            ])}
            buttons={buttons}
        >
            <View nav="/">
                <MainPage nav="/" />
            </View>
        </AdaptivityLayout>
    );
};

export default observer(Layout);
