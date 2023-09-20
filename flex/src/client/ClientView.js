import React, { Component } from "react";
import { connect } from "react-redux";
import { Card, CardText } from "material-ui/Card";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
class ClientView extends Component {
  constructor(props) {
    super();
  }

  render() {
    const { customerName } = this.props;
    return (
      <MuiThemeProvider>
        <div style={{ width: 600 }}>
          <Card>
            <CardText>
              <div className="flex-container">
                <div
                  style={{
                    width: this.props.width === "xs" ? 300 : 600,
                    height: 200
                  }}
                >
                  <h1>T24 Information</h1>
                  {customerName && (
                    <div> Information about : {customerName} </div>
                  )}
                  {/* <iframe src={'https://www.ynet.co.il'} height={800} width={'100%'} /> */}
                </div>
              </div>
            </CardText>
          </Card>
          <Card>
            <CardText>
              <div className="flex-container">
                <div
                  style={{
                    width: this.props.width === "xs" ? 300 : 600,
                    height: 200
                  }}
                >
                  <h1>Salesforce Information</h1>
                  {customerName && (
                    <div> Information about : {customerName} </div>
                  )}
                  {/* <iframe src={'https://www.ynet.co.il'} height={800} width={'100%'} /> */}
                </div>
              </div>
            </CardText>
          </Card>
        </div>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = (state, props) => ({
  customerName: state.video.customerName
});

const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(ClientView);
