import React, { useEffect, useReducer, useState } from "react";
import classNames from "classnames";
import TextInput from "../../lib/components/TextInput";
import Button from "../../lib/components/Button";
import "./BitStitchEditor.scss";
import Modal from "../../lib/components/Modal";
import ToggleSwitch from "../../lib/components/ToggleSwitch";
import Loading from "../../lib/components/Loading";
import ColorMenu from "./ColorMenu";
import reducer, { initialState } from "../../reducer";
import {
  GET_COLORS_REQUEST,
  GENERATE_PATTERN_REQUEST
} from "../../lib/constants/actions";
import { getColors } from "../../api/colors";
import { generatePattern } from "../../api/patterns";
import networkStatus from "../../lib/constants/networkStatus";

function BitStitchEditor() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isColorMenuEnabled, setIsColorMenuEnabled] = useState(false);
  const [colorCount, setColorCount] = useState(25);
  const [allColorsCount, setAllColorsCount] = useState(colorCount);
  const [gridColor, setGridColor] = useState([63, 63, 63, 255]);
  const [hasGrid, setHasGrid] = useState(true);
  const [image, setImage] = useState(null);
  const [imageLabel, setImageLabel] = useState("Please upload an image");
  const [isColorMenuOpen, setIsColorMenuOpen] = useState(false);
  const [pixelSize, setPixelSize] = useState(10);
  const [rowCount, setRowCount] = useState(100);
  const [currentColors, setCurrentColors] = useState({
    selected: [],
    ignored: []
  });

  const getIsFormValid = () => rowCount > 0 && colorCount > 0 && !!image;

  const isFormValid = getIsFormValid();

  useEffect(function() {
    dispatch({ type: GET_COLORS_REQUEST });
    getColors(dispatch);
  }, []);

  useEffect(
    function() {
      if (state.allColors) {
        const allColorKeys = Object.keys(state.allColors);
        setCurrentColors({
          selected: allColorKeys.slice(0, colorCount),
          ignored: allColorKeys.slice(colorCount)
        });
        setAllColorsCount(allColorKeys.length);
      }
    },
    [state.allColors]
  );

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

  function onSubmit() {
    dispatch({ type: GENERATE_PATTERN_REQUEST });

    const canvas = document.createElement("canvas");
    canvas.height = rowCount;
    canvas.width = rowCount * (image.width / image.height);

    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    generatePattern({ requestImageString: canvas.toDataURL() }, dispatch);
  }

  return (
    <div className="bitstitch-editor">
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
      {state.getColorsInProgress !== networkStatus.SUCCESS ? (
        <Loading />
      ) : (
        <>
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
              onCountChange(e.target.value, setColorCount, allColorsCount);
            }}
            numPad
            value={colorCount}
          />
          <div
            className={classNames("bitstitch-editor__menu-wrapper", {
              disabled: isColorMenuEnabled
            })}
          >
            <div className="bitstitch-editor__menu-enable">
              <ToggleSwitch
                checked={!isColorMenuEnabled}
                onClick={() => {
                  setIsColorMenuEnabled(!isColorMenuEnabled);
                }}
              />
              <span className="bitstitch-editor__enable-label">
                Use the most common colors in my picture
              </span>
            </div>
            <Modal
              className="bitstitch-editor__color-modal"
              isModalOpen={isColorMenuOpen}
              onClose={() => {
                setIsColorMenuOpen(false);
              }}
            >
              <ColorMenu
                allColors={state.allColors}
                currentColors={currentColors}
                setCurrentColors={setCurrentColors}
                onClose={() => {
                  setIsColorMenuOpen(false);
                }}
              />
            </Modal>
            <Button
              className="bitstitch-editor__color-button"
              disabled={!isColorMenuEnabled}
              onClick={() => {
                setIsColorMenuOpen(!isColorMenuOpen);
              }}
              secondary
              text="Choose Colors Myself..."
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
            onClick={onSubmit}
            submit
            text="Create BitStitch"
          />
          <div className="bitstitch-editor__preview-wrapper">
            {state.generatePatternInProgress === networkStatus.IN_PROGRESS && (
              <Loading />
            )}
            {state.generatePatternInProgress === networkStatus.SUCCESS && (
              <img
                alt="uploaded cross-stitch pattern"
                className="bitstitch-editor__preview"
                src={state.patternSource}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default BitStitchEditor;

/*


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
} */
