import api from "@/TS/api";
import Session from "@/TS/store/Session";
import { push } from "@itznevikat/router";
import { Icon28QrCodeOutline, Icon56Users3Outline } from "@vkontakte/icons";
import QRCode from "qrcode";

import {
    Button,
    ButtonGroup, Group,
    NavIdProps, Panel,
    PanelHeader,
    Placeholder,
    Spinner
} from "@vkontakte/vkui";

import {
    FC,
    useEffect,
    useRef,
    useState
} from "react";
import Profile from "./Profile";

const MainPage: FC<NavIdProps> = ({ nav }) => {
    if (Session.user === null) {
        return (
            <Panel nav={nav}>
                <Placeholder
                    stretched
                    icon={<Icon56Users3Outline />}
                    header="REA ACS"
                    action={
                        <ButtonGroup mode="vertical">
                            <Button 
                                size="l" 
                                stretched
                                onClick={() => push("?modal=login-page")}
                            >Войти в аккаунт</Button>
                            <Button 
                                size="l" 
                                stretched 
                                mode="secondary"
                                appearance="overlay"
                                onClick={() => push("/?popout=account-not-created")}
                            >У меня нет аккаунта</Button>
                        </ButtonGroup>
                    }
                >
                Для продолжения работы необходимо авторизоваться
                </Placeholder>
            </Panel>
        );
    }

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const [showQRCode, setShowQRCode] = useState(false);
    const [isCreatingQR, setIsCreatingQR] = useState(true);

    const updateQRCode = async () => {
        if (timerRef.current !== null) {
            clearTimeout(timerRef.current);
        }

        setIsCreatingQR(true);
        const {
            key,
            expireIn,
            sign
        } = await api.security.getTempKey();

        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        timerRef.current = setTimeout(updateQRCode, expireIn - (expireIn * 0.10));

        await QRCode.toCanvas(
            canvasRef.current,
            JSON.stringify({
                userId: Session.user?.id,
                key,
                sign
            })
        );
        setIsCreatingQR(false);
    };

    useEffect(() => {
        if (showQRCode === false && timerRef.current !== null) {
            clearTimeout(timerRef.current);
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [showQRCode]);

    return (
        <Panel nav={nav}>
            <PanelHeader>REA ACS</PanelHeader>
            <Profile user={Session.user}/>
            <Group>
                {!showQRCode && (
                    <Placeholder
                        icon={<Icon28QrCodeOutline width={72} height={72}/>}
                        header="QR-Код"
                        action={
                            <Button
                                size="l"
                                appearance="positive"
                                onClick={() => {
                                    setShowQRCode(true);
                                    void updateQRCode();
                                }}
                            >
                                Сгенерировать
                            </Button>
                        }
                    >
                        Сгенерируйте QR-код по которому вы сможете пройти через КПП!
                    </Placeholder>
                )}
                <Placeholder
                    style={{
                        display: !showQRCode ? "none" : undefined 
                    }}
                    action={showQRCode &&
                    (
                        <ButtonGroup stretched mode="vertical">
                            <Button
                                stretched
                                size="m"
                                appearance="positive"
                                onClick={updateQRCode}
                                disabled={isCreatingQR}
                            >
                                Сгенерировать снова
                            </Button>
                            <Button
                                stretched
                                size="m"
                                appearance="neutral"
                                onClick={() => setShowQRCode(false)}
                            >
                                Закрыть
                            </Button>
                        </ButtonGroup>
                    )
                    }
                >
                    {showQRCode && isCreatingQR && (
                        <Placeholder>
                            <Spinner size="large" />
                        </Placeholder>
                    )}
                    <canvas
                        style={{
                            display: (isCreatingQR || !showQRCode) ? "none" : undefined
                        }} 
                        ref={canvasRef} 
                    />
                </Placeholder>
            </Group>
        </Panel>
    );
};

export default MainPage;
