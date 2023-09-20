import React from "react";
import Typography from "@material-ui/core/Typography";
import Popover from "@material-ui/core/Popover";
import CardActionArea from "@material-ui/core/CardActionArea";
import { withProject } from "../warappers/withProject";
import AccountBalance from "@material-ui/icons/AccountBalance";

class Mizrachi extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  openPopup() {
    this.setState({ open: true });
  }
  closePopup() {
    this.setState({ open: false });
  }
  render() {
    const { project, classes } = this.props;
    if (project.structure !== "SingleApartment") {
      return <div />;
    }

    return (
      <div>
        <div style={{}}>
          <CardActionArea onClick={this.openPopup.bind(this)}>
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
              <AccountBalance className={classes.icon} />
              <div
                style={{
                  display: "flex",
                  marginLeft: 16,
                  marginRight: 16,
                  flexDirection: "column"
                }}
              >
                <Typography className={classes.headingTitle}>
                  {this.props.t("Bank Mizrachi")}
                </Typography>
                <Typography
                  align="left"
                  variant="h6"
                  color="textSecondary"
                  className={classes.heading}
                >
                  {this.props.t("Take Mortgage from Bank Mizrachi")}
                </Typography>
              </div>
            </div>
          </CardActionArea>
        </div>

        <Popover
          id="render-props-popover"
          open={this.state.open}
          // anchorEl={anchorEl}
          onClose={this.closePopup.bind(this)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center"
          }}
        >
          <div
            style={{
              width: this.props.width === "xs" ? 300 : 1100,
              height: "90%"
            }}
          >
            <iframe
              src={"https://sc.mizrahi-tefahot.co.il/TofesMashkantaClient/"}
              height={800}
              width={"100%"}
            />
          </div>
        </Popover>
      </div>
    );
  }
}

export default withProject(Mizrachi);
