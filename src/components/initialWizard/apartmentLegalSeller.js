import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { GenericForm, DocumentTemplate } from "../../UI/index";
import Project from "../projects/ProjectNew";
import { sellerSignedDocument } from "../../redux/actions/trusteeManagment";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { getPopulatedProjects } from "../../redux/selectors/projectsSelector";
const firstAgreementSeller = require("./firstAgreementSeller.txt");
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
  signatureSeller: { type: "signature" },
  idBuyer: { type: "text" },
  price: { type: "number" },
  idSeller: { type: "text" },
  reservedBid: { type: "number" },
  firstBid: { type: "number" },
  lastPayment: { type: "number" },
  agreementDate: { type: "date" },
  addressBuyer: { type: "text" },
  addressSeller: { type: "text" },
  signatureBuyer: { type: "image" },
  apartmentAddress: { type: "text" },
  finalDate: { type: "date" },
  finalSignatureDate: { type: "date" }
};

class ApartmentLegalsSeller extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signatureImage: "",
      startLoadingSignature: false,
      signatureBlob: ""
    };
  }

  readTextFile(file) {
    this.setState({
      text: file
    });
  }

  componentDidMount() {
    this.readTextFile(firstAgreementSeller);
  }

  getPendingOrder() {
    const { pendingOrders } = this.props;
    const projectAddress = this.getProjectAddress();
    const userOrders =
      pendingOrders[projectAddress] && pendingOrders[projectAddress].length > 0
        ? pendingOrders[projectAddress].filter(
            order => order.active && order.buyerSignedTermSheet
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
          document={firstAgreementSeller}
          documentDescriptor={DOCUMENT_DESCRIPTOR}
          t={this.props.t}
        />
      </div>
    );
  }

  documentSigned(file) {
    const { sellerSignedDocument, user } = this.props;
    const project = this.getProject();
    const pendingOrder = this.getPendingOrder();
    sellerSignedDocument(user.uid, project.address, pendingOrder.id, file);
    this.props.history.goBack();
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
    const order = this.getPendingOrder();
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
      addressBuyer: order.buyerAddress,
      idBuyer: order.buyerId,
      signatureBuyer: order.buyerSignature,
      buyingDocument: order.buyerTermSheet
    };
  }
  getProjectAddress() {
    return this.props.location.pathname.substring(
      "apartmentLegalsSeller".length + 2
    )
      ? this.props.location.pathname.substring(
          "apartmentLegalsSeller".length + 2
        )
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

ApartmentLegalsSeller.propTypes = {
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
  sellerSignedDocument
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(ApartmentLegalsSeller)
);
