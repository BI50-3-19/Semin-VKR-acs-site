import { IUsersGetResponse } from "@/TS/api/types";
import {
    NavIdProps, Panel, Group, PanelHeader 
} from "@vkontakte/vkui";
import {
    FC, useEffect, useState 
} from "react";
import User from "./User";
import api from "@/TS/api";

const UsersPage: FC<NavIdProps> = ({ nav }) => {
    const [users, setUsers] = useState<IUsersGetResponse[]>([]);

    useEffect(() => {
        void api.users.getList().then(setUsers);
    }, []);

    return (
        <Panel nav={nav}>
            <PanelHeader>Users</PanelHeader>
            <Group>
                {users.map((user) => <User user={user}/>)}
            </Group>
        </Panel>
    );
};

export default UsersPage;
