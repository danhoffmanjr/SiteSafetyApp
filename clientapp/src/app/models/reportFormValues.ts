import { IReportField } from "./reportField";
import { IReportImage } from "./reportImage";

export interface IReportFormValues {
  id: number;
  title: string;
  reportType: string;
  reportTypeId: number;
  reportFields: IReportField[];
  companyId: number;
  companyName: string;
  siteId: number;
  siteName: string;
  images?: IReportImage[];
}
