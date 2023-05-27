import api from "@/TS/api";
import { IUsersGetResponse } from "@/TS/api/types";
import { Avatar, RichCell } from "@vkontakte/vkui";
import { useEffect, useState } from "react";

const User = ({ user }: {user: IUsersGetResponse}) => {
    const [avatar, setAvatar] = useState<string>();

    useEffect(() => {
        if (user.hasAvatar === false) {
            return;
        }

        void api.users.getAvatar({
            userId: user.id
        }).then(setAvatar);
    }, [user]);
    
    return (
        <RichCell
            before={<Avatar size={48} initials={`${user.surname[0]}${user.name[0]}`} src={avatar} />}
            caption={user.role}
            disabled
        >
            {user.surname} {user.name} {user.patronymic}
        </RichCell>
    );
};

export default User;
