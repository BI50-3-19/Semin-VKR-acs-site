import APISection from "../Section";

class APISession extends APISection {
    public getNewTokens(params: {
        refreshToken: string;
    }): Promise<{
        userId: number;
        accessToken: string;
        refreshToken: string;
    }> {
        return this._call("session.getNewTokens", params);
    }
}

export default APISession;
