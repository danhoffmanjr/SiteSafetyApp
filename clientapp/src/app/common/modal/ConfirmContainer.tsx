import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { RootStoreContext } from "../../stores/rootStore";

const ConfirmContainer = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    confirm: { open, header, body, footer },
    closeConfirm,
  } = rootStore.modalStore;
  return (
    <Modal isOpen={open} toggle={closeConfirm} size="lg">
      <ModalHeader toggle={closeConfirm}>{header}</ModalHeader>
      <ModalBody>{body}</ModalBody>
      <ModalFooter>{footer}</ModalFooter>
    </Modal>
  );
};

export default observer(ConfirmContainer);
