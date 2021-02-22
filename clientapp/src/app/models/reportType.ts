import { IReportTypeField } from "./reportTypeField";

export interface IReportType {
    id: number;
    title: string;
    fields: IReportTypeField[];
}