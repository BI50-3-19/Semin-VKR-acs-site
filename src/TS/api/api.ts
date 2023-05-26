import axios, { AxiosRequestConfig } from "axios";

import APIError, { IAPIError } from "./error";

import APIAuth from "./sections/auth";
import APISession from "./sections/session";
import APIUsers from "./sections/users";
import APISecurity from "./sections/security";

import Storage from "../store/Storage";


interface IAPIParams {
    apiUrl?: string;
}

class API {
    private readonly _apiUrl: string;

    public readonly auth: APIAuth;
    public readonly session: APISession;
    public readonly users: APIUsers;
    public readonly security: APISecurity;

    constructor(options?: IAPIParams) {
        this._apiUrl = options?.apiUrl || "https://acs.rus-anonym-team.ru";

        this.auth = new APIAuth(this);
        this.session = new APISession(this);
        this.users = new APIUsers(this);
        this.security = new APISecurity(this);
    }

    public async call<Res = unknown>(
        method: string,
        data: unknown = {
        },
        params?: AxiosRequestConfig
    ): Promise<Res> {
        type TResponse =
            | { response: Res; error: never }
            | { response: never; error: IAPIError };

        const response = await axios<TResponse>({
            ...params,
            headers: Storage.hasAuthInfo() ? {
                "Authorization": `Bearer ${Storage.accessToken}`
            } : undefined,
            method: "POST",
            url: `${this._apiUrl}/${method}`,
            data
        });

        if (response.data.error) {
            if (response.data.error.code === 30 && Storage.hasAuthInfo()) {
                const response = await this.session.getNewTokens({
                    refreshToken: Storage.refreshToken
                });
                Storage.setTokens(response);
                return this.call(method, data, params);
            }

            throw new APIError(response.data.error);
        } else {
            return response.data.response;
        }
    }
}

export default API;
