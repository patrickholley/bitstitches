import React from "react";
import "./Checkbox.scss";

export default ({ checked, onClick }) => (
  <input type="checkbox" onClick={onClick} {...checked && { checked: true }} />
);
