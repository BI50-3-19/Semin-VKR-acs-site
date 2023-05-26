import {
    AdaptivityProvider,
    AppRoot,
    ConfigProvider,
    Platform,
    WebviewType,
    platform
} from "@vkontakte/vkui";
import Session from "./TS/store/Session";
import Layout from "./layout";
import { useEffect, useState } from "react";
import { observer } from "mobx-react";

import "./app.css";

const App = () => {
    const [platform, setPlatform] = useState<Platform>(currentPlatform());

    useEffect(() => {
        function onResize(): void {
            setPlatform(currentPlatform);
        }

        window.addEventListener("resize", onResize, false);
        return () => window.removeEventListener("resize", onResize, false);
    }, []);

    return (
        <ConfigProvider 
            appearance={Session.appearance}
            transitionMotionEnabled={false}
            platform={platform}
            webviewType={WebviewType.VKAPPS}
        >
            <AdaptivityProvider>
                <AppRoot>
                    <Layout />
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
