import {
    Alert,
    Button,
    ButtonGroup,
    CellButton,
    FormItem,
    FormLayout,
    Group,
    IconButton,
    Input,
    NavIdProps, Panel, PanelHeader, PanelHeaderBack, Placeholder, ScreenSpinner, SimpleCell, Spinner
} from "@vkontakte/vkui";
import { observer } from "mobx-react";
import {
    FC, useEffect, useState
} from "react";

import api from "@/TS/api";
import APIError from "@/TS/api/error";
import { ISecurityGetReasonsItemResponse } from "@/TS/api/sections/security";
import Session from "@/TS/store/Session";
import { Icon28AddOutline, Icon28DeleteOutline } from "@vkontakte/icons";

const Reason = ({ reason, onDelete }: { reason: ISecurityGetReasonsItemResponse; onDelete: () => void; }) => {
    return (
        <SimpleCell disabled after={
            <IconButton onClick={onDelete}>
                <Icon28DeleteOutline />
            </IconButton>
        }>
            {reason.title}
        </SimpleCell>
    );
};

const SecurityReasonsPage: FC<NavIdProps> = ({ id }) => {
    const [reasons, setReasons] = useState<ISecurityGetReasonsItemResponse[] | null>(null);
    const [isAdditionMode, setIsAdditionMode] = useState(false);

    const [newReason, setNewReason] = useState("");

    useEffect(() => {
        void api.security.getReasons().then(setReasons);
    }, []);

    const deleteReason = async (reasonId: number) => {
        if (reasons === null) {
            return;
        }
        
        Session.setPopout(<ScreenSpinner state="loading" />);

        try {
            await api.security.deleteReason({
                id: reasonId
            });

            setReasons(reasons.filter(x => x.id !== reasonId));

            Session.setPopout(<ScreenSpinner state="done" />, 1000);
        } catch (error) {
            if (!(error instanceof APIError)) {
                return Session.setModal("error-card");
            }
            Session.setPopout(null);

            if (error.code === 29) {
                return Session.setModal("error-card", {
                    error: "Ошибка при удалении",
                    message: "Сначала необходимо удалить все логи связанные с данной причиной"
                });
            }

            return Session.setModal("error-card");
        }
    };

    const onClickAddNewReason = async () => {
        Session.setPopout(<ScreenSpinner state="loading" />);

        try {
            await api.security.createReason({
                title: newReason
            });

            await api.security.getReasons().then(setReasons);

            Session.setPopout(<ScreenSpinner state="done" />, 1000);
            setIsAdditionMode(false);
            setNewReason("");
        } catch (error) {
            if (!(error instanceof APIError)) {
                return Session.setModal("error-card");
            }
            Session.setPopout(null);

            if (error.code === 28) {
                return Session.setModal("error-card", {
                    error: "Ошибка при добавлении",
                    message: "Такая причина уже существует"
                });
            }

            return Session.setModal("error-card");
        }
    };

    return (
        <Panel id={id}>
            <PanelHeader 
                separator={false}
                before={<PanelHeaderBack onClick={() => Session.setPanel(null)} />}
            >
                Причины недопуска
            </PanelHeader>
            <Group>
                {!isAdditionMode && reasons === null && (
                    <Placeholder>
                        <Spinner size="large" />
                    </Placeholder>
                )}
                {!isAdditionMode && reasons !== null && (
                    <CellButton before={<Icon28AddOutline />} onClick={() => setIsAdditionMode(true)}>
                        Добавить новую причину
                    </CellButton>
                )}
                {!isAdditionMode && reasons !== null && reasons.map((reason) => {
                    return (
                        <Reason 
                            reason={reason} 
                            onDelete={() => {
                                Session.setPopout(
                                    <Alert
                                        actions={[
                                            {
                                                title: "Удалить",
                                                mode: "destructive",
                                                autoClose: true,
                                                action: () => void deleteReason(reason.id)
                                            },
                                            {
                                                title: "Отмена",
                                                autoClose: true,
                                                mode: "cancel"
                                            },
                                        ]}
                                        actionsLayout="vertical"
                                        onClose={() => Session.setPopout(null)}
                                        header="Подтвердите действие"
                                        text="Вы уверены, что хотите удалить причину?"
                                    />
                                );
                            }}
                        />
                    );
                })}
                {isAdditionMode && (
                    <FormLayout>
                        <FormItem top="Введите причину">
                            <Input value={newReason} onChange={(event) => setNewReason(event.target.value)}/>
                        </FormItem>
                        <FormItem>
                            <ButtonGroup mode="vertical" stretched>
                                <Button size="l" stretched disabled={newReason.length === 0} onClick={onClickAddNewReason}>
                                    Добавить
                                </Button>
                                <Button size="l" stretched appearance="neutral" onClick={() => setIsAdditionMode(false)}>
                                    Отменить
                                </Button>
                            </ButtonGroup>
                        </FormItem>
                    </FormLayout>
                )}
            </Group>
        </Panel>
    );
};

export default observer(SecurityReasonsPage);
