export interface IFieldType {
  [key: string]: {
    name: string;
    label: string;
    requiresPlaceholder: boolean;
    requiresOptions: boolean;
  };
}
