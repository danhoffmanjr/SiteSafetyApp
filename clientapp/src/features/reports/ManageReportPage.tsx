import React, { Fragment, useEffect, useState } from "react";
import { useContext } from "react";
import { RouteComponentProps } from "react-router-dom";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { RootStoreContext } from "../../app/stores/rootStore";
import { Accordion, Button, Grid, Header, Icon, Segment, Image, Card } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import CreateReportForm from "./CreateReportForm";
import { DefaultFormValues } from "../../app/models/reportFormValues";
import ConfirmDeleteReportActions from "./ConfirmDeleteReportActions";
import { useHistory } from "react-router-dom";

interface RouteParams {
  id: string;
}

interface IProps extends RouteComponentProps<RouteParams> {}

const ManageReportPage = ({ match }: IProps) => {
  const rootStore = useContext(RootStoreContext);
  const { loadReportById, loadingReport, report } = rootStore.reportStore;
  const { deleteImage } = rootStore.imageStore;
  const { getLocaleDateTime } = rootStore.commonStore;
  const {
    openConfirm,
    confirm: { isDeleting, target },
  } = rootStore.modalStore;

  let history = useHistory();

  useEffect(() => {
    loadReportById(match.params.id);
  }, [loadReportById, match]);

  const [activeIndex, setActiveIndex] = useState<number>(0);

  const defaultValues =
    report &&
    new DefaultFormValues({
      id: report.id.toString(),
      title: report.title,
      companyId: report.companyId.toString(),
      companyName: report.companyName,
      siteId: report.siteId.toString(),
      siteName: report.siteName,
      reportTypeId: report.reportTypeId.toString(),
      reportType: report.reportType,
      reportFields: report.reportFields,
      images: report.images,
    });

  if (loadingReport) return <LoadingComponent content="Loading report..." />;

  return (
    <Fragment>
      <Segment>
        <Grid>
          <Grid.Column width={14}>
            <Header as="h2">
              <Icon name="file alternate" />
              <Header.Content>
                {report?.title ?? "No report loaded"}
                <Header.Subheader>
                  Submitted by {report?.createdBy} on {getLocaleDateTime(new Date(report?.createdOn!))}
                </Header.Subheader>
              </Header.Content>
            </Header>
          </Grid.Column>
          <Grid.Column width={2} textAlign="center" verticalAlign="middle">
            <Button
              size="mini"
              basic
              color="red"
              content="Delete Report"
              loading={target === report?.id && isDeleting}
              name={report?.id}
              onClick={() =>
                openConfirm(
                  "Confirm Delete Site",
                  <p>
                    Are you sure you want to delete <strong>{`${report?.title}`}</strong>?
                  </p>,
                  <ConfirmDeleteReportActions reportId={report!.id} />,
                  report?.id,
                  report?.id
                )
              }
            />
          </Grid.Column>
        </Grid>
      </Segment>
      <Accordion fluid styled>
        <Accordion.Title active={activeIndex === 0} index={0} onClick={() => setActiveIndex(0)}>
          <Icon name="dropdown" />
          Edit Report Details
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>{report && <CreateReportForm report={defaultValues!} />}</Accordion.Content>

        <Accordion.Title active={activeIndex === 1} index={1} onClick={() => setActiveIndex(1)}>
          <Icon name="dropdown" />
          Manage Images [{report?.images.length}]
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 1}>
          <Card.Group>
            {report && report?.images.length > 0 ? (
              report.images.map((image) => (
                <Card key={image.id}>
                  <Image src={image.imageDataUrl} wrapped ui={true} />
                  <Card.Content>
                    <Card.Meta>{image.fileName}</Card.Meta>
                    <Card.Description>
                      <span style={{ color: "CornflowerBlue" }}>Description:</span>
                      <br />
                      {image.description}
                    </Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <div className="ui two buttons">
                      <Button basic primary onClick={() => history.push(`/images/manage/${image.id}`)}>
                        Edit
                      </Button>
                      <Button basic color="red" onClick={() => deleteImage(image.id.toString(), image.fileName)}>
                        Remove
                      </Button>
                    </div>
                  </Card.Content>
                </Card>
              ))
            ) : (
              <Button basic color="blue" content="Add Image" />
            )}
          </Card.Group>
        </Accordion.Content>
      </Accordion>
    </Fragment>
  );
};

export default observer(ManageReportPage);
