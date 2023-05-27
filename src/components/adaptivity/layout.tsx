import {
    FC, useEffect, useState 
} from "react";
import {
    Epic,
    PanelHeader,
    SplitCol,
    SplitLayout,
    SplitLayoutProps,
    useAdaptivityWithJSMediaQueries
} from "@vkontakte/vkui";

import AdaptivitySidebar from "./sidebar";
import { AdaptivityTabbar } from "./tabbar";

import session from "@/TS/store/Session";
import { observer } from "mobx-react";
import { autorun, toJS } from "mobx";
import Session from "@/TS/store/Session";

export type TAdaptivityButton = {
  story: string;
  icon: JSX.Element;
  text: string;
};

type TAdaptivityLayoutProps = SplitLayoutProps & {
  buttons: TAdaptivityButton[];
};

const AdaptivityLayout: FC<TAdaptivityLayoutProps> = ({
    children,
    buttons,
    ...rest
}) => {
    const { isDesktop } = useAdaptivityWithJSMediaQueries();

    const [snackbar, setSnackbar] = useState<JSX.Element | null>(null);

    useEffect(() => {
        return autorun(() => {
            if (session.snackbar === null) {
                setSnackbar(null);
            } else {
                setSnackbar(toJS(session.snackbar));
            }
        });
    }, []);

    return (
        <SplitLayout
            header={!isDesktop && <PanelHeader separator={false} />}
            style={{
                justifyContent: "center"
            }}
            {...rest}
        >
            {isDesktop && buttons.length > 0 && (
                <AdaptivitySidebar buttons={buttons} />
            )}

            <SplitCol
                autoSpaced
                animate={!isDesktop}
                width={isDesktop ? "650px" : "100%"}
                maxWidth={isDesktop ? "650px" : "100%"}
            >
                <Epic
                    activeStory={Session.activeView}
                    tabbar={
                        !isDesktop &&
                            buttons.length > 0 && <AdaptivityTabbar buttons={buttons} />
                    }
                >
                    {children}
                </Epic>

                {snackbar}
            </SplitCol>
        </SplitLayout>
    );
};

export default observer(AdaptivityLayout);
