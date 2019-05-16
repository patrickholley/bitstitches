import React, { useState } from "react";
import "./Modal.scss";

export default ({ children, className, isModalOpen, onClose }) => (
  <>
    {isModalOpen && (
      <div className="modal__wrapper" onClick={onClose}>
        <div
          className={`modal ${className}`}
          onClick={e => {
            e.stopPropagation();
          }}
        >
          {children}
        </div>
      </div>
    )}
  </>
);
