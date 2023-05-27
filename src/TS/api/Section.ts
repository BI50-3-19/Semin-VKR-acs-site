import { AxiosInstance } from "axios";
import API from "./api";

class APISection {
    protected readonly _instance: AxiosInstance;

    protected readonly _api: API;
    protected readonly _call: API["call"];

    constructor(api: API) {
        this._api = api;
        this._call = this._api.call.bind(api);
        this._instance = api["_instance"];
    }
}

export default APISection;
