import axios, { AxiosResponse } from "axios";
import { IReport } from "../models/report";
import { IUser } from "../models/user";
import { IUserFormValues } from "../models/userFormValues";
import { IProfile } from "../models/profile";
import { IPasswordReset } from "../models/passwordReset";
import axiosInstance from "./axios";
import { IRole } from "../models/role";
import { ICompany } from "../models/company";
import { IUserInviteFormValues } from "../models/userInviteFormValues";
import { ISite } from "../models/site";
import { ISiteFormValues } from "../models/siteFormValues";
import { IUserSiteFormValues } from "../models/userSiteFormValues";
import { IEditUserFormValues } from "../models/editUserFormValues";
import { IProfileFormValues } from "../models/profileFormValues";
import { IReportImage } from "../models/reportImage";
import { IReportType } from "../models/reportType";
import { IReportTypeFormValues } from "../models/reportTypeFormValues";

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
  get: (url: string) => axiosInstance.get(url).then(responseBody),
  post: (url: string, body: {}) => axiosInstance.post(url, body).then(responseBody),
  put: (url: string, body: {}) => axiosInstance.put(url, body).then(responseBody),
  delete: (url: string) => axiosInstance.delete(url).then(responseBody),
};

const User = {
  list: (): Promise<IProfile[]> => requests.get(`/users`),
  get: (username: string): Promise<IProfile> => requests.get(`/users/${username}`),
  current: (): Promise<IUser> => requests.get("users/current"),
  login: (user: IUserFormValues): Promise<IUser> => requests.post(`/users/login`, user),
  register: (user: IUserFormValues): Promise<IUser> => requests.post(`/users/register`, user),
  update: (profile: Partial<IProfileFormValues>) => requests.put(`/users`, profile),
  updateUser: (user: Partial<IEditUserFormValues>) => requests.put(`/users/manage/update`, user),
  confirmEmail: (token: string, email: string): Promise<void> => requests.post(`/users/verifyEmail`, { token, email }),
  confirmEmailResend: (email: string): Promise<void> => requests.get(`/users/resendEmailVerification?email=${email}`),
  forgotPassword: (email: string): Promise<void> => requests.post(`/users/forgotPassword`, { email: email }),
  resetPassword: (passwordReset: IPasswordReset): Promise<void> => requests.post(`/users/resetPassword`, passwordReset),
  createPassword: (passwordReset: IPasswordReset): Promise<void> => requests.post(`/users/invite/createPassword`, passwordReset),
  refreshToken: (): Promise<IUser> => requests.post(`/users/refreshToken`, {}),
  getRoles: (): Promise<IRole[]> => requests.get(`/users/roles`),
  sendInvite: (newUser: IUserInviteFormValues): Promise<void> => requests.post(`/users/sendInvite`, newUser),
  confirmInvite: (token: string, email: string): Promise<void> => requests.post(`/users/verifyInvite`, { token, email }),
};

const Companies = {
  list: (): Promise<ICompany[]> => requests.get("/companies"),
  get: (id: string): Promise<ICompany> => requests.get(`/companies/${id}`),
  create: (name: string): Promise<ICompany> => requests.post("/companies/create", { name: name }),
  delete: (id: string) => requests.delete(`/companies/delete/${id}`),
};

const Sites = {
  list: (): Promise<ISite[]> => requests.get("/sites"),
  get: (id: string): Promise<ISite> => requests.get(`/sites/manage/${id}`),
  create: (site: ISiteFormValues): Promise<ISite> => requests.post("/sites/create", site),
  update: (site: Partial<ISiteFormValues>) => requests.put(`/sites/edit`, site),
  delete: (id: string) => requests.delete(`/sites/delete/${id}`),
  assign: (userSite: IUserSiteFormValues): Promise<ISite> => requests.post("/sites/assign", userSite),
  unassign: (userSite: IUserSiteFormValues): Promise<ISite> => requests.post("/sites/unassign", userSite),
};

const Reports = {
  list: (): Promise<IReport[]> => requests.get("/reports"),
  details: (id: string) => requests.get(`/reports/${id}`),
  create: (report: IReport) => requests.post("/createReport", report),
  update: (report: any) => requests.put(`/reports/${report.id}`, report),
  delete: (id: string) => requests.delete(`/reports/${id}`),
};

const ReportTypes = {
  list: (): Promise<IReportType[]> => requests.get("/reporttypes"),
  create: (values: IReportTypeFormValues) => requests.post("/reporttypes/create", values),
  delete: (id: number) => requests.delete(`/reporttypes/delete/${id}`),
};

const ReportImages = {
  upload: (filename: string, image: Blob) => {
    let formData = new FormData();
    formData.append("File", image);
    formData.append("FileName", filename);
    return axios.post<IReportImage>("/api/reportImages", formData, {
      headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${localStorage.getItem("ps-token")}` },
    });
  },
};

export default {
  User,
  Reports,
  ReportTypes,
  ReportImages,
  Companies,
  Sites,
};
