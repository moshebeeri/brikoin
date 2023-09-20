import React from "react";
import Typography from "@material-ui/core/Typography";
import { withCusomeStyle } from "../warappers/withCusomeStyle";
import numberUtils from "../../utils/numberUtils";
import { format } from "../../utils/stringUtils";
import MortgageRequestDialog from "./mortgageRequestDialog";
class MortgageRequestSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDetails: false
    };
  }
  handleChange(name) {
    return event => {
      this.setState({
        [name]: event.target.value
      });
    };
  }

  render() {
    const { request, project } = this.props;
    return (
      <div
        style={{
          display: "flex",
          borderWidth: 5,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",

          padding: 5
        }}
      >
        <Typography align="left" variant={"h6"} color="textSecondary">
          {format(this.props.t("Project Request Status"), [
            numberUtils.formatNumber(request.amount),
            request.approved
              ? this.props.t("Approved")
              : this.props.t("Under Review")
          ])}
          <a
            style={{ textDecoration: "none" }}
            href="#"
            onClick={this.showMortgageDetails.bind(this)}
          >
            {this.props.t("Read Details")}
          </a>
        </Typography>
        <MortgageRequestDialog
          project={project}
          request={request}
          handleClose={this.hideMortgageDetails.bind(this)}
          t={this.props.t}
          open={this.state.showDetails}
        />
      </div>
    );
  }

  showMortgageDetails() {
    this.setState({
      showDetails: true
    });
  }
  hideMortgageDetails() {
    this.setState({
      showDetails: false
    });
  }
}

export default withCusomeStyle(MortgageRequestSummary);
