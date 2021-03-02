import { observer } from "mobx-react-lite";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Accordion, Button, Grid, Header, Icon, Segment } from "semantic-ui-react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { DefaultFormValues } from "../../app/models/reportFormValues";
import { RootStoreContext } from "../../app/stores/rootStore";
import CreateReportForm from "../reports/CreateReportForm";
import ReportsTable from "../reports/ReportsTable";
import AssignUserToSiteForm from "../user/AssignUserToSiteForm";
import UsersManageSubComponent from "../user/UsersManageSubComponent";
import ConfirmDeleteSiteActions from "./ConfirmDeleteSiteActions";
import EditSiteForm from "./EditSiteForm";

interface RouteParams {
  id: string;
}

interface IProps extends RouteComponentProps<RouteParams> {}

const ManageSitePage: React.FC<IProps> = ({ match }) => {
  const rootStore = useContext(RootStoreContext);
  const { loadSiteById, loadingSite, site } = rootStore.siteStore;
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
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    loadSiteById(match.params.id);
  }, [loadSiteById, match]);

  if (loadingSite || loadingCompanies) return <LoadingComponent content="Loading site..." />;

  return (
    <Fragment>
      <Segment>
        <Grid>
          <Grid.Column width={14}>
            <Header as="h2">
              <Icon name="building" />
              <Header.Content>
                {site?.name ?? "No site loaded"}
                <Header.Subheader>{site?.address}</Header.Subheader>
              </Header.Content>
            </Header>
          </Grid.Column>
          <Grid.Column width={2} textAlign="center" verticalAlign="middle">
            <Button
              size="mini"
              basic
              color="red"
              content="Delete Site"
              loading={target === site?.id && isDeleting}
              name={site?.id}
              onClick={() =>
                openConfirm(
                  "Confirm Delete Site",
                  <p>
                    Are you sure you want to delete <strong>{`${site?.name}`}</strong>?
                  </p>,
                  <ConfirmDeleteSiteActions siteId={site!.id} />,
                  site?.id,
                  site?.id
                )
              }
            />
          </Grid.Column>
        </Grid>
      </Segment>
      <Accordion fluid styled>
        <Accordion.Title active={activeIndex === 0} index={0} onClick={() => setActiveIndex(0)}>
          <Icon name="dropdown" />
          Edit {`${site?.name}`}
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>{site && <EditSiteForm site={site} companyOptions={companySelectOptions} />}</Accordion.Content>

        <Accordion.Title active={activeIndex === 1} index={1} onClick={() => setActiveIndex(1)}>
          <Icon name="dropdown" />
          {`${site?.name}`} Reports
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 1}>
          {site && site.reports && site.reports?.length > 0 ? (
            <ReportsTable reports={site?.reports} />
          ) : (
            <Button basic color="blue" content="Create Report" onClick={() => openModal(`Create Report for ${site!.name}`, <CreateReportForm report={new DefaultFormValues} />, site!.id, site!.companyId)} />
          )}
        </Accordion.Content>

        <Accordion.Title active={activeIndex === 2} index={2} onClick={() => setActiveIndex(2)}>
          <Icon name="dropdown" />
          {`${site?.name}`} Users
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 2}>
          {site && site.users && site.users?.length > 0 ? (
            <UsersManageSubComponent users={site.users!} site={site} />
          ) : (
            <Button content="Assign User" basic color="blue" size="mini" onClick={() => openModal("Assign User to Site", <AssignUserToSiteForm site={site!} />, site!.id, site!.name)} />
          )}
        </Accordion.Content>
      </Accordion>
    </Fragment>
  );
};

export default observer(ManageSitePage);
