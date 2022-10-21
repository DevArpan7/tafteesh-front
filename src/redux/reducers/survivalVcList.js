export function survivalVcList(state = [], action) {
    switch (action.type) {
      case "VC_LIST":
        return action.data;
      default:
        return state;
    }
  }
  export function masterAuthorityData(state = [], action) {
    switch (action.type) {
      case "VC_AUTHORITY_LIST_WITH_VC_LIST":
        return action.data;
      default:
        return state;
    }
  }
  export function masterAuthorityTypeData(state = [], action) {
    switch (action.type) {
      case "VC_AUTHORITY_TYPE_LIST_WITH_VC_LIST":
        return action.data;
      default:
        return state;
    }
  }
  
  export function masterVCStatusData(state = [], action) {
    switch (action.type) {
      case "VC_STATUS_LIST_WITH_VC_LIST":
        return action.data;
      default:
        return state;
    }
  }
  