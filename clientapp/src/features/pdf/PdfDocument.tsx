import React, { Fragment, useState } from "react";
import { Document, Page, StyleSheet, View, Text, Image } from "@react-pdf/renderer";
import moment from "moment";
import { IReport } from "../../app/models/report";

interface IProps {
  report: IReport;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    minHeight: "100vh",
    padding: 40,
  },
  titleSection: {
    marginBottom: 20,
    textAlign: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  createdBy: {
    fontSize: 12,
  },
  createdOn: {
    fontSize: 9,
  },
  fields: {
    marginBottom: 15,
    padding: 25,
    fontSize: 12,
  },
  field: {
    marginBottom: 10,
    paddingBottom: 5,
    borderBottom: "solid #000",
    borderBottomWidth: 0.5,
  },
  fieldName: {
    fontStyle: "italic",
    marginBottom: 5,
  },
  fieldValue: {
    fontWeight: "bold",
    marginBottom: 5,
  },
});

const PdfDocument: React.FC<IProps> = ({ report }) => {
  const [fields, setFields] = useState(JSON.parse(report?.formDetails));
  return (
    <Document>
      <Page size="LETTER">
        {report ? (
          <View style={styles.container}>
            <View style={styles.titleSection}>
              <Text style={styles.title}>{report.title}</Text>
              <Text style={styles.createdBy}>{`By: ${report.createdBy}`}</Text>
              <Text style={styles.createdOn}>{`Date: ${moment(report.createdOn, "YYYY-MM-DD").format(" MMMM D Y")}`}</Text>
            </View>
            <View style={styles.fields}>
              {fields
                ? fields.fields.map((field: any) => {
                    return (
                      <View key={field.name} style={styles.field}>
                        <Text style={styles.fieldName}>{field.name}:</Text>
                        <Text style={styles.fieldValue}>{field.value}</Text>
                      </View>
                    );
                  })
                : ""}
            </View>
          </View>
        ) : (
          <View>
            <Text>Error: No Report Details</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default PdfDocument;
