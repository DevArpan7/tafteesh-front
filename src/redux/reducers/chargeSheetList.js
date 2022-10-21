export function chargeSheetList(state = [], action) {
    switch (action.type) {
      case "CHARGE_SHEET_LIST":
        return action.data;
      default:
        return state;
    }
  }
  export function masterActData(state = [], action) {
    switch (action.type) {
      case "MASTER_ACT_LIST_WITH_CHARGE_SHEET_LIST":
        return action.data;
      default:
        return state;
    }
  }

  export function SurvivorFirData(state = [], action) {
    switch (action.type) {
      case "SURVIOVR_FIR_LIST_WITH_CHARGE_SHEET_LIST":
        return action.data;
      default:
        return state;
    }
  }
  