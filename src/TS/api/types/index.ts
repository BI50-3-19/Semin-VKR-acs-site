interface IAPIError {
    code: number;
    message: string;
    request_params: {
        key: string;
        value: string;
    }[];
}

export type { IAPIError };
