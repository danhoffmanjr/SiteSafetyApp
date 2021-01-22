import { observer } from "mobx-react-lite";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { Button, Icon, Menu, Table } from "semantic-ui-react";
import { search } from "../../app/common/utils/search";
import useSortableData from "../../app/common/utils/useSortableData";
import { IProfile } from "../../app/models/profile";
import { ISite } from "../../app/models/site";
import { RootStoreContext } from "../../app/stores/rootStore";
import AssignSiteToUserForm from "./AssignSiteToUserForm";
import ConfirmUnassignActions from "./ConfirmUnassignActions";

interface IProps {
  sites: ISite[];
  user: IProfile;
  companyId: number;
}

const SitesManageSubComponent: React.FC<IProps> = ({ sites, user, companyId }) => {
  const rootStore = useContext(RootStoreContext);
  const { openModal, openConfirm } = rootStore.modalStore;

  const [query, setQuery] = useState("");
  const [data, setData] = useState(sites);
  const { items, requestSort, sortConfig } = useSortableData(data);

  useEffect(() => {
    setData(sites);
  }, [sites]);

  return (
    <Fragment>
      <Menu attached="top" stackable>
        <Menu.Item onClick={() => openModal("Assign Site to User", <AssignSiteToUserForm user={user} companyId={companyId} />, user, companyId)}>
          <Icon name="plus" /> Assign Site
        </Menu.Item>
        <Menu.Menu position="right">
          <div className="ui right aligned category search item">
            <div className="ui transparent icon input">
              <input className="prompt" type="text" placeholder="Search assigned sites..." value={query} onChange={(e) => setQuery(e.target.value)} />
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
                        content="remove"
                        floated="right"
                        name={site.id}
                        onClick={() => openConfirm("Confirm Unassign Site", <p>Are you sure you want to unassign <strong>{`${site.name}`}</strong>?</p>, <ConfirmUnassignActions userId={user.id} siteId={site.id} page="users"/>, site.id, user.id)}
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

export default observer(SitesManageSubComponent);
