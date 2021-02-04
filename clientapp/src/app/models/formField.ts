export interface IFormField {
    type: string;
    name: string;
    placeholder: string;
    options: string[] | null;
    value: string | number | boolean | null;
    isRequired: boolean;
    minLength?: number;
    maxLength?: number;
}