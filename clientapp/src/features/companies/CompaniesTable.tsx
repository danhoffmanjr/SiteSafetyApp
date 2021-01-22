import { observer } from "mobx-react-lite";
import React, { useState, useEffect, Fragment, useContext } from "react";
import { Button, Icon, Popup, Table } from "semantic-ui-react";
import useSortableData from "../../app/common/utils/useSortableData";
import { ICompany } from "../../app/models/company";
import { RootStoreContext } from "../../app/stores/rootStore";
import AddSiteToCompanyForm from "./AddSiteToCompanyForm";
import CompanySitesSubComponent from "./CompanySitesSubComponent";
import ConfirmDeleteActions from "./ConfirmDeleteActions";
import ConfirmDeleteBody from "./ConfirmDeleteBody";

interface IProps {
  companies: ICompany[];
}

const CompaniesTable: React.FC<IProps> = ({ companies }) => {
  const rootStore = useContext(RootStoreContext);
  const {
    openModal,
    openConfirm,
    confirm: { isDeleting, target },
  } = rootStore.modalStore;

  const columns = [
    { name: "", field: "expander" },
    { name: "Name", field: "name" },
    { name: "", field: "actions" },
  ];

  const [data, setData] = useState<{ companies: ICompany[]; expandedRows: number[] }>({ companies: companies, expandedRows: [] });
  const { items, requestSort, sortConfig } = useSortableData(data.companies);

  useEffect(() => {
    setData((data) => {
      return { ...data, companies };
    });
  }, [companies]);

  const styles = {
    expanderColumn: {
      maxWidth: "2rem",
    },
    actionsColumn: {
      maxWidth: "2rem",
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
          <Table.HeaderCell style={styles.expanderColumn}></Table.HeaderCell>
          <Table.HeaderCell sorted={"name" === sortConfig?.key ? sortConfig?.direction : null} onClick={() => requestSort("name")}>
            Company Name
          </Table.HeaderCell>
          <Table.HeaderCell style={styles.actionsColumn}></Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {items[0] &&
          items.map((company: ICompany, rowIndex) => {
            return (
              <Fragment key={rowIndex}>
                <Table.Row key={rowIndex} className={data.expandedRows.includes(rowIndex) ? "selected" : ""}>
                  <Table.Cell style={styles.expanderColumn} onClick={() => handleRowClick(rowIndex)}>
                    {data.expandedRows.includes(rowIndex) ? <Icon name="caret down" /> : <Popup content={`Show sites for ${company.name}`} trigger={<Icon name="caret right" />} />}
                  </Table.Cell>
                  <Table.Cell>{company.name}</Table.Cell>
                  <Table.Cell style={styles.actionsColumn}>
                    <Button
                      size="mini"
                      icon="trash"
                      floated="right"
                      loading={target === company.id && isDeleting}
                      name={company.id}
                      onClick={() => openConfirm(`Delete ${company.name}?`, <ConfirmDeleteBody />, <ConfirmDeleteActions id={company.id} />, company.id, company.id)}
                    />
                  </Table.Cell>
                </Table.Row>
                {data.expandedRows.includes(rowIndex) ? (
                  company.sites !== (undefined || null) && company.sites![0] ? (
                    <Table.Row key={`row-details-${rowIndex}`} className={data.expandedRows.includes(rowIndex) ? "selected" : ""}>
                      <Table.Cell colSpan={9}>
                        <CompanySitesSubComponent sites={company.sites!} company={company} />
                      </Table.Cell>
                    </Table.Row>
                  ) : (
                    <Table.Row key={`row-details-${rowIndex}`} className={data.expandedRows.includes(rowIndex) ? "selected" : ""}>
                      <Table.Cell colSpan={9}>
                        <Button
                          content="Create Site"
                          basic
                          color="blue"
                          size="mini"
                          onClick={() => openModal(`Create Site for ${company.name}`, <AddSiteToCompanyForm company={company} />, company.id, company.name)}
                        />{" "}
                        There are no sites for {`${company.name}`}.
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

export default observer(CompaniesTable);
