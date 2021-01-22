import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Grid, Header, Icon, Menu, Segment } from "semantic-ui-react";
import { search } from "../../app/common/utils/search";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { ICompany } from "../../app/models/company";
import { RootStoreContext } from "../../app/stores/rootStore";
import CompaniesTable from "./CompaniesTable";
import CreateCompanyForm from "./CreateCompanyForm";

const CompaniesPage = () => {
  const rootStore = useContext(RootStoreContext);
  const { loadCompanies, companiesOrderedAscending, loadingCompanies, showForm, toggleForm } = rootStore.companyStore;
  const { openModal } = rootStore.modalStore;

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  const data = useMemo(() => {
    return companiesOrderedAscending;
  }, [companiesOrderedAscending]);

  const [query, setQuery] = useState("");

  if (loadingCompanies) return <LoadingComponent content="Loading companies..." />;

  return (
    <>
      <Segment>
        <Grid>
          <Grid.Column width={16}>
            <Header as="h2">
              <Icon name="industry" />
              <Header.Content>
                Companies
                <Header.Subheader>Manage companies</Header.Subheader>
              </Header.Content>
            </Header>
          </Grid.Column>
        </Grid>
      </Segment>
      <div>
        <Menu attached="top" stackable>
          <Menu.Item onClick={toggleForm} style={showForm ? { backgroundColor: "red", color: "#FFF", fontWeight: "bold" } : null}>
            {showForm ? <Icon name="times" /> : <Icon name="plus" />}
            {showForm ? "Cancel" : "Add Company"}
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
            <CreateCompanyForm />
          </Segment>
        )}
        <Segment attached="bottom">{(data[0] && <CompaniesTable companies={data.filter((site) => search<ICompany>(site, ["name"], query))} />) || <p>NO DATA</p>}</Segment>
      </div>
    </>
  );
};

export default observer(CompaniesPage);
