import { action, computed, observable, runInAction, toJS } from "mobx";
import agent from "../api/agent";
import { IUser } from "../models/user";
import { IUserFormValues } from "../models/userFormValues";
import { RootStore } from "./rootStore";
import { history } from "../..";
import { IProfile } from "../models/profile";
import { toast } from "react-toastify";
import { IPasswordReset } from "../models/passwordReset";
import { IEmail } from "../models/email";
import { IRole } from "../models/role";
import { ISelectOptions } from "../models/reactSelectOptions";
import { IUserInviteFormValues } from "../models/userInviteFormValues";
import { ISite } from "../models/site";
import { IUserSiteFormValues } from "../models/userSiteFormValues";
import { IEditUserFormValues } from "../models/editUserFormValues";
import { IProfileFormValues } from "../models/profileFormValues";

export default class UserStore {
    refreshTokenTimeout: any;
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    @observable user: IUser | null = null;
    @observable profile: IProfile | null = null;
    @observable profileRegistry = new Map<string, IProfile>();
    @observable roleRegistry = new Map<string, IRole>();
    @observable loadingUser = false;
    @observable loadingProfile = false;
    @observable loadingRoles = false;
    @observable isLoading = false;
    @observable isSubmitting = false;

    @computed get isLoggedIn() {return !!this.user}

    @computed get isCurrentUser() {
      return this.user?.id === this.rootStore.commonStore.getUserIdFromToken;
    }

    @computed get profilesOrderedAscending() {
      return Array.from(this.profileRegistry.values()).sort(this.compareProfile);
    }

    @computed get profileSelectOptions(): ISelectOptions[] {
      let options: ISelectOptions[] = [];
       this.profileRegistry.forEach(profile => {
        options.push({ value: `${profile.id}`, label: `${profile.fullName}` })
      });
      return options.sort(this.compareOptions);
    }

    @computed get roleSelectOptions(): ISelectOptions[] {
      let options: ISelectOptions[] = [];
      this.roleRegistry.forEach(role => {
        options.push({ value: `${role.name}`, label: `${role.name}` })
      });
      return options.sort(this.compareOptions);
    }
  
    compareOptions(options1: ISelectOptions, options2: ISelectOptions) {
      if (options1.label < options2.label) {
        return -1;
      }
      if (options1.label > options2.label) {
        return 1;
      }
      return 0;
    }

    compareProfile(profile1: IProfile, profile2: IProfile) {
      if (profile1.lastName < profile2.lastName) {
        return -1;
      }
      if (profile1.lastName > profile2.lastName) {
        return 1;
      }
      return 0;
    }

    compareSite(site1: ISite, site2: ISite) {
      if (site1.name < site2.name) {
        return -1;
      }
      if (site1.name > site2.name) {
        return 1;
      }
      return 0;
    }

    @computed get isAdmin() {return this.user?.role.name === "Admin"}

    @action getRoles = async () => {
      this.loadingRoles = true;
      try {
          const roles = await agent.User.getRoles();
          runInAction(() => {
            roles.forEach((role) => {
              this.roleRegistry.set(role.name, role);
            });;
            this.loadingRoles = false;
          });
        } catch (error) {
          runInAction(() => {
            this.loadingRoles = false;
          });
          console.log("Get Roles Error:", error);//remove
        }
    };

    @action login = async (values: IUserFormValues) => {
        this.isSubmitting = true;
        try {
          const user = await agent.User.login(values);
          console.info("Login User Attempt:", user); // remove
          runInAction(() => {
            this.user = user;
            this.isSubmitting = false;
            this.rootStore.commonStore.setToken(user.token);
            this.rootStore.commonStore.setUserId(user.id);
            this.startRefreshTokenTimer(user);
            history.push("/reports");
          });
        } catch (error) {
          runInAction(() => {
            this.isSubmitting = false;
          });
          throw error;
        }
      };

    @action logout = () => {
        this.rootStore.commonStore.setToken(null);
        this.rootStore.commonStore.setUserId(null);
        this.user = null;
        history.push("/");
    };

    @action registerUser = async (values: IUserFormValues) => {
        try {
          await agent.User.register(values);
          history.push(`/users/registerSuccess?email=${values.email}`);
        } catch (error) {
          throw error;
        }
      };

      @action getUsers = async () => {
        this.loadingProfile = true;
        try {
          const profiles = await agent.User.list();
          runInAction(() => {
            profiles.forEach((profile) => {
              this.profileRegistry.set(profile.id, profile);
            });
            this.loadingProfile = false;
          });
          
        } catch (error) {
          runInAction(() => {
            this.loadingProfile = false;
          });
          console.info("Get Users Error:", error.statusText); // remove
          throw error;
        }
      };

    @action getUser = async () => {
      this.loadingUser = true;
      try {
          const user = await agent.User.current();
          runInAction(() => {
            this.user = user;
            this.loadingUser = false;
          });
          this.rootStore.commonStore.setToken(user.token);
            this.rootStore.commonStore.setUserId(user.id);
            this.startRefreshTokenTimer(user);
        } catch (error) {
          runInAction(() => {
            this.user = null;
            this.loadingUser = false;
          });
          console.log("Get User Error:", error);//remove
        }
    };

    @action loadProfile = async (email: string) => {
      this.loadingProfile = true;
      try {
        if(email === this.user?.email) {
          const profile = await agent.User.get(email);
          runInAction(() => {
            this.profile = profile;
            this.loadingProfile = false;
          });
        } else {
          history.push(`/access-denied`);
          toast.error(
            `Problem loading profile. Login as "${email}" to access this profile.`, { autoClose: 10000 }
          );
        }
        
      } catch (error) {
        runInAction(() => {
          this.loadingProfile = false;
        });
        toast.error(`Problem loading profile. ${error.status}: ${error.statusText}`);
        if (error.status === 403 || 401) {
          history.push(`/`);
        }
        console.log("Error loading Profile:", error);//remove
      }
    };

    @action updateProfile = async (profile: Partial<IProfileFormValues>) => {
      this.isSubmitting = true;
      try {
        await agent.User.update(profile);
        runInAction(() => {  
          if (profile.email !== this.rootStore.userStore.user!.email) {
            this.rootStore.userStore.user!.email = profile.email!;
          }

          if (profile.firstName !== this.rootStore.userStore.user!.firstName) {
            this.rootStore.userStore.user!.firstName = profile.firstName!;
          }
  
          this.profile = { ...this.profile!, ...profile };
          this.isSubmitting = false;
          toast.success("Profile Updated.");
        });
      } catch (error) {
        runInAction(() => {
          this.isSubmitting = false;
        });
        throw error;
      }
    };

    @action loadUser = async (email: string) => {
      this.loadingProfile = true;
      try {
        if(this.user?.role.name.toLowerCase() !== 'inspector') {
          const profile = await agent.User.get(email);
          runInAction(() => {
            this.profile = profile;
            this.loadingProfile = false;
          });
        } else {
          history.push(`/access-denied`);
          toast.error(
            `Problem loading profile. Login as "${email}" to access this profile.`, { autoClose: 10000 }
          );
        }
        
      } catch (error) {
        runInAction(() => {
          this.loadingProfile = false;
        });
        toast.error(`Problem loading profile. ${error.status}: ${error.statusText}`);
        if (error.status === 403 || 401) {
          history.push(`/`);
        }
        console.log("Error loading Profile:", error);//remove
      }
    };

    @action updateUser = async (user: Partial<IEditUserFormValues>) => {
      this.isSubmitting = true;
      const isActive = user.isActive?.toString() === 'true' ? true : false; // for some unknown reason sometimes the value gets sent as a string instead of boolean (issue with the cast?), so we need this check/conversion
      user.isActive = isActive;
      try {
        await agent.User.updateUser(user);
        runInAction(() => {
          this.profile = {...this.profile!, ...user}
          this.isSubmitting = false;
          toast.success(`${user.firstName} successfully updated!`);
        });
      } catch (error) {
        runInAction(() => {
          this.isSubmitting = false;
        });
        throw error;
      }
    };

    @action createPassword = async (password: IPasswordReset) => {
      this.isSubmitting = true;
      try {
        await agent.User.createPassword(password);
        runInAction(() => {
          this.isSubmitting = false;
        });
        toast.success("Password created successfully - you can now login.");
        history.push('/login');
      } catch (error) {
        console.log(error);
        runInAction(() => {
          this.isSubmitting = false;
        });
        throw error;
      }
    };

    @action resetPassword = async (password: IPasswordReset) => {
      this.isSubmitting = true;
      try {
        await agent.User.resetPassword(password);
        runInAction(() => {
          this.isSubmitting = false;
        });
        toast.success("Password reset successfully - you can now login.");
        history.push('/login');
      } catch (error) {
        console.log(error);
        runInAction(() => {
          this.isSubmitting = false;
        });
        throw error;
      }
    };

    @action forgotPassword = async (email: IEmail) => {
      this.isSubmitting = true;
      try {
        await agent.User.forgotPassword(email.email);
        runInAction(() => {
          this.isSubmitting = false;
        });
        toast.success("Password reset link sent - please check your email");
      } catch (error) {
        console.log("Password Reset Error:", error.statusText);
        runInAction(() => {
          this.isSubmitting = false;
        });
        toast.error(`Problem sending password reset link. Error: ${error.statusText}`, { autoClose: 10000 });
      }
    };

    @action inviteUser = async (newUser: IUserInviteFormValues) => {
      this.isSubmitting = true;
      try {
        await agent.User.sendInvite(newUser);
        runInAction(() => {
          this.getUsers();
          this.isSubmitting = false;
        });
        toast.success(`Invitation successfully sent to ${newUser.email}`);
      } catch (error) {
        console.log("Invite User Error:", error.statusText);
        runInAction(() => {
          this.isSubmitting = false;
        });
        throw error;
      }
    };

    @action refreshToken = async () => {
      this.stopRefreshTokenTimer();
      try {
        const user = await agent.User.refreshToken();
        runInAction(() => {
          this.user = user;
        });
        this.rootStore.commonStore.setToken(user.token);
        this.startRefreshTokenTimer(user);
      } catch (error) {
        console.error("RefreshToken Error:", error.statusText);
      }
    };

    @action assignSiteToUser = async (values: IUserSiteFormValues) => {
      this.isSubmitting = true;
      try {
        const siteAssigned: ISite = await agent.Sites.assign(values);
          const profiles = await agent.User.list();
          runInAction(() => {
            profiles.forEach((profile) => {
              this.profileRegistry.set(profile.id, profile);
            });
            this.isSubmitting = false;
            toast.success(`Site successfully assigned!`);
          });
        } catch (error) {
          runInAction(() => {
            this.isSubmitting = false;
          });
          console.log("Assign Site Error:", error);//remove
          throw error;
        }
    };

    @action unassignSiteFromUser = async (values: IUserSiteFormValues) => {
      this.isSubmitting = true;
      try {
          await agent.Sites.unassign(values);
          const profiles = await agent.User.list();
          runInAction(() => {
            profiles.forEach((profile) => {
              this.profileRegistry.set(profile.id, profile);
            });
            this.isSubmitting = false;
            toast.success(`Site successfully removed from user.`);
          });
        } catch (error) {
          runInAction(() => {
            this.isSubmitting = false;
          });
          console.log("Unassign Site Error:", error);//remove
          throw error;
        }
    };

    @action getSitesByUserId = (userId: string): ISite[] => {
      return Array.from(this.profileRegistry.get(userId)?.sites!).sort(this.compareSite);
    }

    @action getUserOptionsByCompanyId = (companyId: number): ISelectOptions[] => {
      let options: ISelectOptions[] = [];
      let users = Array.from(this.profileRegistry.values()).filter(user => {
        return user.companyId === companyId;
      })
      users.forEach(user => {
        options.push({ value: `${user.id}`, label: `${user.fullName}` })
      });
      return options.sort(this.compareOptions);
    }

    private startRefreshTokenTimer(user: IUser) {
      const token = JSON.parse(atob(user.token.split('.')[1]));
      const expires = new Date(token.exp * 1000);
      const timeout = expires.getTime() - Date.now() -(60 * 1000);
      this.refreshTokenTimeout = setTimeout(this.refreshToken, timeout);
    }

    private stopRefreshTokenTimer() {
      clearTimeout(this.refreshTokenTimeout);
    }
}