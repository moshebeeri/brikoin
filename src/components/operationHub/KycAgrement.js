import React, { useEffect, useReducer, useState } from "react";
import { connect } from "react-redux";
import { withUser } from "../../UI/warappers/withUser";
import { ApproveDialog, DocumentTemplate } from "../../UI/index";
import {saveDocumentAttrivutes} from './operationUtils' 
import {
  saveFile
} from "../../redux/actions/documentOperations";

const myTxt = require("./kyc.txt");
const DOCUMENT_DESCRIPTOR = {
  signature: { type: "signature", mandatory: true },
  form: { type: "form", mandatory: true },
  name: { type: "text", mandatory: true },
  secondName: { type: "text", mandatory: true },
  birthDate: { type: "date", mandatory: true },
  familyState: { type: "selector", mandatory: true },
  sex: { type: "selector", mandatory: true },
  nationalStatus: { type: "selector", mandatory: true },
  national: { type: "text", mandatory: true },
  livingAddress: { type: "text", mandatory: true },
  country: { type: "text", mandatory: true },
  pinCode: { type: "text", mandatory: true },
  livingType: { type: "text", mandatory: true },
  mail: { type: "text", mandatory: true },
  mobile: { type: "number", mandatory: true },
  phone: { type: "number", mandatory: true },
  date: { type: "date", fixed: true },
  id: { type: "text", mandatory: true }
};

const DOCUMENT_FORM_DESCRIPTOR = {
  name: "text",
  secondName: "text",
  birthDate: "date",
  familyState: "selector",
  sex: "selector",
  nationalStatus: "selector",
  national: "text",
  livingAddress: "text",
  country: "text",
  pinCode: "text",
  livingType: "text",
  mail: "text",
  mobile: "text-number",
  phone: "text-number",
  id: "text"
};

function TrusteeAggrement(props) {
  const [uploadingFile, setUploadingFile] = useState(false);
  useEffect(() => {
    if (!props.uploading && uploadingFile) {
      setUploadingFile(false);
      props.close();
    }
  }, [props.uploading]);
  return (
    <div>
      <DocumentTemplate
        direction={props.direction}
        title={"Know Your Customer"}
        fileName={"kyc"}
        documentSignedAction={saveFileOperation.bind(this, props)}
        document={myTxt}
        sendDocumentAction={setUploadingFile.bind(this, true)}
        selectorValues={getSelectorValues(props)}
        formDescriptor={DOCUMENT_FORM_DESCRIPTOR}
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
  props.saveFile(file, props.document.id ? props.document : {id: props.operation.document}, props.user, props.operation, true);
}

function getSelectorValues(props) {
  return {
    familyState: [
      { label: props.t("single"), value: "single" },
      { label: props.t("married"), value: "married" },
      { label: props.t("divorced"), value: "divorced" },
      { label: props.t("other"), value: "other" }
    ],
    sex: [
      { label: props.t("male"), value: "male" },
      { label: props.t("female"), value: "female" }
    ],
    nationalStatus: [
      { label: props.t("resident"), value: "resident" },
      { label: props.t("nonresident"), value: "nonresident" },
      { label: props.t("foreignCitizen"), value: "foreignCitizen" }
    ]
  };
}

function saveAttributes(props, close, attributes) {
  let saveAttributes = {};
  let savedAttributes = getDocumentValues(props);
  if (attributes.name || savedAttributes.name) {
    saveAttributes.name = attributes.name
      ? attributes.name
      : savedAttributes.name;
  }

  if (attributes.secondName || savedAttributes.secondName) {
    saveAttributes.secondName = attributes.secondName
      ? attributes.secondName
      : savedAttributes.secondName;
  }
  if (attributes.birthDate || savedAttributes.birthDate) {
    saveAttributes.birthDate = attributes.birthDate
      ? attributes.birthDate
      : savedAttributes.birthDate;
  }
  if (attributes.familyState || savedAttributes.familyState) {
    saveAttributes.familyState = attributes.familyState
      ? attributes.familyState
      : savedAttributes.familyState;
  }
  if (attributes.sex || savedAttributes.sex) {
    saveAttributes.sex = attributes.sex ? attributes.sex : savedAttributes.sex;
  }
  if (attributes.nationalStatus || savedAttributes.nationalStatus) {
    saveAttributes.nationalStatus = attributes.nationalStatus
      ? attributes.nationalStatus
      : savedAttributes.nationalStatus;
  }
  if (attributes.national || savedAttributes.national) {
    saveAttributes.national = attributes.national
      ? attributes.national
      : savedAttributes.national;
  }
  if (attributes.livingAddress || savedAttributes.livingAddress) {
    saveAttributes.livingAddress = attributes.livingAddress
      ? attributes.livingAddress
      : savedAttributes.livingAddress;
  }
  if (attributes.livingAddress2 || savedAttributes.livingAddress2) {
    saveAttributes.livingAddress2 = attributes.livingAddress2
      ? attributes.livingAddress2
      : savedAttributes.livingAddress2;
  }
  if (attributes.mail || savedAttributes.mail) {
    saveAttributes.mail = attributes.mail
      ? attributes.mail
      : savedAttributes.mail;
  }
  if (attributes.livingType || savedAttributes.livingType) {
    saveAttributes.livingType = attributes.livingType
      ? attributes.livingType
      : savedAttributes.livingType;
  }
  if (attributes.mobile || savedAttributes.mobile) {
    saveAttributes.mobile = attributes.mobile
      ? attributes.mobile
      : savedAttributes.mobile;
  }

  if (attributes.country || savedAttributes.country) {
    saveAttributes.country = attributes.country
      ? attributes.country
      : savedAttributes.country;
  }
  if (attributes.pinCode || savedAttributes.pinCode) {
    saveAttributes.pinCode = attributes.pinCode
      ? attributes.pinCode
      : savedAttributes.pinCode;
  }
  if (attributes.address) {
    saveAttributes.address = attributes.address;
  }
  if (attributes.date || savedAttributes.date) {
    saveAttributes.date = attributes.date
      ? attributes.date
      : savedAttributes.date;
  }

  if (attributes.id || savedAttributes.id) {
    saveAttributes.id = attributes.id ? attributes.id : savedAttributes.id;
  }

  if (attributes.phone || savedAttributes.phone) {
    saveAttributes.phone = attributes.phone
      ? attributes.phone
      : savedAttributes.phone;
  }
  saveDocumentAttrivutes(props.document.id, saveAttributes);
  if (close) {
    props.close();
  }
}

function getDocumentValues(props) {
  const { order } = props;
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
  saveFile
};
export default withUser(
  connect(mapStateToProps, mapDispatchToProps)(TrusteeAggrement)
);
