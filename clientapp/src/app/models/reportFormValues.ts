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

export class DefaultFormValues implements IReportFormValues {
  id: string = "";
  title: string = "";
  companyId: string = "";
  companyName: string = "";
  siteId: string = "";
  siteName: string = "";
  reportTypeId: string = "";
  reportType: string = "";
  reportFields: IReportField[] = [];
  images: IReportImage[] = [];

  constructor(report?: DefaultFormValues) {
    if (report) {
      this.id = report.id;
      this.title = report.title;
      this.companyId = report.companyId;
      this.companyName = report.companyName;
      this.siteId = report.siteId;
      this.siteName = report.siteName;
      this.reportTypeId = report.reportTypeId;
      this.reportType = report.reportType;
      this.reportFields = report.reportFields;
      this.images = report.images;
    }
  }
}
