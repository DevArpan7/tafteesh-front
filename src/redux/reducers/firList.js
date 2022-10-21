// export function firList(state = [], action) {
//     switch (action.type) {
//       case "FIR_LIST":
//         return action.data;
//       default:
//         return state;
//     }
//   }
  
  const initialState = { isLoading: false, data: []};


export function firList(state = initialState, action){
  switch (action.type) {
    case "LOADING_CONCERTS":
      return { ...state, isLoading: true };
    case "GET_CONCERTS":
      return { ...state,
               data: action.data.data,
               isLoading: false };
   
    default:
      return state;
  }
};



export function masterActList(state = initialState, action){
  switch (action.type) {
    case "LOADING_CONCERTS":
      return { ...state, isLoading: true };
    case "MASTER_ACT_DATA_FIR_LIST":
      return { ...state,
               data: action.data.masterActData,
               isLoading: false };
   
    default:
      return state;
  }
};



export function masterDataTraffickerList(state = initialState, action){
  switch (action.type) {
    case "LOADING_CONCERTS":
      return { ...state, isLoading: true };
    case "MASTER_TRAFFICKER_DATA_FIR_LIST":
      return { ...state,
               data: action.data.masterDataTrafficker,
               isLoading: false };
   
    default:
      return state;
  }
};

export function masterPoliceStationList(state = initialState, action){
  switch (action.type) {
    case "LOADING_CONCERTS":
      return { ...state, isLoading: true };
    case "MASTER_POLICESTATION_DATA_FIR_LIST":
      return { ...state,
               data: action.data.masterPoliceStationData,
               isLoading: false };
   
    default:
      return state;
  }
};
