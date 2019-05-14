import React, { useState } from "react";
import TextInput from "../../lib/components/TextInput";
import Button from "../../lib/components/Button";
import "./BitStitchEditor.scss";
import "../../../assets/fonts/Modikasti-normal";
import "../../../assets/fonts/Bringshoot-normal";
import DMCFlossColors from "../../lib/constants/DMCFlossColors";
import Modal from "../../lib/components/Modal";
import Checkbox from "../../lib/components/Checkbox";

const AllDMCDistanceCache = {};
const AllDMCColorKeys = Object.keys(DMCFlossColors);
const AllDMCFlossColorsCount = AllDMCColorKeys.length;

function BitStitchEditor() {
  const [bitStitch, setBitStitch] = useState(null);
  const [isColorMenuEnabled, setIsColorMenuEnabled] = useState(false);
  const [colorCount, setColorCount] = useState(25);
  const [colors, setColors] = useState({
    active: AllDMCColorKeys.slice(0, colorCount),
    inactive: AllDMCColorKeys.slice(
      colorCount,
      AllDMCColorKeys.length - colorCount
    )
  });
  const [gridColor, setGridColor] = useState([63, 63, 63, 255]);
  const [hasGrid, setHasGrid] = useState(true);
  const [image, setImage] = useState(null);
  const [imageLabel, setImageLabel] = useState("Please upload an image");
  const [isColorMenuOpen, setIsColorMenuOpen] = useState(false);
  const [pixelSize, setPixelSize] = useState(10);
  const [rowCount, setRowCount] = useState(100);

  const getIsFormValid = () => rowCount > 0 && colorCount > 0 && !!image;

  const isFormValid = getIsFormValid();

  function drawBitStitchBorder(canvas, context) {
    canvas.width = canvas.width + 1;
    canvas.height = canvas.height + 1;
    context.strokeStyle = "#3f3f3f";
    context.beginPath();
    context.moveTo(0, 1080);
    context.lineTo(1920, 1080);
    context.lineTo(1920, 0);
    context.stroke();
  }

  function drawBitStitchImage(canvas, context, buffer) {
    const bufferData = context.createImageData(
      canvas.width - 1,
      canvas.height - 1
    );
    bufferData.data.set(buffer);
    context.putImageData(bufferData, 0, 0);
    const bufferImageSrc = canvas.toDataURL();
    const bufferImage = new Image();
    bufferImage.src = bufferImageSrc;
    context.drawImage(bufferImage, 0, 0);
  }

  function createBitStitch() {
    const columnCount = Math.floor((rowCount * image.width) / image.height);
    const imageData = getStateImageData();
    const canvas = getBitStitchCanvas(columnCount);
    const context = canvas.getContext("2d");
    const buffer = manipulatePixels(canvas, imageData, columnCount);

    drawBitStitchBorder(canvas, context);
    drawBitStitchImage(canvas, context, buffer);
    setBitStitch(canvas.toDataURL());
  }

  function getBitStitchCanvas(columnCount) {
    const canvas = document.createElement("canvas");
    canvas.width = columnCount * pixelSize;
    canvas.height = rowCount * pixelSize;

    return canvas;
  }

  function getStateImageData() {
    const { width, height } = image;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0);

    return context.getImageData(0, 0, width, height).data;
  }

  function manipulatePixels(
    canvas,
    imageData,
    columnCount,
    autoSelectColors = false
  ) {
    const { width } = canvas;
    const imageWidth = image.width;
    const imageHeight = image.height;

    const DMCColorCounts = {};
    const DMCDistanceCache = autoSelectColors ? AllDMCDistanceCache : {};
    const DMCIndexes = autoSelectColors
      ? Object.keys(DMCFlossColors)
      : manipulatePixels(canvas, imageData, columnCount, true);

    const buffer = new Uint8ClampedArray(
      rowCount * columnCount * 4 * pixelSize * pixelSize
    );

    for (let rowNumber = 0; rowNumber < rowCount; rowNumber++) {
      const imageRowNumber = Math.floor((imageHeight * rowNumber) / rowCount);
      const y = rowNumber * pixelSize;

      for (let columnNumber = 0; columnNumber < columnCount; columnNumber++) {
        const imageColumnNumber = Math.floor(
          (imageWidth * columnNumber) / columnCount
        );
        const x = columnNumber * pixelSize;
        const pixelIndex =
          (imageRowNumber * imageWidth + imageColumnNumber) * 4;
        const pixelColor = imageData.slice(pixelIndex, pixelIndex + 4);
        const pixelColorString = pixelColor.join(",");
        const DMCColor =
          DMCDistanceCache[pixelColorString] ||
          roundToDMCColor(pixelColor, DMCIndexes);
        const { index } = DMCColor;

        if (!DMCDistanceCache[pixelColorString]) {
          DMCDistanceCache[pixelColorString] = DMCColor;
        }

        if (!autoSelectColors) {
          setBufferIndex(buffer, DMCColor, width, x, y);
        } else {
          if (!DMCColorCounts[index]) DMCColorCounts[index] = 0;
          DMCColorCounts[index]++;
        }
      }
    }

    return autoSelectColors
      ? Object.keys(DMCColorCounts)
          .sort((a, b) => DMCColorCounts[b] - DMCColorCounts[a])
          .slice(0, colorCount)
      : buffer;
  }

  function roundToDMCColor(color, DMCIndexes) {
    let closestColor = {};

    for (let index of DMCIndexes) {
      const { red, green, blue } = DMCFlossColors[index];
      const distance = Math.sqrt(
        Math.pow(color[0] - red, 2) +
          Math.pow(color[1] - green, 2) +
          Math.pow(color[2] - blue, 2)
      );

      if (!closestColor.distance || distance < closestColor.distance) {
        closestColor = { distance, index };
        if (distance === 0) break;
      }
    }

    return DMCFlossColors[closestColor.index];
  }

  function setBufferIndex(buffer, DMCColor, width, x, y) {
    for (let pixelRow = 0; pixelRow < pixelSize; pixelRow++) {
      for (let pixelColumn = 0; pixelColumn < pixelSize; pixelColumn++) {
        const bufferIndex = (width * (y + pixelRow) + x + pixelColumn) * 4;
        const colorSource =
          pixelRow === 0 || pixelColumn === 0
            ? gridColor
            : [DMCColor.red, DMCColor.green, DMCColor.blue, 255];

        for (let colorParam = 0; colorParam < 4; colorParam++) {
          buffer[bufferIndex + colorParam] = colorSource[colorParam];
        }
      }
    }
  }

  function onUpload(e, dataKey) {
    const imageFile = e[dataKey].files[0];
    const validExtensions = ["bmp", "gif", "jpg", "jpeg", "png"];
    const imageExtension = imageFile.name.split(".").pop();

    if (validExtensions.includes(imageExtension)) {
      const reader = new FileReader();

      reader.onload = file => {
        const image = new Image();
        image.onload = () => {
          setImage(image);
          setImageLabel(imageFile.name);
        };
        image.src = file.target.result;
      };

      reader.readAsDataURL(imageFile);
    } else setImageLabel("Invalid file type");
  }

  function onCountChange(value, setCount, countLimit) {
    value = parseInt(value, 10);
    if (Number.isNaN(value) || value < 0) value = 0;
    else if (value > countLimit) value = countLimit;
    setCount(value);
  }

  const renderColorList = collection => (
    <div className="bitstitch-editor__color-menu-wrapper">
      <ul className="bitstitch-editor__color-menu">
        {colors[collection].map(i => {
          const { red, green, blue, index, name } = DMCFlossColors[i];
          return (
            <li
              key={i}
              className="bitstitch-editor__color-item"
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
                className="bitstitch-editor__color-circle"
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
    <div className="bitstitch-editor">
      {isColorMenuOpen && (
        <Modal className="bitstitch-editor__modal">
          {renderColorList("active")}
          {renderColorList("inactive")}
        </Modal>
      )}
      <div className="bitstitch-editor__title">
        <span className="bitstitch-editor__title-span">BitStitches</span>
        <svg
          width="240"
          height="12"
          className="bitstitch-editor__title-underline"
          fill="transparent"
          strokeWidth="4"
          stroke="rgb(96, 149, 139)"
        >
          <path d="M0 7 C 120 0 180 0 240 5" />
        </svg>
      </div>
      <h3 className="bitstitch-editor__subtitle">
        Cross-stitch pattern and pixel art creation software
      </h3>
      <TextInput
        className="bitstitch-editor__field"
        label="Row Count"
        onChange={e => {
          onCountChange(e.target.value, setRowCount, 250);
        }}
        numPad
        value={rowCount}
      />
      <TextInput
        className="bitstitch-editor__field"
        label="Color Count"
        onChange={e => {
          onCountChange(e.target.value, setColorCount, AllDMCFlossColorsCount);
        }}
        numPad
        value={colorCount}
      />
      <div className="bitstitch-editor__color-menu-options">
        <Checkbox
          checked={isColorMenuOpen}
          onClick={() => {
            setIsColorMenuEnabled(!isColorMenuEnabled);
          }}
        />
        <Button
          disabled={!isColorMenuEnabled}
          onClick={() => {
            setIsColorMenuOpen(!isColorMenuOpen);
          }}
          text="Choose Colors"
        />
      </div>
      <span className="bitstitch-editor__file-span">{imageLabel}</span>
      <label className="bitstitch-editor__upload-label">
        <input
          type="file"
          onChange={e => {
            onUpload(e, "target");
          }}
        />
        <span className="bitstitch-editor__upload-span">Select Image</span>
      </label>
      <Button
        disabled={!isFormValid}
        onClick={createBitStitch}
        submit
        text="Create BitStitch"
      />
      <div className="bitstitch-editor__preview-wrapper">
        {bitStitch && (
          <img
            alt="uploaded cross-stitch pattern"
            className="bitstitch-editor__preview"
            src={bitStitch}
          />
        )}
      </div>
    </div>
  );
}

export default BitStitchEditor;
