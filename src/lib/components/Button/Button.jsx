import React from "react";
import classNames from "classnames";
import "./Button.scss";

const Button = ({ className, onClick, secondary, submit, text }) => (
  <button
    className={classNames({
      button: true,
      [className]: !!className,
      primary: !secondary,
      secondary
    })}
    onClick={onClick}
    type={submit ? "submit" : "button"}
  >
    {text}
  </button>
);

export default Button;
