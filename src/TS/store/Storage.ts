import { makeAutoObservable } from "mobx";

class Storage {
    public userId: number | null;
    public accessToken: string | null;
    public refreshToken: string | null;

    public readonly accessRights = {
        "users:get": 1 << 0,
        "users:manage": 1 << 1,
        "schedules": 1 << 2,
        "roles": 1 << 3,
        "groups": 1 << 4,
        "areas": 1 << 5,
        "devices": 1 << 6,
        "security": 1 << 7,
        "security:reasons": 1 << 8
    } as const;

    constructor() {
        makeAutoObservable(this);

        this.userId = Number(localStorage.getItem("userId"));
        this.accessToken = localStorage.getItem("accessToken");
        this.refreshToken = localStorage.getItem("refreshToken");
    }

    public setUserId(userId: number) {
        this.userId = userId;
        localStorage.setItem("userId", userId.toString());
    }

    public setAccessToken(accessToken: string): void {
        this.accessToken = accessToken;
        localStorage.setItem("accessToken", accessToken);
    }

    public setRefreshToken(refreshToken: string): void {
        this.refreshToken = refreshToken;
        localStorage.setItem("refreshToken", refreshToken);
    }

    public setTokens({
        userId,
        accessToken,
        refreshToken
    }: {
        userId: number;
        accessToken: string; 
        refreshToken: string;
    }) {
        this.setUserId(userId);
        this.setAccessToken(accessToken);
        this.setRefreshToken(refreshToken);
    }

    public hasAuthInfo(): this is {
        userId: number;
        accessToken: string;
        refreshToken: string;
        } {
        return this.accessToken !== null && this.refreshToken !== null && this.userId !== null;
    }

    public reset(): void {
        this.userId = null;
        localStorage.removeItem("userId");

        this.accessToken = null;
        localStorage.removeItem("accessToken");

        this.refreshToken = null;
        localStorage.removeItem("refreshToken");
    }
}

export default new Storage();
