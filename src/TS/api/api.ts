import axios, { AxiosRequestConfig } from "axios";

import APIError, { IAPIError } from "./error";

import APIAccount from "./sections/account";
import APIAuth from "./sections/auth";
import APISecurity from "./sections/security";
import APISessions from "./sections/sessions";
import APIUsers from "./sections/users";

import Session from "../store/Session";
import Storage from "../store/Storage";

import APIAreas from "./sections/areas";


interface IAPIParams {
    apiUrl?: string;
}

class API {
    private readonly _apiUrl: string;

    public readonly auth: APIAuth;
    public readonly sessions: APISessions;
    public readonly users: APIUsers;
    public readonly security: APISecurity;
    public readonly account: APIAccount;
    public readonly areas: APIAreas;

    constructor(options?: IAPIParams) {
        this._apiUrl = options?.apiUrl || "https://acs.rus-anonym-team.ru";

        this.auth = new APIAuth(this);
        this.sessions = new APISessions(this);
        this.users = new APIUsers(this);
        this.security = new APISecurity(this);
        this.account = new APIAccount(this);
        this.areas = new APIAreas(this);
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
            if (response.data.error.code === 4) {
                Storage.reset();
                Session.reset();
            }

            if (response.data.error.code === 30 && Storage.hasAuthInfo()) {
                const response = await this.sessions.getNewTokens({
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
