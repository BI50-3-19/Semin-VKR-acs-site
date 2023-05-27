import { replace, useMeta } from "@itznevikat/router";
import {
    Button, ButtonGroup, ModalCard, NavIdProps 
} from "@vkontakte/vkui";
import { FC } from "react";

interface IErrorCardMeta {
    message?: string;
    prevPath?: string;
}

export const ErrorCard: FC<NavIdProps> = ({ nav }) => {
    const { message, prevPath } = useMeta<IErrorCardMeta>();

    return (
        <ModalCard
            nav={nav}
            header="Ошибка"
            subheader={message || "Неизвестная ошибка"}
            actions={
                <ButtonGroup gap="m" mode="horizontal" stretched>
                    {prevPath !== undefined && (
                        <Button
                            size="m"
                            mode="primary"
                            onClick={() => replace(prevPath)}
                        >
                            Назад
                        </Button>
                    )}
                    <Button
                        size="m"
                        mode="primary"
                        onClick={() => replace("/")}
                    >
                        На главную
                    </Button>
                </ButtonGroup>
            }
        />
    );
};
