import React from "react";
import classNames from "classnames";
import "./Checkbox.scss";

export default ({ checked, onClick }) => {
  return (
    <button
      className={classNames("toggle-switch", { checked })}
      onClick={onClick}
    >
      <div className={classNames("toggle-switch__button", { checked })} />
    </button>
  );
};
