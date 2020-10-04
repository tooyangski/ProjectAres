import React from "react";
import ReactDOM from "react-dom";

import { CSSTransition } from "react-transition-group";

const ModalOverlay = (props) => {
  const content = (
    <div className={`modal ${props.isActive}`}>
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{props.header}</p>
          <button
            onClick={props.onClose}
            className="delete"
            aria-label="close"
          ></button>
        </header>
        <section className="modal-card-body">{props.children}</section>
        <footer className="modal-card-foot">{props.footer}</footer>
      </div>
    </div>
  );
  return ReactDOM.createPortal(content, document.getElementById("modal-hook"));
};

const Modal = (props) => {
  return (
    <React.Fragment>
      <CSSTransition
        in={props.show}
        mountOnEnter
        unmountOnExit
        timeout={200}
        classNames="modal"
      >
        <ModalOverlay {...props} />
      </CSSTransition>
    </React.Fragment>
  );
};

export default Modal;
