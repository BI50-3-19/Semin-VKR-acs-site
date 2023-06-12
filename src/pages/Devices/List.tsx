import api from "@/TS/api";
import { IDeviceGetListItemResponse } from "@/TS/api/sections/devices";
import session from "@/TS/store/Session";
import {
    Group,
    NavIdProps, Panel, PanelHeader, PanelHeaderBack, Placeholder, RichCell, ScreenSpinner, Spinner, Switch
} from "@vkontakte/vkui";
import { useEffect, useState } from "react";

const Device = ({ device }: {device: IDeviceGetListItemResponse}) => {
    const [isEnabled, setStatus] = useState(device.isEnabled);

    const onSwitchClick = async () => {
        const newStatus = !isEnabled;

        session.setPopout(<ScreenSpinner state="loading" />);

        await api.devices.edit({
            id: device.id,
            isEnabled: newStatus
        }).then(() => {
            setStatus(newStatus);
            session.setPopout(<ScreenSpinner state="done" />, 1000);
        }).catch(() => {
            session.setPopout(<ScreenSpinner state="error" />, 1000);
        });
    };

    return (
        <RichCell 
            after={<Switch checked={isEnabled} onChange={onSwitchClick} />}
            caption={device.description}
            onClick={() => session.setModal("device-page", {
                device
            })}
        >
            {device.title}
        </RichCell>
    );
};

const DevicesPageList = ({ id }: NavIdProps) => {
    const [isLoad, setIsLoad] = useState(true);

    const [devices, setDevices] = useState<IDeviceGetListItemResponse[]>([]);

    useEffect(() => {
        void api.devices.getList().then((devices) =>{
            setDevices(devices);
            setIsLoad(false); 
        });
    },[]);

    return (
        <Panel id={id}>
            <PanelHeader 
                separator={false}
                before={<PanelHeaderBack onClick={() => session.setPanel(null)} />}
            >
                Список устройств
            </PanelHeader>
            <Group>
                {isLoad ? (
                    <Placeholder>
                        <Spinner size="large"/>
                    </Placeholder>
                ) : devices.map(device => <Device device={device} />)}
            </Group>
        </Panel>
    );
};

export default DevicesPageList;
