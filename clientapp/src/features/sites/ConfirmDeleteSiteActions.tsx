import React, { useContext } from "react";
import { Button } from "reactstrap";
import { RootStoreContext } from "../../app/stores/rootStore";

interface IProps {
  siteId: number;
}

const ConfirmDeleteSiteActions: React.FC<IProps> = ({ siteId }) => {
  const rootStore = useContext(RootStoreContext);
  const { closeConfirm } = rootStore.modalStore;
  const { deleteSiteFromCompany, isSubmitting } = rootStore.companyStore;

  const handleDelete = (id: number) => {
    deleteSiteFromCompany(id.toString()).then(() => {
      closeConfirm();
    });
  };
  return (
    <>
      <Button color="primary" loading={isSubmitting} onClick={() => handleDelete(siteId)}>
        Yes
      </Button>{" "}
      <Button color="secondary" onClick={closeConfirm}>
        No
      </Button>
    </>
  );
};

export default ConfirmDeleteSiteActions;
