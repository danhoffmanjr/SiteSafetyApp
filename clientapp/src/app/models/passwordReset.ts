export interface IPasswordReset {
    email: string;
    token: string;
    password: string;
    confirmPassword: string;
}