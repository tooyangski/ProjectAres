import React from "react";

import Modal from "./Modal";

const ErrorModal = (props) => {
  return (
    <Modal
      onClose={props.onClose}
      header={"There seems to be a problem, see details below."}
      error={props.error}
      show={props.show}
      isActive={props.isActive}
      footer={props.footer}
    >
      <div>
        <p>{props.error}</p>
      </div>
    </Modal>
  );
};

export default ErrorModal;
