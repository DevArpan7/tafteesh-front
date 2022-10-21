

export function agencyTypeList(state = [], action) {
  switch (action.type) {
    case "AGENCY_TYPE_LIST":
      return action.data;
    default:
      return state;
  }
}


export function agencyList(state = [], action) {
    switch (action.type) {
      case "AGENCY_LIST":
        return action.data;
      default:
        return state;
    }
  }
  

export function agencyListbyType(state = [], action) {
    switch (action.type) {
      case "AGENCY_LIST_BY_TYPE":
        return action.data;
      default:
        return state;
    }
  }
  
export function whereList(state = [], action) {
    switch (action.type) {
      case "WHERE_LIST":
        return action.data;
      default:
        return state;
    }
  }
  

  export function incomeTypeList(state = [], action) {
    switch (action.type) {
      case "INCOME_TYPE_LIST":
        return action.data;
      default:
        return state;
    }
  }
  
  export function modeOfearningList(state = [], action) {
    switch (action.type) {
      case "MODE_OF_EARNING_LIST":
        return action.data;
      default:
        return state;
    }
  }
  
  export function loanPurposeList(state = [], action) {
    switch (action.type) {
      case "PURPOSE_LIST":
        return action.data;
      default:
        return state;
    }
  
  }
  

  export function grantPurposeList(state = [], action) {
    switch (action.type) {
      case "GRANT_PURPOSE_LIST":
        return action.data;
      default:
        return state;
    }
  }
  

  