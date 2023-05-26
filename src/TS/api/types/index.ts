interface IAPIError {
    code: number;
    message: string;
    request_params: {
        key: string;
        value: string;
    }[];
}

export * from "../sections/users";

export type { IAPIError };
