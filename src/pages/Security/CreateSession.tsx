import api from "@/TS/api";
import { IAreasGetListItemResponse } from "@/TS/api/sections/areas";
import Session, { SecuritySession } from "@/TS/store/Session";
import {
    Button,
    FormItem, FormLayout, FormLayoutGroup, FormStatus, Group, Placeholder, Select, Spinner 
} from "@vkontakte/vkui";
import { useEffect, useState } from "react";

const CreateSecuritySession = () => {
    const [areas, setAreas] = useState<IAreasGetListItemResponse[] | null>(null);

    const [nextAreaId, setNextAreaId] = useState<number | null>(null);
    const [prevAreaId, setPrevAreaId] = useState<number | null>(null);

    useEffect(() => {
        void api.areas.getList().then(setAreas);
    }, []);

    if (areas === null) {
        return (
            <Group>
                <Placeholder>
                    <Spinner size="large" />
                </Placeholder>
            </Group>
        );
    }

    return (
        <Group>
            <FormStatus mode="default">
                Для начала сессии, необходимо указать охраняемые зоны
            </FormStatus>
            <FormLayout>
                <FormLayoutGroup mode="horizontal">
                    <FormItem
                        top="Предыдущая зона"
                    >
                        <Select
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
                </FormLayoutGroup>
                <FormItem>
                    <Button 
                        size="l" 
                        stretched 
                        disabled={prevAreaId === nextAreaId}
                        onClick={() => {
                            Session.setSecuritySession(new SecuritySession(nextAreaId, prevAreaId, areas));
                        }}
                    >
                        Продолжить
                    </Button>
                </FormItem>
            </FormLayout>
        </Group>
    );
};

export default CreateSecuritySession;