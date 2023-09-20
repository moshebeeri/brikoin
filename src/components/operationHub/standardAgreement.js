import React, { useEffect, useReducer, useState } from "react";
import { connect } from "react-redux";
import { withUser } from "../../UI/warappers/withUser";
import { ApproveDialog, DocumentTemplateHtml } from "../../UI/index";
import {
  saveDocumentAttributes,
  saveFile
} from "../../redux/actions/documentOperations";

const standard = require("./standard.txt");
const trustee2 = require("./trustee2.txt");
const trustee3 = require("./trustee3.txt");
const DOCUMENT_DESCRIPTOR = {
  signature: { type: "signature" },
  name: { type: "text" },
  address: { type: "text" },
  date: { type: "date", fixed: true },
  // price: {type: 'number', fixed: true},
  id: { type: "text" }
};

function StandardAggrement(props) {
  const [uploadingFile, setUploadingFile] = useState(false);
  useEffect(() => {
    if (!props.uploading && uploadingFile) {
      setUploadingFile(false);
      props.close();
    }
  }, [props.uploading]);
  return (
    <div>
      <DocumentTemplateHtml
        direction={props.direction}
        title={"Standard Agreement"}
        fileName={"standardAgreement"}
        documentSignedAction={saveFileOperation.bind(this, props)}
        pages={[standard, trustee2, trustee3]}
        sendDocumentAction={setUploadingFile.bind(this, true)}
        saveDocumentAttributes={saveAttributes.bind(this, props, true)}
        documentValues={getDocumentValues(props)}
        documentDescriptor={DOCUMENT_DESCRIPTOR}
        t={props.t}
      />
      <ApproveDialog
        t={props.t}
        cancelAction={closeDialog.bind(this)}
        processDone={closeDialog.bind(this)}
        process={uploadingFile}
        hideAction
        processNow
        openDialog={uploadingFile}
        title={props.t("UploadingDocument")}
        approveMessage={props.t("UploadingDocumentMsg")}
      />
    </div>
  );
}

function closeDialog() {}

function saveFileOperation(props, file, state) {
  saveAttributes(props, false, state);
  props.saveFile(file, props.document, props.user, props.operation, true);
}

function saveAttributes(props, close, attributes) {
  let saveAttributes = {};
  let savedAttributes = getDocumentValues(props);
  if (attributes.name || savedAttributes.name) {
    saveAttributes.name = attributes.name
      ? attributes.name
      : savedAttributes.name;
  }
  if (attributes.address || savedAttributes.address) {
    saveAttributes.address = attributes.address
      ? attributes.address
      : savedAttributes.address;
  }
  if (attributes.address) {
    saveAttributes.address = attributes.address;
  }
  if (attributes.date || savedAttributes.date) {
    saveAttributes.date = attributes.date
      ? attributes.date
      : savedAttributes.date;
  }
  if (attributes.price || savedAttributes.price) {
    saveAttributes.price = attributes.price
      ? attributes.price
      : savedAttributes.price;
  }
  if (attributes.id || savedAttributes.id) {
    saveAttributes.id = attributes.id ? attributes.id : savedAttributes.id;
  }
  props.saveDocumentAttributes(props.document, saveAttributes, props.user);
  if (close) {
    props.close();
  }
}

function getDocumentValues(props) {
  return {
    date: new Date().getTime(),
    ...props.documentsAttributes,
    ...props.document.attributes
  };
}

const mapStateToProps = (state, props) => ({
  user: state.login.user,
  direction: state.userProfileReducer.direction,
  uploading: state.documentOperaions.uploading
});
const mapDispatchToProps = {
  saveDocumentAttributes,
  saveFile
};
export default withUser(
  connect(mapStateToProps, mapDispatchToProps)(StandardAggrement)
);
