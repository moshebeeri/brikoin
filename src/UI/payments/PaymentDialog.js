import React from "react";
// import PropTypes from 'prop-types'
import { withStyles } from "@material-ui/core/styles";
import red from "@material-ui/core/colors/red";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Route } from "react-router-dom";
import Cards from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";
import { pay } from "../../redux/actions/payments";

const styles = theme => ({
  card: {
    maxWidth: "2000",
    marginLeft: "5%",
    marginRight: "5%",
    marginTop: "1%"
  },
  media: {
    width: 500,
    height: 500
  },
  actions: {
    display: "flex"
  },
  expand: {
    transform: "rotate(0deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    }),
    marginLeft: "auto"
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  avatar: {
    backgroundColor: red[500]
  }
});

class PaymentDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      stackId: "",
      showSignup: false,
      useInternal: true,
      name: "Idan Test",
      tz: "12222222227",
      number: "4580101900056793",
      expiry: "03/22",
      cvc: "479",
      focused: ""
    };
  }

  login() {
    const { email, password } = this.state;
    this.props.login(email, password);
    this.state = {
      email: "",
      password: ""
    };
  }

  onCheckbox(event) {
    this.setState({ useInternal: event.target.checked });
  }

  handleFocus(name) {
    this.setState({
      focused: name
    });
  }
  handleClose() {
    this.setState({ open: false, showSignup: false });
  }

  handleClickOpen() {
    this.setState({ open: true });
  }

  showSignUp() {
    this.setState({ showSignup: true });
  }

  signup() {
    const { name, email, password, verifyPassword, useInternal } = this.state;
    if (password !== verifyPassword) {
      return;
    }
    this.props.signup(name, email, password, useInternal);
    this.handleClose();
  }

  componentDidMount() {
    const { sum, quantity, productName } = this.props;
    let product = { Quantity: 1, Number: 0, Cost: sum, Details: productName };
    const returnURLTrue = `https://test.brikoin.com/paymentStatus/true`;
    const returnURLFalse = `https://test.brikoin.com/paymentStatus/false`;
    const redirectToken = "96eb87ca-d7c0-49f4-8118-8185243cf5ff";
    const mType = "1"; // NIS
    const products = JSON.stringify({ Prods: [product] });
    this.setState({
      url:
        `https://secure.e-c.co.il/easycard/createform.asp?RedirectToken=${redirectToken}&mtype=${mType}&sum=${sum}&` +
        `ReturnURLTrue=${returnURLTrue}&ReturnURLFalse=${returnURLFalse}&products=${products}`,
      product,
      sum,
      productName,
      quantity,
      mType
    });
  }

  componentDidUpdate() {
    const pendingPayments = this.state.pendingPayments;
    const storePayments = this.props.payments;

    if (
      pendingPayments &&
      storePayments &&
      pendingPayments.size() &&
      storePayments.size()
    ) {
    }
  }

  pay() {
    const externalId = Math.random()
      .toString(36)
      .substring(2);
    const { sum, productName } = this.props;
    const product = { Quantity: 1, Number: 0, Cost: sum, Details: productName };
    const [month, year] = this.parseExp(this.state.expiry);
    const card = {
      number: this.state.number,
      month,
      year,
      tz: this.state.tz,
      cvc: this.state.cvc
    };
    const payment = {
      mType: "1",
      dealType: "1",
      opt: "01",
      actionMethod: "50"
    };
    // const returnURLTrue = `https://test.brikoin.com/paymentStatus/true`
    // const returnURLFalse = `https://test.brikoin.com/paymentStatus/false`
    // const redirectToken = '96eb87ca-d7c0-49f4-8118-8185243cf5ff'
    // const mType = '1'
    // const products = JSON.stringify({Prods: [product]})
    this.props.pay(
      {
        externalId,
        payment,
        product,
        card
      },
      { ...this.state, product }
    );
    this.setState(state => {
      const url = `${state.url}&ExternalID=${externalId}`;
      return {
        url,
        pendingPayment: externalId
      };
    });

    // let pendingPayments = this.state.pendingPayments
    // const newPending = pendingPayments.push('paymentId')
    // this.setState({pendingPayments: newPending})
  }

  renderRedirect() {
    if (this.state.pendingPayment) {
      return (
        <Route
          path="/"
          component={() => {
            window.location = this.state.url;
            return null;
          }}
        />
      );
    }
  }

  handleChange(name) {
    return event => {
      this.setState({
        [name]: event.target.value
      });
    };
  }

  handleExpiryChange(exp) {
    this.setState({
      expiry: this.expiry(exp)
    });
  }

  parseExp(date) {
    let month = "";
    let year = "";
    if (date.includes("/")) {
      [month, year] = date.split("/");
    } else if (date.length) {
      month = date.substr(0, 2);
      year = date.substr(2, 6);
    }
    if (year.length > 2) {
      year = year.substr(2, 4);
    }
    return [month, year];
  }

  expiry(event) {
    const expiry = event.target.value;
    const date = typeof expiry === "number" ? expiry.toString() : expiry;
    const [month, year] = this.parseExp(date);
    return year.length > 0 ? `${month}/${year}` : `${month}`;
  }

  number(type) {
    const number = this.state.number;

    let maxLength = type.maxLength;
    let nextNumber =
      typeof number === "number"
        ? number.toString()
        : number.replace(/[A-Za-z]| /g, "");

    if (isNaN(parseInt(nextNumber, 10))) {
      nextNumber = "";
    }

    if (maxLength > 16) {
      maxLength = nextNumber.length <= 16 ? 16 : maxLength;
    }

    if (nextNumber.length > maxLength) {
      nextNumber = nextNumber.slice(0, maxLength);
    }

    if (["amex", "dinersclub"].includes(this.issuer)) {
      const format = [0, 4, 10];
      const limit = [4, 6, 5];
      nextNumber = `${nextNumber.substr(
        format[0],
        limit[0]
      )} ${nextNumber.substr(format[1], limit[1])} ${nextNumber.substr(
        format[2],
        limit[2]
      )}`;
    } else if (nextNumber.length > 16) {
      const format = [0, 4, 8, 12];
      const limit = [4, 7];
      nextNumber = `${nextNumber.substr(
        format[0],
        limit[0]
      )} ${nextNumber.substr(format[1], limit[0])} ${nextNumber.substr(
        format[2],
        limit[0]
      )} ${nextNumber.substr(format[3], limit[1])}`;
    } else {
      for (let i = 1; i < maxLength / 4; i++) {
        const spaceIndex = i * 4 + (i - 1);
        nextNumber = `${nextNumber.slice(0, spaceIndex)} ${nextNumber.slice(
          spaceIndex
        )}`;
      }
    }
    this.setState({
      number: nextNumber
    });

    return nextNumber;
  }

  cardCallback(type, isValid) {
    type.isValid = isValid;
    const nextNumber = this.number(type);
  }

  render() {
    const {
      classes,
      errorMessage,
      title,
      variant,
      buttonString,
      sum,
      productName,
      className,
      direction
    } = this.props;
    const button = buttonString || this.props.t("Pay");
    const buttonClass = className || classes.button;
    return (
      <div>
        {/* this.renderRedirect() */}
        {variant ? (
          <Button
            variant="outlined"
            fullWidth
            className={buttonClass}
            onClick={this.handleClickOpen.bind(this)}
          >
            {button}
          </Button>
        ) : (
          <Button
            fullWidth
            className={buttonClass}
            onClick={this.handleClickOpen.bind(this)}
          >
            {button}
          </Button>
        )}
        <div>
          you are about to pay us {sum}
          for the product {productName}
          {/* <CreditCardsFrom number='' preview='' /> */}
        </div>
        <div class="rccs__demo__content">
          <div>
            <Cards
              number={this.state.number}
              name={this.state.name}
              expiry={this.state.expiry}
              cvc={this.state.cvc}
              focused={this.state.focused}
              issuer="visa"
              callback={this.cardCallback.bind(this)}
            />
          </div>

          <form className={classes.container} noValidate autoComplete="off">
            <div
              dir="ltr"
              style={{
                alignItems: "center",
                flexDirection: "col",
                justifyContent: "center"
              }}
            >
              <div style={{ flex: 1 }}>
                <TextField
                  id="number"
                  label={this.props.t("number")}
                  placeholder={this.props.t("Card Number")}
                  className={classes.textField}
                  value={this.state.number}
                  onChange={this.handleChange("number")}
                  onFocus={this.handleFocus.bind(this, "number")}
                  margin="normal"
                  fullWidth
                />
              </div>
              <div dir={direction}>
                <TextField
                  id="name"
                  label={this.props.t("name")}
                  placeholder={this.props.t("Name")}
                  className={classes.textField}
                  value={this.state.name}
                  onChange={this.handleChange("name")}
                  onFocus={this.handleFocus.bind(this, "name")}
                  margin="normal"
                  fullWidth
                />
              </div>
              <div dir={direction}>
                <TextField
                  id="tz"
                  label={this.props.t("tz")}
                  placeholder={this.props.t("tz")}
                  className={classes.textField}
                  value={this.state.tz}
                  onChange={this.handleChange("tz")}
                  onFocus={this.handleFocus.bind(this, "tz")}
                  margin="normal"
                  fullWidth
                />
              </div>
              <div>
                <TextField
                  id="expiry"
                  label={this.props.t("expiry")}
                  placeholder={this.props.t("Valid Thru")}
                  className={classes.textField}
                  value={this.state.expiry}
                  onChange={this.handleExpiryChange.bind(this)}
                  onFocus={this.handleFocus.bind(this, "expiry")}
                  margin="normal"
                  fullWidth
                />
              </div>
              <div>
                <TextField
                  id="cvc"
                  label={this.props.t("cvc")}
                  placeholder={this.props.t("CVC")}
                  className={classes.textField}
                  value={this.state.cvc}
                  onChange={this.handleChange("cvc")}
                  onFocus={this.handleFocus.bind(this, "cvc")}
                  margin="normal"
                  fullWidth
                />
              </div>
            </div>
          </form>
          <div>
            <Button onClick={this.pay.bind(this)} color="primary">
              {this.props.t("pay")}
            </Button>
            <Button onClick={this.handleClose.bind(this)} color="primary">
              {this.props.t("cancel")}
            </Button>
          </div>
        </div>
        {/* <Dialog */}
        {/* open={this.state.open} */}
        {/* onClose={this.handleClose.bind(this)} */}
        {/* aria-labelledby='form-dialog-title' */}
        {/* > */}
        {/* <DialogTitle id='form-dialog-title'>{this.props.t('Payment')}</DialogTitle> */}
        {/* <DialogContent> */}
        {/* <DialogContentText> */}
        {/* {title} */}
        {/* </DialogContentText> */}
        {/* <div> */}
        {/* you are about to pay us {sum} */}
        {/* for the product {productName} */}
        {/* /!* <a href={url} onClick={}>click to pay</a> *!/ */}
        {/* </div> */}
        {/* </DialogContent> */}
        {/* <DialogActions> */}
        {/* <Button onClick={this.pay.bind(this)} color='primary'> */}
        {/* {this.props.t('pay')} */}
        {/* </Button> */}
        {/* <Button onClick={this.handleClose.bind(this)} color='primary'> */}
        {/* {this.props.t('cancel')} */}
        {/* </Button> */}
        {/* </DialogActions> */}
        {/* </Dialog> */}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    payments: state.payments.pendingPayments,
    errorMessage: state.login.errorMessage,
    direction: state.userProfileReducer.direction
  };
};

const mapDispatchToProps = {
  pay
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(PaymentDialog)
);
