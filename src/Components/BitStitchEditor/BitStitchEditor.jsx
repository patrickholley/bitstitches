import React, { Component } from 'react';
import './BitStitchEditor.scss';
import ImageUploader from '../ImageUploader';

class BitStitchEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnCount: 100,
      gridColor: [0, 0, 0, 255],
      hasGrid: true,
      image: null,
      pixelSize: 10,
      rowCount: 100,
      spaceColor: [255, 255, 255, 255],
    }
  }

  onUpload = imageFile => {
    const reader = new FileReader();

    reader.onload = (file) => {
      const image = new Image();
      image.onload = () => {
        this.setState({ image }, () => { this.onImageLoad(); });
      };
      image.src = file.target.result;
    };

    reader.readAsDataURL(imageFile);
  };

  outOfBounds = (x, y, width, height) => x < 0 || x >= height || y < 0 || y >= width;

  onImageLoad = () => {
    const {
      columnCount,
      gridColor,
      hasGrid,
      image,
      pixelSize,
      rowCount,
      spaceColor,
    } = this.state;
    const canvas = document.createElement('canvas');
    const { width, height } = image;
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);
    const imageData = context.getImageData(0, 0, width, height).data;
    const heightPerRow = height / rowCount;
    const widthPerColumn = width / columnCount;
    const ratioDifference = heightPerRow - widthPerColumn;
    const scale = ratioDifference > 0 ? heightPerRow : widthPerColumn;
    const buffer = new Uint8ClampedArray(rowCount * columnCount * 4 * pixelSize * pixelSize);
    const xOffset = ratioDifference < 0 ? ((widthPerColumn * rowCount) - height) / 2 : 0;
    const yOffset = ratioDifference > 0 ? ((heightPerRow * columnCount) - width) / 2 : 0;

    for (let i = 0; i < rowCount; i++) {
      for (let j = 0; j < columnCount; j++) {
        const x = Math.round((scale * i) - xOffset);
        const y = Math.round((scale * j) - yOffset);

        for (let k = 0; k < pixelSize; k++) {
          for (let l = 0; l < pixelSize; l++) {
            let colorSource;
            let colorIndex = 0;
            const bufferIndex = (((columnCount * pixelSize) * ((i * pixelSize) + k)) + (j * pixelSize) + l) * 4;
            if (
              (
                k === (pixelSize - 1)
                || l === (pixelSize - 1)
                || (i === 0 && k === 0)
                || (j === 0 && l === 0)
              ) && hasGrid
            ) {
              colorSource = gridColor;
            }
            else if (this.outOfBounds(x, y, width, height)) {
              colorSource = spaceColor;
            } else {
              colorSource = imageData;
              colorIndex = ((width * x) + y) * 4;
            }
            for (let i = 0; i < 4; i++) {
              buffer[bufferIndex + i] = colorSource[colorIndex + i];
            }
          }
        }
      }
    }

    canvas.width = columnCount * pixelSize;
    canvas.height = rowCount * pixelSize;
    const bufferData = context.createImageData(canvas.width, canvas.height);
    bufferData.data.set(buffer);
    context.putImageData(bufferData, 0, 0);
    const bufferImage = canvas.toDataURL();

    this.setState({ image: bufferImage });
  };

  onRowCountChange = e => {
    const { value } = e.target;
    if (Number.isInteger(parseInt(value)) || value === "") {
      this.setState({ rowCount: value });
    }
  };

  render() {
    return (
      <div className="bitstitch-editor">
        <div className="bitstitch-editor__input-wrapper">
          <input
            className="bitstitch-editor__input"
            onChange={this.onRowCountChange}
            value={this.state.rowCount}
          />
        </div>
        <ImageUploader onUpload={this.onUpload} />
        <div className="bitstitch-editor__preview-wrapper">
          <img
            alt="uploaded cross-stitch pattern"
            className="bitstitch-editor__preview"
            src={this.state.image}
          />
        </div>
      </div>
    )
  }
}

export default BitStitchEditor;
