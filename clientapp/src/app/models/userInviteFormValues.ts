export interface IUserInviteFormValues {
    email: string;
    firstName: string;
    lastName: string;
    companyId: number | null | undefined;
    siteId?: number | null | undefined;
    roleName: string | undefined;
}