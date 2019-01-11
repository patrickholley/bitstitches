import * as React from 'react'
import './BitStitchCreator.scss';
import ImageUploader from '../ImageUploader';
import ImageFrame from '../ImageFrame';

interface IProps {

}

interface IState {
  image: string,
}

class BitStitchCreator extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      image: null,
    }
  }

  onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const imageFile = event.dataTransfer.files[0];
    const reader = new FileReader();
    reader.onload = (file: Event) => {
      this.setState({
        image: reader.result as string,
      })
    };
    reader.readAsDataURL(imageFile);
  };

  render() {
    return (
      <>
        <ImageUploader onDrop={this.onDrop} />
        <ImageFrame image={this.state.image} />
      </>
    )
  }
}

export default BitStitchCreator;
