import React, { Component } from 'react';
import './BitStitchCreator.scss';
import ImageUploader from '../ImageUploader';
import ImageFrame from '../ImageFrame';
import CrossStitchPattern from '../CrossStitchPattern/CrossStitchPattern';

class BitStitchCreator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnCount: 100,
      gridColor: [0, 0, 0, 255],
      hasGrid: true,
      image: null,
      pixelSize: 10,
      rowCount: 75,
      spaceColor: [255, 255, 255, 255],
    }
  }

  onDrop = (event) => {
    event.preventDefault();
    const imageFile = event.dataTransfer.files[0];
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
            const bufferIndex = (((columnCount * pixelSize) * ((i * pixelSize) + k)) + (j * pixelSize) + l) * 4;
            if (
              (
                k === (pixelSize - 1)
                || l === (pixelSize - 1)
                || (i === 0 && k === 0)
                || (j === 0 && l === 0)
              ) && hasGrid
            ) {
              buffer[bufferIndex] = gridColor[0];
              buffer[bufferIndex + 1] = gridColor[1];
              buffer[bufferIndex + 2] = gridColor[2];
              buffer[bufferIndex + 3] = gridColor[3];
            }
            else if (this.outOfBounds(x, y, width, height)) {
              buffer[bufferIndex] = spaceColor[0];
              buffer[bufferIndex + 1] = spaceColor[1];
              buffer[bufferIndex + 2] = spaceColor[2];
              buffer[bufferIndex + 3] = spaceColor[3];
            } else {
              const imageIndex = ((width * x) + y) * 4;
              buffer[bufferIndex] = imageData[imageIndex];
              buffer[bufferIndex + 1] = imageData[imageIndex + 1];
              buffer[bufferIndex + 2] = imageData[imageIndex + 2];
              buffer[bufferIndex + 3] = imageData[imageIndex + 3];
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

  outOfBounds = (x, y, width, height) => x < 0 || x >= height || y < 0 || y >= width;

  render() {
    return (
      <>
        <ImageUploader onDrop={this.onDrop} />
        <img alt="uploaded cross-stitch pattern" src={this.state.image} />
        {/*<CrossStitchPattern
          columnCount={this.state.columnCount}
          rowCount={this.state.rowCount}
        />*/}
      </>
    )
  }
}

export default BitStitchCreator;
