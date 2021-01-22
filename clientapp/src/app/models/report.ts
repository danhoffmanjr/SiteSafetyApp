export interface IReport {
    id: number;
    title: string;
    formType: string;
    formDetails: string;
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
}