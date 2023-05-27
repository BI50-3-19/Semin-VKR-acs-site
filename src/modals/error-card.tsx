import Session from "@/TS/store/Session";
import {
    Button, ButtonGroup, ModalCard, NavIdProps
} from "@vkontakte/vkui";
import { observer } from "mobx-react";
import { FC, useMemo } from "react";

const ErrorCard: FC<NavIdProps> = ({ id }) => {
    const error = useMemo<{ 
        error?: string; 
        message?: string;
    }>(() => Session.cache.get("modal-error-card"), []);

    return (
        <ModalCard
            id={id}
            header={error?.error || "Ошибка"}
            subheader={error?.message || "Неизвестная ошибка"}
            actions={
                <ButtonGroup gap="m" mode="horizontal" stretched>
                    <Button
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

export default observer(ErrorCard);
