import { IUsersGetResponse } from "@/TS/api/types";
import { Avatar, RichCell } from "@vkontakte/vkui";

const User = ({ user }: {user: IUsersGetResponse}) => {
    return (
        <RichCell
            before={<Avatar size={48} initials={`${user.surname[0]}${user.name[0]}`} src="" />}
            caption={user.role}
            disabled
        >
            {user.surname} {user.name} {user.patronymic}
        </RichCell>
    );
};

export default User;
