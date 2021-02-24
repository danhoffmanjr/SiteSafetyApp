import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Accordion, Button, Grid, Header, Icon, Menu, Popup, Segment } from "semantic-ui-react";
import { search } from "../../app/common/utils/search";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { IReportType } from "../../app/models/reportType";
import { RootStoreContext } from "../../app/stores/rootStore";
import CreateForm from "../form-creator/CreateForm";
import ReportTypeForm from "./ReportTypeForm";

const ReportTypesPage = () => {
  const rootStore = useContext(RootStoreContext);
  const { loadingReportTypes, loadReportTypes, typesOrderedByTitleAscending } = rootStore.reportTypeStore;

  const [showForm, setShowForm] = useState(false);
  const toggleForm = () => setShowForm(!showForm);
  const [query, setQuery] = useState("");

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    loadReportTypes();
  }, [loadReportTypes]);

  const data = useMemo(() => {
    return toJS(typesOrderedByTitleAscending);
  }, [typesOrderedByTitleAscending]);

  if (loadingReportTypes) return <LoadingComponent content="Loading report types..." />;
  return (
    <>
      <Segment>
        <Grid>
          <Grid.Column width={16}>
            <Header as="h2">
              <Icon name="file alternate" />
              <Header.Content>
                Report Types <Popup content={`Report types are custom forms for different types of reports.`} trigger={<Icon size="small" color="teal" name="question circle outline" />} />
                <Header.Subheader>Manage report type forms</Header.Subheader>
              </Header.Content>
            </Header>
          </Grid.Column>
        </Grid>
      </Segment>

      <div>
        <Menu attached="top" stackable>
          <Menu.Item onClick={toggleForm} style={showForm ? { backgroundColor: "red", color: "#FFF", fontWeight: "bold" } : null}>
            {showForm ? <Icon name="times" /> : <Icon name="plus" />}
            {showForm ? "Cancel" : "Create Report Type"}
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
            <CreateForm />
          </Segment>
        )}
        <Segment attached="bottom">
          {data.length > 0 ? (
            <Accordion styled fluid>
              {data
                ?.filter((type) => search<IReportType>(type, ["title"], query))
                .map((form, index) => {
                  return (
                    <div key={form.id}>
                      <Accordion.Title key={`${form.id}-title`} active={activeIndex === index} index={index} onClick={() => setActiveIndex(index)}>
                        <Icon name="dropdown" />
                        {form.title}{" "}
                        <Button icon size="mini" compact floated="right">
                          <Icon color="red" name="trash alternate" />
                        </Button>
                      </Accordion.Title>
                      <Accordion.Content key={`${form.id}-content`} active={activeIndex === index}>
                        <ReportTypeForm type={form} />
                      </Accordion.Content>
                    </div>
                  );
                })}
            </Accordion>
          ) : (
            <p>NO REPORT TYPES</p>
          )}
        </Segment>
      </div>
    </>
  );
};

export default observer(ReportTypesPage);
