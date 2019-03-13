import React from 'react';
import './TextInput.scss';

const TextInput = props => (
  <div
    className={`text-input__wrapper${props.className ? ` ${props.className}` : ''}`}
  >
    <input
      className={`text-input${props.hasError ? " error" : ""}`}
      onChange={props.onChange}
      value={props.value}
    />
  </div>
);

export default TextInput;
