import { IReportField } from "./reportField";
import { IReportImage } from "./reportImage";

export interface IReportFormValues {
  id: string;
  title: string;
  reportType: string;
  reportTypeId: string;
  reportFields: IReportField[];
  companyId: string;
  companyName: string;
  siteId: string;
  siteName: string;
  images?: IReportImage[];
}
