import APISection from "../Section";

interface IAreasGetListItemResponse {
    id: number;
    title: string;
    isLocked: boolean;
}

class APIAreas extends APISection {
    public getList(): Promise<IAreasGetListItemResponse[]> {
        return this._call("areas.getList");
    }
}

export type { IAreasGetListItemResponse };

export default APIAreas;
