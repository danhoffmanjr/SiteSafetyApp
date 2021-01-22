import { IProfile } from "./profile";
import { IReport } from "./report";

export interface ISite {
    id: number;
    name: string;
    address: string;
    companyId: number;
    companyName: string;
    notes: string;
    reports?: IReport[];
    users?: IProfile[];
}