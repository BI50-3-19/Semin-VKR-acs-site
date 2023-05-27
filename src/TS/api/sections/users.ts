import APISection from "../Section";

interface IUsersGetResponse {
    id: number;
    name: string;
    surname: string;
    patronymic?: string;
    role: string;
    mask: number;
    hasAvatar: boolean;
}

class APIUsers extends APISection {
    public get(params?: {
        userId?: number;
    }): Promise<IUsersGetResponse> {
        return this._call("users.get", params);
    }

    public getList(params?: {
        count?: number;
        offset?: number;
    }): Promise<IUsersGetResponse[]> {
        return this._call("users.getList", params);
    }

    public async getAvatar(params?: {
        userId?: number
    }): Promise<string> {
        const response = await this._instance.get<Blob>("users.getAvatar", {
            responseType: "blob",
            params
        });

        return URL.createObjectURL(response.data);
    }
}

export type { IUsersGetResponse };

export default APIUsers;
