import { replace, useMeta } from "@itznevikat/router";
import {
    Button, ButtonGroup, ModalCard, NavIdProps 
} from "@vkontakte/vkui";
import { FC } from "react";

interface IErrorCardMeta {
    message: string;
    description: string;
}

export const SecurityErrorCard: FC<NavIdProps> = ({ nav }) => {
    const { message, description } = useMeta<IErrorCardMeta>();

    return (
        <ModalCard
            nav={nav}
            header={message}
            subheader={description}
            actions={
                <ButtonGroup gap="m" mode="horizontal" stretched>
                    <Button
                        stretched
                        size="m"
                        mode="primary"
                        onClick={() => replace("/security")}
                    >
                        Назад
                    </Button>
                </ButtonGroup>
            }
        />
    );
};
