import Session from "@/TS/store/Session";
import {
    Button, ButtonGroup, ModalCard, NavIdProps
} from "@vkontakte/vkui";
import { observer } from "mobx-react";
import { FC, useMemo } from "react";

interface IErrorCardMeta {
    message: string;
    description: string;
}

const SecurityErrorCard: FC<NavIdProps> = ({ id }) => {
    const { message, description } = useMemo<IErrorCardMeta>(() => Session.cache.get("modal-security-error-card"), [Session.cache.trigger]);

    return (
        <ModalCard
            id={id}
            header={message}
            subheader={description}
            actions={
                <ButtonGroup gap="m" mode="horizontal" stretched>
                    <Button
                        stretched
                        size="m"
                        mode="primary"
                        onClick={() => Session.setModal(null)}
                    >
                        Назад
                    </Button>
                </ButtonGroup>
            }
        />
    );
};

export default observer(SecurityErrorCard);
