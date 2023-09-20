import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import PictureAsPdf from "@material-ui/icons/PictureAsPdf";
import CardActionArea from "@material-ui/core/CardActionArea";
import { withCusomeStyle } from "../warappers/withCusomeStyle";

class PdfViewer extends React.Component {
  state = { expanded: false, estimationExpanded: false, pageNumber: 1 };

  handleChange(name) {
    return event => {
      this.setState({
        [name]: event.target.value
      });
    };
  }

  render() {
    const { pdf, title, description, classes } = this.props;
    return (
      <div style={{}}>
        <CardActionArea>
          <a href={pdf} target="_blank">
            <div
              style={{
                marginTop: 16,
                marginBottom: 16,
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "flex-start"
              }}
            >
              <PictureAsPdf className={classes.colorIcon} />
              <div
                title={"click to download"}
                style={{
                  display: "flex",
                  marginLeft: 16,
                  marginRight: 16,
                  flexDirection: "column"
                }}
              >
                <Typography className={classes.headingTitle}>
                  {title}
                </Typography>
                <Typography
                  align="left"
                  variant="h6"
                  color="textSecondary"
                  className={classes.heading}
                >
                  {description}
                </Typography>
              </div>
            </div>
          </a>
        </CardActionArea>
      </div>
    );
  }
}

PdfViewer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withCusomeStyle(PdfViewer);
