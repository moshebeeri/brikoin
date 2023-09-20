import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { selectLanguage } from "../../redux/actions/userProfile";
import i18next from "i18next";
const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  }
});

class LanguageSelect extends React.Component {
  state = {
    open: false,
    age: ""
  };

  handleChange = name => event => {
    this.setState({ [name]: Number(event.target.value) });
  };

  setLanguage(lang) {
    const { selectLanguage } = this.props;
    this.setState({ open: false });
    if (lang === "He") {
      selectLanguage(lang, "rtl");
      i18next.changeLanguage("il");
    } else {
      selectLanguage(lang, "ltr");
      i18next.changeLanguage("en");
    }
  }

  render() {
    const { language } = this.props;
    const changeLanguage = language === "He" ? "En" : "He";
    return (
      <div>
        <Button
          onClick={this.setLanguage.bind(this, changeLanguage)}
          style={{ color: "#70819e" }}
        >
          {this.props.t(changeLanguage)}
        </Button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    language: state.userProfileReducer.lang,
    direction: state.userProfileReducer.direction
  };
};

LanguageSelect.contextTypes = {
  drizzle: PropTypes.object
};

const mapDispatchToProps = {
  selectLanguage
};
export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(LanguageSelect)
);
