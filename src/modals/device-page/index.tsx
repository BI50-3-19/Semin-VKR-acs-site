import Session from "@/TS/store/Session";
import {
    Button,
    CellButton,
    FormItem,
    FormLayout,
    Group,
    Input,
    ModalPage,
    ModalPageHeader,
    NavIdProps,
    Placeholder,
    ScreenSpinner,
    Select,
    SimpleCell,
    Spinner,
    Switch,
    Textarea
} from "@vkontakte/vkui";
import { observer } from "mobx-react";
import {
    FC,
    useEffect,
    useMemo, useState
} from "react";

import api from "@/TS/api";
import { IAreasGetListItemResponse } from "@/TS/api/sections/areas";
import { IDeviceGetListItemResponse } from "@/TS/api/sections/devices";
import session from "@/TS/store/Session";

const DeviceModalPage: FC<
    NavIdProps & { dynamicContentHeight: boolean }
> = ({ id }) => {
    const { device } = useMemo<{
        device: IDeviceGetListItemResponse;
    }>(() => Session.cache.get("modal-device-page"), [Session.cache.trigger]);

    const [isLoad, setIsLoad] = useState(true);
    const [showDescription, setShowDescription] = useState(device.description !== undefined);
    const [showIP, setShowIP] = useState(device.ip !== undefined);

    const [areas, setAreas] = useState<IAreasGetListItemResponse[]>([]);

    const [title, setTitle] = useState(device.title);
    const [description, setDescription] = useState(device.description || "");
    const [ip, setIp] = useState("");
    const [nextAreaId, setNextAreaId] = useState<number | null>(device.nextAreaId);
    const [prevAreaId, setPrevAreaId] = useState<number | null>(device.prevAreaId);
    const [isEnabled, setIsEnabled] = useState(device.isEnabled);

    useEffect(() => {
        void api.areas.getList().then((areas) => {
            setAreas(areas);
            setIsLoad(false);
        });
    }, []);

    const onSaveButtonClick = () => {
        session.setPopout(<ScreenSpinner state="loading" />);
        
        return api.devices.edit({
            id: device.id,
            isEnabled,
            nextAreaId,
            prevAreaId,
            title,
            description,
            ip
        }).then(() => {
            session.setPopout(<ScreenSpinner state="done" />, 1000);
        }).catch(() => {
            session.setPopout(<ScreenSpinner state="error" />, 1000);
        });
    };

    return (
        <ModalPage
            id={id}
            dynamicContentHeight
        >
            <ModalPageHeader
                separator={false}
            >
                Устройство
            </ModalPageHeader>
            {isLoad ? (
                <Group>
                    <Placeholder>
                        <Spinner size="large" />
                    </Placeholder>
                </Group>
            ) : (
                <Group>
                    <FormLayout>
                        <FormItem top="Название">
                            <Input value={title} onChange={(event) => setTitle(event.target.value)} />
                        </FormItem>
                        <FormItem
                            top="Предыдущая зона"
                        >
                            <Select
                                value={prevAreaId ?? undefined}
                                onChange={(event) => {
                                    const prevAreaId = parseInt(event.target.value);
                                    setPrevAreaId(Number.isNaN(prevAreaId) ? null : prevAreaId);
                                }}
                                placeholder="Не выбрана"
                                name="purpose"
                                options={areas.map((area) => {
                                    return {
                                        label: area.title,
                                        value: area.id
                                    };
                                })}
                                allowClearButton
                                searchable
                            />
                        </FormItem>
                        <FormItem
                            top="Следующая зона"
                        >
                            <Select
                                value={nextAreaId ?? undefined}
                                onChange={(event) => {
                                    const nextAreaId = parseInt(event.target.value);
                                    setNextAreaId(Number.isNaN(nextAreaId) ? null : nextAreaId);
                                }}
                                placeholder="Не выбрана"
                                name="purpose"
                                options={areas.map((area) => {
                                    return {
                                        label: area.title,
                                        value: area.id
                                    };
                                })}
                                allowClearButton
                                searchable
                            />
                        </FormItem>
                        {showDescription ? (
                            <FormItem 
                                top="Описание"
                                removable
                                onRemove={() => setShowDescription(false)}
                            >
                                <Textarea value={description} onChange={(event) => setDescription(event.target.value)} />
                            </FormItem>
                        ) : (
                            <CellButton onClick={() => setShowDescription(true)}>Указать описание</CellButton>
                        )}
                        {showIP ? (
                            <FormItem 
                                top="IP-адрес"
                                removable
                                onRemove={() => setShowIP(false)}
                            >
                                <Input value={ip} onChange={(event) => setIp(event.target.value)}/>
                            </FormItem>
                        ) : (
                            <CellButton onClick={() => setShowIP(true)}>Установить ограничение по IP</CellButton>
                        )}
                        <SimpleCell Component="label" after={<Switch checked={isEnabled} onChange={() => setIsEnabled(!isEnabled)} />}>
                            Устройство включено
                        </SimpleCell>
                        <FormItem>
                            <Button size="l" stretched onClick={onSaveButtonClick}>
                                Сохранить
                            </Button>
                        </FormItem>
                    </FormLayout>
                </Group>
            )} 
        </ModalPage>
    );
};

export default observer(DeviceModalPage);
