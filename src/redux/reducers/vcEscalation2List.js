export function vcEscalation2List(state = [], action) {
    switch (action.type) {
      case "VC_ESCALATION_2_LIST":
        return action.data;
      default:
        return state;
    }
  }
  
  export function multipleVcEscalation2List(state=[] ,action){
    switch (action.type) {
      case "MULTIPLE_VC_ESCALATION_2_LIST":
        return action.data;
      default:
        return state;
    }

  }