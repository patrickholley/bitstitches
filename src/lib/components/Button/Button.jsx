import React from "react";
import classNames from "classnames";
import "./Button.scss";

export default ({ className, disabled, onClick, secondary, submit, text }) => (
  <button
    className={classNames({
      button: true,
      [className]: !!className,
      primary: !secondary,
      secondary
    })}
    disabled={disabled}
    onClick={onClick}
    type={submit ? "submit" : "button"}
  >
    {text}
  </button>
);
