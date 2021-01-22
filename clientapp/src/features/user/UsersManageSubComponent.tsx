import { observer } from "mobx-react-lite";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { Button, Icon, Menu, Table } from "semantic-ui-react";
import { search } from "../../app/common/utils/search";
import useSortableData from "../../app/common/utils/useSortableData";
import { IProfile } from "../../app/models/profile";
import { ISite } from "../../app/models/site";
import { RootStoreContext } from "../../app/stores/rootStore";
import ConfirmUnassignActions from "../sites/ConfirmUnassignActions";
import AssignUserToSiteForm from "./AssignUserToSiteForm";

interface IProps {
  users: IProfile[];
  site: ISite;
}

const UsersManageSubComponent: React.FC<IProps> = ({ users, site }) => {
  const rootStore = useContext(RootStoreContext);
  const { openModal, openConfirm } = rootStore.modalStore;

  const [query, setQuery] = useState("");
  const [data, setData] = useState(users);
  const { items, requestSort, sortConfig } = useSortableData(data);

  useEffect(() => {
    setData(users);
  }, [users]);

  return (
    <Fragment>
      <Menu attached="top" stackable>
        <Menu.Item onClick={() => openModal("Assign User to Site", <AssignUserToSiteForm site={site} />, site.id, site.name)}>
          <Icon name="plus" /> Assign User
        </Menu.Item>
        <Menu.Menu position="right">
          <div className="ui right aligned category search item">
            <div className="ui transparent icon input">
              <input className="prompt" type="text" placeholder="Search assigned users..." value={query} onChange={(e) => setQuery(e.target.value)} />
              <i className="search link icon" />
            </div>
            <div className="results" />
          </div>
        </Menu.Menu>
      </Menu>
      <Table sortable striped celled selectable compact attached>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell sorted={"firstName" === sortConfig?.key ? sortConfig?.direction : null} onClick={() => requestSort("firstName")}>
              First Name
            </Table.HeaderCell>
            <Table.HeaderCell sorted={"lastName" === sortConfig?.key ? sortConfig?.direction : null} onClick={() => requestSort("lastName")}>
              Last Name
            </Table.HeaderCell>
            <Table.HeaderCell sorted={"email" === sortConfig?.key ? sortConfig?.direction : null} onClick={() => requestSort("email")}>
              Email
            </Table.HeaderCell>
            <Table.HeaderCell sorted={"companyName" === sortConfig?.key ? sortConfig?.direction : null} onClick={() => requestSort("companyName")}>
              Company
            </Table.HeaderCell>
            <Table.HeaderCell sorted={"contactPhoneNumber" === sortConfig?.key ? sortConfig?.direction : null} onClick={() => requestSort("contactPhoneNumber")}>
              Phone
            </Table.HeaderCell>
            <Table.HeaderCell sorted={"role" === sortConfig?.key ? sortConfig?.direction : null} onClick={() => requestSort("role")}>
              Role
            </Table.HeaderCell>
            <Table.HeaderCell style={{ width: "90px" }}></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items[0] &&
            items
              .filter((user) => search<IProfile>(user, ["firstName", "lastName", "email", "companyName", "contactPhoneNumber", "role"], query))
              .map((user: IProfile, rowIndex) => {
                return (
                  <Table.Row key={rowIndex}>
                    <Table.Cell>{user.firstName}</Table.Cell>
                    <Table.Cell>{user.lastName}</Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>{user.companyName}</Table.Cell>
                    <Table.Cell>{user.contactPhoneNumber}</Table.Cell>
                    <Table.Cell>{user.role}</Table.Cell>
                    <Table.Cell>
                      <Button
                        size="mini"
                        basic
                        color="red"
                        content="remove"
                        name={site.id}
                        onClick={() =>
                          openConfirm(
                            "Confirm Unassign Site",
                            <p>
                              Are you sure you want to unassign <strong>{`${user.fullName}`}</strong> from <strong>{`${site.name}`}</strong>?
                            </p>,
                            <ConfirmUnassignActions userId={user.id} siteId={site.id} page="sites" />,
                            site.id,
                            user.id
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

export default observer(UsersManageSubComponent);
