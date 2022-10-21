
export function rescueList(state = [], action) {
    switch (action.type) {
      case "RESCUE_LIST":
        return action.data;
      default:
        return state;
    }
  }
  export function masterStateData(state = [], action) {
    switch (action.type) {
      case "MASTER_STATE_DATA_WITH_RESCUE":
        return action.data;
      default:
        return state;
    }
  }
  