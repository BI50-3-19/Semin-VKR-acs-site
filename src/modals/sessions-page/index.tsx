import {
    FC, useEffect, useState 
} from "react";
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
import api from "@/TS/api";
import { useMeta } from "@itznevikat/router";
import { ISessionsGetActiveItemResponse } from "@/TS/api/sections/sessions";
import moment from "moment";
import {
    Icon24DoorArrowLeftOutline,
    Icon28DoorArrowLeftOutline
} from "@vkontakte/icons";

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

export const SessionsPage: FC<
    NavIdProps & { dynamicContentHeight: boolean }
> = ({ nav }) => {
    const { list } = useMeta<{
        list?: ISessionsGetActiveItemResponse[];
    }>();

    const [sessions, setSessions] = useState<ISessionsGetActiveItemResponse[] | null>(list || null);

    useEffect(() => {
        void api.sessions.getActive().then(setSessions);
    }, []);

    return (
        <ModalPage
            nav={nav}
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
