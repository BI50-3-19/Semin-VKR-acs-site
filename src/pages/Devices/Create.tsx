import api from "@/TS/api";
import { IAreasGetListItemResponse } from "@/TS/api/sections/areas";
import session from "@/TS/store/Session";
import {
    Button,
    CellButton,
    FormItem,
    FormLayout,
    Group,
    Input,
    NavIdProps,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    Placeholder,
    ScreenSpinner,
    Select,
    SimpleCell,
    Spinner,
    Switch,
    Textarea
} from "@vkontakte/vkui";
import { useEffect, useState } from "react";

const DevicesCreatePage = ({ id }: NavIdProps) => {
    const [isLoad, setIsLoad] = useState(true);
    const [showDescription, setShowDescription] = useState(false);
    const [showIP, setShowIP] = useState(false);

    const [areas, setAreas] = useState<IAreasGetListItemResponse[]>([]);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [ip, setIp] = useState("");
    const [nextAreaId, setNextAreaId] = useState<number | null>(null);
    const [prevAreaId, setPrevAreaId] = useState<number | null>(null);
    const [isEnabled, setIsEnabled] = useState(false);

    useEffect(() => {
        void api.areas.getList().then((areas) => {
            setAreas(areas);
            setIsLoad(false);
        });
    }, []);

    const onAddButtonClick = () => {
        session.setPopout(<ScreenSpinner state="loading" />);
        
        return api.devices.create({
            isEnabled,
            nextAreaId,
            prevAreaId,
            title,
            description: description !== "" ? description : undefined,
            ip: ip !== "" ? ip : undefined
        }).then(() => {
            session.setPopout(<ScreenSpinner state="done" />, 1000);
            session.setPanel("/list");
        }).catch(() => {
            session.setPopout(<ScreenSpinner state="error" />, 1000);
        });
    };

    return (
        <Panel id={id}>
            <PanelHeader 
                separator={false}
                before={<PanelHeaderBack onClick={() => session.setPanel(null)} />}
            >
                Добавление устройства
            </PanelHeader>
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
                            <Button size="l" stretched onClick={onAddButtonClick}>
                                Добавить
                            </Button>
                        </FormItem>
                    </FormLayout>
                </Group>
            )}
        </Panel>
    );
};

export default DevicesCreatePage;
