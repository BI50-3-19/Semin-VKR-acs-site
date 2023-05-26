import APISection from "../Section";

interface IAuthByTempKeyParams {
    userId: number;
    key: string;
    sign: string;
}

class APIAuth extends APISection {
    public init(params: {
        login: string;
        password: string;
        otp?: string;
    }): Promise<{
        userId: number;
        accessToken: string;
        refreshToken: string;
    }> {
        return this._call("auth.init", params);
    }

    public byTempKey(params: IAuthByTempKeyParams): Promise<{
        userId: number;
        accessToken: string;
        refreshToken: string;
    }> {
        return this._call("auth.byTempKey", params);
    }
}

export type { IAuthByTempKeyParams };

export default APIAuth;
