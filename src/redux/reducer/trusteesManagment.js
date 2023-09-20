import { types } from "../../redux/actions/trusteeManagment";
import { REHYDRATE } from "redux-persist";

const initialState = {
  kycLoading: false,
  signDocumentLoading: false,
  kycFile: "",
  kycProjectAddress: "",
  kycPendingOrderId: ""
};
export default function trusteeManagment(state = initialState, action = {}) {
  if (action.type === REHYDRATE) {
    const savedData = action.payload || initialState;
    if (savedData.trusteesManagment) {
      return {
        ...state,
        kycFile: savedData.trusteesManagment.kycFile,
        kycProjectAddress: savedData.trusteesManagment.kycProjectAddress,
        kycPendingOrderId: savedData.trusteesManagment.kycPendingOrderId
      };
    }
  }
  switch (action.type) {
    case types.UPLOADING_KYC:
      return {
        ...state,
        kycLoading: true,
        kycFile: action.file,
        kycProjectAddress: action.projectAddress,
        kycPendingOrderId: action.pendingOrderId
      };
    case types.UPLOADING_BUYER_DOCUMENT:
      return {
        ...state,
        signDocumentLoading: true
      };
    case types.UPLOADING_BUYER_DOCUMENT_DONE:
      return {
        ...state,
        signDocumentLoading: false
      };
    case types.UPLOADING_KYC_DONE:
      return {
        ...state,
        kycLoading: false,
        kycFile: "",
        kycProjectAddress: "",
        kycPendingOrderId: ""
      };
    case "LOGOUT.SUCCESS":
      return {
        ...state,
        kycLoading: false,
        kycFile: "",
        kycProjectAddress: "",
        kycPendingOrderId: ""
      };
    default:
      return state;
  }
}
