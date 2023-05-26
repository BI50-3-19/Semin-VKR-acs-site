import {
    FC, useEffect, useRef, useState 
} from "react";
import {
    Button,
    ButtonGroup,
    CellButton,
    Group,
    IconButton,
    ModalPage,
    ModalPageHeader,
    NavIdProps,
    Placeholder,
    RichCell,
    Separator,
    Spinner
} from "@vkontakte/vkui";
import api from "@/TS/api";
import { useMeta } from "@itznevikat/router";
import { ISessionsGetActiveItemResponse } from "@/TS/api/sections/sessions";
import moment from "moment";
import {
    Icon24DoorArrowLeftOutline,
    Icon28DoorArrowLeftOutline,
    Icon28QrCodeOutline 
} from "@vkontakte/icons";
import QRCode from "qrcode";
import Session from "@/TS/store/Session";

const SessionCell = ({ session, onChangeList }: {session: ISessionsGetActiveItemResponse; onChangeList: () => void;}) => {
    return (
        <RichCell 
            disabled
            multiline
            after={
                <IconButton
                    onClick={() => {
                        void api.sessions.destroy({
                            id: session.id
                        }).then(onChangeList);
                    }}
                >
                    <Icon24DoorArrowLeftOutline />
                </IconButton>
            }
            subhead={`Создана: ${moment(session.createdAt).format("DD.MM.YYYY, HH:mm:ss")}`}
            caption={`Последнее посещение: ${moment(session.lastUsedAt).format("DD.MM.YYYY, HH:mm:ss")}`}
        />
    );
};

export const SessionsPage: FC<
    NavIdProps & { dynamicContentHeight: boolean }
> = ({ nav }) => {
    const { list } = useMeta<{
        list?: ISessionsGetActiveItemResponse[];
    }>();

    const [sessions, setSessions] = useState<ISessionsGetActiveItemResponse[] | null>(list || null);

    useEffect(() => {
        void api.sessions.getActive().then(setSessions);
    }, []);

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
        } = await api.sessions.getTempKey();

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
        <ModalPage
            nav={nav}
            dynamicContentHeight
        >
            <ModalPageHeader>Управление сессиями</ModalPageHeader>
            {sessions === null ? (
                <Group>
                    <Placeholder>
                        <Spinner size="large" />
                    </Placeholder>
                </Group>
            ) : sessions.map((session) => {
                return (<SessionCell 
                    session={session} 
                    onChangeList={() => {
                        setSessions(null);
                        void api.sessions.getActive().then(setSessions);
                    }} 
                />);
            })}
            <Separator wide/>
            <CellButton
                style={{
                    display: showQRCode ? "none" : undefined 
                }}
                onClick={() => {
                    setShowQRCode(true);
                    void updateQRCode();
                }}
                expandable
                before={<Icon28QrCodeOutline />}
            >
                Добавить новое устройство через QR-код
            </CellButton>
            <CellButton
                mode="danger"
                style={{
                    display: showQRCode ? "none" : undefined 
                }}
                onClick={() => {
                    setSessions(null);
                    void api.sessions.reset().then(() => {
                        void api.sessions.getActive().then(setSessions);
                    });
                }}
                expandable
                before={<Icon28DoorArrowLeftOutline />}
            >
                Сбросить все сессии кроме текущей
            </CellButton>
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
        </ModalPage>
    );
};
