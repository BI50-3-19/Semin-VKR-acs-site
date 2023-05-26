import {
    FC, useMemo, useState 
} from "react";
import {
    Button,
    FormItem,
    FormLayout,
    Group,
    Input,
    ModalPage,
    NavIdProps,
    Placeholder,
    Spinner
} from "@vkontakte/vkui";
import api from "@/TS/api";
import { replace } from "@itznevikat/router";
import APIError from "@/TS/api/error";
import Storage from "@/TS/store/Storage";
import Session from "@/TS/store/Session";

export const LoginModalPage: FC<
  NavIdProps & { dynamicContentHeight: boolean }
> = ({ nav }) => {
    const [isLoad, setIsLoad] = useState(false);
    const [has2FA, set2FA] = useState(false);

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [twoFactorCode, set2FACode] = useState("");

    const isValidFields = useMemo(() => {
        if (login === "" || password === "") {
            return false;
        }

        if (has2FA && twoFactorCode.length !== 6) {
            return false;
        } 

        return true;
    }, [login, password, has2FA, twoFactorCode]);

    const onSubmit = async (): Promise<void> => {
        setIsLoad(true);
        
        try {
            const response = await api.auth.init({
                login,
                password,
                otp: twoFactorCode !== "" ? twoFactorCode : undefined
            });
            Storage.setTokens(response);
            await Session.load();
            setIsLoad(false);
        } catch (error) {
            if (error instanceof APIError) {
                if (error.code === 4) {
                    replace("/?modal=error-card", {
                        message: "Неверный логин или пароль",
                    });
                } else if (error.code === 5) {
                    set2FA(true);
                    setIsLoad(false);
                } else if (error.code === 6) {
                    replace("/?modal=error-card", {
                        message: "Неверный OTP код"
                    });
                }
            } else {
                replace("/?modal=error-card", {
                    message: "Неизвестная ошибка"
                });
            }
        }
    };

    return (
        <ModalPage
            nav={nav}
            dynamicContentHeight
        >
            {isLoad ? (
                <Group>
                    <Placeholder>
                        <Spinner size="large" />
                    </Placeholder>
                </Group>
            ) : (
                <Group>
                    <FormLayout onSubmit={!isValidFields ? onSubmit : undefined}>
                        {!has2FA ? (
                            <>
                                <FormItem top="Логин">
                                    <Input 
                                        type="text" 
                                        placeholder="Введите логин" 
                                        value={login} 
                                        onChange={(event) => setLogin(event.target.value)}
                                    />
                                </FormItem>
                                <FormItem top="Пароль">
                                    <Input 
                                        type="password" 
                                        placeholder="Введите пароль"
                                        value={password} 
                                        onChange={(event) => setPassword(event.target.value)}
                                    />
                                </FormItem>
                            </>
                        ) : (
                            <>
                                <FormItem top="2FA">
                                    <Input 
                                        maxLength={6}
                                        type="text" 
                                        placeholder="Введите код" 
                                        value={twoFactorCode} 
                                        onChange={(event) => set2FACode(event.target.value)}
                                    />
                                </FormItem>
                            </>
                        )}
                        
                        <FormItem>
                            <Button 
                                size="l" 
                                stretched 
                                onClick={onSubmit}
                                disabled={!isValidFields}
                            >
                                Войти
                            </Button>
                        </FormItem>
                    </FormLayout>
                </Group>
            )}
        </ModalPage>
    );
};
