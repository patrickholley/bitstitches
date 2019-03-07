import React from 'react';
import './Button.scss';

const Button = props => (
  <button
    className={`button ${props.className}`}
    form={props.formId}
    onClick={props.onClick}
    type="button"
  >
    {props.text}
  </button>
);

export default Button;
