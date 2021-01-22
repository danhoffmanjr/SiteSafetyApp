import { IReport } from "./report";
import { ISite } from "./site";

export interface IProfile
{
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    companyName: string;
    companyId: number;
    role: string;
    isActive: boolean;
    contactPhoneNumber?: string;
    reports?: IReport[] | null;
    sites?: ISite[] | null;
}