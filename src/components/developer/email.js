import React from "react";
import { withStyles } from "@material-ui/core/styles";
import red from "@material-ui/core/colors/red";
import TextField from "@material-ui/core/TextField";
import { connect } from 'react-redux';
import { sendMail } from "../../redux/actions/mailSender";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import { Collapse } from "react-collapse";

const styles = theme => ({
  card: {
    maxWidth: 400
  },
  cardDeveloper: {
    maxWidth: 400,
    position: "absolute",
    bottom: 0,
    right: 0
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
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

class MailSender extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      to: "",
      subject: "",
      message: "",
      setValue: "",
      estimatorAccountId: "",
      managerAccountId: ""
    };
  }

  handleChange(name) {
    return event => {
      this.setState({
        [name]: event.target.value
      });
    };
  }

  openCollapse() {
    this.setState({ open: true });
  }
  closeCollapse() {
    this.setState({ open: false });
  }

  sendMail() {
    const { sendMail } = this.props;
    if (this.state.to && this.state.subject && this.state.message) {
      sendMail(this.state.to, this.state.subject, this.state.message);
    }
    this.setState({
      to: "",
      subject: "",
      message: ""
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        {this.state.open ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <div>Send Mail</div>
            <Button color={"primary"} onClick={this.closeCollapse.bind(this)}>
              <MetirialIcons.MdExpandMore />
            </Button>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <div>Send Mail</div>
            <Button color={"primary"} onClick={this.openCollapse.bind(this)}>
              <MetirialIcons.MdExpandLess />
            </Button>
          </div>
        )}

        <Collapse isOpened={this.state.open}>
          <form className={classes.container} noValidate autoComplete="off">
            <div
              style={{
                width: 200,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <div
                style={{
                  width: 100,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <TextField
                  label="To"
                  id="name"
                  className={classes.textField}
                  onChange={this.handleChange("to")}
                  margin="normal"
                  fullWidth
                  type="string"
                  value={this.state.to}
                />
                <TextField
                  label="Subject"
                  id="name"
                  className={classes.textField}
                  onChange={this.handleChange("subject")}
                  margin="normal"
                  fullWidth
                  type="string"
                  value={this.state.subject}
                />
                <TextField
                  label="Message"
                  id="name"
                  className={classes.textField}
                  onChange={this.handleChange("message")}
                  margin="normal"
                  fullWidth
                  type="string"
                  value={this.state.message}
                />
                <Button color={"primary"} onClick={this.sendMail.bind(this)}>
                  Send Mail
                </Button>
              </div>
            </div>
          </form>
        </Collapse>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.login.user,
  accounts: state.accounts
});
const mapDispatchToProps = {
  sendMail
};
MailSender.contextTypes = {
  drizzle: PropTypes.object
};


export default withStyles(styles)(connect(
  mapStateToProps, mapDispatchToProps
)(MailSender))