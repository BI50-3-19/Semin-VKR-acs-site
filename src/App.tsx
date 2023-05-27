import {
    AdaptivityProvider,
    AppRoot,
    ConfigProvider,
    Platform,
    ScreenSpinner,
    SplitLayout,
    WebviewType,
    platform
} from "@vkontakte/vkui";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import Session from "./TS/store/Session";
import Layout from "./layout";

import "moment/dist/locale/ru";
import Storage from "./TS/store/Storage";
import "./app.css";

const App = () => {
    const [isLoad, setIsLoad] = useState<boolean>(true);
    const [platform, setPlatform] = useState<Platform>(currentPlatform());

    useEffect(() => {
        function onResize(): void {
            setPlatform(currentPlatform);
        }

        window.addEventListener("resize", onResize, false);
        return () => window.removeEventListener("resize", onResize, false);
    }, []);

    useEffect(() => {
        if (Storage.hasAuthInfo()) {
            Session.load().finally(() => setIsLoad(false));
        } else {
            setIsLoad(false);
        }
    }, []);

    return (
        <ConfigProvider 
            appearance={Session.appearance}
            transitionMotionEnabled={false}
            platform={platform}
            webviewType={WebviewType.INTERNAL}
        >
            <AdaptivityProvider>
                <AppRoot mode="full">
                    {isLoad ? (
                        <SplitLayout popout={<ScreenSpinner state="loading" />} />
                    ) : (
                        <Layout />
                    )}
                </AppRoot>
            </AdaptivityProvider>
        </ConfigProvider>
    );
};

function currentPlatform(): Platform {
    if (window.matchMedia("(orientation: landscape)").matches) {
        return Platform.VKCOM;
    }

    return platform() as Platform;
}

export default observer(App);
