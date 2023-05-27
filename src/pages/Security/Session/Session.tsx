import {
    FC, useEffect, useMemo, useState
} from "react";

import {
    Button,
    CellButton,
    Group,
    IconButton,
    Placeholder,
    Separator,
    SimpleCell,
    Spacing
} from "@vkontakte/vkui";

import api from "@/TS/api";
import Session, { SecuritySession } from "@/TS/store/Session";
import QRReader from "@/components/QRReader";
import useForceUpdate from "@/hooks/useForceUpdate";
import {
    Icon28ArrowLeftOutline,
    Icon28ArrowRightOutline,
    Icon28DeleteOutline, Icon28QrCodeOutline
} from "@vkontakte/icons";
import SecurityUserInfo from "./User";

const SecuritySessionComponent: FC<{ session: SecuritySession }> = ({ session }) => {
    const [direction, setDirection] = useState<"next" | "prev">("next");
    const [userId, setUserId] = useState<number | null>(null);

    const [isScannerOpen, setIsScannerOpen] = useState<boolean>();

    const [endSessionConfirm, setEndSessionConfirm] = useState<boolean>(false);

    const forceUpdate = useForceUpdate();

    const { prevArea, nextArea } = useMemo(() => {
        const prevArea = direction === "next" ? session.prevArea : session.nextArea;
        const nextArea = direction === "next" ? session.nextArea : session.prevArea;

        return {
            prevArea, 
            nextArea
        };
    }, [direction]);

    const directionSubtitle = useMemo(() => {
        if (prevArea === null) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return `С улицы в ${nextArea!.title}`;
        }

        if (nextArea === null) {
            return `Из ${prevArea.title} на улицу`;
        }

        return `Из ${prevArea.title} в ${nextArea.title}`;
    }, [direction]);

    useEffect(() => {
        if (!endSessionConfirm) {
            return;
        }

        const timeout = setTimeout(() => setEndSessionConfirm(false), 5000);

        return () => clearTimeout(timeout);
    }, [endSessionConfirm]);

    if (userId !== null) {
        return (
            <SecurityUserInfo
                session={session}
                userId={userId}
                back={() => setUserId(null)}
                nextArea={nextArea}
                prevArea={prevArea}
                direction={direction}
                directionSubtitle={directionSubtitle}
                setDirection={setDirection}
            />
        );
    }

    if (isScannerOpen) {
        return (
            <Group>
                <QRReader 
                    scanInterval={100}
                    onResult={async (result) => {
                        try {
                            const QRInfo = JSON.parse(result) as Record<string, unknown>;

                            if (
                                typeof QRInfo["userId"] !== "number" ||
                                typeof QRInfo["key"] !== "string" ||
                                typeof QRInfo["sign"] !== "string"
                            ) {
                                throw new Error("QR code invalid");
                            } else {
                                const status = await api.security.isValidTempKey({
                                    userId: QRInfo["userId"],
                                    key: QRInfo["key"],
                                    sign: QRInfo["sign"]
                                });

                                if (status.status) {
                                    setUserId(QRInfo["userId"]);
                                } else {
                                    switch (status.reason) {
                                        case "EXPIRED":
                                            Session.setModal("security-error-card", {
                                                message: "Неверный код",
                                                description: "Срок действия кода истёк"
                                            });
                                            break;
                                        case "INVALID_SIGN":
                                            Session.setModal("security-error-card", {
                                                message: "Неверная подпись",
                                                description: "Вероятно код подделан"
                                            });
                                            break;
                                        case "INVALID_USER_ID":
                                            Session.setModal("security-error-card", {
                                                message: "Неверный ID пользователя",
                                                description: "Вероятно код подделан"
                                            });
                                            break;
                                    }
                                }
                            }
                        } catch (error) {
                            Session.setModal("security-error-card", {
                                message: "Неверный QR",
                                description: "QR не принадлежит системе"
                            });
                        } finally {
                            setIsScannerOpen(false);
                        }
                    }}
                    onResize={forceUpdate}
                />
                <Placeholder 
                    action={
                        <Button size="l" onClick={() => setIsScannerOpen(false) }>
                            Назад
                        </Button>
                    } 
                />
            </Group>
        );
    }

    return (
        <Group>
            <SimpleCell 
                disabled
                after={
                    <IconButton onClick={() => setDirection(direction === "next" ? "prev" : "next")}>
                        {direction === "next" ? <Icon28ArrowRightOutline /> : <Icon28ArrowLeftOutline />}
                    </IconButton>
                }
                subtitle={directionSubtitle}
            >
                Направление движения: 
            </SimpleCell>
            <CellButton before={<Icon28QrCodeOutline />} onClick={() => setIsScannerOpen(true)}>
                Сканировать QR-код
            </CellButton>
            <Spacing />
            <Separator />
            <Spacing />
            <CellButton before={<Icon28DeleteOutline />} mode="danger" onClick={
                () => {
                    if (endSessionConfirm) {
                        SecuritySession.removeBackup();
                        Session.setSecuritySession(null);
                    } else {
                        setEndSessionConfirm(true);
                    }
                }
            }>
                {endSessionConfirm ? "Вы уверены?" : "Закончить сессию"}
            </CellButton>
        </Group>
    );
};

export default SecuritySessionComponent;
