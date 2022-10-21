export function cityList(state = [], action) {
    switch (action.type) {
      case "CITY_LIST":
        return action.data;
      default:
        return state;
    }
  }
  
  export function allCityList(state = [], action) {
    switch (action.type) {
      case "ALL_CITY_LIST":
        return action.data;
      default:
        return state;
    }
  }
  