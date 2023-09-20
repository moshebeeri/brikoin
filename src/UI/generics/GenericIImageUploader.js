import React from "react";
import ImageUploader from "./imageLoader";

export default class GennericImageUploader extends React.Component {
  constructor(props) {
    super(props);
    this.state = { pictures: [] };
    this.onDrop = this.onDrop.bind(this);
  }

  onDrop(files, picture) {
    const { fieldKey } = this.props;
    let uploadedPictures =
      picture && picture.filter(pic => pic.includes("http"));
    let filesArray = files.concat(uploadedPictures);
    this.props.setState({
      [fieldKey]: filesArray
    });
  }

  render() {
    const { fieldKey, fieldValue } = this.props;
    return (
      <ImageUploader
        t={this.props.t}
        withPreview
        fieldKey={fieldKey}
        fieldValue={fieldValue}
        onChange={this.onDrop}
      />
    );
  }
}
