import React, { useContext } from "react";
import { Button } from "reactstrap";
import { RootStoreContext } from "../../app/stores/rootStore";
import { useHistory } from "react-router-dom";

interface IProps {
  reportId: number;
}

const ConfirmDeleteReportActions = ({ reportId }: IProps) => {
  const rootStore = useContext(RootStoreContext);
  const { closeConfirm } = rootStore.modalStore;
  const { deleteReport, isSubmitting } = rootStore.reportStore;

  let history = useHistory();

  const handleDelete = (id: number) => {
    deleteReport(id).then(() => {
      closeConfirm();
      history.push("/reports");
    });
  };
  return (
    <>
      <Button color="primary" loading={isSubmitting} onClick={() => handleDelete(reportId)}>
        Yes
      </Button>{" "}
      <Button color="secondary" onClick={closeConfirm}>
        No
      </Button>
    </>
  );
};

export default ConfirmDeleteReportActions;
