import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { GenericForm, DocumentTemplate } from "../../UI/index";
import Project from "../projects/ProjectNew";
import { buyerSignedDocument } from "../../redux/actions/trusteeManagment";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { getPopulatedProjects } from "../../redux/selectors/projectsSelector";
const firstAgreement = require("./firstAgreement.txt");
const styles = theme => {
  return {
    card: {
      display: "flex",
      boxShadow: "none",
      width: "100%",
      minWidth: 1000,
      maxWidth: 1000,
      borderWidth: 1,
      borderColor: "#e5e5e5",
      borderStyle: "solid"
    }
  };
};

const DOCUMENT_DESCRIPTOR = {
  signatureBuyer: { type: "signature" },
  signatureSeller: { type: "signature" },
  idBuyer: { type: "text" },
  price: { type: "number" },
  reservedBid: { type: "number" },
  firstBid: { type: "number" },
  lastPayment: { type: "number" },
  agreementDate: { type: "date" },
  addressBuyer: { type: "text" },
  apartmentAddress: { type: "text" },
  finalDate: { type: "date" },
  finalSignatureDate: { type: "date" }
};

class ApartmentLegals extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  readTextFile(file) {
    this.setState({
      text: file
    });
  }

  componentDidMount() {
    this.readTextFile(firstAgreement);
  }

  getUserPendingOrder() {
    const { pendingOrders, user } = this.props;
    const projectAddress = this.getProjectAddress();
    const userOrders =
      pendingOrders[projectAddress] && pendingOrders[projectAddress].length > 0
        ? pendingOrders[projectAddress].filter(
            order => order.active && order.userId === user.uid
          )
        : [];

    return userOrders && userOrders.length > 0 ? userOrders[0] : "";
  }
  render() {
    const { projects, lang } = this.props;
    if (!projects || projects.length === 0) {
      return <div />;
    }
    const project = this.getProject();
    if (!project) {
      return <div />;
    }

    return (
      <div
        style={{
          marginTop: "10%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {this.pageTitle}

        {project && (
          <Project
            history={this.props.history}
            lang={lang}
            t={this.props.t}
            init
            viewOnly
            project={project}
          />
        )}
        <DocumentTemplate
          title={"Apartment Initial Agreement"}
          documentSignedAction={this.documentSigned.bind(this)}
          documentValues={this.getDocumentValues()}
          document={firstAgreement}
          documentDescriptor={DOCUMENT_DESCRIPTOR}
          t={this.props.t}
        />
      </div>
    );
  }

  documentSigned(file, docAttributes) {
    const { buyerSignedDocument, user } = this.props;
    const project = this.getProject();
    const pendingOrder = this.getUserPendingOrder();
    buyerSignedDocument(
      user.uid,
      project.address,
      pendingOrder.id,
      file,
      docAttributes.signatureBuyer_file,
      docAttributes.idBuyer,
      docAttributes.addressBuyer
    );
    this.props.history.push("/projectsView/" + project.address);
  }

  getProject() {
    const { projects } = this.props;
    const projectAddress = this.getProjectAddress();
    const filteredProject = projects.filter(
      project => project.address === projectAddress
    );
    return filteredProject.length > 0 ? filteredProject[0] : "";
  }

  getDocumentValues() {
    const { lang } = this.props;
    const project = this.getProject();
    const order = this.getUserPendingOrder();
    const propertyAddress =
      lang === "En"
        ? project.property.address1
        : project.property.lang[lang].address1;
    return {
      price: order.amount,
      agreementDate: new Date(),
      apartmentAddress: propertyAddress,
      reservedBid: project.reservedBid / 1000000,
      firstBid: (order.amount * project.firstBidPercentages) / 100,
      lastPayment:
        order.amount -
        project.reservedBid / 1000000 -
        (order.amount * project.firstBidPercentages) / 100,
      finalDate: new Date().setMonth(new Date().getMonth() + 3),
      finalSignatureDate: new Date().setMonth(new Date().getMonth() + 1),
      signatureSeller: "_____________________"
    };
  }
  getProjectAddress() {
    return this.props.location.pathname.substring("ApartmentLegals".length + 2)
      ? this.props.location.pathname.substring("ApartmentLegals".length + 2)
      : "";
  }

  pageTitle() {
    const { classes } = this.props;
    const title = [this.props.t("Know Your Customer")];
    return (
      <Card className={classes.card}>
        <div>
          <CardContent>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start"
              }}
            >
              <Typography
                classes={classes.formTitle}
                noWrap
                align="left"
                variant="h5"
              >
                {title.join(" -> ")}
              </Typography>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }
}

ApartmentLegals.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = (state, props) => ({
  user: state.login.user,
  loggedIn: state.login.loggedIn,
  pendingOrders: state.trades.pendingOrders,
  projects: getPopulatedProjects(state, props),
  cases: state.cases.list,
  lang: state.userProfileReducer.lang,
  loaded: state.cases.loaded
});
const mapDispatchToProps = {
  buyerSignedDocument
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(ApartmentLegals)
);
