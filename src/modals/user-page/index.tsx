import api from "@/TS/api";
import { IUsersGetResponse } from "@/TS/api/types";
import Session from "@/TS/store/Session";
import UserProfile from "@/components/UserProfile";
import {
    Alert,
    CellButton,
    Group,
    ModalPage,
    ModalPageHeader,
    NavIdProps,
    PanelHeaderButton,
    Placeholder,
    ScreenSpinner,
    Spinner
} from "@vkontakte/vkui";
import { observer } from "mobx-react";
import {
    FC, Fragment, useEffect, useMemo, useState
} from "react";

import session from "@/TS/store/Session";
import { Icon24ArrowLeftOutline, Icon28DeleteOutline } from "@vkontakte/icons";

const UserModalPage: FC<
    NavIdProps & { dynamicContentHeight: boolean }
> = ({ id }) => {
    const { user: oldUser } = useMemo<{
        user: IUsersGetResponse;
    }>(() => Session.cache.get("modal-user-page"), [Session.cache.trigger]);

    const [user, setUser] = useState<IUsersGetResponse>(oldUser);
    const [isLoad, setIsLoad] = useState(false);

    const [page, setPage] = useState<"main" | "edit">("main");

    useEffect(() => {
        void api.users.get({
            userId: user.id
        }).then(setUser);
    }, []);

    return (
        <ModalPage
            id={id}
            dynamicContentHeight
        >
            <ModalPageHeader
                before={
                    <Fragment>
                        {page !== "main" && (
                            <PanelHeaderButton onClick={() => setPage("main")}>
                                <Icon24ArrowLeftOutline />
                            </PanelHeaderButton>
                        )}
                    </Fragment>
                }
                separator={false}
            >
                Пользователь
            </ModalPageHeader>
            {isLoad ? (
                <Group>
                    <Placeholder>
                        <Spinner size="large" />
                    </Placeholder>
                </Group>
            ) : (
                <>
                    {page === "main" && (
                        <Group>
                            <UserProfile user={user} />
                        </Group>
                    )}
                    {/* {session.hasAccess("users:manage") && <UserPageEditActions page={page} setPage={setPage}/>} */}
                    <Group>
                        <CellButton before={<Icon28DeleteOutline />} mode="danger" onClick={() => {
                            return session.setPopout(<Alert
                                header="Вы уверены?"
                                text="Для удаления пользователя, необходимо подтвердить действие"
                                actions={[
                                    {
                                        title: "Отмена",
                                        autoClose: true,
                                        mode: "cancel"
                                    },
                                    {
                                        title: "Подтвердить",
                                        mode: "destructive",
                                        action: (): void => {
                                            session.setPopout(<ScreenSpinner state="loading" />);

                                            api.users.delete({
                                                userId: user.id
                                            }).then(() => {
                                                session.setPopout(<ScreenSpinner state="done" />, 1000);
                                                session.setModal(null);
                                            }).catch(() => {
                                                session.setPopout(<ScreenSpinner state="error" />, 1000);
                                            });
                                        }
                                    }
                                ]}
                                onClose={() => session.setPopout(null)}
                            />);
                        }}>
                            Удалить аккаунт
                        </CellButton>
                    </Group>
                </>
            )} 
        </ModalPage>
    );
};

export default observer(UserModalPage);
