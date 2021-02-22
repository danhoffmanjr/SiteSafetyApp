import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Grid, Header, Icon, Image, Menu, Segment } from "semantic-ui-react";
import { search } from "../../app/common/utils/search";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { IReport } from "../../app/models/report";
import { RootStoreContext } from "../../app/stores/rootStore";
import CreateReportForm from "./CreateReportForm";
import ReportsTable from "./ReportsTable";

const ReportsPage = () => {
  const rootStore = useContext(RootStoreContext);
  const { loadReports, loadingReports, reportsOrderedByTitleAscending } = rootStore.reportStore;
  const { openModal } = rootStore.modalStore;

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const data = useMemo(() => {
    return reportsOrderedByTitleAscending;
  }, [reportsOrderedByTitleAscending]);

  const [showForm, setShowForm] = useState(false);
  const toggleForm = () => setShowForm(!showForm);
  const [query, setQuery] = useState("");

  if (loadingReports) return <LoadingComponent content="Loading reports..." />;
  return (
    <>
      <Segment>
        <Grid>
          <Grid.Column width={16}>
            <Header as="h2">
              <Icon name="file alternate" />
              <Header.Content>
                Reports
                <Header.Subheader>Manage reports</Header.Subheader>
              </Header.Content>
            </Header>
          </Grid.Column>
        </Grid>
      </Segment>
      <div>
        <Menu attached="top" stackable>
          <Menu.Item onClick={toggleForm} style={showForm ? { backgroundColor: "red", color: "#FFF", fontWeight: "bold" } : null}>
            {showForm ? <Icon name="times" /> : <Icon name="plus" />}
            {showForm ? "Cancel" : "Create Report"}
          </Menu.Item>
          <Menu.Menu position="right">
            <div className="ui right aligned category search item">
              <div className="ui transparent icon input">
                <input className="prompt" type="text" placeholder="Search reports..." value={query} onChange={(e) => setQuery(e.target.value)} />
                <i className="search link icon" />
              </div>
              <div className="results" />
            </div>
          </Menu.Menu>
        </Menu>
        {showForm && (
          <Segment attached>
            <CreateReportForm />
            {/* {data?.[0].imageDtos.map((image) => <Image src={image.imageDataUrl} alt={image.Name} style={{ maxHeight: 200 }} />)} */}
          </Segment>
        )}
        <Segment attached="bottom">
          {(data[0] && (
            <ReportsTable reports={data.filter((report) => search<IReport>(report, ["title", "reportType", "companyName", "siteName", "createdBy", "createdOn", "isComplete"], query))} />
          )) || <p>NO REPORTS</p>}
        </Segment>
      </div>
    </>
  );
};

export default observer(ReportsPage);
