import { ISite } from "./site";

export interface ICompany {
    id: number;
    name: string;
    sites: ISite[];
}