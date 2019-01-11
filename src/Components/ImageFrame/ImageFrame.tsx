import * as React from 'react'
import './ImageFrame.scss';

interface IProps {
  image: string,
}

class ImageFrame extends React.Component<IProps> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div
        className="image-frame"
      >
        Image will show here
        <img src={this.props.image} />
      </div>
    )
  }
}

export default ImageFrame;
