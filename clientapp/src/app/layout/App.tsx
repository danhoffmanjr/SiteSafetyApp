import { observer } from "mobx-react-lite";
import React, { Fragment, useContext, useEffect } from "react";
import { Route, RouteComponentProps, Switch, withRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Container } from "semantic-ui-react";
import AppMenu from "../../features/app-menu/AppMenu";
import CompaniesPage from "../../features/companies/CompaniesPage";
import CreateCompanyForm from "../../features/companies/CreateCompanyForm";
import CreateForm from "../../features/form-creator/CreateForm";
import HomePage from "../../features/home/HomePage";
import CreateReportForm from "../../features/reports/CreateReportForm";
import ReportDetailsPage from "../../features/reports/ReportDetailsPage";
import ReportsPage from "../../features/reports/ReportsPage";
import CreateSiteForm from "../../features/sites/CreateSiteForm";
import ManageSitePage from "../../features/sites/ManageSitePage";
import SitesPage from "../../features/sites/SitesPage";
import ConfirmEmail from "../../features/user/ConfirmEmail";
import ConfirmInvite from "../../features/user/ConfirmInvite";
import ForgotPasswordForm from "../../features/user/ForgotPassword";
import LoginForm from "../../features/user/LoginForm";
import ManageUserPage from "../../features/user/ManageUserPage";
import PasswordResetForm from "../../features/user/PasswordResetForm";
import ProfilePage from "../../features/user/ProfilePage";
import RegisterForm from "../../features/user/RegisterForm";
import RegisterSuccess from "../../features/user/RegisterSuccess";
import UsersPage from "../../features/user/UsersPage";
import ConfirmContainer from "../common/modal/ConfirmContainer";
import ModalContainer from "../common/modal/ModalContainer";
import { RootStoreContext } from "../stores/rootStore";
import AccessDenied from "./AccessDenied";
import LoadingComponent from "./LoadingComponent";
import NotFound from "./NotFound";
import "./styles.css";

const App: React.FC<RouteComponentProps> = ({ location, match, history, children }) => {
  const rootStore = useContext(RootStoreContext);
  const { setAppLoaded, token, appLoaded } = rootStore.commonStore;
  const { getUser, getUsers, getRoles } = rootStore.userStore;

  useEffect(() => {
    if (token && !appLoaded) {
      getUser().finally(() => setAppLoaded());
    } else {
      setAppLoaded();
    }
  }, [setAppLoaded, getUser, getUsers, getRoles, token, appLoaded]);

  if (!appLoaded) return <LoadingComponent content="Loading Pike Safety App..." />;

  return (
    <Fragment>
      <ConfirmContainer />
      <ModalContainer />
      <ToastContainer position="bottom-right" />
      <AppMenu />
      <Container>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/reports/manage" component={ReportsPage} />
          <Route path="/reports/manage/:id" component={ReportDetailsPage} />
          <Route exact path="/reports/create" component={CreateReportForm} />
          <Route exact path="/companies/manage" component={CompaniesPage} />
          <Route exact path="/companies/create" component={CreateCompanyForm} />
          <Route exact path="/sites/manage" component={SitesPage} />
          <Route path="/sites/manage/:id" component={ManageSitePage} />
          <Route exact path="/sites/create" component={CreateSiteForm} />
          <Route exact path="/login" component={LoginForm} />
          {/* <Route exact path="/register" component={RegisterForm} /> */}
          <Route exact path="/users/forgotPassword" component={ForgotPasswordForm} />
          <Route exact path="/users/manage" component={UsersPage} />
          <Route path="/users/manage/:email" component={ManageUserPage} />
          <Route path="/users/registerSuccess" component={RegisterSuccess} />
          <Route path="/users/verifyEmail" component={ConfirmEmail} />
          <Route path="/users/verifyInvite" component={ConfirmInvite} />
          <Route path="/users/resetPassword" component={PasswordResetForm} />
          <Route path="/users/verifyEmailChange" component={ConfirmEmail} />
          <Route path="/profiles/:username" component={ProfilePage} />
          <Route path="/report-type/create" component={CreateForm} />
          <Route exact path="/access-denied" component={AccessDenied} />
          <Route component={NotFound} />
        </Switch>
      </Container>
    </Fragment>
  );
};

export default withRouter(observer(App));
