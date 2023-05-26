import { FC } from "react";
import { back } from "@itznevikat/router";
import {
    Alert, NavIdProps, useAdaptivityWithJSMediaQueries 
} from "@vkontakte/vkui";

export const AccountNotCreated: FC<NavIdProps> = () => {
    const { isDesktop } = useAdaptivityWithJSMediaQueries();

    return (
        <Alert
            onClose={back}
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
