import React, { Component } from 'react';
import classNames from "classnames";
import './TextInput.scss';

class TextInput extends Component {
  constructor() {
    super();

    this.state = {
      isPristine: true,
    }
  }

  render() {
    const { className, errorMessage, label, onChange, validate, value } = this.props;
    const { isPristine } = this.state;

    const hasError = !isPristine && !validate(value);

    return (
      <div
        className={classNames({
          'text-input__wrapper': true,
          label: value !== '',
          placeholder: value === '',
          error: hasError,
          [className]: !!className
        })}
        props-label={label}
      >
        <input
          className="text-input"
          onChange={onChange}
          onBlur={() => {
            if (isPristine) this.setState({ isPristine: false });
          }}
          value={value}
        />
        <span className="text-input__error">{errorMessage}</span>
      </div>
    );
  }
}

TextInput.defaultProps = {
  errorMessage: "Ehhh",
  validate: value => value !== ""
};

export default TextInput;
