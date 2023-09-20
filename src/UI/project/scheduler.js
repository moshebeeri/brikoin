import React from "react";
import withWidth from "@material-ui/core/withWidth";
import BigCalendar from "react-big-calendar";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import moment from "moment";

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
const localizer = BigCalendar.momentLocalizer(moment);

class ProjectViewScheduling extends React.Component {
  render() {
    const { language, direction, project } = this.props;

    if (project.structure !== "SingleApartment") {
      return <div />;
    }

    const events = this.getOpenHours(project);
    let initTime = new Date();
    initTime.setHours(8);
    initTime.setMinutes(0);

    let endTTime = new Date();
    endTTime.setMinutes(0);
    endTTime.setHours(21);

    return (
      <div style={{ minWidth: this.props.width === "xs" ? 0 : 700 }}>
        <div
          style={{
            display: "flex",
            marginBottom: 5,
            alignItems: "flex-start",
            justifyContent: "flex-start",
            minWidth: this.props.width === "xs" ? 0 : 700
          }}
        >
          <Typography align="center" variant="h6" color="textSecondary">
            {this.props.t("openHouseHours")}
          </Typography>
        </div>
        <BigCalendar
          rtl={direction === "rtl"}
          view={"week"}
          min={initTime}
          max={endTTime}
          onView={this.onView.bind(this)}
          drilldownView={null}
          events={events}
          views={["week"]}
          culture={language}
          localizer={localizer}
        />
      </div>
    );
  }

  onView(event) {}
  getOpenHours(project) {
    return [
      {
        id: 1,
        title: this.props.t("openHouse"),
        start: new Date(new Date().setHours(new Date().getHours() - 3)),
        end: new Date(new Date().setHours(new Date().getHours() + 3))
      }
    ];
  }
}

const mapStateToProps = state => {
  return {
    language: state.userProfileReducer.lang,
    direction: state.userProfileReducer.direction
  };
};

const mapDispatchToProps = {};
export default withWidth()(
  connect(mapStateToProps, mapDispatchToProps)(ProjectViewScheduling)
);
