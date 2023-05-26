import { Icon56CameraOffOutline } from "@vkontakte/icons";
import {
    Group, Placeholder, Div 
} from "@vkontakte/vkui";
import { useState, useEffect } from "react";
import { QrScanner } from "@yudiel/react-qr-scanner";

const QRReader = ({ onResult, onResize }:{ 
    onResult: (value: string) => void; 
    onResize: () => void;
}) =>{
    const [hasError, setHasError] = useState<boolean>(false);

    useEffect(onResize, [hasError]);

    if (hasError) {
        return (
            <Group>
                <Placeholder
                    icon={<Icon56CameraOffOutline />}
                >
                    Для запуска необходимо предоставить доступ к камере
                </Placeholder>
            </Group>
        );
    }

    return (
        <Div>
            <QrScanner
                containerStyle={{
                    borderRadius: "15px"
                }}
                scanDelay={0}
                onResult={(result) => onResult(result.getText())}
                onError={() => setHasError(true)}
            />
        </Div>
    );
};

export default QRReader;