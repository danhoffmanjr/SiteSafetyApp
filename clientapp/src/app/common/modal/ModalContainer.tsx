import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { RootStoreContext } from "../../stores/rootStore";

const ModalContainer = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    modal: { open, header, body },
    closeModal,
  } = rootStore.modalStore;
  return (
    <Modal isOpen={open} toggle={closeModal} size="lg">
      <ModalHeader toggle={closeModal}>{header}</ModalHeader>
      <ModalBody>{body}</ModalBody>
    </Modal>
  );
};

export default observer(ModalContainer);
