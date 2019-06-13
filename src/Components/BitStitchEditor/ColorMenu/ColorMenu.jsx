import React from "react";
import Button from "../../../lib/components/Button";
import "./ColorMenu.scss";

const ColorMenu = ({ allColors, currentColors, onClose, setCurrentColors }) => {
  const isSelectedColorsEmpty = currentColors.selected.length === 0;

  function handleColorClick(index, inCollectionName) {
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

    let i = 0;
    const outCollectionLength = outCollection.length;
    do {
      if (i >= outCollectionLength - 1) {
        outCollection.push(index);
      } else if (index <= outCollection[i]) {
        outCollection.splice(i, 0, index);
        break;
      }

      i++;
    } while (i < outCollectionLength);

    setCurrentColors({
      [inCollectionName]: inCollection,
      [outCollectionName]: outCollection
    });
  }

  function handleClear(inCollectionName) {
    const outCollectionName =
      inCollectionName === "selected" ? "ignored" : "selected";

    setCurrentColors({
      [inCollectionName]: [],
      [outCollectionName]: Object.keys(allColors)
    });
  }

  const generateColorItems = inCollectionName =>
    currentColors[inCollectionName].map(index => {
      const { RGB } = allColors[index];

      return (
        <li
          key={index}
          className="color-menu__list-item"
          onClick={() => {
            handleColorClick(index, inCollectionName);
          }}
        >
          <div
            className="color-menu__list-circle"
            style={{ backgroundColor: `rgb(${RGB})` }}
          />
          <span>{index}</span>
        </li>
      );
    });

  const generateColorList = inCollectionName => (
    <div className="color-menu__list-wrapper">
      {inCollectionName}
      <ul className="color-menu__list">
        {isSelectedColorsEmpty && inCollectionName === "selected" ? (
          <div className="color-menu__list-error">
            at least one color must be selected
          </div>
        ) : (
          generateColorItems(inCollectionName)
        )}
      </ul>
      <Button
        className="color-menu__list-button"
        onClick={() => {
          handleClear(inCollectionName);
        }}
        secondary
        text="Clear"
      />
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
        disabled={isSelectedColorsEmpty}
        onClick={onClose}
        text="Close Menu"
      />
    </div>
  );
};

export default ColorMenu;
