import React from "react";

const ConfirmModal = (props) => {
  return (
    <div className="modal is-active">
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Are you sure you want to proceed?</p>
          <button
            className="delete"
            aria-label="close"
            onClick={props.onCancel}
          ></button>
        </header>

        <footer className="modal-card-foot">
          <button className="button is-success" onClick={props.onConfirm}>
            Confirm
          </button>
          <button className="button" onClick={props.onCancel}>
            Cancel
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ConfirmModal;
