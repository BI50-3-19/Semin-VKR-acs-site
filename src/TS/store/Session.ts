import { AppearanceType } from "@vkontakte/vk-bridge";
import { makeAutoObservable } from "mobx";
import { IUsersGetResponse } from "../api/types";
import api from "../api";
import Storage from "./Storage";
import { IAreasGetListItemResponse } from "../api/sections/areas";
import { ISecurityGetReasonsItemResponse } from "../api/sections/security";

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

class SecuritySession {
    public nextAreaId: number | null;
    public prevAreaId: number | null;

    public readonly areas: IAreasGetListItemResponse[];
    public readonly reasons: ISecurityGetReasonsItemResponse[];

    constructor({ nextAreaId, prevAreaId, areas, reasons }: { 
        nextAreaId: number | null; 
        prevAreaId: number | null; 
        areas: IAreasGetListItemResponse[]; 
        reasons: ISecurityGetReasonsItemResponse[]; 
    }) {
        this.nextAreaId  = nextAreaId;
        this.prevAreaId = prevAreaId;
        this.areas = areas;
        this.reasons = reasons;
    }

    public get nextArea(): IAreasGetListItemResponse | null {
        return this.areas.find(x => x.id === this.nextAreaId) || null;
    }

    public get prevArea(): IAreasGetListItemResponse | null {
        return this.areas.find(x => x.id === this.prevAreaId) || null;
    }
}

class Session {
    private _appearance: AppearanceType | "auto" = "dark";

    public cache = new Cache();
    public snackbar: JSX.Element | null = null;
    public popout: JSX.Element | null = null;

    public activeModal: string | null = null;
    public activeView = "/";
    public activePanel = "/";

    public user: IUsersGetResponse | null = null;

    public securitySession: SecuritySession | null = null;

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

    public setPopout(popout: JSX.Element | null): void {
        this.popout = popout;
    }

    public setModal(modal: string | null, payload?: unknown): void {
        if (modal !== null && payload) {
            this.cache.set(`modal-${modal}`, payload);
        }
        this.activeModal = modal;
    }

    public setView(view: string | null) {
        this.activeView = view || "/";
        this.setPanel(null);
    }

    public setPanel(panel: string | null) {
        this.activePanel = panel || "/";
    }

    public setSecuritySession(session: SecuritySession | null) {
        this.securitySession = session;
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

    public reset() {
        this.user = null;
        this.setView("/");
    }
}

export { SecuritySession };

export default new Session();
