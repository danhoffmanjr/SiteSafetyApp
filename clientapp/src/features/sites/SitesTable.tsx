import React, { useState, useEffect, Fragment, useContext } from "react";
import { Button, Icon, Popup, Table } from "semantic-ui-react";
import useSortableData from "../../app/common/utils/useSortableData";
import { ISite } from "../../app/models/site";
import { RootStoreContext } from "../../app/stores/rootStore";
import AssignUserToSiteForm from "../user/AssignUserToSiteForm";
import UsersManageSubComponent from "../user/UsersManageSubComponent";
import SitesPage from "./SitesPage";
import { history } from "../..";

interface IProps {
  sites: ISite[];
}

const SitesTable: React.FC<IProps> = ({ sites }) => {
  const rootStore = useContext(RootStoreContext);
  const { openModal } = rootStore.modalStore;

  const columns = [
    { name: "", field: "expander" },
    { name: "Name", field: "name" },
    { name: "Address", field: "address" },
    { name: "Company", field: "companyName" },
    { name: "", field: "actions" },
  ];

  const [data, setData] = useState<{ sites: ISite[]; expandedRows: number[] }>({ sites: sites, expandedRows: [] });
  const { items, requestSort, sortConfig } = useSortableData(data.sites);

  useEffect(() => {
    setData((data) => {
      return { ...data, sites };
    });
  }, [sites]);

  const handleRowClick = (rowId: number) => {
    const currentExpandedRows = data.expandedRows;
    const isRowCurrentlyExpanded = currentExpandedRows.includes(rowId);

    const newExpandedRows = isRowCurrentlyExpanded ? currentExpandedRows.filter((id) => id !== rowId) : currentExpandedRows.concat(rowId);

    setData({ ...data, expandedRows: newExpandedRows });
  };

  const styles = {
    expanderColumn: {
      maxWidth: "2rem",
    },
    actionsColumn: {
      maxWidth: "83px",
    },
  };

  return (
    <Table sortable striped celled selectable compact>
      <Table.Header>
        <Table.Row>
          {sites.length > 0 &&
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
        {items.length > 0 &&
          items.map((site: ISite, rowIndex) => {
            return (
              <Fragment key={rowIndex}>
                <Table.Row key={rowIndex} className={data.expandedRows.includes(rowIndex) ? "selected" : ""}>
                  <Table.Cell style={styles.expanderColumn} onClick={() => handleRowClick(rowIndex)}>
                    {data.expandedRows.includes(rowIndex) ? <Icon name="caret down" /> : <Popup content={`Show users and reports`} trigger={<Icon name="caret right" />} />}
                  </Table.Cell>
                  <Table.Cell>{site.name}</Table.Cell>
                  <Table.Cell>{site.address}</Table.Cell>
                  <Table.Cell>{site.companyName}</Table.Cell>
                  <Table.Cell style={styles.actionsColumn}>
                    <Button size="mini" basic content="Manage" floated="right" name={site.id} onClick={() => history.push(`/sites/manage/${site.id.toString()}`)} />
                  </Table.Cell>
                </Table.Row>
                {data.expandedRows.includes(rowIndex) ? (
                  (site.users !== undefined || site.users !== null) && site.users!.length > 0 ? (
                    <Table.Row key={`row-details-${rowIndex}`} className={data.expandedRows.includes(rowIndex) ? "selected" : ""}>
                      <Table.Cell colSpan={5}>
                        <UsersManageSubComponent users={site.users!} site={site} />
                      </Table.Cell>
                    </Table.Row>
                  ) : (
                    <Table.Row key={`row-details-${rowIndex}`} className={data.expandedRows.includes(rowIndex) ? "selected" : ""}>
                      <Table.Cell colSpan={5}>
                        <Button content="Assign User" basic color="blue" size="mini" onClick={() => openModal("Assign User to Site", <AssignUserToSiteForm site={site} />, site.id, site.name)} /> No
                        users assigned to this site.
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

export default SitesTable;
