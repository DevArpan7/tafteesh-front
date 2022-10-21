
export function investResultList(state = [], action) {
    switch (action.type) {
      case "INVESTIGATION_RESULT_LIST":
        return action.data;
      default:
        return state;
    }
  }
  export function vcResultList(state = [], action) {
    switch (action.type) {
      case "VC_RESULT_LIST":
        return action.data;
      default:
        return state;
    }
  }
  
  export function vcEscResultList(state = [], action) {
    switch (action.type) {
      case "VC_ESCALATION_RESULT_LIST":
        return action.data;
      default:
        return state;
    }
  }

  export function pcResultList(state = [], action) {
    switch (action.type) {
      case "PC_RESULT_LIST":
        return action.data;
      default:
        return state;
    }
  }


  export function pcEscResultList(state = [], action) {
    switch (action.type) {
      case "PC_ESCALATION_RESULT_LIST":
        return action.data;
      default:
        return state;
    }
  }
  