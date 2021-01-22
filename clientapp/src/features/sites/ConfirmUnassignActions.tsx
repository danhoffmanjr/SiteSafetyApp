import React, { useContext } from "react";
import { Button } from "reactstrap";
import { RootStoreContext } from "../../app/stores/rootStore";
import { IUserSiteFormValues } from "../../app/models/userSiteFormValues";

interface IProps {
  userId: string;
  siteId: number;
  page: string;
}

const ConfirmUnassignActions: React.FC<IProps> = ({ userId, siteId, page }) => {
  const rootStore = useContext(RootStoreContext);
  const { closeConfirm } = rootStore.modalStore;
  const { unassignSiteFromUser } = rootStore.userStore;
  const { unassignUserFromSite } = rootStore.siteStore;

  const handleDelete = (userId: string, siteId: number) => {
    let values: IUserSiteFormValues = {
      userId,
      siteId,
    };
    if (page === "users") {
      unassignSiteFromUser(values).then(() => {
        closeConfirm();
      });
    } else {
      unassignUserFromSite(values).then(() => {
        closeConfirm();
      });
    }
  };
  return (
    <>
      <Button color="primary" onClick={() => handleDelete(userId, siteId)}>
        Yes
      </Button>{" "}
      <Button color="secondary" onClick={closeConfirm}>
        No
      </Button>
    </>
  );
};

export default ConfirmUnassignActions;
