import { IFormField } from "./formField";

export interface IFormTemplate {
    name: string;
    fields: IFormField[];
}