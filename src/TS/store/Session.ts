import { AppearanceType } from "@vkontakte/vk-bridge";
import { makeAutoObservable } from "mobx";
import { IUsersGetResponse } from "../api/types";
import api from "../api";
import Storage from "./Storage";

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
    private _appearance: AppearanceType | "auto" = "dark";

    public cache = new Cache();
    public snackbar: JSX.Element | null = null;

    public user: IUsersGetResponse | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    public get appearance(): AppearanceType {
        if (this._appearance === "auto") {
            return window.matchMedia &&
                window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light";
        } else {
            return this._appearance;
        }
    }

    public setAppearance(appearance: Session["_appearance"]) {
        this._appearance = appearance;
    }

    public setSnackbar(snackbar: JSX.Element | null): void {
        this.snackbar = snackbar;
    }

    public hasAccess(
        right: keyof typeof Storage["accessRights"]
    ): this is {
        user: IUsersGetResponse;
    } {
        if (this.user === null) {
            return false;
        }

        return Boolean(Storage.accessRights[right] & this.user.mask);
    }

    public async load(): Promise<void> {
        this.user = await api.users.get();
    }
}

export default new Session();
