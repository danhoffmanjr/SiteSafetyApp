import { observer } from "mobx-react-lite";
import React, { useState, useEffect, Fragment, useContext } from "react";
import { Button, Icon, Popup, Table } from "semantic-ui-react";
import useSortableData from "../../app/common/utils/useSortableData";
import { IProfile } from "../../app/models/profile";
import { RootStoreContext } from "../../app/stores/rootStore";
import AssignSiteToUserForm from "../sites/AssignSiteToUserForm";
import SitesManageSubComponent from "../sites/SitesManageSubComponent";
import { history } from "../..";

interface IProps {
  users: IProfile[];
}

const UsersTable: React.FC<IProps> = ({ users }) => {
  const rootStore = useContext(RootStoreContext);
  const { openModal } = rootStore.modalStore;

  const columns = [
    { name: "", field: "expander" },
    { name: "First Name", field: "firstName" },
    { name: "Last Name", field: "lastName" },
    { name: "Email", field: "email" },
    { name: "Company", field: "company" },
    { name: "Phone", field: "contactPhoneNumber" },
    { name: "Role", field: "role" },
    { name: "Is Active", field: "isActive" },
    { name: "", field: "actions" },
  ];

  const [data, setData] = useState<{ users: IProfile[]; expandedRows: number[] }>({ users: users, expandedRows: [] });
  const { items, requestSort, sortConfig } = useSortableData(data.users);

  useEffect(() => {
    setData((data) => {
      return { ...data, users };
    });
  }, [users]);

  const styles = {
    expanderColumn: {
      maxWidth: "2rem",
    },
    actionsColumn: {
      maxWidth: "83px",
    },
  };

  const handleRowClick = (rowId: number) => {
    const currentExpandedRows = data.expandedRows;
    const isRowCurrentlyExpanded = currentExpandedRows.includes(rowId);

    const newExpandedRows = isRowCurrentlyExpanded ? currentExpandedRows.filter((id) => id !== rowId) : currentExpandedRows.concat(rowId);

    setData({ ...data, expandedRows: newExpandedRows });
  };

  return (
    <Table sortable striped celled selectable compact>
      <Table.Header>
        <Table.Row>
          {users[0] &&
            columns.map((heading) => {
              return (
                <Table.HeaderCell key={heading.field} sorted={heading.field === sortConfig?.key ? sortConfig?.direction : null} onClick={() => requestSort(heading.field)}>
                  {heading.name}
                </Table.HeaderCell>
              );
            })}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {items[0] &&
          items.map((user: IProfile, rowIndex) => {
            return (
              <Fragment key={rowIndex}>
                <Table.Row key={rowIndex} className={data.expandedRows.includes(rowIndex) ? "selected" : ""}>
                  <Table.Cell style={styles.expanderColumn} onClick={() => handleRowClick(rowIndex)}>
                    {data.expandedRows.includes(rowIndex) ? <Icon name="caret down" /> : <Popup content={`Show ${user.firstName}'s sites and reports`} trigger={<Icon name="caret right" />} />}
                  </Table.Cell>
                  <Table.Cell>{user.firstName}</Table.Cell>
                  <Table.Cell>{user.lastName}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{user.companyName}</Table.Cell>
                  <Table.Cell>{user.contactPhoneNumber}</Table.Cell>
                  <Table.Cell>{user.role}</Table.Cell>
                  <Table.Cell>{user.isActive.toString()}</Table.Cell>
                  <Table.Cell style={styles.actionsColumn}>
                    <Button size="mini" basic content="Manage" name={user.id} onClick={() => history.push(`/users/manage/${user.email}`)} />
                  </Table.Cell>
                </Table.Row>
                {data.expandedRows.includes(rowIndex) ? (
                  user.sites !== (undefined || null) && user.sites![0] ? (
                    <Table.Row key={`row-details-${rowIndex}`} className={data.expandedRows.includes(rowIndex) ? "selected" : ""}>
                      <Table.Cell colSpan={9}>
                        <SitesManageSubComponent user={user} companyId={user.companyId} sites={user.sites!} />
                      </Table.Cell>
                    </Table.Row>
                  ) : (
                    <Table.Row key={`row-details-${rowIndex}`} className={data.expandedRows.includes(rowIndex) ? "selected" : ""}>
                      <Table.Cell colSpan={9}>
                        <Button
                          content="Assign Site"
                          basic
                          color="blue"
                          size="mini"
                          onClick={() => openModal("Assign Site to User", <AssignSiteToUserForm user={user} companyId={user.companyId} />, user, user.companyId)}
                        />{" "}
                        User is not assigned to any sites.
                      </Table.Cell>
                    </Table.Row>
                  )
                ) : null}
              </Fragment>
            );
          })}
      </Table.Body>
    </Table>
  );
};

export default observer(UsersTable);
