import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import { withCusomeStyle } from "../warappers/withCusomeStyle";
import LinesEllipsis from "react-lines-ellipsis";
import { connect } from "react-redux";
import ProjectFeature from "../generics/GenericProjectFeature";

class UserEntity extends React.Component {
  render() {
    const {
      classes,
      user,
      small,
      large,
      nameVariant,
      fullDetails,
      direction,
      features,
      project
    } = this.props;
    const variant = nameVariant || "subtitle2";
    const containerStyle = fullDetails
      ? {
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          width: 500,
          alignItems: "center"
        }
      : {
          height: 22,
          display: "flex",
          flexDirection: "row",
          width: 220,
          justifyContent: "flex-start",
          alignItems: "center"
        };

    return user.name ? (
      <div style={containerStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Avatar
            src={user.photoUrl}
            className={
              small
                ? classes.purpleAvatarSmall
                : large
                ? classes.purpleAvatarLarge
                : classes.purpleAvatar
            }
          >
            {user.name.substring(0, 1)}
          </Avatar>
        </div>
        <div
          style={{
            minWidth: 100,
            margin: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start"
          }}
        >
          <div key="3" item>
            {user.website ? (
              <a href={user.website} target="_blank">
                <Typography color={"primary"} variant={variant} gutterBottom>
                  {user.name}
                </Typography>
              </a>
            ) : (
              <Typography variant={variant} gutterBottom>
                {user.name}
              </Typography>
            )}
          </div>
          {fullDetails && (
            <div
              style={{
                display: "flex",
                textAlign: direction === "rtl" ? "right" : "left",
                fontSize: 14,
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "flex-start"
              }}
            >
              <div style={{ maxWidth: this.props.width === "xs" ? 400 : 600 }}>
                {user.description}
                {/*<LinesEllipsis*/}
                {/*text={user.description}*/}
                {/*maxLine='7'*/}
                {/*ellipsis='...'*/}
                {/*basedOn='words'*/}
                {/*/>*/}
              </div>
              {features && (
                <div
                  style={{
                    marginTop: 5,
                    flexDirection: "row",
                    display: "flex"
                  }}
                >
                  {Object.keys(features).length > 0 &&
                    Object.keys(features)
                      .sort(function(a, b) {
                        if (features[a].order < features[b].order) return -1;
                        if (features[a].order > features[b].order) return 1;
                        return 0;
                      })
                      .map(key => (
                        <div style={{ margin: 5 }}>
                          <ProjectFeature
                            project={project}
                            t={this.props.t}
                            featureKey={features[key].value ? features[key].value : key }
                            value={features[key]}
                          />{" "}
                        </div>
                      ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    ) : (
      <div />
    );
  }
}

const mapStateToProps = state => {
  return {
    direction: state.userProfileReducer.direction
  };
};
const mapDispatchToProps = {};
export default withCusomeStyle(
  connect(mapStateToProps, mapDispatchToProps)(UserEntity)
);
