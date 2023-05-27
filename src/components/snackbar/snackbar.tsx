import {
    Icon20CancelCircleFillRed,
    Icon20CheckCircleFillGreen
} from "@vkontakte/icons";
import {
    Snackbar,
    SnackbarProps,
    useAdaptivityWithJSMediaQueries
} from "@vkontakte/vkui";
import { FC } from "react";

import session from "@/TS/store/Session";
import { observer } from "mobx-react";
import styles from "./snackbar.module.css";

// eslint-disable-next-line @typescript-eslint/naming-convention
type BaseSnackbarProps = Omit<SnackbarProps, "onClose">;

const NativeBaseSnackbar: FC<BaseSnackbarProps> = ({ children, ...rest }) => {
    const { isDesktop } = useAdaptivityWithJSMediaQueries();

    return (
        <Snackbar
            className={!isDesktop ? styles.snackbarMobile : undefined}
            onClose={() => {
                session.snackbar = null;
            }}
            {...rest}
        >
            {children}
        </Snackbar>
    );
};

export const BaseSnackbar: FC<BaseSnackbarProps> = observer(NativeBaseSnackbar);

export const SuccessSnackbar: FC<BaseSnackbarProps> = ({
    children,
    ...rest
}) => (
    <BaseSnackbar
        before={<Icon20CheckCircleFillGreen width={24} height={24} />}
        {...rest}
    >
        {children}
    </BaseSnackbar>
);

export const ErrorSnackbar: FC<BaseSnackbarProps> = ({ children, ...rest }) => (
    <BaseSnackbar
        before={<Icon20CancelCircleFillRed width={24} height={24} />}
        {...rest}
    >
        {children}
    </BaseSnackbar>
);
