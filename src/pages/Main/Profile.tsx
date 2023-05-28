import api from "@/TS/api";
import { IAccountGetStatsResponse } from "@/TS/api/sections/account";
import { ISessionsGetActiveItemResponse } from "@/TS/api/sections/sessions";
import { IUsersGetResponse } from "@/TS/api/types";
import Session from "@/TS/store/Session";
import UserProfile from "@/components/UserProfile";
import {
    Icon28CheckShieldDeviceOutline,
    Icon28DevicesOutline,
    Icon28KeyOutline
} from "@vkontakte/icons";
import {
    Group,
    SimpleCell,
    Spacing,
    Spinner
} from "@vkontakte/vkui";
import moment from "moment";
import {
    useEffect,
    useState
} from "react";

const Profile = ({ user }: {user: IUsersGetResponse}) => {
    const [sessions, setSessions] = useState<ISessionsGetActiveItemResponse[] | null>(null);
    const [stats, setStats] = useState<IAccountGetStatsResponse | null>(null);

    useEffect(() => {
        void api.sessions.getActive().then(setSessions);
        void api.account.getStats().then(setStats);
    }, []);

    return  (
        <Group>
            <UserProfile user={user} />
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
