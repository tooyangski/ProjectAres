import React from "react";

const AddModal = (props) => {
  return (
    <div className="modal is-active">
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{props.headerTitle}</p>
          <button
            className="delete"
            aria-label="close"
            onClick={props.onCancel}
          ></button>
        </header>
        <section className="modal-card-body">{props.children}</section>
      </div>
    </div>
  );
};

export default AddModal;
