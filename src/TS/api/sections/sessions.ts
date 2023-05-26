import APISection from "../Section";

interface ISessionsGetActiveItemResponse {
    id: string;
    lastUsedAt: Date;
    createdAt: Date;
}

class APISessions extends APISection {
    public getNewTokens(params: {
        refreshToken: string;
    }): Promise<{
        userId: number;
        accessToken: string;
        refreshToken: string;
    }> {
        return this._call("sessions.getNewTokens", params);
    }

    public getActive(): Promise<ISessionsGetActiveItemResponse[]> {
        return this._call("sessions.getActive");
    }

    public getTempKey(): Promise<{
        key: string;
        sign: string;
        expireIn: number;
    }> {
        return this._call("sessions.getTempKey");
    }

    public destroy(params: {
        id: string;
    }): Promise<boolean> {
        return this._call("sessions.destroy", params);
    }

    public reset(): Promise<boolean> {
        return this._call("sessions.reset");
    }
}

export type { ISessionsGetActiveItemResponse };

export default APISessions;
