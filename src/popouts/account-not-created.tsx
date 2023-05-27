import { FC } from "react";
import {
    Alert, NavIdProps, useAdaptivityWithJSMediaQueries 
} from "@vkontakte/vkui";
import Session from "@/TS/store/Session";

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
