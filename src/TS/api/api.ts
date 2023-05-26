import axios, { AxiosRequestConfig } from "axios";

import APIError, { IAPIError } from "./error";
import APIAuth from "./sections/auth";

interface IAPIParams {
    apiUrl?: string;
}

class API {
    private readonly _apiUrl: string;

    public readonly auth: APIAuth;

    constructor(options?: IAPIParams) {
        this._apiUrl = options?.apiUrl || "https://acs.rus-anonym-team.ru";

        this.auth = new APIAuth(this);
    }

    public async call<Res = unknown>(
        method: string,
        data?: unknown,
        params?: AxiosRequestConfig
    ): Promise<Res> {
        type TResponse =
            | { response: Res; error: never }
            | { response: never; error: IAPIError };

        const response = await axios<TResponse>({
            ...params,
            method: "POST",
            url: `${this._apiUrl}/${method}`,
            data
        });

        if (response.data.error) {
            throw new APIError(response.data.error);
        } else {
            return response.data.response;
        }
    }
}

export default API;
