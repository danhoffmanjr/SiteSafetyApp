import React, { Fragment, useEffect } from "react";
import { useContext } from "react";
import { RouteComponentProps } from "react-router-dom";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { RootStoreContext } from "../../app/stores/rootStore";
import { Button, Grid, Header, Icon, Segment, Tab } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import ConfirmDeleteReportActions from "./ConfirmDeleteReportActions";
import EditReportForm from "./EditReportForm";

interface RouteParams {
  id: string;
}

interface IProps extends RouteComponentProps<RouteParams> {}

const ManageReportPage = ({ match }: IProps) => {
  const rootStore = useContext(RootStoreContext);
  const { loadReportById, loadingReport, report } = rootStore.reportStore;
  const { getLocaleDateTime } = rootStore.commonStore;
  const {
    openConfirm,
    confirm: { isDeleting, target },
  } = rootStore.modalStore;

  useEffect(() => {
    loadReportById(match.params.id);
  }, [loadReportById, match]);

  const panes = [
    {
      menuItem: "Edit Details",
      render: () => (
        <Tab.Pane attached="bottom">
          <EditReportForm report={report!} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Manage Images",
      render: () => <Tab.Pane attached="bottom">Manage Images Tab</Tab.Pane>,
    },
  ];

  if (loadingReport) return <LoadingComponent content="Loading report..." />;

  return (
    <Fragment>
      <Segment>
        <Grid>
          <Grid.Column width={14}>
            <Header as="h2">
              <Icon name="file alternate" />
              <Header.Content>
                {report?.title ?? "No report loaded"}
                <Header.Subheader>
                  Submitted by {report?.createdBy} on {getLocaleDateTime(new Date(report?.createdOn!))}
                </Header.Subheader>
              </Header.Content>
            </Header>
          </Grid.Column>
          <Grid.Column width={2} textAlign="center" verticalAlign="middle">
            <Button
              size="mini"
              basic
              color="red"
              content="Delete Report"
              loading={target === report?.id && isDeleting}
              name={report?.id}
              onClick={() =>
                openConfirm(
                  "Confirm Delete Site",
                  <p>
                    Are you sure you want to delete <strong>{`${report?.title}`}</strong>?
                  </p>,
                  <ConfirmDeleteReportActions reportId={report!.id} />,
                  report?.id,
                  report?.id
                )
              }
            />
          </Grid.Column>
        </Grid>
      </Segment>
      {report && <Tab menu={{ attached: "top" }} panes={panes} />}
    </Fragment>
  );
};

export default observer(ManageReportPage);
