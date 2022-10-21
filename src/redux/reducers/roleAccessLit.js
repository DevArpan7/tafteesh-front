
export function roleAccessLit(state = {}, action) {
    switch (action.type) {
      case "ROLE_ACCESS_LIST":
        return action.data;
      default:
        return state;
    }
  }
  