import api from "@/TS/api";
import { IAreasGetListItemResponse } from "@/TS/api/sections/areas";
import { ISecurityCheckAccessToAreaResponse } from "@/TS/api/sections/security";
import { IUsersGetResponse } from "@/TS/api/types";
import Session, { SecuritySession } from "@/TS/store/Session";
import utils from "@rus-anonym/web-utils";
import { Icon28ArrowRightOutline, Icon28ArrowLeftOutline } from "@vkontakte/icons";
import {
    Alert,
    Avatar,
    Button,
    ButtonGroup,
    CellButton,
    Div,
    FormItem,
    FormLayout,
    FormStatus,
    Group, 
    IconButton, 
    Placeholder, 
    ScreenSpinner, 
    Select, 
    Separator, 
    SimpleCell, 
    Spacing, 
    Spinner, 
    Textarea, 
    Title 
} from "@vkontakte/vkui";
import { useEffect, useState } from "react";

const SecurityUserInfo = ({ session, userId, back, direction, directionSubtitle, setDirection, nextArea, prevArea }: { 
    session: SecuritySession;
    userId: number; 
    back: () => void; 
    direction: "prev" | "next";
    directionSubtitle: string;
    setDirection: (direction: "prev" | "next") => void;
    nextArea: IAreasGetListItemResponse | null;
    prevArea: IAreasGetListItemResponse | null;
}) => {
    const [user, setUser] = useState<IUsersGetResponse | null>(null);
    const [access, setAccess] = useState<ISecurityCheckAccessToAreaResponse | null>(null);

    const [isForceAction, setIsForceAction] = useState<boolean>(false);
    const [isForceActionTimeout, setIsForceActionTimeout] = useState<boolean>(false);

    const [reasonId, setReasonId] = useState<number>();
    const [comment, setComment] = useState<string>();

    useEffect(() => {
        void api.users.get({
            userId
        }).then(setUser);
    }, []);

    useEffect(() => {
        setAccess(null);
        setIsForceAction(false);
        if (nextArea) {
            void api.security.checkAccessToArea({
                userId,
                areaId: nextArea.id
            }).then(setAccess);
        } else {
            setAccess({
                isAllow: true,
                isAreaLocked: false
            });
        }
    }, [direction]);

    useEffect(() => {
        if (!isForceAction) {
            setIsForceActionTimeout(false);
            return;
        }
        setIsForceActionTimeout(true);

        const timeout = setTimeout(() => {
            setIsForceActionTimeout(false);
        }, 1500);

        return () => clearTimeout(timeout);
    }, [isForceAction]);

    if (user === null || access === null) {
        return (
            <Group>
                <Placeholder>
                    <Spinner size="large" />
                </Placeholder>
            </Group>
        );
    }

    const onACSResponse = async (response: boolean) => {
        if (response) {
            Session.setPopout(<ScreenSpinner state="done" />);
        } else {
            Session.setPopout(<Alert
                header="Ошибка"
                text="Система отклонила проход"
                actions={[
                    {
                        title: "Закрыть",
                        autoClose: true,
                        mode: "cancel"
                    }
                ]}
                onClose={() => Session.setPopout(null)}
            />);
        }

        if (response) {
            await utils.sleep(1500);
            Session.setPopout(null);
        }
    };

    const onAllowClick = async () => {
        if (!access.isAllow && !isForceAction) {
            setIsForceAction(true);
            return;
        }

        Session.setPopout(<ScreenSpinner state="loading" />);

        const response = await api.security.allowAccessToArea({
            userId,
            nextAreaId: nextArea === null ? null : nextArea.id,
            prevAreaId: prevArea === null ? null : prevArea.id,
            direction
        });
        back();

        return onACSResponse(response);
    };

    const onDenyClick = async () => {
        if (access.isAllow && !isForceAction) {
            setIsForceAction(true);
            return;
        }

        Session.setPopout(<ScreenSpinner state="loading" />);

        const response = await api.security.denyAccessToArea({
            userId,
            nextAreaId: nextArea === null ? null : nextArea.id,
            prevAreaId: prevArea === null ? null : prevArea.id,
            direction,
            comment,
            reasonId
        });
        back();

        return onACSResponse(response);
    };

    return (
        <Group>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center"
                }}
            >
                <Avatar size={72} initials={`${user.surname[0]}${user.name[0]}`} src="" />
                <Title
                    style={{
                        marginBottom: 8, marginTop: 20, fontSize: 24 
                    }}
                    level="3"
                    weight="2"
                >
                    {user.surname} {user.name} {user.patronymic}
                </Title>
                {user.role}
            </div>
            {access.isAllow === false && (
                <FormStatus header="У пользователя нет доступа к зоне" mode="error" />
            )}
            <SimpleCell 
                disabled
                subtitle={directionSubtitle}
                after={
                    <IconButton
                        onClick={() => setDirection(direction === "next" ? "prev" : "next")}
                    >
                        {direction === "next" ? <Icon28ArrowRightOutline /> : <Icon28ArrowLeftOutline />}
                    </IconButton>
                }
            >
                Направление движения:
            </SimpleCell>
            {isForceAction && access.isAllow && (
                <FormLayout>
                    <FormItem
                        top="Причина отказа"
                    >
                        <Select
                            onChange={(event) => {
                                const reasonId = parseInt(event.target.value);
                                setReasonId(Number.isNaN(reasonId) ? undefined : reasonId);
                            }}
                            placeholder="Не выбрана"
                            name="purpose"
                            options={session.reasons.map((area) => {
                                return {
                                    label: area.title,
                                    value: area.id
                                };
                            })}
                            allowClearButton
                            searchable
                        />
                    </FormItem>
                    <FormItem top="Комментарий">
                        <Textarea 
                            placeholder="Дополнительная информация о причине недопуска" 
                            onChange={(event) => {
                                if (event.target.value !== "") {
                                    setComment(event.target.value);
                                } else {
                                    setComment(undefined);
                                }
                            }}
                        />
                    </FormItem>
                </FormLayout>
            )}
            <Div>
                <ButtonGroup stretched mode="horizontal">
                    <Button 
                        stretched 
                        size="l" 
                        appearance={access.isAllow ? "negative" : "positive"}
                        disabled={access.isAllow && isForceActionTimeout}
                        onClick={onDenyClick}
                    >
                        {(isForceActionTimeout && access.isAllow) ? "Вы уверены?" : "Отказать"}
                    </Button>
                    <Button 
                        stretched 
                        size="l" 
                        appearance={access.isAllow ? "positive" : "negative"}
                        disabled={!access.isAllow && isForceActionTimeout}
                        onClick={onAllowClick}
                    >
                        {(isForceActionTimeout && !access.isAllow) ? "Вы уверены?" : "Разрешить"}
                    </Button>
                </ButtonGroup>
            </Div>
            <Spacing />
            <Separator />
            <Spacing />
            <CellButton onClick={back}>
                Назад
            </CellButton>
        </Group>
    );
};

export default SecurityUserInfo;
