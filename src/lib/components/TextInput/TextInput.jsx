import React, { Component } from "react";
import classNames from "classnames";
import "./TextInput.scss";

class TextInput extends Component {
  constructor() {
    super();

    this.state = {
      isPristine: true
    };
  }

  render() {
    const {
      className,
      disabled,
      errorMessage,
      label,
      onChange,
      numPad,
      validate,
      value
    } = this.props;
    const { isPristine } = this.state;
    const hasError = !isPristine && !validate(value);

    return (
      <div
        className={classNames("text-input__wrapper", {
          label: value !== "",
          placeholder: value === "",
          error: hasError,
          [className]: !!className
        })}
        data-label={label}
      >
        <input
          className="text-input"
          disabled={disabled}
          onChange={onChange}
          onBlur={() => {
            if (isPristine) this.setState({ isPristine: false });
          }}
          onKeyDown={e => {
            if (numPad) {
              if (e.key === "ArrowUp") {
                onChange({
                  ...e,
                  target: { ...e.target, value: +e.target.value + 1 }
                });
              } else if (e.key === "ArrowDown") {
                onChange({
                  ...e,
                  target: { ...e.target, value: +e.target.value - 1 }
                });
              }
            }
          }}
          type={numPad ? "tel" : "text"}
          value={value}
        />
        {hasError && <span className="text-input__error">{errorMessage}</span>}
      </div>
    );
  }
}

TextInput.defaultProps = {
  errorMessage: "Required",
  validate: value => value !== ""
};

export default TextInput;
