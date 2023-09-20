import React, { useEffect, useReducer, useState } from "react";
import { connect } from "react-redux";
import { withUser } from "../../UI/warappers/withUser";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import {generateBrokerLink} from "./brokerApi"
import LoadingCircular from "../../UI/loading/LoadingCircular";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import LinkIcon from '@material-ui/icons/Link';
function BrokerPanel(props) {
    const {direction} = props
    const [link, setLink] = useState('');
    const [copyLink, setCopyLink] = useState('');
    const [loadLink, setLoadLink] = useState(false);
    return  <Card className={props.classes.formCardMinWidth}>
    <CardContent>
      <Typography
        align={direction === "ltr" ? "left" : "right"}
        variant="h5"
      >
        {" "}
        {props.t("Broker")}
      </Typography>
      <Typography
        align={direction === "ltr" ? "left" : "right"}
        variant="h6"
        color="textSecondary"
      >
        {props.t("brokeryMsg")}
      </Typography>
      <div style={{ display:"flex", flexDirection:"row",marginTop: 30 }}>
        <Typography
          align={direction === "ltr" ? "left" : "right"}
          variant="h6"
        >
          {props.t("generateLink")}{" "}
        </Typography>
        <div style={{marginRight: 20, marginLeft: 20}}>
        {loadLink && <LoadingCircular open />}
        <Button
                  fullWidth
                  disabled={link || loadLink}
                  variant="outlined"
                  className={props.classes.button}
                  onClick={generateLink.bind(this, setLink, setLoadLink)}
                >
                  {props.t("create")}
                </Button>
                </div>

                {link && <CopyToClipboard text={link}
      >
      <button><LinkIcon/></button>
             </CopyToClipboard> }
      </div>
      {link &&
      
        <div style={{ display:"flex", flexDirection:"row",marginTop: 30 }}>
        <Card className={props.classes.formCardSmall2}>
        <CardContent>
          <div>{link}</div>

       
        </CardContent>
       
      </Card>

   
     </div>}
    </CardContent>
  </Card>
}

function generateLink(setLink, setLoadLink){
    generateBrokerLink(setLink, setLoadLink)
}



const mapStateToProps = (state, props) => ({
  user: state.login.user,
  direction: state.userProfileReducer.direction,
  uploading: state.documentOperaions.uploading,
  files: state.documentOperaions.files,
  loading: state.documentOperaions.loading,
  loadFiles: state.documentOperaions.loadFiles
});
const mapDispatchToProps = {
};
export default withUser(
  connect(mapStateToProps, mapDispatchToProps)(BrokerPanel)
);
