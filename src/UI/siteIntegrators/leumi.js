import React from "react";
import Typography from "@material-ui/core/Typography";
import CardActionArea from "@material-ui/core/CardActionArea";
import { withProject } from "../warappers/withProject";
import AccountBalance from "@material-ui/icons/AccountBalance";

class Leumi extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  render() {
    const { project, classes } = this.props;
    if (project.structure !== "SingleApartment") {
      return <div />;
    }

    return (
      <div>
        <div style={{}}>
          <a
            href={
              "https://digitalforms.leumi.co.il/mortgage-request-new/page0/0?rid=TP8gCPcpPn8"
            }
            target="popup"
          >
            <CardActionArea>
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
                    {this.props.t("Bank Leumi")}
                  </Typography>
                  <Typography
                    align="left"
                    variant="h6"
                    color="textSecondary"
                    className={classes.heading}
                  >
                    {this.props.t("Take Mortgage from Bank Leumi")}
                  </Typography>
                </div>
              </div>
            </CardActionArea>
          </a>
        </div>
      </div>
    );
  }
}

export default withProject(Leumi);
