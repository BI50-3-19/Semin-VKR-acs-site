import api from "@/TS/api";
import { ISessionsGetActiveItemResponse } from "@/TS/api/sections/sessions";
import Session from "@/TS/store/Session";
import {
    Icon24DoorArrowLeftOutline,
    Icon28DoorArrowLeftOutline
} from "@vkontakte/icons";
import {
    CellButton,
    Group,
    IconButton,
    ModalPage,
    ModalPageHeader,
    NavIdProps,
    Placeholder,
    RichCell,
    Separator,
    Spinner
} from "@vkontakte/vkui";
import { observer } from "mobx-react";
import moment from "moment";
import {
    FC, useEffect, useMemo, useState
} from "react";

const SessionCell = ({ session, onChangeList }: {session: ISessionsGetActiveItemResponse; onChangeList: () => void;}) => {
    return (
        <RichCell 
            disabled
            multiline
            after={
                <IconButton
                    onClick={() => {
                        void api.sessions.destroy({
                            id: session.id
                        }).then(onChangeList);
                    }}
                >
                    <Icon24DoorArrowLeftOutline />
                </IconButton>
            }
            subhead={`Создана: ${moment(session.createdAt).format("DD.MM.YYYY, HH:mm:ss")}`}
            caption={`Последнее посещение: ${moment(session.lastUsedAt).format("DD.MM.YYYY, HH:mm:ss")}`}
        />
    );
};

const SessionsPage: FC<
    NavIdProps & { dynamicContentHeight: boolean }
> = ({ id }) => {
    const { list } = useMemo<{
        list?: ISessionsGetActiveItemResponse[];
    }>(() => Session.cache.get("modal-sessions-list"), [Session.cache.trigger]);

    const [sessions, setSessions] = useState<ISessionsGetActiveItemResponse[] | null>(list || null);

    useEffect(() => {
        void api.sessions.getActive().then(setSessions);
    }, []);

    return (
        <ModalPage
            id={id}
            dynamicContentHeight
        >
            <ModalPageHeader>Управление сессиями</ModalPageHeader>
            {sessions === null ? (
                <Group>
                    <Placeholder>
                        <Spinner size="large" />
                    </Placeholder>
                </Group>
            ) : sessions.map((session) => {
                return (<SessionCell 
                    session={session} 
                    onChangeList={() => {
                        setSessions(null);
                        void api.sessions.getActive().then(setSessions);
                    }} 
                />);
            })}
            <Separator wide/>
            <CellButton
                mode="danger"
                onClick={() => {
                    setSessions(null);
                    void api.sessions.reset().then(() => {
                        void api.sessions.getActive().then(setSessions);
                    });
                }}
                expandable
                before={<Icon28DoorArrowLeftOutline />}
            >
                Сбросить все сессии кроме текущей
            </CellButton>
        </ModalPage>
    );
};

export default observer(SessionsPage);
