import { makeAutoObservable } from "mobx";

class Storage {
    public userId: number | null;
    public accessToken: string | null;
    public refreshToken: string | null;

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
}

export default new Storage();
