import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Project from "../projects/ProjectNew";
import { connect } from "react-redux";
import { getPopulatedProjects } from "../../redux/selectors/projectsSelector";
import { selectLanguage } from "../../redux/actions/userProfile";
import i18next from "i18next";

// https://test.brikoin.com/?StateData=&Total=2&CardOwner=moshe%20beeri&OwnerEmail=moshe.beeri@gmail.com&Id=b6b5c2a2-dd5c-4705-a0b5-fac72e051eaf&OkNumber=0000000&Code=000&DealID=20334616&BusinessName=%D7%9E%D7%A9%D7%94%20%D7%91%D7%93%D7%99%D7%A7%D7%95%D7%AA%20&Terminal=0962317010&DealNumber=02715404&CardNumber=4231&DealDate=02/04/2019%2010:33:25&PayNumber=&FirstPay=&AddPay=&DealTypeOut=%D7%A2%D7%A1%D7%A7%D7%AA%20%D7%97%D7%95%D7%91%D7%94%20%D7%A8%D7%92%D7%99%D7%9C%D7%94%200000000&DealType=%D7%90%D7%A9%D7%A8%D7%90%D7%99%20%D7%A8%D7%92%D7%99%D7%9C&Currency=%D7%A9%D7%A7%D7%9C%D7%99%D7%9D&CardNameID=%D7%95%D7%99%D7%96%D7%94%20%D7%9B.%D7%90.%D7%9C&Manpik=%D7%95%D7%99%D7%96%D7%94%20%D7%9B.%D7%90.%D7%9C&Mutag=%D7%95%D7%99%D7%96%D7%94&DealTypeID=1&CurrencyID=1&CardNameIDCode=2&ManpikID=2&MutagID=2&Tz=028032597&CardDate=10/24&Token=&phoneNumber=_&EmvSoftVersion=&OriginalUID=&CompRetailerNum=#/
// https://secure.e-c.co.il/easycard/createform.asp?RedirectToken=96eb87ca-d7c0-49f4-8118-8185243cf5ff&mtype=1&sum=2&ReturnURLTrue=https://test.brikoin.com/#/paymentStatus/true&ReturnURLFalse=https://test.brikoin.com/#/paymentStatus/false&products={"Prods":[{"Quantity":1,"Number":0,"Cost":"2"}]}&ExternalID=3dmsk76hbvk
const styles = theme => {
  return {};
};

class PaymentStatus extends React.Component {
  constructor(props) {
    super(props);
    const params = this.props.location.pathname.split("/");
    const status = params[2];
    const productName = params[3];
    const productId = params[4];

    this.state = { status, productName, productId };
  }

  render() {
    // status/:productName/:productId
    const { projects, lang } = this.props;
    // const locale = lang === 'En' ? 'en' : 'he-il'
    const project = projects.filter(
      project => project.address === productId
    )[0];
    const status = this.state.status;
    const productName = this.state.productName;
    const productId = this.state.productId;

    this.state = { status, productName, productId };

    if (productId && project) {
      return (
        <div
          style={{
            marginTop: "60px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <h1>{status}</h1>
          <h2>{productName}</h2>
          <Project
            lang={lang}
            init
            project={project}
            t={this.props.t}
            history={this.props.history}
          />
        </div>
      );
    } else {
      return (
        <div
          style={{
            marginTop: "60px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <h1>{status}</h1>
          <h2>{productName}</h2>
          <h2>{`${productId} could not be found`}</h2>
        </div>
      );
    }
  }

  componentDidMount() {
    const { selectLanguage, location } = this.props;

    const externalLang =
      location.search && location.search.includes("He") ? "He" : "En";
    window.scrollTo(0, 0);
    if (externalLang) {
      if (externalLang === "He") {
        selectLanguage(externalLang, "rtl");
        i18next.changeLanguage("il");
      } else {
        selectLanguage(externalLang, "ltr");
        i18next.changeLanguage("en");
      }
    }
  }
}

PaymentStatus.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = (state, props) => ({
  projects: getPopulatedProjects(state, props),
  lang: state.userProfileReducer.lang,
  direction: state.userProfileReducer.direction
});
const mapDispatchToProps = {
  selectLanguage
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(PaymentStatus)
);
