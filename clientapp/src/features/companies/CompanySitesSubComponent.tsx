import { observer } from "mobx-react-lite";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { Button, Icon, Menu, Table } from "semantic-ui-react";
import { search } from "../../app/common/utils/search";
import useSortableData from "../../app/common/utils/useSortableData";
import { ICompany } from "../../app/models/company";
import { ISite } from "../../app/models/site";
import { RootStoreContext } from "../../app/stores/rootStore";
import ConfirmDeleteSiteActions from "../sites/ConfirmDeleteSiteActions";
import AddSiteToCompanyForm from "./AddSiteToCompanyForm";

interface IProps {
  sites: ISite[];
  company: ICompany;
}

const CompanySitesSubComponent: React.FC<IProps> = ({ sites, company }) => {
  const rootStore = useContext(RootStoreContext);
  const {
    openModal,
    openConfirm,
    confirm: { isDeleting, target },
  } = rootStore.modalStore;

  const [query, setQuery] = useState("");
  const [data, setData] = useState(sites);
  const { items, requestSort, sortConfig } = useSortableData(data);

  useEffect(() => {
    setData(sites);
  }, [sites]);

  return (
    <Fragment>
      <Menu attached="top" stackable>
        <Menu.Item onClick={() => openModal(`Create Site for ${company.name}`, <AddSiteToCompanyForm company={company} />, company.id, company.name)}>
          <Icon name="plus" /> Add Site
        </Menu.Item>
        <Menu.Menu position="right">
          <div className="ui right aligned category search item">
            <div className="ui transparent icon input">
              <input className="prompt" type="text" placeholder="Search company sites..." value={query} onChange={(e) => setQuery(e.target.value)} />
              <i className="search link icon" />
            </div>
            <div className="results" />
          </div>
        </Menu.Menu>
      </Menu>
      <Table sortable striped celled selectable compact attached>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell sorted={"name" === sortConfig?.key ? sortConfig?.direction : null} onClick={() => requestSort("name")}>
              Name
            </Table.HeaderCell>
            <Table.HeaderCell sorted={"address" === sortConfig?.key ? sortConfig?.direction : null} onClick={() => requestSort("address")}>
              Address
            </Table.HeaderCell>
            <Table.HeaderCell sorted={"notes" === sortConfig?.key ? sortConfig?.direction : null} onClick={() => requestSort("notes")}>
              Notes
            </Table.HeaderCell>
            <Table.HeaderCell style={{ width: "90px" }}></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items[0] &&
            items
              .filter((site) => search<ISite>(site, ["name", "address", "notes"], query))
              .map((site: ISite, rowIndex) => {
                return (
                  <Table.Row key={rowIndex}>
                    <Table.Cell>{site.name}</Table.Cell>
                    <Table.Cell>{site.address}</Table.Cell>
                    <Table.Cell>{site.notes}</Table.Cell>
                    <Table.Cell>
                      <Button
                        size="mini"
                        basic
                        color="red"
                        content="delete"
                        floated="right"
                        loading={target === site.id && isDeleting}
                        name={site.id}
                        onClick={() =>
                          openConfirm(
                            "Confirm Delete Site",
                            <p>
                              Are you sure you want to delete <strong>{`${site.name}`}</strong>?
                            </p>,
                            <ConfirmDeleteSiteActions siteId={site.id} />,
                            site.id,
                            site.id
                          )
                        }
                      />
                    </Table.Cell>
                  </Table.Row>
                );
              })}
        </Table.Body>
      </Table>
    </Fragment>
  );
};

export default observer(CompanySitesSubComponent);
