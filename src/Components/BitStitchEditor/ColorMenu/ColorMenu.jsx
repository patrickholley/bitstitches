/* import React from "react";
import Button from "../../../lib/components/Button";
import "./ColorMenu.scss";

const ColorMenu = ({ colors, onClose, setColors }) => {
  const generateColorList = collection => (
    <div className="color-menu__list-wrapper">
      {collection === "active" ? "selected" : "ignored"}
      <ul className="color-menu__list">
        {colors[collection].map(i => {
          const { red, green, blue, index, name } = DMCFlossColors[i];
          return (
            <li
              key={i}
              className="color-menu__list-item"
              onClick={() => {
                const inContainer = [];
                const outContainer = [];
                for (let key in DMCFlossColors) {
                  if (key !== i && colors[collection].indexOf(key) !== -1) {
                    inContainer.push(key);
                  } else outContainer.push(key);
                }
                setColors(
                  collection === "active"
                    ? { active: inContainer, inactive: outContainer }
                    : { active: outContainer, inactive: inContainer }
                );
              }}
            >
              <div
                className="color-menu__list-circle"
                style={{ backgroundColor: `rgb(${red}, ${green}, ${blue})` }}
              />
              <span>{index}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <div className="color-menu">
      <span className="color-menu__prompt">
        Choose a color to move it to the other column
      </span>
      <div className="color-menu__lists">
        {generateColorList("active")}
        {generateColorList("inactive")}
      </div>
      <Button
        className="color-menu__close"
        onClick={onClose}
        text="Close Menu"
      />
    </div>
  );
};

export default ColorMenu;
 */
