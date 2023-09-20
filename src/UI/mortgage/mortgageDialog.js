import React, { useState, useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import MortgageView from "./mortgageView";
import { withCusomeStyle } from "../warappers/withCusomeStyle";
import LoadingCircular from "../../UI/loading/LoadingCircular";
function MortgageDialog(props) {
  const { open, handleClose, mortgages, project } = props;
  const [processRequest, setProcessRequest] = useState(false);
  const [redirect, setRedirect] = useState(false);
  useEffect(() => {
    if (processRequest) {
      setTimeout(() => {
        setProcessRequest(false);
        setRedirect(true);
      }, 6000);
    }
  }, [processRequest]);

  useEffect(() => {
    if (redirect) {
      setRedirect(false);
      redirectToHHoldings(props.history);
    }
  }, [redirect]);
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {props.t("Mortgage Funding")}
        </DialogTitle>
        <DialogContent>
          {processRequest && <LoadingCircular open />}
          {mortgages.map(mortgage => (
            <MortgageView
              process={setProcessRequest}
              project={project}
              mortgage={mortgage}
              t={props.t}
            />
          ))}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function redirectToHHoldings(history) {
  history.push("/holdings/");
}

export default withCusomeStyle(MortgageDialog);
