import api from "@/TS/api";
import { IAreasGetListItemResponse } from "@/TS/api/sections/areas";
import { IUsersGetResponse } from "@/TS/api/types";
import Session, { SecuritySession } from "@/TS/store/Session";
import {
    Avatar,
    Button,
    CellButton,
    FormItem, FormLayout, FormLayoutGroup, FormStatus, Group, Placeholder, Select, Spinner, Title 
} from "@vkontakte/vkui";
import { useEffect, useState } from "react";

const SecurityUserInfo = ({ userId, back }: { userId: number; back: () => void; }) => {
    const [user, setUser] = useState<IUsersGetResponse | null>(null);

    useEffect(() => {
        void api.users.get({
            userId
        }).then(setUser);
    }, []);

    if (user === null) {
        return (
            <Group>
                <Placeholder>
                    <Spinner size="large" />
                </Placeholder>
            </Group>
        );
    }

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

            <CellButton onClick={back}>
                Назад
            </CellButton>
        </Group>
    );
};

export default SecurityUserInfo;
