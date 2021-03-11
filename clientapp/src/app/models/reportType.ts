import { IReportField } from "./reportField";

export interface IReportType {
  id: number;
  title: string;
  requireImages: boolean;
  fields: IReportField[];
}
