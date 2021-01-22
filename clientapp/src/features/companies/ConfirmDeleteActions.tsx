import React, { useContext } from "react";
import { Button } from "reactstrap";
import { RootStoreContext } from "../../app/stores/rootStore";

interface IProps {
  id: number;
}

const ConfirmDeleteActions: React.FC<IProps> = ({ id }) => {
  const rootStore = useContext(RootStoreContext);
  const { closeConfirm } = rootStore.modalStore;
  const { deleteCompany } = rootStore.companyStore;
  const handleDelete = (id: string) => {
    deleteCompany(id);
    closeConfirm();
  };
  return (
    <>
      <Button color="primary" onClick={() => handleDelete(id.toString())}>
        Yes
      </Button>{" "}
      <Button color="secondary" onClick={closeConfirm}>
        No
      </Button>
    </>
  );
};

export default ConfirmDeleteActions;
