export function survivorPcList(state = [], action) {
    switch (action.type) {
      case "SURVIVOR_PC_LIST":
        return action.data;
      default:
        return state;
    }
  }
  export function masterSurvivorChargesheetData(state = [], action) {
    switch (action.type) {
      case "SURVIVOR_CHARGESHEET_LIST_WITH_PC_LIST":
        return action.data;
      default:
        return state;
    }
  }
  export function masterSurvivorDocumentData(state = [], action) {
    switch (action.type) {
      case "SURVIVOR_DOCUMENT_LIST_WITH_PC_LIST":
        return action.data;
      default:
        return state;
    }
  }

  export function masterSurvivorFirData(state = [], action) {
    switch (action.type) {
      case "SURVIVOR_FIR_LIST_WITH_PC_LIST":
        return action.data;
      default:
        return state;
    }
  }


  export function masterSurvivorInvestigationData(state = [], action) {
    switch (action.type) {
      case "SURVIVOR_INVESTIGATION_LIST_WITH_PC_LIST":
        return action.data;
      default:
        return state;
    }
  }


  export function masterSurvivorLawyersData(state = [], action) {
    switch (action.type) {
      case "SURVIVOR_LAWYERS_LIST_WITH_PC_LIST":
        return action.data;
      default:
        return state;
    }
  }


  export function masterSurvivrCourtData(state = [], action) {
    switch (action.type) {
      case "SURVIVOR_COURT_LIST_WITH_PC_LIST":
        return action.data;
      default:
        return state;
    }
  }


  export function allDocdetails(state = [], action) {
    switch (action.type) {
      case "SURVIVOR_ALLDOC_LIST_WITH_PC_LIST":
        return action.data;
      default:
        return state;
    }
  }


  export function escalatedResonList(state = [], action) {
    switch (action.type) {
      case "SURVIVOR_ESCALATED_REASON_LIST_WITH_PC_LIST":
        return action.data;
      default:
        return state;
    }
  }


  export function escalatedtTypeList(state = [], action) {
    switch (action.type) {
      case "SURVIVOR_ESCALATED_TYPE_LIST_WITH_PC_LIST":
        return action.data;
      default:
        return state;
    }
  }


  export function masterPcCurrentStatusList(state = [], action) {
    switch (action.type) {
      case "SURVIVOR_PC_CURRENT_STATUS_LIST_WITH_PC_LIST":
        return action.data;
      default:
        return state;
    }
  }


  export function masterPcWhyList(state = [], action) {
    switch (action.type) {
      case "SURVIVOR_PC_WHY_LIST_WITH_PC_LIST":
        return action.data;
      default:
        return state;
    }
  }



  export function masterResOfProsecutionList(state = [], action) {
    switch (action.type) {
      case "SURVIVOR_PC_REASON_OF_PROSECUTION_LIST_WITH_PC_LIST":
        return action.data;
      default:
        return state;
    }
  }


  export function masterDocumentTypeData(state = [], action) {
    switch (action.type) {
      case "SURVIVOR_PC_DOCUMENT_TYPE_LIST_WITH_PC_LIST":
        return action.data;
      default:
        return state;
    }
  }


  export function masterPcResultData(state = [], action) {
    switch (action.type) {
      case "SURVIVOR_PC_RESULT_LIST_WITH_PC_LIST":
        return action.data;
      default:
        return state;
    }
  }
