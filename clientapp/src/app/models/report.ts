import { IReportField } from "./reportField";
import { IReportImage } from "./reportImage";

export interface IReport {
    id: number;
    title: string;
    reportType: string;
    reportTypeId: number;
    reportFields: IReportField[];
    companyId: number;
    companyName: string;
    siteId: number;
    siteName: string;
    createdBy: string;
    createdOn: Date;
    updatedBy: string;
    updatedOn: Date;
    isComplete: boolean;
    isActive: boolean;
    images: IReportImage[];
}