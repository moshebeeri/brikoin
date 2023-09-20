import { types } from "../../redux/actions/inputForms";
const initialState = {
  formTransactionState: {},
  wizardForm: {},
  pdf: {},
  pdfCode: {},
  pdfMd5: {},
  addresses: {},
  changed: false
};

export default function inputForms(state = initialState, action = {}) {
  let inputForms = { ...state };
  switch (action.type) {
    case types.SET_TRANSACTION_STATE:
      inputForms.formTransactionState[action.formName] =
        action.transactionState;
      inputForms.changed = !inputForms.changed;
      return inputForms;

    case types.SAVE_WIZARD_FORM:
      inputForms.wizardForm[action.user.uid] = action.form;
      return inputForms;
    case types.SET_PDF_FILE:
      inputForms.pdf[action.formName] = action.pdfUrl;
      inputForms.pdfCode[action.formName] = action.urlCode;
      inputForms.pdfMd5[action.formName] = action.pdfMd5;
      inputForms.changed = !inputForms.changed;
      return inputForms;
    case types.SET_ADDRESS:
      inputForms.addresses[action.formName] = action.address;
      inputForms.changed = !inputForms.changed;
      return inputForms;
    case types.RESET_FORM:
      inputForms.pdf[action.formName] = "";
      inputForms.formTransactionState[action.formName] = "";
      inputForms.pdfCode[action.formName] = "";
      inputForms.pdfMd5[action.formName] = "";
      inputForms.addresses[action.formName] = "";
      inputForms.changed = !inputForms.changed;
      return inputForms;
    default:
      return state;
  }
}
