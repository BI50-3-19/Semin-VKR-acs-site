import APISection from "../Section";

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
}

export default APIAuth;
