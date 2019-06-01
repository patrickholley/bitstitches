import React from "react";
import Button from "../../../lib/components/Button";
import "./ColorMenu.scss";

const ColorMenu = ({ allColors, currentColors, onClose, setCurrentColors }) => {
  function handleClick(index, inCollectionName) {
    const outCollectionName =
      inCollectionName === "selected" ? "ignored" : "selected";

    const inCollection = currentColors[inCollectionName].slice();
    const outCollection = currentColors[outCollectionName].slice();

    for (let i = 0; i < inCollection.length; i++) {
      if (index === inCollection[i]) {
        inCollection.splice(i, 1);
        break;
      }
    }

    for (let i = 0; i < outCollection.length; i++) {
      if (index <= outCollection[i]) {
        outCollection.splice(i, 0, index);
        break;
      }

      if (i === outCollection.length - 1) {
        outCollection.push(index);
        break;
      }
    }

    setCurrentColors({
      [inCollectionName]: inCollection,
      [outCollectionName]: outCollection
    });
  }

  const generateColorList = inCollectionName => (
    <div className="color-menu__list-wrapper">
      {inCollectionName}
      <ul className="color-menu__list">
        {currentColors[inCollectionName].map(index => {
          const { RGB } = allColors[index];

          return (
            <li
              key={index}
              className="color-menu__list-item"
              onClick={() => {
                handleClick(index, inCollectionName);
              }}
            >
              <div
                className="color-menu__list-circle"
                style={{ backgroundColor: `rgb(${RGB})` }}
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
        {generateColorList("selected")}
        {generateColorList("ignored")}
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
