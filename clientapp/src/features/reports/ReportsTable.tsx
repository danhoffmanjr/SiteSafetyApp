import React, { Fragment, useContext } from "react";
import { Button, Icon, Table, Popup } from "semantic-ui-react";
import useSortableData from "../../app/common/utils/useSortableData";
import { IReport } from "../../app/models/report";
import { history } from "../..";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfDocument from "../pdf/PdfDocument";
import moment from "moment";
import { RootStoreContext } from "../../app/stores/rootStore";

interface IProps {
  reports: IReport[];
}

const ReportsTable: React.FC<IProps> = ({ reports }) => {
  const rootStore = useContext(RootStoreContext);
  const { getLocaleDateOffset } = rootStore.commonStore;

  const columns = [
    { name: "Title", field: "title" },
    { name: "Report Type", field: "formType" },
    { name: "Company Name", field: "companyName" },
    { name: "Site Name", field: "siteName" },
    { name: "Created By", field: "createdBy" },
    { name: "Date", field: "createdOn" },
    { name: "Completed", field: "isComplete" },
    { name: "PDF", field: "pdf" },
    { name: "", field: "actions" },
  ];

  const { items, requestSort, sortConfig } = useSortableData(reports);

  const styles = {
    expanderColumn: {
      maxWidth: "2rem",
    },
    actionsColumn: {
      maxWidth: "83px",
    },
    pdfColumn: {
      maxWidth: "33px",
    },
  };

  return (
    <Table sortable striped celled selectable compact>
      <Table.Header>
        <Table.Row>
          {items[0] &&
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
          items.map((report: IReport, rowIndex) => {
            return (
              <Fragment key={rowIndex}>
                <Table.Row key={rowIndex}>
                  <Table.Cell>{report.title}</Table.Cell>
                  <Table.Cell>{report.reportType}</Table.Cell>
                  <Table.Cell>{report.companyName}</Table.Cell>
                  <Table.Cell>{report.siteName}</Table.Cell>
                  <Table.Cell>{report.createdBy}</Table.Cell>
                  <Table.Cell>{getLocaleDateOffset(new Date(report.createdOn!))}</Table.Cell>
                  <Table.Cell>{report.isComplete.toString()}</Table.Cell>

                  <Table.Cell textAlign="center" verticalAlign="middle">
                    <PDFDownloadLink document={<PdfDocument report={report} />} fileName={`${report.title}.pdf`}>
                      <Popup content={`Download PDF for ${report.title}`} trigger={<Icon name="file pdf outline" />} />
                    </PDFDownloadLink>
                  </Table.Cell>
                  <Table.Cell style={styles.actionsColumn}>
                    <Button size="mini" basic content="Manage" name={report.id} onClick={() => history.push(`/reports/manage/${report.id}`)} />
                  </Table.Cell>
                </Table.Row>
              </Fragment>
            );
          })}
      </Table.Body>
    </Table>
  );
};

export default ReportsTable;
