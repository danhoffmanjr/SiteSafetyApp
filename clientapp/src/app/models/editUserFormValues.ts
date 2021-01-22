export interface IEditUserFormValues {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    companyName: string;
    companyId: number;
    role: string;
    isActive: boolean;
    contactPhoneNumber?: string;
}