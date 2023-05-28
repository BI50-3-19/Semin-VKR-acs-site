import { AppearanceType } from "@vkontakte/vk-bridge";
import { makeAutoObservable } from "mobx";
import api from "../api";
import { IAreasGetListItemResponse } from "../api/sections/areas";
import { ISecurityGetReasonsItemResponse } from "../api/sections/security";
import { IUsersGetResponse } from "../api/types";
import Storage, { TBackupValue } from "./Storage";

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

    public static hasBackup(): number | null {
        return Storage.hasBackup("security-session");
    }

    public static restoreBackup(): SecuritySession {
        const backup = Storage.getBackup<{ 
            nextAreaId: number | null; 
            prevAreaId: number | null; 
            areas: IAreasGetListItemResponse[]; 
            reasons: ISecurityGetReasonsItemResponse[]; 
        }>("security-session");

        if (!backup) {
            throw new Error("Backup not found");
        }

        const securitySession = new SecuritySession(backup.value);

        session.setSecuritySession(securitySession);

        return securitySession;
    }

    public static removeBackup() {
        return Storage.deleteBackup("security-session");
    }

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

        Storage.createBackup("security-session", {
            nextAreaId,
            prevAreaId,
            areas,
            reasons
        } as unknown as TBackupValue);
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

    public setPopout(popout: JSX.Element | null, ms?: number): void {
        this.popout = popout;

        if (ms) {
            setTimeout(() => this.setPopout(null), ms);
        }
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

        if (this.user.hasAvatar) {
            this.cache.set(`user-${this.user.id}-avatar`, await api.users.getAvatar());
        } else {
            this.cache.delete(`user-${this.user.id}-avatar`);
        }
    }

    public reset() {
        this.user = null;
        this.setView("/");
    }
}

export { SecuritySession };

const session = new Session();

export default session;
