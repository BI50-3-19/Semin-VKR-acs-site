import api from "@/TS/api";
import { IAccountGetStatsResponse } from "@/TS/api/sections/account";
import { ISessionsGetActiveItemResponse } from "@/TS/api/sections/sessions";
import { IUsersGetResponse } from "@/TS/api/types";
import Session from "@/TS/store/Session";
import {
    Icon28KeyOutline, 
    Icon28CheckShieldDeviceOutline, 
    Icon28DevicesOutline 
} from "@vkontakte/icons";
import {
    Group, 
    Avatar, 
    Title,
    SimpleCell,
    Spacing,
    Spinner
} from "@vkontakte/vkui";
import moment from "moment";
import { useEffect, useState } from "react";

const Profile = ({ user }: {user: IUsersGetResponse}) => {
    const [sessions, setSessions] = useState<ISessionsGetActiveItemResponse[] | null>(null);
    const [stats, setStats] = useState<IAccountGetStatsResponse | null>(null);

    useEffect(() => {
        void api.sessions.getActive().then(setSessions);
        void api.account.getStats().then(setStats);
    }, []);

    return  (
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
                <Avatar size={96} initials={`${user.surname[0]}${user.name[0]}`} src="" />
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
            <Spacing />
            {/* <Spinner size="small" style={{ margin: '20px 0' }} /> */}
            <SimpleCell 
                indicator={stats === null ? 
                    <Spinner size="small" /> : 
                    moment(stats.passwordUpdatedAt).fromNow()} 
                before={<Icon28KeyOutline />}
            >
                    Пароль
            </SimpleCell>
            <SimpleCell 
                indicator={stats === null ? <Spinner size="small" /> : (
                    stats.has2FA ? "Включено" : "Отключено"
                )} 
                before={<Icon28CheckShieldDeviceOutline />}
            >
                    Подтверждение входа
            </SimpleCell>
            <SimpleCell
                onClick={() => Session.setModal("sessions-list", {
                    list: sessions
                })}
                indicator={sessions === null ? <Spinner size="small" /> : sessions.length} 
                before={<Icon28DevicesOutline />}
            >
                    Управление сессиями
            </SimpleCell>
        </Group>
    );
};

export default Profile;
