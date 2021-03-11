import { IImage } from "./image";

export interface IReportPostValues {
  id: string;
  title: string;
  reportType: string;
  reportTypeId: string;
  reportFields: string;
  companyId: string;
  siteId: string;
  images: IImage[];
}
