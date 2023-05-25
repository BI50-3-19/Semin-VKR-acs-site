import API from "./api";

class APISection {
    protected readonly _api: API;
    protected readonly _call: API["call"];

    constructor(api: API) {
        this._api = api;
        this._call = this._api.call.bind(api);
    }
}

export default APISection;
