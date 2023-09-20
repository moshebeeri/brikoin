import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import withWidth from "@material-ui/core/withWidth";
import green from "@material-ui/core/colors/green";
import deepPurple from "@material-ui/core/colors/deepPurple";

const styles = theme => {
  return {
    // Project PreView
    projectCard: {
      display: "flex",
      boxShadow: "none",
      borderWidth: 1,
      borderColor: "#e5e5e5",
      borderStyle: "solid"
    },

    projectCardEmpty: {
      display: "flex",
      boxShadow: "none",
      borderWidth: 1,
      marginTop: 10,
      backgroundColor:'#ECF0F3',
      width: 1000,
      height: 120,
      alignItems: 'cemter',
      justifyContent:'center',
      borderColor: "#e5e5e5",
      borderStyle: "solid"
    },
    bigDialog: {
      maxWidth: 900
    },
    projectCover: {
      width: 300,
      height: 250
    },
    projectContent: {
      flex: "1 0 auto"
    },
    projectControl: {
      display: "flex",
      alignItems: "center",
      width: 220,
      height: 200,
      paddingLeft: theme.spacing.unit,
      paddingBottom: theme.spacing.unit
    },
    projectControlPreview: {
      display: "flex",
      alignItems: "flex-start",
      width: 220,
      height: 200,
      
      paddingLeft: theme.spacing.unit,
      paddingBottom: theme.spacing.unit
    },
    projectDetails: {
      display: "flex",
      maxWidth: 600,
      flexDirection: "column"
    },
    //
    card: {
      display: "flex",
      boxShadow: "none",
      width: "100%",
      minWidth: 1000,
      maxWidth: 1000,
      borderWidth: 1,
      borderColor: "#e5e5e5",
      borderStyle: "solid"
    },
    componentBox: {
      width: 300,
      height: 60,
      // backgroundColor: '#f0f4b2',
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "flex-start"
    },
    componentBoxArea: {
      marginTop: 5,
      width: 900,
      minHeight: 100,
      // backgroundColor: '#f0f4b2',
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start"
    },
    componentBoxAreaSmall: {
      marginTop: 5,
      width: 300,
      minHeight: 100,
      // backgroundColor: '#f0f4b2',
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start"
    },
    componentBoxValue: {
      width: 300,
      height: 40,
      backgroundColor: "#fefff2",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    },
    componentBoxFileSmall: {
      marginTop: 5,
      backgroundColor: "#fefff2",
      width: 300
    },
    componentBoxFileValue: {
      width: 900
    },

    dynamicForm: {
      width: 1200
    },
    componentBoxError: {
      minWidth: 300,
      marginLeft: 10,
      marginRight: 10,
      maxWidth: 830,
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      border: "1px solid #ced4da",
      borderColor: "red",
      borderRadius: 4
    },
    cardTitle: {
      marginTop: 16,
      display: "flex",
      marginBottom: 16,
      justifyContent: "flex-start",
      alignItems: "center",
      flexDirection: "column",
      boxShadow: "none",
      borderWidth: 1,
      borderColor: "#e5e5e5",
      borderStyle: "solid"
    },
    cardDetails: {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      flexDirection: "column"
    },
    cardSubMenu: {
      marginBottom: 16,
      height: 80,
      width: 320,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      boxShadow: "none",
      borderWidth: 1,
      borderColor: "#e5e5e5",
      borderStyle: "solid"
    },
    investCard: {
      marginBottom: 16,
      // height: 100,
      width: 320,
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      flexDirection: "column",
      boxShadow: "none",
      borderWidth: 1,
      borderColor: "#e5e5e5",
      borderStyle: "solid"
    },
    investCardOrder: {
      marginTop: 16,
      marginBottom: 32,
      // height: 150,
      width: 320,
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      flexDirection: "column",
      boxShadow: "none",
      borderWidth: 1,
      borderColor: "#e5e5e5",
      borderStyle: "solid"
    },
    // Buttons Style
    button: {
      width: 200,
      fontSize: 16,
      color: "#3E79D6",
      borderColor: "#3E79D6",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
      // height: 30
    },
    buttonSmall: {
      color: "#3E79D6",
      borderColor: "#3E79D6",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
      // height: 30
    },
    buttonContinue: {
      width: 250,
      fontSize: 12,
      color: "white",
      backgroundColor: "#004466",

      borderColor: "#004466",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    buttonSignUp: {
      width: 250,
      fontSize: 12,
      color: "white",
      backgroundColor: "#A9A9A9",

      borderColor: "#A9A9A9",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    buttonGoogle: {
      width: 250,
      fontSize: 12,
      color: "white",
      backgroundColor: "#4885ed",

      borderColor: "#4885ed",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    menuButton: {
      marginLeft: -12,
      marginRight: 20
    },
    buttonInvest: {
      marginTop: 10,
      width: 150,
      // height: 30,
      fontSize: 16,
      display: "flex",
      color: "white",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#004466"
    },
    buttonRegular: {
      marginTop: 10,
      width: 150,
      // height: 30,
      fontSize: 16,
      color: "#3E79D6",
      borderColor: "#3E79D6",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    buttonProgress: {
      color: green[500],
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: -12,
      marginLeft: -12
    },
    // form fields
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 200
    },

    textFieldLogin: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 250
    },
    textArea: {
      width: 800,
      minHeight: 120
    },
    textAreaMedium: {
      width: 690,
      minHeight: 120
    },
    textAreaSmall: {
      width: 200,
      minHeight: 120
    },
    madlanHeaderTitle: {
      fontSize: theme.typography.pxToRem(20),
      fontWeight: theme.typography.fontWeightMedium,
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "flex-start"
    },
    madlanIcon: {
      fontSize: 45
    },
    headingTitle: {
      fontSize: theme.typography.pxToRem(20),
      fontWeight: theme.typography.fontWeightMedium,
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "flex-start"
    },
    icon: {
      fontSize: 45
    },
    userDetailsCard: {
      display: "flex",
      maxWidth: 790,
      boxShadow: "none",
      borderWidth: 1,
      borderColor: "#e5e5e5",
      borderStyle: "solid"
    },
    formCard: {
      maxWidth: 420,
      display: "flex",
      boxShadow: "none",
      borderWidth: 1,
      borderColor: "#e5e5e5",
      borderStyle: "solid"
    },
    formCardSmall: {
      maxWidth: 440,
      height: 300,
      marginRight: "10%",
      display: "flex",
      boxShadow: "none",
      borderWidth: 1,
      borderColor: "#e5e5e5",
      borderStyle: "solid"
    },
    formCardMinWidth: {
      maxWidth: 440,
      minWidth: 440,
      height: 300,
      marginRight: "10%",
      display: "flex",
      boxShadow: "none",
      borderWidth: 1,
      borderColor: "#e5e5e5",
      borderStyle: "solid"
    },
    formCardSmall2: {
      maxWidth: 370,
      backgroundColor: "#f9fafc"
    },
    // FORM GENERATOR
    selectorMargin: {
      marginTop: theme.spacing.unit,
      minWidth: 200
    },
    menuItem: {
      minWidth: 200
    },
    root: {
      display: "flex",
      flexWrap: "wrap"
    },
    appHeader: {
      display: "flex",
      flexWrap: "wrap",
      height: 30
    },
    colorIcon: {
      fontSize: 45,
      color: "#004466"
    },
    tabRoot: {
      // backgroundColor: '#004466',
      // color: '#004466',
      fontSize: 15,
      "&:hover": {
        color: "gray",
        opacity: 1
      },
      "&$tabSelected": {
        color: "#004466",
        fontWeight: theme.typography.fontWeightMedium
      },
      "&:focus": {
        color: "#004466"
      }
    },
    tabSelected: {
      // backgroundColor: 'white'
    },
    tabBackgroundSmall: {
      display: "flex",
      marginTop: 20,
      alignItems: "flex-start",
      justifyContent: "flex-start",
      width: 450
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "flex-start"
    },
    tabBackground: {
      display: "flex",
      marginTop: 20,
      alignItems: "flex-start",
      justifyContent: "flex-start",
      width: 550
      // backgroundColor: '#004466'
    },
    avatar: {
      margin: 10
    },
    purpleAvatarSmall: {
      margin: 5,
      width: 30,
      height: 30,
      color: "#fff",
      backgroundColor: deepPurple[500]
    },
    purpleAvatarLarge: {
      margin: 5,
      width: 60,
      height: 60,
      color: "#fff",
      backgroundColor: deepPurple[500]
    },
    purpleAvatar: {
      margin: 5,
      width: 40,
      height: 40,
      color: "#fff",
      backgroundColor: deepPurple[500]
    },
    fab: {
      marginBottom: 20,
      marginRight: 20,
      marginLeft: 20
    }
  };
};

export function withCusomeStyle(WrappedComponent) {
  class CustomeStyle extends React.PureComponent {
    render() {
      const { classes } = this.props;
      return (
        <WrappedComponent
          width={this.props.width}
          classes={classes}
          {...this.props}
        />
      );
    }
  }

  CustomeStyle.propTypes = {
    classes: PropTypes.object.isRequired
  };
  return withWidth()(withStyles(styles)(CustomeStyle));
}
