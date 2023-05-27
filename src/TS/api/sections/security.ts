import APISection from "../Section";

interface ISecurityCheckAccessToAreaResponse {
    isAllow: boolean;
    isAreaLocked: boolean
}

interface ISecurityGetReasonsItemResponse {
    id: number;
    title: string;
}

class APISecurity extends APISection {
    public getTempKey(): Promise<{
        key: string;
        sign: string;
        expireIn: number;
    }> {
        return this._call("security.getTempKey");
    }

    public isValidTempKey(params: {
        userId: number;
        key: string;
        sign: string;
    }): Promise<{
        status: true
    } | {
        status: false; 
        reason: "INVALID_SIGN" | "INVALID_USER_ID" | "EXPIRED";
    }> {
        return this._call("security.isValidTempKey", params);
    }

    public checkAccessToArea(params: {
        userId: number;
        areaId: number;
    }): Promise<ISecurityCheckAccessToAreaResponse> {
        return this._call("security.checkAccessToArea", params);
    }

    public allowAccessToArea(params: {
        userId: number;
        nextAreaId: number | null;
        prevAreaId: number | null;
        direction: "next" | "prev"
    }): Promise<boolean> {
        return this._call("security.allowAccessToArea", params);
    }

    public denyAccessToArea(params: {
        userId: number;
        nextAreaId: number | null;
        prevAreaId: number | null;
        direction: "next" | "prev";
        reasonId?: number;
        comment?: string;
    }): Promise<boolean> {
        return this._call("security.denyAccessToArea", params);
    }

    public getReasons(): Promise<ISecurityGetReasonsItemResponse[]> {
        return this._call("security.getReasons");
    }

    public createReason(params: { title: string }): Promise<1> {
        return this._call("security.createReason", params);
    }

    public deleteReason(params: { id: number }): Promise<1> {
        return this._call("security.deleteReason", params);
    }
}

export type { ISecurityCheckAccessToAreaResponse, ISecurityGetReasonsItemResponse };

export default APISecurity;
