import { observer } from "mobx-react-lite";
import React, { SyntheticEvent, useContext, useEffect, useMemo, useState } from "react";
import { Grid, Header, Icon, Menu, Pagination, Segment } from "semantic-ui-react";
import { paginate } from "../../app/common/utils/paginate";
import { search } from "../../app/common/utils/search";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { ISite } from "../../app/models/site";
import { RootStoreContext } from "../../app/stores/rootStore";
import CreateCompanyForm from "../companies/CreateCompanyForm";
import CreateSiteForm from "./CreateSiteForm";
import SitesTable from "./SitesTable";
import _ from "lodash";

const SitesPage = () => {
  const rootStore = useContext(RootStoreContext);
  const { loadSites, sitesOrderedAscending, loadingSites, showForm, toggleForm } = rootStore.siteStore;
  const { openModal } = rootStore.modalStore;

  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const handlePageChange = (e: SyntheticEvent, pageInfo: any) => {
    setPage(pageInfo.activePage);
  };

  useEffect(() => {
    loadSites();
  }, [loadSites]);

  const data = useMemo(() => {
    return sitesOrderedAscending;
  }, [sitesOrderedAscending]);

  const [query, setQuery] = useState("");

  let filtered = data.filter((site) => search<ISite>(site, ["name", "address", "companyName"], query));

  const sites = paginate(filtered, page, pageSize);

  if (loadingSites) return <LoadingComponent content="Loading sites..." />;
  return (
    <>
      <Segment>
        <Grid>
          <Grid.Column width={16}>
            <Header as="h2">
              <Icon name="building" />
              <Header.Content>
                Sites
                <Header.Subheader>Manage sites</Header.Subheader>
              </Header.Content>
            </Header>
          </Grid.Column>
        </Grid>
      </Segment>
      <div>
        <Menu attached="top" stackable>
          <Menu.Item onClick={toggleForm} style={showForm ? { backgroundColor: "red", color: "#FFF", fontWeight: "bold" } : null}>
            {showForm ? <Icon name="times" /> : <Icon name="plus" />}
            {showForm ? "Cancel" : "Add Site"}
          </Menu.Item>
          <Menu.Item onClick={() => openModal("Create Company", <CreateCompanyForm />, null, null)}>
            <Icon name="plus" />
            Add Company
          </Menu.Item>
          <Menu.Menu position="right">
            <div className="ui right aligned category search item">
              <div className="ui transparent icon input">
                <input className="prompt" type="text" placeholder="Search sites..." value={query} onChange={(e) => setQuery(e.target.value)} />
                <i className="search link icon" />
              </div>
              <div className="results" />
            </div>
          </Menu.Menu>
        </Menu>
        {showForm && (
          <Segment attached>
            <CreateSiteForm />
          </Segment>
        )}
        <Segment attached="bottom">
          {(filtered.length > 0 && (
            <>
              <SitesTable sites={sites} />
              <Pagination
                boundaryRange={0}
                defaultActivePage={1}
                ellipsisItem={null}
                firstItem={null}
                lastItem={null}
                siblingRange={1}
                activePage={page}
                totalPages={Math.ceil(filtered.length / pageSize)}
                onPageChange={handlePageChange}
              />
            </>
          )) || <p>NO DATA</p>}
        </Segment>
      </div>
    </>
  );
};

export default observer(SitesPage);
