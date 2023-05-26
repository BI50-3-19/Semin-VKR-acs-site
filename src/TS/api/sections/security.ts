import APISection from "../Section";

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
    }): Promise<boolean> {
        return this._call("security.isValidTempKey", params);
    }
}

export default APISecurity;
