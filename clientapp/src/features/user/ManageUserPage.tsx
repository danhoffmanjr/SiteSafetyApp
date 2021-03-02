import { observer } from "mobx-react-lite";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Accordion, Button, Grid, Header, Icon, Segment } from "semantic-ui-react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { DefaultFormValues } from "../../app/models/reportFormValues";
import { RootStoreContext } from "../../app/stores/rootStore";
import CreateReportForm from "../reports/CreateReportForm";
import ReportsTable from "../reports/ReportsTable";
import AssignSiteToUserForm from "../sites/AssignSiteToUserForm";
import SitesManageSubComponent from "../sites/SitesManageSubComponent";
import EditUserForm from "./EditUserForm";

interface RouteParams {
  email: string;
}

interface IProps extends RouteComponentProps<RouteParams> {}

const ManageUserPage: React.FC<IProps> = ({ match }) => {
  const rootStore = useContext(RootStoreContext);
  const { getRoles, loadingRoles, loadUser, loadingProfile, profile, roleSelectOptions } = rootStore.userStore;
  const { loadCompanies, companySelectOptions, loadingCompanies } = rootStore.companyStore;
  const {
    openModal,
    openConfirm,
    confirm: { isDeleting, target },
  } = rootStore.modalStore;

  useEffect(() => {
    if (companySelectOptions.length < 1) {
      loadCompanies();
    }
  }, [companySelectOptions, loadCompanies]);

  useEffect(() => {
    if (roleSelectOptions.length < 1) {
      getRoles();
    }
  }, [roleSelectOptions, getRoles]);

  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      loadUser(match.params.email);
    }
    return () => {
      mounted = false;
    };
  }, [loadUser, match]);

  if (loadingProfile || loadingCompanies || loadingRoles) return <LoadingComponent content="Loading user..." />;

  return (
    <Fragment>
      <Segment>
        <Grid>
          <Grid.Column width={14}>
            <Header as="h2">
              <Icon name="user" />
              <Header.Content>
                {profile?.fullName ?? "No user loaded"}
                <Header.Subheader>{profile?.email}</Header.Subheader>
              </Header.Content>
            </Header>
          </Grid.Column>
          <Grid.Column width={2} textAlign="center" verticalAlign="middle">
            <Button
              size="mini"
              basic
              color="red"
              content="Delete User"
              loading={target === profile?.id && isDeleting}
              name={profile?.id}
              onClick={() =>
                openConfirm(
                  "Confirm Delete User",
                  <p>
                    Are you sure you want to delete <strong>{`${profile?.fullName}`}</strong>?
                  </p>,
                  "Confirm Delete User Component here...",
                  profile?.id,
                  profile?.id
                )
              }
            />
          </Grid.Column>
        </Grid>
      </Segment>
      <Accordion fluid styled>
        <Accordion.Title active={activeIndex === 0} index={0} onClick={() => setActiveIndex(0)}>
          <Icon name="dropdown" />
          Edit {`${profile?.fullName}`}
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>{profile && <EditUserForm profile={profile} companyOptions={companySelectOptions} roleOptions={roleSelectOptions} />}</Accordion.Content>

        <Accordion.Title active={activeIndex === 1} index={1} onClick={() => setActiveIndex(1)}>
          <Icon name="dropdown" />
          {`${profile?.firstName}'s`} Reports
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 1}>
          {profile && profile.reports && profile.reports?.length > 0 ? (
            <ReportsTable reports={profile?.reports} />
          ) : (
            <Button
              basic
              color="blue"
              content="Create Report"
              onClick={() => openModal(`Create Report for ${profile!.firstName}`, <CreateReportForm report={new DefaultFormValues()} />, profile!.id, profile!.companyId)}
            />
          )}
        </Accordion.Content>

        <Accordion.Title active={activeIndex === 2} index={2} onClick={() => setActiveIndex(2)}>
          <Icon name="dropdown" />
          {`${profile?.firstName}'s`} Sites
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 2}>
          {profile && profile.sites && profile.sites?.length > 0 ? (
            <SitesManageSubComponent sites={profile.sites!} user={profile} companyId={profile.companyId} />
          ) : (
            <Button
              content="Assign User"
              basic
              color="blue"
              size="mini"
              onClick={() => openModal("Assign User to profile", <AssignSiteToUserForm user={profile!} companyId={profile!.companyId} />, profile!.id, profile!.fullName)}
            />
          )}
        </Accordion.Content>
      </Accordion>
    </Fragment>
  );
};

export default observer(ManageUserPage);
