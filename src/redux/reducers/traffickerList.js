export function traffickerList(state = [], action) {
    switch (action.type) {
      case "TRAFFICKER_LIST":
        return action.data;
      default:
        return state;
    }
  }
  

export function survivorTraffickerList(state= {}, action){
  switch (action.type){
    case "SURVIVOR_TRAFFICKER_LIST":
        return action.data;
      default:
        return state;
  }
}

export function traffickerActionData(state= {}, action){
  switch (action.type){
    case "TRAFFICKER_ACTION_LIST":
        return action.data;
      default:
        return state;
  }
}

export function mastertraffickerData(state= {}, action){
  switch (action.type){
    case "MASTER_TRAFFICKER_LIST_WITH_SURVIVOR_TRAFFICKER_LSIT":
        return action.data;
      default:
        return state;
  }
}


export function mastertraffickerDataforSurv(state= [], action){
  switch (action.type){
    case "MASTER_TRAFFICKER_LIST_FOR_SUR":
        return action.data;
      default:
        return state;
  }
}


