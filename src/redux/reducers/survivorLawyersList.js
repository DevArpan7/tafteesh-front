export function survivorLawyersList(state = [], action) {
    switch (action.type) {
      case "SURVIVOR_LAWYERS_LIST":
        return action.data;
      default:
        return state;
    }
  }
  
  export function masterLawyerCategoryList(state = [], action) {
    switch (action.type) {
      case "SURVIVOR_LAWYERS_CATEGRORY_LIST_WITH_LAWYERSLIST":
        return action.data;
      default:
        return state;
    }
  }
  
  export function masterLawyerData(state = [], action) {
    switch (action.type) {
      case "SURVIVOR_LAWYERS_LIST_WITH_LAWYERSLIST":
        return action.data;
      default:
        return state;
    }
  }
  
  export function masterStateDataList(state = [], action) {
    switch (action.type) {
      case "SURVIVOR_STATE_LIST_WITH_LAWYERSLIST":
        return action.data;
      default:
        return state;
    }
  }
  