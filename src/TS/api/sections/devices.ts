import APISection from "../Section";

interface IDeviceGetListItemResponse {
    id: number;
    title: string;
    token: string;
    description?: string;
    isEnabled: boolean;
    lastRequestDate: Date;
    nextAreaId: number | null;
    prevAreaId: number | null;
    ip?: string;
}

class APIDevices extends APISection {
    public create(params: {
        title: string;
        description?: string;
        ip?: string;
        prevAreaId: number | null;
        nextAreaId: number | null;
        isEnabled?: boolean;
    }): Promise<1> {
        return this._call("devices.create", params);
    }

    public edit(params: {
        id: number;
        title?: string;
        description?: string;
        ip?: string;
        prevAreaId?: number | null;
        nextAreaId?: number | null;
        isEnabled?: boolean;
    }): Promise<1> {
        return this._call("devices.edit", params);
    }

    public getList(params?: {
        count?: number;
        offset?: number;
    }): Promise<IDeviceGetListItemResponse[]> {
        return this._call("devices.getList", params);
    }
}

export type { IDeviceGetListItemResponse };

export default APIDevices;
