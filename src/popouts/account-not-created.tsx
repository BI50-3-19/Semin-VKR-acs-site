import Session from "@/TS/store/Session";
import {
    Alert, NavIdProps, useAdaptivityWithJSMediaQueries
} from "@vkontakte/vkui";
import { FC } from "react";

export const AccountNotCreated: FC<NavIdProps> = () => {
    const { isDesktop } = useAdaptivityWithJSMediaQueries();

    return (
        <Alert
            onClose={() => Session.setPopout(null)}
            actions={!isDesktop ? [
                {
                    title: "Закрыть",
                    autoClose: true,
                    mode: "cancel"
                }
            ] : undefined}
            header="Требуется аккаунт"
            text="Для создания аккаунта, либо получения пароля обратитесь в бюро пропусков"
        />
    );
};
