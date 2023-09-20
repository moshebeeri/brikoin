import React from "react";
import { connect } from "react-redux";
import { withUserOrder } from "../warappers/withUserOrder";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import numberUtils from "../../utils/numberUtils";
import currencyUtils from "../../utils/currencyUtils";

class OfficeOrderDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes, order, project } = this.props;
    if (!order || !order.amount) {
      return <div />;
    }

    return (
      <Card className={classes.investCard}>
        <div style={{ marginTop: 10 }}>
          <div
            style={{
              display: "flex",
              borderWidth: 5,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column"
            }}
          >
            <Typography align="left" variant={"h6"} color="textSecondary">
              {this.props.t("My Order")}
            </Typography>
            <Typography align="center" variant={"h6"} color="textSecondary">
              {project.currency
                ? currencyUtils.currencyCodeToSymbol(project.currency)
                : "$"}{" "}
              {numberUtils.formatNumber(
                parseInt(order.amount) * parseFloat(order.price),
                0
              )}
            </Typography>
            {this.getOrderStatus()}
          </div>
        </div>
      </Card>
    );
  }

  getOrderStatus() {
    const { order } = this.props;
    if (order.orderApproved) {
      return (
        <Typography align="left" variant={"h6"} color="textSecondary">
          {this.props.t("Order Approved")}
        </Typography>
      );
    }

    if (order.fullDeposit) {
      return (
        <Typography align="left" variant={"h6"} color="textSecondary">
          {this.props.t("Fund Received")}
        </Typography>
      );
    }
    if (order.reserved) {
      return (
        <Typography align="left" variant={"h6"} color="textSecondary">
          {this.props.t("Order Reserved")}
        </Typography>
      );
    }
    return <div />;
  }
}

const mapStateToProps = state => {
  return {
    user: state.login.user
  };
};

const mapDispatchToProps = {};
export default withUserOrder(
  connect(mapStateToProps, mapDispatchToProps)(OfficeOrderDetails)
);
