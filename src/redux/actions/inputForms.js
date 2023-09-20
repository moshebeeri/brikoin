export const types = {
  SET_TRANSACTION_STATE: "SET_TRANSACTION_STATE",
  UPLOAD_PDF: "UPLOAD_PDF",
  GET_ADDRESS: "GET_ADDRESS",
  SAVE_ENTITY: "SAVE_ENTITY",
  SET_ADDRESS: "SET_ADDRESS",
  SET_PDF_FILE: "SET_PDF_FILE",
  SAVE_WIZARD_FORM: "SAVE_WIZARD_FORM",
  RESET_FORM: "RESET_FORM"
};
export const setTransactionState = (transactionState, formName) => ({
  type: types.SET_TRANSACTION_STATE,
  transactionState,
  formName
});

export const uploadPDF = (entity, formName) => ({
  type: types.UPLOAD_PDF,
  entity,
  formName
});
export const saveEntity = (entity, entityType) => ({
  type: types.SAVE_ENTITY,
  entity,
  entityType
});

export const saveWizardForm = (form, user) => ({
  type: types.SAVE_WIZARD_FORM,
  form,
  user
});
export const fetchAddress = (address, formName) => ({
  type: types.GET_ADDRESS,
  address,
  formName
});

export const resetFormState = formName => ({
  type: types.RESET_FORM,
  formName
});
