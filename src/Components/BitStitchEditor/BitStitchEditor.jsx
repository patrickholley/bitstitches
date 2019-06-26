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
  GENERATE_PATTERN_REQUEST,
  CLEAR_GENERATE_PATTERN
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
  const [maxRowCount, setMaxRowCount] = useState(250);
  const [pixelSize, setPixelSize] = useState(10);
  const [rowCount, setRowCount] = useState(100);
  const [currentColors, setCurrentColors] = useState({
    selected: [],
    ignored: []
  });
  const maxColorCount = 50;
  const numbersOnlyRegex = /^[0-9]*$/;

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
          ignored: allColorKeys.slice(colorCount, allColorKeys.length)
        });
        setAllColorsCount(allColorKeys.length);
      }
    },
    [state.allColors]
  );

  useEffect(
    function() {
      if (state.generatePatternStatus === networkStatus.SUCCESS) {
        const { allColors, selectedColors } = state;
        const selected = [];
        const ignored = [];

        Object.keys(allColors).forEach(id => {
          for (let i = 0; i < selectedColors.length; i++) {
            if (selectedColors[i].ID === id) {
              selected.push(id);
              break;
            }
          }

          ignored.push(id);
        });

        setCurrentColors({ selected, ignored });
      }
    },
    [state.generatePatternStatus]
  );

  useEffect(
    function() {
      if (rowCount > maxRowCount) setRowCount(maxRowCount);
    },
    [maxRowCount]
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
          let rowToColumnRatio = image.height / image.width;
          if (rowToColumnRatio > 1) rowToColumnRatio = 1;
          setMaxRowCount(Math.floor(rowToColumnRatio * 250));
        };
        image.src = file.target.result;
      };

      reader.readAsDataURL(imageFile);
    } else setImageLabel("Invalid file type");
  }

  function onCountChange(value, setCount, countLimit) {
    if (numbersOnlyRegex.test(value)) {
      if (value !== "" && value < 1) value = 1;
      else if (value > countLimit) value = countLimit;
      setCount(value);
    }
  }

  function onSubmit() {
    dispatch({ type: GENERATE_PATTERN_REQUEST });

    const canvas = document.createElement("canvas");
    canvas.height = rowCount;
    canvas.width = rowCount * (image.width / image.height);

    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    generatePattern(
      {
        colorCount,
        imageString: canvas.toDataURL(),
        selectedColors: isColorMenuEnabled
          ? currentColors.selected
          : Object.keys(state.allColors)
      },
      dispatch
    );
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
          strokeWidth="3"
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
              onCountChange(e.target.value, setRowCount, maxRowCount);
            }}
            numPad
            tooltip={`Maximum ${maxRowCount} rows (based on image)`}
            tooltipClassName="bitstitch-editor__tooltip-row"
            value={rowCount}
          />
          <TextInput
            className="bitstitch-editor__field"
            label="Color Count"
            onChange={e => {
              onCountChange(e.target.value, setColorCount, maxColorCount);
            }}
            numPad
            tooltip={`Maximum ${maxColorCount} colors`}
            tooltipClassName="bitstitch-editor__tooltip-color"
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
                Use the most common colors in my picture (this may take longer)
              </span>
            </div>
            <Modal
              className="bitstitch-editor__color-modal"
              isModalOpen={isColorMenuOpen}
              onClose={() => {
                if (currentColors.selected.length > 0)
                  setIsColorMenuOpen(false);
              }}
            >
              <ColorMenu
                allColors={state.allColors}
                currentColors={currentColors}
                setCurrentColors={setCurrentColors}
                onClose={() => {
                  if (currentColors.selected.length > 0)
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
            {state.generatePatternStatus === networkStatus.IN_PROGRESS && (
              <Loading />
            )}
            {state.generatePatternStatus === networkStatus.SUCCESS && (
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
