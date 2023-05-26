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
}

export type { IUsersGetResponse };

export default APIUsers;
