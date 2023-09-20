import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import ProjectLendingPageDetails from "../projects/ProjectLendingPageDetails";
import ProjectRecommendation from "../../UI/project/ProjectRecommendation";
import { connect } from "react-redux";
import { getPopulatedProjects } from "../../redux/selectors/projectsSelector";
import { invest } from "../../redux/actions/contractAbi";
import { login } from "../../redux/actions/login";
import { withRouter } from "react-router-dom";
import { pageViewd } from "../../utils/tracker";
import {
  trade,
  tradeExternalRequest,
  initProjectStats,
  listenForProjects,
  initUserProjectStats
} from "../../redux/actions/trade";
import CarouselSlider from "react-carousel-slider";
import { geolocated } from "react-geolocated";
import Geocode from "react-geocode";
import LoadingCircular from "../../UI/loading/LoadingCircular";
const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2
  },
  button2: {
    width: 200
  },
  root: {
    flexGrow: 1
  },
  paper: {
    borderStyle: "none",
    height: 300,
    width: 300
  },
  control: {
    padding: theme.spacing.unit * 2
  }
});

const headerContainerStyle = {
  position: "relative"
};

const HeaderDecor = {
  float: "left",
  position: "absolute",
  top: "200px",
  right: "100px",
  width: "1400px",
  zIndex: "1000",
  padding: "5px",
  color: "#000000",
  backgroundColor: "transparent",
  fontWeight: "bold",
  fontSize: "2rem"
};

const headerText = {
  float: "left",
  position: "absolute",
  textAlign: "left",
  top: "150px",
  left: "300px",
  width: "600px",
  height: "280px",
  zIndex: "1000",
  padding: "5px",
  backgroundColor: "transparent"
};

const brikoinLogo = {
  float: "left",
  position: "absolute",
  top: "70px",
  left: "50px",
  width: "200px",
  height: "140px",
  zIndex: "1000",
  padding: "5px",
  backgroundColor: "transparent"
};

const brikoin13Vid = {
  float: "center",
  position: "absolute",
  margin: "auto",
  top: "500px",
  left: "300px",
  width: "600px",
  zIndex: "1000",
  backgroundColor: "transparent"
};
const sliderButtonSetting = {
  placeOn: "middle-inside",
  hoverEvent: true,
  style: {
    left: {
      height: "50px",
      width: "50px",
      color: "#929393",
      background: "rgba(225, 228, 232, 0.8)",
      borderRadius: "50%"
    },
    right: {
      height: "50px",
      width: "50px",
      color: "#929393",
      background: "rgba(225, 228, 232, 0.8)",
      borderRadius: "50%"
    }
  }
};

let sliderManner = {
  autoSliding: { interval: "5s" },
  duration: "2s"
};

class Lending extends React.Component {
  saveEntity() {
    this.props.save(this.state);
  }
  constructor(props) {
    super(props);
    Geocode.setApiKey("AIzaSyBr0HjmyUqlu3ozlafUAXllJgU6a13i9EM");
    Geocode.enableDebug();

    this.state = {
      location: "",
      geoLocation: "",
      investType: "",
      spacing: "100",
      address: "",
      country: "",
      countryCode: ""
    };
  }
  geo() {
    return !this.props.isGeolocationAvailable ? (
      <div>Your browser does not support Geolocation</div>
    ) : !this.props.isGeolocationEnabled ? (
      <div>Geolocation is not enabled</div>
    ) : this.props.coords ? (
      <table>
        <tbody>
          <tr>
            <td>latitude</td>
            <td>{this.props.coords.latitude}</td>
          </tr>
          <tr>
            <td>longitude</td>
            <td>{this.props.coords.longitude}</td>
          </tr>
          <tr>
            <td>altitude</td>
            <td>{this.props.coords.altitude}</td>
          </tr>
          <tr>
            <td>heading</td>
            <td>{this.props.coords.heading}</td>
          </tr>
          <tr>
            <td>speed</td>
            <td>{this.props.coords.speed}</td>
          </tr>
        </tbody>
      </table>
    ) : (
      <div>Getting the location data&hellip; </div>
    );
  }

  render() {
    const { classes, lang, projects, user, topAsks } = this.props;
    const projectAddress = this.props.location.pathname.substring(
      "/lending/".length
    )
      ? this.props.location.pathname.substring("/lending/".length)
      : "";
    const project = projectAddress
      ? projects.filter(project => project.address === projectAddress)[0]
      : "";
    const recommendedProjects = projects.map((project, index) => (
      <ProjectRecommendation
        project={project}
        history={this.props.history}
        t={this.props.t}
      />
    ));

    if (projects && projects.length > 0) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flex: 1,
            backgroundColor: "white"
          }}
        >
          <div style={headerContainerStyle}>
            <div style={brikoinLogo}>
              <img
                style={{ width: "50%" }}
                src={
                  "https://firebasestorage.googleapis.com/v0/b/firestone-1.appspot.com/o/briKoin%20logo.png?alt=media&token=66773b2a-9740-4b32-abe5-f2c5b41e83ff"
                }
              />
              <img
                style={{ width: "100%" }}
                src={
                  "https://firebasestorage.googleapis.com/v0/b/firestone-1.appspot.com/o/brikoin%20name.png?alt=media&token=e1dcd5a2-d17d-481a-a011-24c36df8acac"
                }
              />
            </div>
            <div style={headerText}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  flexDirection: "column"
                }}
              >
                <p style={{ display: "flex", fontSize: "3em" }}>
                  {this.props.t("BuildPerfectPortfolio")}
                </p>
                <p style={{ display: "flex", fontSize: "2em" }}>
                  {this.props.t("IntroducingInvestmentPlatform")}
                </p>
                <p style={{ display: "flex", fontSize: "2em" }}>
                  {this.state.country}
                </p>
              </div>
            </div>
            <div style={HeaderDecor}>
              <img
                style={{ width: "100%" }}
                id="headerDecoImage"
                alt="Build Your Real-Estate Portfolio"
                sizes="100vw"
                src="https://firebasestorage.googleapis.com/v0/b/firestone-1.appspot.com/o/lending_man.png?alt=media&token=7e8fc40b-885e-4345-b78b-eef08083053d"
              />
            </div>
            <div style={brikoin13Vid}>
              <h2>{this.props.t("What's the story?")}</h2>
              <video
                id="brikoin13Vid"
                width="600"
                controls
                poster="https://firebasestorage.googleapis.com/v0/b/firestone-1.appspot.com/o/brikoin13_poster.png?alt=media&token=d93abf67-646d-4047-b38f-04cb7994d78a"
              >
                <source
                  src="https://firebasestorage.googleapis.com/v0/b/firestone-1.appspot.com/o/BriKoin13-489.m4v?alt=media&token=09617783-2758-49eb-85b8-29a4c9db5a1c"
                  type="video/mp4"
                />
              </video>
            </div>

            <img
              style={{ width: "100%" }}
              id="headerImage"
              alt="Buy Real-Estate online"
              sizes="100vw"
              src="https://firebasestorage.googleapis.com/v0/b/firestone-1.appspot.com/o/lending_page_bkg.jpg?alt=media&token=fab6010a-37e2-4997-8ba2-93f1202e902d"
            />
          </div>
          <div style={{ marginTop: 20 }}>
            <ProjectLendingPageDetails
              projectAddress={projectAddress}
              history={this.props.history}
              lang={lang}
              t={this.props.t}
              key={project.address}
              init={topAsks}
              user={user}
            />
          </div>
          <div style={{ maxWidth: "90%", marginTop: 30, height: 750 }}>
            <h3>{this.props.t("Recommended Projects")}</h3>
            <div dir={"ltr"}>
              <CarouselSlider
                sliderBoxStyle={{
                  maxWidth: "90%",
                  background: "white",
                  height: 550
                }}
                manner={sliderManner}
                buttonSetting={sliderButtonSetting}
                slideCpnts={recommendedProjects}
              />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div style={{ width: "100%", marginTop: 60, minHeight: 500 }}>
          <LoadingCircular open className={classes.progress} />
        </div>
      );
    }
  }

  componentDidUpdate() {
    const { user, init } = this.props;
    if (user && !init) {
      this.props.initUserProjectStats(user.uid);
    }
  }

  componentDidMount() {
    this.props.initProjectStats();
    pageViewd("/projectList");
    window.scrollTo(0, 0);

    let setState = this.setState.bind(this);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        setState({
          geoLocation: `lat=${position.coords.latitude}&lon=${position.coords.longitude}`
        });
        Geocode.fromLatLng(
          position.coords.latitude,
          position.coords.longitude
        ).then(
          response => {
            const country = response.results[0].address_components.filter(
              comp => comp.types.includes("country")
            );
            console.log(JSON.stringify(country[0].long_name));
            setState({ country: country[0].long_name });
            setState({ countryCode: country[0].short_name });

            const address = response.results[0].formatted_address;
            console.log(JSON.stringify(response));
            setState({ address: address });
            console.log(address);
          },
          error => {
            console.log(error);
          }
        );
      });
    }
  }
}

Lending.propTypes = {
  classes: PropTypes.object.isRequired
};
const mapStateToProps = (state, props) => ({
  projects: getPopulatedProjects(state, props),
  accountInit: state.userAccounts.accountInit,
  drizzleStatus: state.drizzleStatus,
  topAsks: state.trades.topAsks,
  activeAccount: state.userAccounts.activeAccount,
  user: state.login.user,
  lang: state.userProfileReducer.lang,
  init: state.trades.init,
  errorMessage: state.login.errorMessage
});

const mapDispatchToProps = {
  invest,
  tradeExternalRequest,
  trade,
  initProjectStats,
  login,
  listenForProjects,
  initUserProjectStats
};

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false
  },
  userDecisionTimeout: 5000
})(
  withRouter(
    withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Lending))
  )
);
