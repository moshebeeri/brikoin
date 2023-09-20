import * as React from "react";
import Typography from "@material-ui/core/Typography";
import { DataTypeProvider } from "@devexpress/dx-react-grid";
import {
  Grid,
  Table,
  TableHeaderRow,
  TableColumnResizing
} from "@devexpress/dx-react-grid-material-ui";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Close from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
const ProjectTitleFormater = ({ value }) => (
  <Typography align="left" variant="h6">
    {value}
  </Typography>
);
const linkFormater = ({ value }) => (
  <a title={"click to download"} href={value} target="_blank">
    {" "}
    download{" "}
  </a>
);

const ProjectTypeProvider = props => (
  <DataTypeProvider formatterComponent={ProjectTitleFormater} {...props} />
);
const LinkProvider = props => (
  <DataTypeProvider formatterComponent={linkFormater} {...props} />
);

const styles = theme => {
  return {
    root: {
      width: "80%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      marginTop: 70,
      flexGrow: 1
    },
    rootGrid: {
      overflowX: "auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexGrow: 1
    },
    table: {
      minWidth: 700,
      width: "auto",
      tableLayout: "auto"
    },
    row: {
      "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.background.default
      }
    },
    card: {
      marginTop: "1%",
      width: "70%",
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      flexDirection: "column",
      borderColor: "white"
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
    details: {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      width: "100%",
      marginTop: 30,
      flexDirection: "column"
    },
    cardRow: {
      display: "flex",
      marginLeft: "10%",
      marginRight: "10%",
      width: "60%",
      marginTop: "1%"
    },

    cover: {
      marginTop: "1%",
      marginLeft: 10,
      marginRight: 10,
      width: 180,
      height: 120
    },

    paper: {
      padding: theme.spacing.unit * 2,
      textAlign: "center",
      color: theme.palette.text.secondary
    }
  };
};
class KycDetails extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columnWidths: [
        // { columnName: 'generalStatus', width: 100 },
        { columnName: "address", width: 150 },
        { columnName: "idDocument", width: 95 },
        { columnName: "name", width: 95 },
        { columnName: "phone", width: 95 },
        { columnName: "identifier", width: 95 }
      ],

      expandedRowIds: []
    };

    this.changeExpandedDetails = expandedRowIds =>
      this.setState({ expandedRowIds });
  }

  handleClose() {
    this.props.closeDialog();
  }
  render() {
    const { columnWidths } = this.state;
    const { row, openDialog, userKyc } = this.props;
    const columns = [
      { name: "address", title: this.props.t("address") },
      { name: "idDocument", title: this.props.t("idDocument") },
      { name: "name", title: this.props.t("name") },
      { name: "phone", title: this.props.t("phone") },
      { name: "identifier", title: this.props.t("identifier") }
    ];

    const rows = [];
    if (!userKyc[row]) {
      return <div />;
    }
    rows.push(userKyc[row]);

    return (
      <Dialog
        open={openDialog}
        onClose={this.handleClose.bind(this)}
        aria-labelledby="form-dialog-title"
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-end"
          }}
        >
          <Button color="primary" onClick={this.handleClose.bind(this)}>
            <Close />
          </Button>
        </div>
        <DialogTitle id="form-dialog-title">
          {this.props.t("UserDetails")}
        </DialogTitle>
        <DialogContent>
          <div
            style={{
              backgroundColor: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start"
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItem: "center",
                width: "100%",
                justifyContent: "center",
                minWidth: 700
              }}
            />
            <Grid rows={rows} columns={columns}>
              <ProjectTypeProvider
                for={["address", "name", "phone", "identifier"]}
              />

              <LinkProvider for={["idDocument"]} />
              <Table />
              <TableColumnResizing columnWidths={columnWidths} />
              <TableHeaderRow />
            </Grid>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}

const mapStateToProps = (state, props) => ({
  user: state.login.user,
  userKyc: state.mortgage.userKyc
});

export default withStyles(styles)(connect(mapStateToProps)(KycDetails));
