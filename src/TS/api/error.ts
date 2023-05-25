import { IAPIError } from "./types";

class APIError extends Error implements IAPIError {
    public readonly code;
    public readonly request_params;

    constructor(error: IAPIError) {
        super(error.message);
        this.code = error.code;
        this.request_params = error.request_params;
        Object.setPrototypeOf(this, APIError.prototype);
    }
}

export type { IAPIError };

export default APIError;
