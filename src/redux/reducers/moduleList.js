export function moduleList(state = [], action) {
    switch (action.type) {
      case "MODULE_LIST":
        return action.data;
      default:
        return state;
    }
  }
  