import {
    useRef, useState, useEffect 
} from "react";

import QRCodeGenerator from "qrcode";
import {
    Group, Placeholder, Button, ButtonGroup, Spinner 
} from "@vkontakte/vkui";
import { Icon28QrCodeOutline } from "@vkontakte/icons";


import api from "@/TS/api";
import Session from "@/TS/store/Session";

const QRCode = () => {
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

        await QRCodeGenerator.toCanvas(
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
                        Сгенерируйте QR-код по которому вы сможете авторизоваться
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
    );
};

export default QRCode;
