// Import React FilePond
import React from "react";
import { FilePond, registerPlugin } from "react-filepond";
import "./file.css";
// Import FilePond styles
import "filepond/dist/filepond.min.css";
// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import Gallery from "react-grid-gallery";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import CollectionsBookmark from "@material-ui/icons/CollectionsBookmark";
// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);
// Our app
export default class GenericFileLoader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Set initial files, type 'local' means this is a file
      // that has already been uploaded to the server (see docs)
      files: []
    };
  }

  handleInit() {
    console.log("FilePond instance has initialised", this.pond);
  }

  componentDidMount() {
    const { fieldValue, fieldKey } = this.props;
    this.props.setState({
      [fieldKey]: fieldValue
    });
  }

  removePictures() {
    const { fieldKey } = this.props;
    this.props.setState({
      [fieldKey]: []
    });
  }

  render() {
    const { maxFiles, fieldKey, fieldValue } = this.props;
    if (this.isHttpFiles(fieldValue)) {
      if (fieldKey === "map") {
        const width = this.props.width === "xs" ? "100%" : "65%";
        return (
          <div style={{ width: width }}>
            <div style={{ width: 40 }}>
              <IconButton
                aria-label="delete"
                onClick={this.removePictures.bind(this)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </div>
            <Gallery
              rowHeight={200}
              maxRows={2}
              images={[
                {
                  src: Array.isArray(fieldValue) ? fieldValue[0] : fieldValue,
                  thumbnail: Array.isArray(fieldValue)
                    ? fieldValue[0]
                    : fieldValue,
                  thumbnailHeight: 9
                }
              ]}
            />
          </div>
        );
      }
      if (fieldKey === "pictures" || fieldKey === "map") {
        const width = this.props.width === "xs" ? "100%" : "65%";
        return (
          <div style={{ width: width }}>
            <div style={{ width: 40 }}>
              <IconButton
                aria-label="delete"
                onClick={this.removePictures.bind(this)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </div>
            <Gallery
              rowHeight={200}
              maxRows={2}
              images={fieldValue
                .map((picture, index) => {
                  return {
                    src: Array.isArray(picture) ? picture[0] : picture,
                    thumbnail: Array.isArray(picture) ? picture[0] : picture,
                    thumbnailWidth: 16 + index,
                    thumbnailHeight: 9
                  };
                })
                .filter(pic => pic)}
            />
          </div>
        );
      }
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div style={{ margin: 5 }}>{this.props.t(fieldKey)}</div>
          <a href={fieldValue} target="_blank">
            <CollectionsBookmark />
          </a>
          <div style={{ width: 40 }}>
            <IconButton
              aria-label="delete"
              onClick={this.removePictures.bind(this)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </div>
        </div>
      );
    }
    let browseLabel = this.props.t("Browse");
    let descMsg = this.props.t(fieldKey);
    return (
      <div className="App">
        {/* Pass FilePond properties as attributes */}
        <FilePond
          ref={ref => (this.pond = ref)}
          files={this.props.state[fieldKey]}
          allowMultiple
          maxFiles={maxFiles || 1}
          labelIdle={`Drag & Drop your ${descMsg} File or <span class="filepond--label-action"> ${browseLabel} </span>`}
          // server='/api'
          oninit={() => this.handleInit()}
          onupdatefiles={fileItems => {
            let items = fileItems.filter(
              item =>
                item.file.type === "application/octet-stream" ||
                !(item.file instanceof File)
            );
            if (items.length > 0) {
              return;
            }

            // Set currently active file objects to this.state
            this.props.setState({
              [fieldKey]: fileItems.map(fileItem => fileItem.file)
            });
          }}
          stylePanelLayout={"compact"}
        />
      </div>
    );
  }

  isHttpFiles(files) {
    if (!files) {
      return false;
    }

    if (files.includes && files.includes("http")) {
      return true;
    }

    let httpFiles = files.filter(item => !(item instanceof File));
    if (httpFiles.length > 0) {
      return true;
    }

    return false;
  }
}
