import { AppearanceType } from "@vkontakte/vk-bridge";
import { makeAutoObservable } from "mobx";
import { IUsersGetResponse } from "../api/types";
import api from "../api";

class Cache {
    private readonly _values: Record<string, unknown> = {
    };

    constructor() {
        makeAutoObservable(this, undefined, {
            deep: true
        });
    }

    public set(id: string, value: unknown) {
        this._values[id] = value;
    }

    public delete(id: string) {
        delete this._values[id];
    }

    public get<T>(id: string): T {
        return this._values[id] as T;
    }
}

class Session {
    public cache = new Cache();
    public appearance: AppearanceType = "dark";
    public snackbar: JSX.Element | null = null;

    public user: IUsersGetResponse | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    public setAppearance(appearance: AppearanceType) {
        this.appearance = appearance;
    }

    public setSnackbar(snackbar: JSX.Element | null): void {
        this.snackbar = snackbar;
    }

    public async load(): Promise<void> {
        this.user = await api.users.get();
    }
}

export default new Session();
