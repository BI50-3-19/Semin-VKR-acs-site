import { push, useMeta } from "@itznevikat/router";
import {
    Button, ModalCard, NavIdProps 
} from "@vkontakte/vkui";
import { FC } from "react";

interface IErrorCardMeta {
    message: string;
}

export const ErrorCard: FC<NavIdProps> = ({ nav }) => {
    const { message } = useMeta<IErrorCardMeta>();

    return (
        <ModalCard
            nav={nav}
            header="Ошибка"
            subheader={message}
            actions={
                <Button
                    size="l"
                    mode="primary"
                    onClick={() =>  push("/")}
                >
                    На главную
                </Button>
            }
        />
    );
};
