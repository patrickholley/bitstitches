import React, { Component } from 'react';
import './BitStitchCreator.scss';
import ImageUploader from '../ImageUploader';
import ImageFrame from '../ImageFrame';
import CrossStitchPattern from '../CrossStitchPattern/CrossStitchPattern';

class BitStitchCreator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnCount: 1000,
      image: null,
      rowCount: 1000,
    }
  }

  componentWillMount = () => {
    const { columnCount, rowCount } = this.state;
    const testData = [];

    for (let i = 0; i < columnCount; i++) {
      const testColumnData = [];

      for (let j = 0; j < rowCount; j++) {
        testColumnData.push([Math.random() * 255, Math.random() * 255, Math.random() * 255]);
      }

      testData.push(testColumnData);
    }

    this.setState({ data: testData });
  };

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
    const { columnCount, image, rowCount } = this.state;
    // const data = Object.assign({}, this.state.data);
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);
    const { width, height } = image;
    const imageData = context.getImageData(0, 0, width, height).data;

    const dimensionDifference = height - width;

    let largerDimension = dimensionDifference > 0 ? height : width;
    const yOffset = dimensionDifference > 0 ? dimensionDifference / 2 : 0;
    const xOffset = dimensionDifference < 0 ? (0 - dimensionDifference) / 2 : 0;
    const buffer = new Uint8ClampedArray(rowCount * columnCount * 4);

    for (let i = 0; i < columnCount; i++) {
      for (let j = 0; j < rowCount; j++) {
        const bufferIndex = Math.round((columnCount * i) + j) * 4;
        const x = Math.round(((largerDimension/columnCount) * i) - xOffset);
        const y = Math.round(((largerDimension/rowCount) * j) - yOffset);

        if (this.outOfBounds(x, y, width, height)) {
          buffer[bufferIndex] = 255;
          buffer[bufferIndex + 1] = 255;
          buffer[bufferIndex + 2] = 255;
          buffer[bufferIndex + 3] = 255;
        } else {
          const imageIndex = ((width * x) + y) * 4;
          buffer[bufferIndex] = imageData[imageIndex];
          buffer[bufferIndex + 1] = imageData[imageIndex + 1];
          buffer[bufferIndex + 2] = imageData[imageIndex + 2];
          buffer[bufferIndex + 3] = imageData[imageIndex + 3];
        }
      }
    }

    /*for (let i = 0; i < buffer.length; i+= 4) {
      const imageIndex = Math.round(((imageData.length/buffer.length) * i) / 4) * 4;

      if (i === 36) console.log(buffer.length, imageData.length, i, imageIndex);

      buffer[i] = imageData[imageIndex];
      buffer[i + 1] = imageData[imageIndex + 1];
      buffer[i + 2] = imageData[imageIndex + 2];
      buffer[i + 3] = imageData[imageIndex + 3];
    }*/

    canvas.width = columnCount;
    canvas.height = rowCount;
    const bufferData = context.createImageData(columnCount, rowCount);
    bufferData.data.set(buffer);
    context.putImageData(bufferData, 0, 0);
    const bufferImage = canvas.toDataURL();

    this.setState({ image: bufferImage });

    // this.setState({ data });
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
