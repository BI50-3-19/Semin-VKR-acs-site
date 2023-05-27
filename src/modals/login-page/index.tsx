import api from "@/TS/api";
import APIError from "@/TS/api/error";
import { IAuthByTempKeyParams } from "@/TS/api/sections/auth";
import Session from "@/TS/store/Session";
import Storage from "@/TS/store/Storage";
import QRReader from "@/components/QRReader";
import useForceUpdate from "@/hooks/useForceUpdate";
import { Icon28QrCodeOutline } from "@vkontakte/icons";
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
import { observer } from "mobx-react";
import {
    FC, useMemo, useState
} from "react";

const LoginModalPage: FC<
    NavIdProps & { dynamicContentHeight: boolean }
> = ({ id }) => {
    const [isLoad, setIsLoad] = useState(false);
    const [has2FA, set2FA] = useState(false);
    const [byQRCode, setByQRCode] = useState(false);

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [twoFactorCode, set2FACode] = useState("");

    const forceUpdate = useForceUpdate();

    const isValidFields = useMemo(() => {
        if (login === "" || password === "") {
            return false;
        }

        if (has2FA && twoFactorCode.length !== 6) {
            return false;
        } 

        return true;
    }, [login, password, has2FA, twoFactorCode]);

    const authByLoginPass = async (): Promise<void> => {
        setIsLoad(true);
        
        try {
            const response = await api.auth.init({
                login,
                password,
                otp: twoFactorCode !== "" ? twoFactorCode : undefined
            });
            Storage.setTokens(response);
            await Session.load();
            Session.setView("/");
            setIsLoad(false);
        } catch (error) {
            if (error instanceof APIError) {
                if (error.code === 4) {
                    Session.setModal("error-card", {
                        message: "Неверный логин или пароль",
                    });
                } else if (error.code === 5) {
                    set2FA(true);
                    setIsLoad(false);
                } else if (error.code === 6) {
                    Session.setModal("error-card",{
                        message: "Неверный OTP код"
                    });
                } else {
                    Session.setModal("error-card",{
                        message: "Неизвестная ошибка"
                    });
                }
            } else {
                Session.setModal("error-card", {
                    message: "Неизвестная ошибка"
                });
            }
        }
    };

    const authByQR = async (qrInfo: IAuthByTempKeyParams): Promise<void> => {
        setIsLoad(true);

        try {
            const response = await api.auth.byTempKey(qrInfo);
            Storage.setTokens(response);
            await Session.load();
            Session.setView("/");
            setIsLoad(false);
            Session.setModal(null);
        } catch (error) {
            if (error instanceof APIError) {
                if (error.code === 4) {
                    Session.setModal("error-card",{
                        message: "Срок действия кода уже истёк",
                    });
                } else {
                    Session.setModal("error-card",{
                        message: "Неизвестная ошибка"
                    });
                }
            } else {
                Session.setModal("error-card",{
                    message: "Неизвестная ошибка"
                });
            }
        }
    };

    return (
        <ModalPage
            id={id}
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
                    {!byQRCode &&(
                        <FormLayout onSubmit={!isValidFields ? authByLoginPass : undefined}>
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
                                    onClick={authByLoginPass}
                                    disabled={!isValidFields}
                                >
                                Войти
                                </Button>
                            </FormItem>
                        </FormLayout>
                    )}

                    {byQRCode && <QRReader 
                        scanInterval={250}
                        onResult={(result) => {
                            const QRInfo = JSON.parse(result) as Record<string, unknown>;

                            if (!("userId" in QRInfo) || !("key" in QRInfo) || !("sign" in QRInfo)) {
                                Session.setModal("error-card",{
                                    message: "Неверный QR"
                                });
                            } else {
                                if (isLoad) {
                                    return;
                                } else {
                                    setByQRCode(false);
                                    return authByQR(QRInfo as unknown as IAuthByTempKeyParams);
                                }
                                
                            }
                        }}
                        onResize={forceUpdate}
                    />}

                    {login === "" && password === "" && (
                        <FormItem>
                            <Button 
                                before={!byQRCode && <Icon28QrCodeOutline />}
                                size="l"
                                stretched 
                                onClick={() => setByQRCode(!byQRCode)}
                            >
                                {byQRCode ? "Войти по логину и паролю" : "Войти через QR-код"}
                            </Button>
                        </FormItem>
                    )}
                </Group>
            )}
        </ModalPage>
    );
};

export default observer(LoginModalPage);
