import { IRole } from "./role";

export interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    token: string;
    role: IRole;
}