export function unAuthorizedData(state = {}, action){
    switch (action.type) {
        case "UNAUTHORIZED_DATA":
          return action.data;
        default:
          return state;
      }
}
