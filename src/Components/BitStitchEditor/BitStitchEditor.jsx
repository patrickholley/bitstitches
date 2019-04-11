import React, { Component } from "react";
import TextInput from "../../lib/components/TextInput";
import Button from "../../lib/components/Button";
import "./BitStitchEditor.scss";
import "../../../assets/fonts/Modikasti-normal";
import "../../../assets/fonts/Bringshoot-normal";
import DMCFlossColors from "../../lib/constants/DMCFlossColors";
import Modal from "../../lib/components/Modal";

const AllDMCDistanceCache = {};
const AllDMCColorKeys = Object.keys(DMCFlossColors);
const AllDMCFlossColorsCount = AllDMCColorKeys.length;

class BitStitchEditor extends Component {
  constructor(props) {
    super(props);

    const colorCount = 25;

    this.state = {
      activeColors: AllDMCColorKeys.slice(0, colorCount),
      bitStitch: null,
      colorCount,
      gridColor: [63, 63, 63, 255],
      hasGrid: true,
      image: null,
      imageLabel: "Please upload an image",
      inactiveColors: AllDMCColorKeys.slice(
        colorCount,
        AllDMCColorKeys.length - colorCount
      ),
      isModalOpen: true,
      pixelSize: 10,
      rowCount: 100
    };
  }

  drawBitStitchBorder(canvas, context) {
    canvas.width = canvas.width + 1;
    canvas.height = canvas.height + 1;
    context.strokeStyle = "#3f3f3f";
    context.beginPath();
    context.moveTo(0, 1080);
    context.lineTo(1920, 1080);
    context.lineTo(1920, 0);
    context.stroke();
  }

  drawBitStitchImage(canvas, context, buffer) {
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

  createBitStitch = () => {
    const { image, rowCount } = this.state;

    const columnCount = Math.floor((rowCount * image.width) / image.height);
    const imageData = this.getStateImageData();
    const canvas = this.getBitStitchCanvas(columnCount);
    const context = canvas.getContext("2d");
    const buffer = this.manipulatePixels(canvas, imageData, columnCount);

    this.drawBitStitchBorder(canvas, context);
    this.drawBitStitchImage(canvas, context, buffer);
    this.setState({ bitStitch: canvas.toDataURL() });
  };

  getBitStitchCanvas(columnCount) {
    const { pixelSize, rowCount } = this.state;

    const canvas = document.createElement("canvas");
    canvas.width = columnCount * pixelSize;
    canvas.height = rowCount * pixelSize;

    return canvas;
  }

  getStateImageData() {
    const { image } = this.state;
    const { width, height } = image;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0);

    return context.getImageData(0, 0, width, height).data;
  }

  manipulatePixels(canvas, imageData, columnCount, autoSelectColors = false) {
    const { colorCount, image, pixelSize, rowCount } = this.state;
    const { width } = canvas;
    const imageWidth = image.width;
    const imageHeight = image.height;

    const DMCColorCounts = {};
    const DMCDistanceCache = autoSelectColors ? AllDMCDistanceCache : {};
    const DMCIndexes = autoSelectColors
      ? Object.keys(DMCFlossColors)
      : this.manipulatePixels(canvas, imageData, columnCount, true);

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
          this.roundToDMCColor(pixelColor, DMCIndexes);
        const { index } = DMCColor;

        if (!DMCDistanceCache[pixelColorString]) {
          DMCDistanceCache[pixelColorString] = DMCColor;
        }

        if (!autoSelectColors) {
          this.setBufferIndex(buffer, DMCColor, width, x, y);
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

  roundToDMCColor(color, DMCIndexes) {
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

  setBufferIndex(buffer, DMCColor, width, x, y) {
    const { gridColor, pixelSize } = this.state;

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

  isFormValid = () =>
    this.state.rowCount !== "" &&
    this.state.colorCount !== "" &&
    !!this.state.image;

  onUpload(e, dataKey) {
    const imageFile = e[dataKey].files[0];
    const validExtensions = ["bmp", "gif", "jpg", "jpeg", "png"];
    const imageExtension = imageFile.name.split(".").pop();

    if (validExtensions.includes(imageExtension)) {
      const reader = new FileReader();

      reader.onload = file => {
        const image = new Image();
        image.onload = () => {
          this.setState({ image, imageLabel: imageFile.name });
        };
        image.src = file.target.result;
      };

      reader.readAsDataURL(imageFile);
    } else this.setState({ imageLabel: "Invalid file type" });
  }

  onCountChange(value, countKey, countLimit) {
    if (value !== "") {
      if (isNaN(value)) return;
      if (value > countLimit) value = countLimit;
      else if (value <= 0) value = 1;
    }
    this.setState({ [countKey]: value });
  }

  renderColorList = collection => (
    <div className="bitstitch-editor__color-list-wrapper">
      <ul className="bitstitch-editor__color-list">
        {this.state[collection].map(i => {
          const { red, green, blue, index, name } = DMCFlossColors[i];
          return (
            <li
              key={i}
              className="bitstitch-editor__color-item"
              onClick={() => {
                this.setState(prevState => {
                  const inContainer = [];
                  const outContainer = [];
                  for (let key in DMCFlossColors) {
                    if (
                      key !== i &&
                      prevState[collection].indexOf(key) !== -1
                    ) {
                      inContainer.push(key);
                    } else outContainer.push(key);
                  }
                  return {
                    activeColors:
                      collection === "activeColors"
                        ? inContainer
                        : outContainer,
                    inactiveColors:
                      collection === "activeColors" ? outContainer : inContainer
                  };
                });
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

  render() {
    const { isModalOpen } = this.state;

    const isFormValid = this.isFormValid();

    return (
      <div className="bitstitch-editor">
        {isModalOpen && (
          <Modal className="bitstitch-editor__modal">
            {this.renderColorList("activeColors")}
            {this.renderColorList("inactiveColors")}
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
            this.onCountChange(e.target.value, "rowCount", 250);
          }}
          numPad
          value={this.state.rowCount}
        />
        <TextInput
          className="bitstitch-editor__field"
          label="Color Count"
          onChange={e => {
            this.onCountChange(
              e.target.value,
              "colorCount",
              AllDMCFlossColorsCount
            );
          }}
          numPad
          value={this.state.colorCount}
        />
        <span className="bitstitch-editor__file-span">
          {this.state.imageLabel}
        </span>
        <label className="bitstitch-editor__upload-label">
          <input
            type="file"
            onChange={e => {
              this.onUpload(e, "target");
            }}
          />
          <span className="bitstitch-editor__upload-span">Select Image</span>
        </label>
        <Button
          disabled={!isFormValid}
          onClick={this.createBitStitch}
          submit
          text="Create BitStitch"
        />
        <div className="bitstitch-editor__preview-wrapper">
          {this.state.bitStitch && (
            <img
              alt="uploaded cross-stitch pattern"
              className="bitstitch-editor__preview"
              src={this.state.bitStitch}
            />
          )}
        </div>
      </div>
    );
  }
}

export default BitStitchEditor;
