import { observable, action, reaction, computed } from "mobx";
import { RootStore } from "./rootStore";

export default class CommonStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    reaction(
      () => this.token,
      (token) => {
        if (token) {
          localStorage.setItem("ps-token", token);
          localStorage.setItem("ps-user-id", this.getUserIdFromToken);
        } else {
          localStorage.removeItem("ps-token");
          localStorage.removeItem("ps-user-id");
        }
      }
    );
  }

  @observable token: string | null = localStorage.getItem("ps-token");
  @observable userId: string | null = localStorage.getItem("ps-user-id");
  @observable appLoaded = false;

  @computed get getUserIdFromToken(): string {
    const tokenObject = this.parseToken(this.token);
    const userId: string = tokenObject.nameid;
    return userId;
  }

  @action setToken = (token: string | null) => {
    this.token = token;
  };

  @action setUserId = (userId: string | null) => {
    this.userId = userId;
  };

  @action setAppLoaded = () => {
    this.appLoaded = true;
  };

  @action parseToken = (token: string | null) => {
    if (token !== null) {
      var base64Url = token.split(".")[1];
      var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      var jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );

      return JSON.parse(jsonPayload);
    }
    return null;
  };

  @action getLocaleDateTime = (dateUtc: Date | undefined): string => {
    if (dateUtc === undefined) return "undefined";
    const currentTimeZoneOffset = dateUtc.getTimezoneOffset() * 60_000;
    const date = new Date(dateUtc.getTime() - currentTimeZoneOffset).toLocaleDateString("en-us");
    const time = new Date(dateUtc.getTime() - currentTimeZoneOffset).toLocaleTimeString();
    return `${date} ${time}`;
  };

  @action getLocaleDateOffset = (dateUtc: Date | undefined): string => {
    if (dateUtc === undefined) return "undefined";
    const currentTimeZoneOffset = dateUtc.getTimezoneOffset() * 60_000;
    const localeDate = new Date(dateUtc.getTime() - currentTimeZoneOffset).toLocaleDateString("en-us");
    return localeDate;
  };
}
