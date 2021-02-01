import { IFormFieldValidation } from "./formFieldValidation";

export interface IFormField {
    type: string;
    name: string;
    placeholder: string;
    options: string[];
    value: string | number | boolean | null;
    validation: IFormFieldValidation;
}