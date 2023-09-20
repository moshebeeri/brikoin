import React, { useEffect, useReducer, useState } from "react";
import { connect } from "react-redux";
import { signKyc } from "../../redux/actions/trusteeManagment";

function FileUploader(props) {
  useEffect(() => {
    if (!props.kycLoading && props.kycFile && props.user) {
      console.log("what");
      // fetch(props.kycFile).then(r => r.blob().then(blob =>
      //     props.signKyc(props.user.uid, props.kycProjectAddress, props.kycPendingOrderId, blob)
      // ))
    }
  }, [props.kycLoading, props.user]);
  return <div></div>;
}

const mapStateToProps = (state, props) => ({
  user: state.login.user,
  kycLoading: state.trusteesManagment.kycLoading,
  kycProjectAddress: state.trusteesManagment.kycProjectAddress,
  kycPendingOrderId: state.trusteesManagment.kycPendingOrderId,
  kycFile: state.trusteesManagment.kycFile,
  pendingOrders: state.trades.pendingOrders
});
const mapDispatchToProps = {
  signKyc
};
export default connect(mapStateToProps, mapDispatchToProps)(FileUploader);
