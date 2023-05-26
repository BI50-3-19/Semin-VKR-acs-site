import APISection from "../Section";

interface IAccountGetStatsResponse {
    passwordUpdatedAt: Date;
    has2FA: boolean;
}

class APIAccount extends APISection {
    public getStats(): Promise<IAccountGetStatsResponse> {
        return this._call("account.getStats");
    }
}

export type { IAccountGetStatsResponse };

export default APIAccount;
