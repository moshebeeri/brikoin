import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import withWidth from "@material-ui/core/withWidth";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import { filterProjects } from "../../redux/actions/userProfile";
import SearchIcon from "@material-ui/icons/Search";
import GenericTextField from "../../UI/generics/GenericTextField";

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    marginBottom: 15
  },
  margin: {
    margin: theme.spacing.unit,
    minWidth: 200,
    marginBottom: 10
  },
  input: {
    marginLeft: 8,
    marginRight: 8,
    fontSize: 16,
    height: 41,
    flex: 1,
    border: "1px solid #ced4da",
    borderRadius: 4,
    padding: "10px 26px 10px 12px"
  },
  bootstrapFormLabel: {
    fontSize: 18
  }
});

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "",
      searchText: ""
    };
  }

  changeType(event) {
    this.setState({ type: event.target.value });
  }

  componentWillReceiveProps() {}

  filerProjectsOperation() {
    this.props.filterProjects(this.state.type, this.state.searchText);
  }

  render() {
    const { classes } = this.props;
    if (this.props.width === "xs") {
      return (
        <div>
          <Typography align="left" variant="h5">
            {" "}
            {this.props.t("Investor Game")}
          </Typography>
        </div>
      );
    }
    if (this.props.location.pathname === "/projects") {
      return (
        <div
          style={{
            display: "flex",
            height: this.props.width === "xs" ? 120 : 55,
            width: "100%",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div
            style={{
              display: "flex",
              boxShadow: "none"
            }}
          >
            <Grid
              container
              direction="row"
              alignItems="center"
              alignContent="center"
              justify="center"
              spacing={8}
            >
              <Grid key="searchMessage-searchBar" item>
                <Typography align="left" variant="subtitle1">
                  {this.props.t("searchMessage")}
                </Typography>
              </Grid>

              <Grid key="SearchAddress-searchBar" item>
                <div
                  style={{
                    display: "flex",
                    marginBottom: 9,
                    alignItems: "flex-start",
                    justifyContent: "flex-start"
                  }}
                >
                  <GenericTextField
                    state={this.state}
                    textArea={false}
                    setState={this.setState.bind(this)}
                    t={this.props.t}
                    fieldKey={"searchText"}
                    fieldValue={this.state.text}
                    viewOnly={false}
                  />
                </div>
              </Grid>

              <Grid key="type-searchBar" item>
                <form className={classes.root} autoComplete="off">
                  <FormControl className={classes.margin}>
                    <InputLabel
                      htmlFor="age-customized-select"
                      className={classes.bootstrapFormLabel}
                    >
                      {this.props.t("type")}
                    </InputLabel>
                    <Select
                      value={this.state.type}
                      onChange={this.changeType.bind(this)}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={"SingleApartment"}>
                        {this.props.t("Residential")}
                      </MenuItem>
                      <MenuItem value={"Office"}>
                        {this.props.t("Office")}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </form>
              </Grid>

              <Grid key="Search-searchBar" item>
                <IconButton
                  onClick={this.filerProjectsOperation.bind(this)}
                  className={classes.iconButton}
                  aria-label="Search"
                >
                  <SearchIcon />
                </IconButton>
              </Grid>
            </Grid>
          </div>
        </div>
      );
    }
    return (
      <div>
        <Typography align="left" variant="h5">
          {" "}
          {this.props.t("Investor Game")}
        </Typography>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  searchType: state.userProfileReducer.projectType,
  searchText: state.userProfileReducer.projectSearchText
});
const mapDispatchToProps = {
  filterProjects
};
export default withWidth()(
  withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(SearchBar))
);
