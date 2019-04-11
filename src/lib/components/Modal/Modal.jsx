import React from "react";
import "./Modal.scss";

const Modal = ({ children, className }) => (
  <div className="modal__wrapper">
    <div className={`modal ${className}`}>{children}</div>
  </div>
);

export default Modal;
