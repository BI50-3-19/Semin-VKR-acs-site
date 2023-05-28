import { Avatar, Title } from "@vkontakte/vkui";
import { useEffect, useState } from "react";

import api from "@/TS/api";
import { IUsersGetResponse } from "@/TS/api/types";
import Session from "@/TS/store/Session";
import { observer } from "mobx-react";

const UserProfile = ({ user }: { user: IUsersGetResponse; }) => {
    const [avatar, setAvatar] = useState<string>();

    useEffect(() => {
        if (user.hasAvatar === false) {
            return;
        }

        if (user.id === Session.user?.id) {
            setAvatar(Session.cache.get(`user-${user.id}-avatar`));
        }

        void api.users.getAvatar({
            userId: user.id
        }).then(setAvatar);
    }, [user]);
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center"
            }}
        >
            <Avatar size={96} initials={`${user.surname[0]}${user.name[0]}`} src={avatar} />
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
    );
};

export default observer(UserProfile);
