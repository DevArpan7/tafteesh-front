
/////// for diary status master /////

export function diaryStatusList(state=[] ,action){
    switch (action.type) {
      case "DIARY_STATUS_LIST":
        return action.data;
      default:
        return state;
    }

  }

  /////// for GRANT status master /////

export function grantStatusList(state=[] ,action){
    switch (action.type) {
      case "GRANT_STATUS_LIST":
        return action.data;
      default:
        return state;
    }

  }


  /////// for iNVESTIGATION status master /////

export function investigationStatusList(state=[] ,action){
    switch (action.type) {
      case "INVESTIGATION_STATUS_LIST":
        return action.data;
      default:
        return state;
    }

  }

  /////// for CIT status master /////

export function citStatusList(state=[] ,action){
    switch (action.type) {
      case "CIT_STATUS_LIST":
        return action.data;
      default:
        return state;
    }

  }

  /////// for VC status master /////

export function vcStatusList(state=[] ,action){
    switch (action.type) {
      case "VC_STATUS_LIST":
        return action.data;
      default:
        return state;
    }

  }
    /////// for SURVIVOR status master /////

export function survivorStatusList(state=[] ,action){
    switch (action.type) {
      case "SURVIVOR_STATUS_LIST":
        return action.data;
      default:
        return state;
    }

  }