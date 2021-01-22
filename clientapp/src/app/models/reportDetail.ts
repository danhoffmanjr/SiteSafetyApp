import { IKeyValuePair } from "./keyValuePair";

export interface IReportDetail {
    reportId: number;
    company: number;
    formType: string;
    site: number;
    lotNumber: string;
    violationType: string;
    submittedBy: string;
    narrative: string;
    createdAt: Date;
    updatedAt: Date;
    subcontractorCompany: string;
    subcontractorRepresentive: string;
    correctActionTaken: string;
    siteAddress: string;
    companies: IKeyValuePair[];
    sites: IKeyValuePair[];
}