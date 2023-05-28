import api from "@/TS/api";
import { IUsersGetResponse } from "@/TS/api/types";
import Session from "@/TS/store/Session";
import UserProfile from "@/components/UserProfile";
import {
    Group,
    ModalPage,
    ModalPageHeader,
    NavIdProps,
    Placeholder,
    Spinner
} from "@vkontakte/vkui";
import { observer } from "mobx-react";
import {
    FC, useEffect, useMemo, useState
} from "react";

const UserModalPage: FC<
    NavIdProps & { dynamicContentHeight: boolean }
> = ({ id }) => {
    const { user: oldUser } = useMemo<{
        user: IUsersGetResponse;
    }>(() => Session.cache.get("modal-user-page"), []);

    const [user, setUser] = useState<IUsersGetResponse>(oldUser);
    const [isLoad, setIsLoad] = useState(false);

    useEffect(() => {
        void api.users.get({
            userId: user.id
        }).then(setUser);
    }, []);

    if (isLoad) {
        return (
            <ModalPage
                id={id}
                dynamicContentHeight
            >
                <ModalPageHeader>Пользователь</ModalPageHeader>
                <Group>
                    <Placeholder>
                        <Spinner size="large" />
                    </Placeholder>
                </Group>
            </ModalPage>
        );
    }

    return (
        <ModalPage
            id={id}
            dynamicContentHeight
        >
            <ModalPageHeader>Пользователь</ModalPageHeader>
            <Group>
                <UserProfile user={user} />
            </Group>
        </ModalPage>
    );
};

export default observer(UserModalPage);
