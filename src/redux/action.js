import axios from "../utils/axios";
const api = "https://tafteesh-staging-node.herokuapp.com/api/";

// const token = localStorage.getItem("accessToken");
// let axiosConfig = {
//   headers: {
//     "Content-Type": "application/json;charset=UTF-8",
//     Authorization: `Bearer ${token}`,
//   },
// };



const unAuthorizedData = (data) => {
  ////console.log(data, "state reducers");
  return {
    type: "UNAUTHORIZED_DATA",
    data: data,
  };
};


// ////// API CALL FOR GET STATE LIST /////

const stateList = (data) => {
  ////console.log(data, "state reducers");
  return {
    type: "STATE_LIST",
    data: data,
  };
};
export const getStateList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "state/list",config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error == false) {
          const { data } = response;

          dispatch(stateList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "stateList error");
      });
  };
};

/////// API CALL FOR DISTRICT LIST /////////

const districtList = (data) => {
  ////console.log(data, "district reducers");
  return {
    type: "DISTRICT_LIST",
    data: data,
  };
};
export const getDistrictList = (id) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "district/list-by-state/"+id,config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error == false) {
          const { data } = response;

          dispatch(districtList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "district error");
      });
  };
};

/////// API CALL FOR MASTER DISTRICT LIST /////////

const masterDistrictList = (data) => {
  ////console.log(data, "masterDistrictList reducers");
  return {
    type: "MASTER_DISTRICT_LIST",
    data: data,
  };
};
export const getMasterDistrictList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "district/list",config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error == false) {
          const { data } = response;

          dispatch(masterDistrictList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "masterDistrictList error");
      });
  };
};

/////// API CALL FOR BLOCK LIST /////

const blockList = (data) => {
  ////console.log(data, "block reducers");
  return {
    type: "BLOCK_LIST",
    data: data,
  };
};
export const getBlockList = (stateId,distId) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "block/list-by-state-district/"+stateId+"/"+distId,config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error == false) {
          const { data } = response;

          dispatch(blockList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "block error");
      });
  };
};



/////// API CALL FOR BLOCK LIST /////

const masterBlockList = (data) => {
  ////console.log(data, "masterBlockList reducers");
  return {
    type: "MASTER_BLOCK_LIST",
    data: data,
  };
};
export const getMasterBlockList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "block/list",config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error == false) {
          const { data } = response;

          dispatch(masterBlockList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "masterBlockList error");
      });
  };
};

/////// API CALL FOR SHG LIST /////

const shgList = (data) => {
  ////console.log(data, "SHG reducers");
  return {
    type: "SHG_LIST",
    data: data,
  };
};
export const getShgList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "shg/list",config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error == false) {
          const { data } = response;

          dispatch(shgList(data));
        }
      })
      .catch((error) => {
        ////console.log(error, "shg error");
      });
  };
};

export const deleteShg = (id) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .patch(api + "shg/delete/"+id,config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(getShgList());
        }
      })
      .catch((error) => {
        ////console.log(error, "partner error");
      });
  };
};
/////// API CALL FOR POLICE STATION LIST /////

const policeStationList = (data) => {
  ////console.log(data, "policeStation reducers");
  return {
    type: "POLICE_STATION_LIST",
    data: data,
  };
};
export const getPoliceStationList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "police-station/list",config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error == false) {
          const { data } = response;

          dispatch(policeStationList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "policeStation error");
      });
  };
};

////// API CALL FOR COLLECTIVES LIST /////

const collectivesList = (data) => {
  ////console.log(data, "collectives reducers");
  return {
    type: "COLLECTIVES_LIST",
    data: data,
  };
};
export const getCollectivesList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "collective/list",config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error == false) {
          const { data } = response;

          dispatch(collectivesList(data));
        }
      })
      .catch((error) => {
        ////console.log(error, "collectives error");
      });
  };
};

export const deleteCollective = (id) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .patch(api + "collective/delete/"+id,config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(getCollectivesList());
        }
      })
      .catch((error) => {
        ////console.log(error, "partner error");
      });
  };
};

////// API CALL FOR SURVIVOR LIST /////

const survivorList = (data) => {
  ////console.log(data, "survivor reducers");
  return {
    type: "SURVIVOR_LIST",
    data: data,
  };
};



// export const getSurvivorList = () => {
//   return (dispatch) => {
//     dispatch({ type: 'LOADING_CONCERTS' });
//     return axios.get(api + "survival-profile/list",axiosConfig)
//       .then(response => {
//         const { data } = response;
//         dispatch({ type: 'GET_CONCERTS', data })
//         dispatch({ type: 'SET_CONCERTS', data })
//         dispatch(survivorList(data))
//       })
//       .catch( err=> {
       
//       }
//       )
//     }
// }


export const getSurvivorList = (id) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "survival-profile/list-by-userId/"+id,config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(survivorList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "survivor error");
      });
  };
};




const allsurvivorList = (data) => {
  ////console.log(data, "survivor reducers");
  return {
    type: "ALL_SURVIVOR_LIST",
    data: data,
  };
};

export const getAllSurvivorList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "survival-profile/list",config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(allsurvivorList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "survivor error");
      });
  };
};


////////////survivor search API clling ////////////

// export const servivorSearchApi = (body) => {
//   return (dispatch) => {
//     dispatch({ type: 'LOADING_CONCERTS' });
//     return axios.post(api + "survival-profile/search",body)
//       .then(response => {
//         const { data } = response;
//         //console.log(data,"action data")
//         dispatch({ type: 'GET_CONCERTS', data })
//         dispatch({ type: 'SET_CONCERTS', data })
//         dispatch(survivorList(data.data))
//       })
//       .catch( err=> {
       
//       }
//       )
//     }
// }

export const servivorSearchApi = (body) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .post(api + "survival-profile/search",body,config)
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(survivorList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "survivor error");
      });
  };
};




////// API CALL FOR PARTICIPATION LIST /////

const participationList = (data) => {
  ////console.log(data, "participation reducers");
  return {
    type: "PARTICIPATION_LIST",
    data: data,
  };
};


export const getParticipationList = (id) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  ////console.log(id)
  return (dispatch) => {
    axios
      .get(api + "survival-participation/list/"+id,config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(participationList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "participation error");
      });
  };
};




////// API CALL FOR ROLE LIST /////

const roleList = (data) => {
  ////console.log(data, "role reducers");
  return {
    type: "ROLE_LIST",
    data: data,
  };
};


export const getRoleList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "role/list",config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(roleList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "role error");
      });
  };
};





////// API CALL FOR ORGANIZATION LIST /////

const organizationList = (data) => {
  ////console.log(data, "organization reducers");
  return {
    type: "ORGANIZATION_LIST",
    data: data,
  };
};


export const getOrganizationList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "organization/list",config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(organizationList(data));
        }
      })
      .catch((error) => {
        ////console.log(error, "organization error");
      });
  };
};




export const deleteOrganisation = (id) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .patch(api + "organization/delete/"+id,config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(getOrganizationList());
        }
      })
      .catch((error) => {
        ////console.log(error, "partner error");
      });
  };
};

//////////////////GET ALL USER LIST API CALL //////////


const usersList = (data) => {
  ////console.log(data, "user reducers");
  return {
    type: "USERS_LIST",
    data: data,
  };
};


export const getUsersList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "user/list",config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(usersList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "user error");
      });
  };
};

////////////user search API clling ////////////
export const usersSearchApi = (body) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .post(api + "user/search",body,config)
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(usersList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "survivor error");
      });
  };
};




//////////////////GET survivor DETAILS API CALL //////////


const survivorDetails = (data) => {
  ////console.log(data, "survivor details reducers");
  return {
    type: "SURVIVOR_DETAILS",
    data: data,
  };
};
const survivorActionDetails = (data) => {
  ////console.log(data, "survivor details reducers");
  return {
    type: "SURVIVOR_ACTION_DETAILS",
    data: data,
  };
};

export const getSurvivorDetails = (id) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "survival-profile/detail/"+id,config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(survivorDetails(data.data));
          dispatch(survivorActionDetails(data.profileDetails));

        }
      })
      .catch((error) => {
        ////console.log(error, "survivor details error");
      });
  };
};


//////////////////GET ALL TRAFFICKER LIST API CALL //////////


const traffickerList = (data) => {
  ////console.log(data, "trafficker reducers");
  return {
    type: "TRAFFICKER_LIST",
    data: data,
  };
};


export const getTraffickerList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "trafficker-Profile/list",config)
      .then((response) => {
        //console.log(response,"traaaa");
        if (response.data && response.data.error === false) {
          const { data } = response;
          // //console.log(data,"traaaa");
          dispatch(traffickerList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "trafficker error");
      });
  };
};

/////////// socila worker/survivor trafficker list ///////////////
const survivorTraffickerList = (data) => {
  ////console.log(data, "trafficker reducers");
  return {
    type: "SURVIVOR_TRAFFICKER_LIST",
    data: data,
  };
};

const mastertraffickerData = (data) => {
  ////console.log(data, "trafficker reducers");
  return {
    type: "MASTER_TRAFFICKER_LIST_WITH_SURVIVOR_TRAFFICKER_LSIT",
    data: data,
  };
};


export const getSurvivorTraffickerList = (id) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "survival-trafficker/list/"+ id,config)
      .then((response) => {
        //console.log(response,"survivorTraffickerList");
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(survivorTraffickerList(data.data));
          dispatch(mastertraffickerData(data.mastertraffickerData))
        }
      })
      .catch((error) => {
        ////console.log(error, "trafficker error");
      });
  };
};



//////////////////ADD FIR API CALL //////////


const firList = (data) => {
  return {
    // type: "FIR_LIST",
    data: data,
  };
};


const masterActList = (data) => {
  return {
    // type: "MASTER_ACT_DATA_FIR_LIST",
    data: data,
  };
};

const masterDataTraffickerList = (data) => {
  return {
    // type: "MASTER_TRAFFICKER_DATA_FIR_LIST",
    data: data,
  };
};


const masterPoliceStationList = (data) => {
  return {
    // type: "MASTER_POLICESTATION_DATA_FIR_LIST",
    data: data,
  };
};

export const getFirList = (id) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    dispatch({ type: 'LOADING_CONCERTS' });
    return axios.get(api + "survival-fir/list/"+id,config)
      .then(response => {
        if(response.data  && response.data.error == false){
       
        const { data } = response;
        dispatch({ type: 'GET_CONCERTS', data })
        dispatch({ type: 'MASTER_ACT_DATA_FIR_LIST', data })
        dispatch({ type: 'MASTER_TRAFFICKER_DATA_FIR_LIST', data })
        dispatch({ type: 'MASTER_POLICESTATION_DATA_FIR_LIST', data })

        dispatch({ type: 'SET_CONCERTS', data })
        dispatch(firList(data.data))
       
        }

      })
      .catch( err=> {
        // //console.log(err.code)
        // //console.log(err.message)
        // //console.log(err.stack)
      }
      )
    }
}
// export const getFirList = (id) => {
//   return (dispatch) => {
//     axios
//       .get(api + "survival-fir/list/"+id,axiosConfig)
//       .then((response) => {
//         ////console.log(response);
//         if (response.data && response.data.error === false) {
//           const { data } = response;

//           dispatch(firList(data.data));
//         }
//       })
//       .catch((error) => {
//         ////console.log(error, "fir error");
//       });
//   };
// };


//////////////////GET CHARGE SHEET LIST API CALL //////////


const chargeSheetList = (data) => {
  ////console.log(data, "charge sheet reducers");
  return {
    type: "CHARGE_SHEET_LIST",
    data: data,
  };
};



const masterActData = (data) => {
  ////console.log(data, "charge sheet reducers");
  return {
    type: "MASTER_ACT_LIST_WITH_CHARGE_SHEET_LIST",
    data: data,
  };
};

const SurvivorFirData = (data) => {
  ////console.log(data, "charge sheet reducers");
  return {
    type: "SURVIOVR_FIR_LIST_WITH_CHARGE_SHEET_LIST",
    data: data,
  };
};

const mastertraffickerDataforSurv=(data)=>{
  return {
    type: "MASTER_TRAFFICKER_LIST_FOR_SUR",
    data : data
  }
}

export const getChargeSheetList = (id) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  ////console.log(id,"id");
  return (dispatch) => {
    axios
      .get(api + "survival-chargesheet/list/"+id,config)
      .then((response) => {
        // //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(chargeSheetList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "charge sheet error");
      });
  };
};


export const getChargeSheetListByFirIdandInvestId = (survId,firId,investId) => {
  ////console.log(id,"id");
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "survival-chargesheet/list/"+survId+"/"+firId+"/"+investId,config)
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(chargeSheetList(data.data));
          dispatch(masterActData(data.masterActData))
          dispatch(mastertraffickerDataforSurv(data.masterTraffickerData))
          dispatch(SurvivorFirData(data.SurvivorFirData))
        }
      })
      .catch((error) => {
        ////console.log(error, "charge sheet error");
      });
  };
};


//////////////////GET CHARGE SHEET LIST API CALL //////////


const supplimentarychargeSheetList = (data) => {
  ////console.log(data, "charge sheet reducers");
  return {
    type: "SUPPLIMENTARY_CHARGE_SHEET_LIST",
    data: data,
  };
};


export const getSupplimentaryChargeSheetList = (id) => {
  //console.log(id,"id");
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "supplimentary-chargesheet/list/"+id,config)
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;
          dispatch(supplimentarychargeSheetList(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "charge sheet error");
      });
  };
};


//////////////////GET INVESTIGATION LIST API CALL //////////


const investigationList = (data) => {
  ////console.log(data, "investigationList reducers");
  return {
    type: "INVESTIGATION_LIST",
    data: data,
  };
};


export const getInvestigationList = (id) => {
  ////console.log(id,"id");
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "survival-investigation/list/"+id,config)
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(investigationList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "investigationList error");
      });
  };
};


export const getInvestigationListByFirId = (surid,firid) => {
  ////console.log(id,"id");
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "survival-investigation/list/"+surid+"/"+firid,config)
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(investigationList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "investigationList error");
      });
  };
};



//////////////////GET RESCUE LIST API CALL //////////


const masterStateData = (data) => {
  ////console.log(data, "rescueList reducers");
  return {
    type: "MASTER_STATE_DATA_WITH_RESCUE",
    data: data,
  };
};



const rescueList = (data) => {
  ////console.log(data, "rescueList reducers");
  return {
    type: "RESCUE_LIST",
    data: data,
  };
};




export const getRescueList = (id) => {
  //console.log(id,"id");
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "survival-rescue/list/"+id,config)
      .then((response) => {
        //console.log(response,'responseeeeeeeeeeeeeeeeeee');
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(rescueList(data.data));
          dispatch(masterStateData(data.masterStateData));
        }
      })
      .catch((error) => {
        ////console.log(error, "rescueList error");
      });
  };
};



//////////////////GET ALL LAWYERS LIST API CALL //////////


const lawyersList = (data) => {
  ////console.log(data, "lawyers reducers");
  return {
    type: "LAWYERS_LIST",
    data: data,
  };
};


export const getLawyersList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "lawyer/list",config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(lawyersList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "lawyers error");
      });
  };
};





//////////////////GET ALL LAWYERS LIST BY CAT ID API CALL //////////


const lawyersListByCatId = (data) => {
  ////console.log(data, "lawyers reducers");
  return {
    type: "LAWYERS_LIST_CATEGORY_ID",
    data: data,
  };
};


export const getLawyersListByCatId = (id) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "lawyer/list-by-category/"+id,config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(lawyersListByCatId(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "lawyers error");
      });
  };
};


//////////////////GET ALL LAWYERS CATEGORY LIST API CALL //////////

const lawyersCategoryList = (data) => {
  ////console.log(data, "lawyers category reducers");
  return {
    type: "LAWYERS_CATEGORY_LIST",
    data: data,
  };
};


export const getLawyersCategoryList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "lawyer-category/list",config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(lawyersCategoryList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "lawyers category error");
      });
  };
};


//////////////////GET ALL SURVIVOR LAWYERS LIST API CALL //////////


const survivorLawyersList = (data) => {
  ////console.log(data, "Shelter home reducers");
  return {
    type: "SURVIVOR_LAWYERS_LIST",
    data: data,
  };
};


const masterLawyerCategoryList = (data) => {
  ////console.log(data, "Shelter home reducers");
  return {
    type: "SURVIVOR_LAWYERS_CATEGRORY_LIST_WITH_LAWYERSLIST",
    data: data,
  };
};

const masterLawyerData = (data) => {
  ////console.log(data, "Shelter home reducers");
  return {
    type: "SURVIVOR_LAWYERS_LIST_WITH_LAWYERSLIST",
    data: data,
  };
};


const masterStateDataList = (data) => {
  ////console.log(data, "Shelter home reducers");
  return {
    type: "SURVIVOR_STATE_LIST_WITH_LAWYERSLIST",
    data: data,
  };
};


export const getSurvivorLawyersList = (id) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api +"survivor-lawyer/list/"+id,config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(survivorLawyersList(data.data));
          dispatch(masterLawyerCategoryList(data.masterLawyerCategoryData))
          dispatch(masterLawyerData(data.masterLawyerData))
          dispatch(masterStateDataList(data.masterStateData))


        }
      })
      .catch((error) => {
        ////console.log(error, "shelter home vc error");
      });
  };
};

//////////////////GET ALL COURT LIST API CALL //////////


const courtList = (data) => {
  ////console.log(data, "court reducers");
  return {
    type: "COURT_LIST",
    data: data,
  };
};


export const getCourtList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "court/list",config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(courtList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "court error");
      });
  };
};


//////////////////GET ALL VC LIST API CALL //////////


const survivalVcList = (data) => {
  ////console.log(data, "vc reducers");
  return {
    type: "VC_LIST",
    data: data,
  };
};

const masterAuthorityData = (data) => {
  ////console.log(data, "vc reducers");
  return {
    type: "VC_AUTHORITY_LIST_WITH_VC_LIST",
    data: data,
  };
};


const masterAuthorityTypeData = (data) => {
  ////console.log(data, "vc reducers");
  return {
    type: "VC_AUTHORITY_TYPE_LIST_WITH_VC_LIST",
    data: data,
  };
};


const masterVCStatusData = (data) => {
  ////console.log(data, "vc reducers");
  return {
    type: "VC_STATUS_LIST_WITH_VC_LIST",
    data: data,
  };
};


export const getSurvivalVcList = (id) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api +"survival-vc/list/"+id,config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(survivalVcList(data.data));
          dispatch(masterSurvivorLawyersData(data.SurvivorLawyerData))
          dispatch(masterSurvivrCourtData(data.masterCourtData))
          dispatch(masterAuthorityData(data.masterAuthorityData))
          dispatch(masterAuthorityTypeData(data.masterAuthorityTypeData))
          dispatch(masterVCStatusData(data.masterVCStatusData))

        }
      })
      .catch((error) => {
        ////console.log(error, "survival vc error");
      });
  };
};




//////////////////GET ALL SVC ESCALATION LIST API CALL //////////

const vcEscalationList = (data) => {
  ////console.log(data, "vc escalation reducers");
  return {
    type: "VC_ESCALATION_LIST",
    data: data,
  };
};


export const getVcEscalationList = (id) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api +"vc-escalation/list/"+id,config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(vcEscalationList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "vc escalation error");
      });
  };
};



//////////////////GET ALL SVC ESCALATION 2 LIST API CALL //////////
const vcEscalation2List = (data) => {
  ////console.log(data, "vc escalation reducers");
  return {
    type: "VC_ESCALATION_2_LIST",
    data: data,
  };
};


//////////////////GET ALL SVC ESCALATION 2 LIST API CALL //////////
const multipleVcEscalation2List = (data) => {
  ////console.log(data, "vc escalation reducers");
  return {
    type: "MULTIPLE_VC_ESCALATION_2_LIST",
    data: data,
  };
};


export const getVcEscalation2List = (vcId,escalId) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api +"vc-escalation/list-2/"+vcId+"/"+escalId,config)
      .then((response) => {
        //console.log(response,"vcEscalation2List action");
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(vcEscalation2List(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "vc escalation error");
      });
  };
};

//////////////////GET ALL SHELTER HOME LIST API CALL //////////


const shelterHomeList = (data) => {
  ////console.log(data, "Shelter home reducers");
  return {
    type: "SHELTER_HOME_LIST",
    data: data,
  };
};


export const getShelterHomeList = (id) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api +"shelter-home/list/"+id,config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(shelterHomeList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "shelter home vc error");
      });
  };
};


//////////////////GET ALL SURVIVAL LOAN LIST API CALL //////////

const survivalLoanList = (data) => {
  ////console.log(data, "Survival loan reducers");
  return {
    type: "SURVIVAL_LOAN_LIST",
    data: data,
  };
};


export const getSurvaivalLoanList = (id) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api +"survival-loan/list/"+id,config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(survivalLoanList(data));
        }
      })
      .catch((error) => {
        ////console.log(error, "survival loan error");
      });
  };
};


//////////////////GET ALL PC ESCALATION LIST API CALL //////////

const pcEscalationList = (data) => {
  ////console.log(data, "pc escalation reducers");
  return {
    type: "PC_ESCALATION_LIST",
    data: data,
  };
};


export const getPcEscalationList = (id) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api +"pc-escalation/list/"+id,config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(pcEscalationList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "escalation error");
      });
  };
};


//////////////////GET ALL PC LIST API CALL //////////

const survivorPcList = (data) => {
  ////console.log(data, "pc reducers");
  return {
    type: "SURVIVOR_PC_LIST",
    data: data,
  };
};


const masterSurvivorChargesheetData = (data) => {
  ////console.log(data, "pc reducers");
  return {
    type: "SURVIVOR_CHARGESHEET_LIST_WITH_PC_LIST",
    data: data,
  };
};

const masterSurvivorDocumentData = (data) => {
  ////console.log(data, "pc reducers");
  return {
    type: "SURVIVOR_DOCUMENT_LIST_WITH_PC_LIST",
    data: data,
  };
};

const masterSurvivorFirData = (data) => {
  ////console.log(data, "pc reducers");
  return {
    type: "SURVIVOR_FIR_LIST_WITH_PC_LIST",
    data: data,
  };
};

const masterSurvivorInvestigationData = (data) => {
  ////console.log(data, "pc reducers");
  return {
    type: "SURVIVOR_INVESTIGATION_LIST_WITH_PC_LIST",
    data: data,
  };
};


const masterSurvivorLawyersData = (data) => {
  ////console.log(data, "pc reducers");
  return {
    type: "SURVIVOR_LAWYERS_LIST_WITH_PC_LIST",
    data: data,
  };
};


const masterSurvivrCourtData = (data) => {
  ////console.log(data, "pc reducers");
  return {
    type: "SURVIVOR_COURT_LIST_WITH_PC_LIST",
    data: data,
  };
};



const allDocdetails = (data) => {
  ////console.log(data, "pc reducers");
  return {
    type: "SURVIVOR_ALLDOC_LIST_WITH_PC_LIST",
    data: data,
  };
};


const escalatedResonList = (data) => {
  ////console.log(data, "pc reducers");
  return {
    type: "SURVIVOR_ESCALATED_REASON_LIST_WITH_PC_LIST",
    data: data,
  };
};

const escalatedtTypeList = (data) => {
  ////console.log(data, "pc reducers");
  return {
    type: "SURVIVOR_ESCALATED_TYPE_LIST_WITH_PC_LIST",
    data: data,
  };
};

const masterPcCurrentStatusList = (data) => {
  ////console.log(data, "pc reducers");
  return {
    type: "SURVIVOR_PC_CURRENT_STATUS_LIST_WITH_PC_LIST",
    data: data,
  };
};


const masterPcWhyList = (data) => {
  ////console.log(data, "pc reducers");
  return {
    type: "SURVIVOR_PC_WHY_LIST_WITH_PC_LIST",
    data: data,
  };
};

const masterResOfProsecutionList = (data) => {
  ////console.log(data, "pc reducers");
  return {
    type: "SURVIVOR_PC_REASON_OF_PROSECUTION_LIST_WITH_PC_LIST",
    data: data,
  };
};
const masterDocumentTypeData = (data) => {
  ////console.log(data, "pc reducers");
  return {
    type: "SURVIVOR_PC_DOCUMENT_TYPE_LIST_WITH_PC_LIST",
    data: data,
  };
};
const masterPcResultData = (data) => {
  ////console.log(data, "pc reducers");
  return {
    type: "SURVIVOR_PC_RESULT_LIST_WITH_PC_LIST",
    data: data,
  };
};


export const getSurvivorPcList = (id) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api +"survival-pc/list/"+id,config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(survivorPcList(data.data));
          dispatch(masterSurvivorChargesheetData(data.SurvivorChargesheetData));
          dispatch(masterSurvivorDocumentData(data.SurvivorDocumentData));
          dispatch(masterSurvivorFirData(data.SurvivorFirData))
          dispatch(masterSurvivorInvestigationData(data.SurvivorInvestigationData))
          dispatch(masterSurvivorLawyersData(data.SurvivorLawyerData))
          dispatch(allDocdetails(data.docdetails))
          dispatch(masterSurvivrCourtData(data.masterCourtData))
          dispatch(escalatedResonList(data.masterEscalatedReasonData))
          dispatch(escalatedtTypeList(data.masterEscalatedTypeData))
          dispatch(masterPcCurrentStatusList(data.masterPcCurrentStatusData))
          dispatch(masterPcWhyList(data.masterPcWhyData))
          dispatch(masterResOfProsecutionList(data.masterResOfProsecutionData))
          dispatch(masterDocumentTypeData(data.masterDocumentTypeData))
          dispatch(masterPcResultData(data.masterPcResultData))
        }
      })
      .catch((error) => {
        ////console.log(error, "survivorPcList error");
      });
  };
};

//////////////////GET ALL SURVIVAL NEXT PLAN LIST API CALL //////////

const nextPlanList = (data) => {
  ////console.log(data, "nextPlanList reducers");
  return {
    type: "SURVIVAL_NEXT_PLAN_LIST",
    data: data,
  };
};


export const getNextPlanList = (id) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api +"survival-diary/list/"+id,config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(nextPlanList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "nextPlanList error");
      });
  };
};


/////////////////GET ALL SURVIVAL INCOME LIST API CALL //////////

const incomeList = (data) => {
  ////console.log(data, "incomeList reducers");
  return {
    type: "SURVIVAL_INCOME_LIST",
    data: data,
  };
};


export const getSurvivalIncomeList = (id) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api +"survival-income/list/"+id,config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(incomeList(data));
        }
      })
      .catch((error) => {
        ////console.log(error, "incomeList error");
      });
  };
};



/////////////////GET ALL SURVIVAL DOCUMENT LIST API CALL //////////

const survivalDocList = (data) => {
  ////console.log(data, "survivalDocList reducers");
  return {
    type: "SURVIVAL_DOCUMENT_LIST",
    // type: "GET_CONCERTS",
    data: data,
  };
};


// export const getSurvivalDocList = (id) => {
//   return (dispatch) => {
//     dispatch({ type: 'LOADING_CONCERTS' });
//     return axios.get(api + "survival-document/list/"+id,axiosConfig)
//       .then(response => {
//         const { data } = response;
//         dispatch({ type: 'GET_CONCERTS', data })
//         // dispatch({ type: 'SET_CONCERTS', data })
//         dispatch(survivalDocList(data))
//       })
//       .catch( err=> {
       
//       }
//       )
//     }
// }

export const getSurvivalDocList = (id) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api +"survival-document/list/"+id,config)
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;
          //console.log(data,"survivalDocList....");

          dispatch(survivalDocList(data));
        }
      })
      .catch((error) => {
        ////console.log(error, "survivalDocList error");
      });
  };
};





/////////////////GET ALL MASTER DOCUMENT LIST API CALL //////////

const masterDocList = (data) => {
  ////console.log(data, "survivalDocList reducers");
  return {
    type: "MASTER_DOCUMENT_LIST",
    data: data,
  };
};


export const getMasterDocList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api +"document/list",config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(masterDocList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "masterDocList error");
      });
  };
};




/////////////////GET ALL SURVIVAL SHELTER HOME QUESTION LIST API CALL //////////

const shelterQuestionList = (data) => {
  ////console.log(data, "shelterQuestionList reducers");
  return {
    type: "SHELTER_QUESTION_LIST",
    data: data,
  };
};


export const getShelterQuestionList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api +"shelter-home-question/list",config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(shelterQuestionList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "shelterQuestionList error");
      });
  };
};



/////////////////GET ALL SURVIVAL MORTGAGE LIST API CALL //////////

const mortgageList = (data) => {
  ////console.log(data, "mortgage reducers");
  return {
    type: "MORTGAGE_LIST",
    data: data,
  };
};


export const getMortgageList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api +"mortgage/list",config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(mortgageList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "mortgage error");
      });
  };
};


/////////////////GET ALL SURVIVAL DOCUMENT LIST API CALL //////////

const survivalGrantList = (data) => {
  ////console.log(data, "survivalGrantList reducers");
  return {
    type: "SURVIVAL_GRANT_LIST",
    data: data,
  };
};


export const getSurvivaLGrantList = (id) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api +"survival-grant/list/"+id,config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(survivalGrantList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "survivalGrantList error");
      });
  };
};




////// API CALL FOR PARTNERS LIST /////

const partnerList = (data) => {
  ////console.log(data, "partner reducers");
  return {
    type: "PARTNERS_LIST",
    data: data,
  };
};


export const getPartnerList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "partner/list",config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(partnerList(data));
        }
      })
      .catch((error) => {
        ////console.log(error, "partner error");
      });
  };
};



export const deletePartner = (id) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .patch(api + "partner/delete/"+id,config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(getPartnerList());
        }
      })
      .catch((error) => {
        ////console.log(error, "partner error");
      });
  };
};

/////// API CALL FOR AUTHORITY TYPE LIST /////

const authorityTypeList = (data) => {
  ////console.log(data, "authorityTypeList reducers");
  return {
    type: "AUTHORITY_TYPE_LIST",
    data: data,
  };
};
export const getAuthorityTypeList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "authority_type/list",config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error == false) {
          const { data } = response;

          dispatch(authorityTypeList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "authorityTypeList error");
      });
  };
};





/////// API CALL FOR authorityListByAuthType LIST /////

const authorityListByAuthType = (data) => {
  ////console.log(data, "authorityList reducers");
  return {
    type: "AUTHORITY_LIST_BY_AUTHORITY_TYPE",
    data: data,
  };
};



export const getAuthorityByAuthorityType = (id) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
   
    return axios.get(api + "authority/list-by-id/"+id,config)
      .then(response => {
        const { data } = response;
      
        dispatch(authorityListByAuthType(data.data))
      })
      .catch( err=> {
     
      }
      )
    }
}


/////// API CALL FOR AUTHORITY LIST /////

const authorityList = (data) => {
  ////console.log(data, "authorityList reducers");
  return {
    // type: "AUTHORITY_LIST",
    data: data,
  };
};



export const getAuthorityList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    dispatch({ type: 'LOADING_CONCERTS' });
    return axios.get(api + "authority/list",config)
      .then(response => {
        const { data } = response;
        dispatch({ type: 'GET_CONCERTS', data })
        dispatch({ type: 'SET_CONCERTS', data })
        dispatch(authorityList(data.data))
      })
      .catch( err=> {
        // //console.log(err.code)
        // //console.log(err.message)
        // //console.log(err.stack)
      }
      )
    }
}



// export const getAuthorityList = () => {
//   return (dispatch) => {
//     axios
//       .get(api + "authority/list",axiosConfig)
//       .then((response) => {
//         ////console.log(response);
//         if (response.data && response.data.error == false) {
//           const { data } = response;

//           dispatch(authorityList(data.data));
//         }
//       })
//       .catch((error) => {
//         ////console.log(error, "authorityList error");
//       });
//   };
// };

// ////// API CALL FOR GET ACT LIST /////

const actList = (data) => {
  ////console.log(data, "state reducers");
  return {
    type: "ACT_LIST",
    data: data,
  };
};
export const getActList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
return (dispatch) => {
    axios
      .get(api + "act/list",config)
      .then((response) => {
        // //console.log(response);
        if (response.data && response.data.error == false) {
          const { data } = response;
          dispatch(actList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "actList error");
      });
  };
};
const sectionList = (data) => {
  ////console.log(data, "state reducers");
  return {
    type: "SECTION_LIST",
    data: data,
  };
};
export const getSectionList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
return (dispatch) => {
    axios
      .get(api + "section/list",config)
      .then((response) => {
        //console.log(response,'sectionnnnnnnnnnnnnnnnnnnn');
        if (response.data && response.data.error == false) {
          const { data } = response;
          dispatch(sectionList(data.data));
        }
      })
      .catch((error) => {
        //console.log(error, "sectionList error");
      });
  };
};

const sectionByActId = (data) => {
  ////console.log(data, "state reducers");
  return {
    type: "SECTION_LIST_BY_ACT",
    data: data,
  };
};
export const getSectionByActId = (id) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
      axios
        .get(api + "section/list-by-act-name/"+id,config)
        .then((response) => {
          //console.log(response,'sectionnnnnnnnnnnnnnnnnnnn');
          if (response.data && response.data.error == false) {
            const { data } = response;
            dispatch(sectionByActId(data.data));
          }
        })
        .catch((error) => {
          //console.log(error, "sectionByActId error");
        });
    };
  };


/////// API CALL FOR Pc why LIST /////

const pcWhyList = (data) => {
  ////console.log(data, "pcWhyList reducers");
  return {
    type: "PC_WHY_LIST",
    data: data,
  };
};
export const getPcWhyList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "pcwhy/list",config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error == false) {
          const { data } = response;

          dispatch(pcWhyList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "pcWhyList error");
      });
  };
};


/////// API CALL FOR Pc current status LIST /////

const pcCurrentStatusList = (data) => {
  ////console.log(data, "pcCurrentStatusList reducers");
  return {
    type: "PC_CURRENT_STATUS_LIST",
    data: data,
  };
};
export const getPcCurrentStatusList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "pc-current-status/list",config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error == false) {
          const { data } = response;

          dispatch(pcCurrentStatusList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "pcCurrentStatusList error");
      });
  };
};


/////// API CALL FOR Pc PC Result of Prosecution List LIST /////

const pcResultofProsecutionList = (data) => {
  ////console.log(data, "pcResultofProsecutionList reducers");
  return {
    type: "PC_RSULT_OF_PROSECUTION_LIST",
    data: data,
  };
};
export const getPcResultofProsecutionList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "res-of-prosecution/list",config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error == false) {
          const { data } = response;

          dispatch(pcResultofProsecutionList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "pcResultofProsecutionList error");
      });
  };
};


/////// API CALL FOR Pc PC Document Type List LIST /////

const pcDocumentTypeList = (data) => {
  ////console.log(data, "Document Type reducers");
  return {
    type: "PC_DOCUMENT_TYPE_LIST",
    data: data,
  };
};
export const getPcDocumentTypeList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "document-type/list",config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error == false) {
          const { data } = response;

          dispatch(pcDocumentTypeList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "Document Type error");
      });
  };
};


/////// API CALL FOR Pc PC EscalatedType List LIST /////

const pcEscalatedTypeList = (data) => {
  ////console.log(data, "EscalatedType reducers");
  return {
    type: "PC_ESCALATION_TYPE_LIST",
    data: data,
  };
};
export const getPcEscalatedTypeList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "escalated-type/list",config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error == false) {
          const { data } = response;

          dispatch(pcEscalatedTypeList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "EscalatedType error");
      });
  };
};


/////// API CALL FOR Pc  Escalation Reason LIST /////

const pcEscalationReasonList = (data) => {
  ////console.log(data, "Escalation Reason reducers");
  return {
    type: "PC_ESCALATION_REASON_LIST",
    data: data,
  };
};
export const getPcEscalationReasonList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "escalated-reason/list",config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error == false) {
          const { data } = response;

          dispatch(pcEscalationReasonList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "Escalation Reason error");
      });
  };
};


/////// API CALL FOR CITDimension LIST /////

const citDimensionList = (data) => {
  ////console.log(data, "CITDimension reducers");
  return {
    type: "CIT_DIMENSION_LIST",
    data: data,
  };
};
export const getCitDimensionList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "cit-dimension/list",config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error == false) {
          const { data } = response;

          dispatch(citDimensionList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "CITDimension error");
      });
  };
};



////////////getCitDimensionList by version id /////

export const getCitDimensionListByVersionId = (id) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "cit-dimension/list-by-version/"+id,config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error == false) {
          // debugger;
          const { data } = response;

          dispatch(citDimensionList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "CITDimension error");
      });
  };
};


///////// getCitDimensionListAll with version data //////
// export const getCitDimensionListAll = () => {
//   return (dispatch) => {
//     axios
//       .get(api + "cit-dimension/list-all",axiosConfig)
//       .then((response) => {
//         ////console.log(response);
//         if (response.data && response.data.error == false) {
//           const { data } = response;

//           dispatch(citDimensionList(data.data));
//         }
//       })
//       .catch((error) => {
//         ////console.log(error, "CITDimension error");
//       });
//   };
// };

/////////// cit dimension list with CIT version /////
export const getCitDimensionAllList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "cit-dimension/list-all",config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error == false) {
          const { data } = response;

          dispatch(citDimensionList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "CITDimension error");
      });
  };
};

// export const deleteCitDimension = (id) => {
//   return (dispatch) => {
//     axios
//       .patch(api + "cit-dimension/delete/"+id)
//       .then((response) => {
//         ////console.log(response);
//         if (response.data && response.data.error === false) {
//           const { data } = response;

//           // dispatch(getCitDimensionList());
//           dispatch(getCitDimensionAllList())
//         }
//       })
//       .catch((error) => {
//         ////console.log(error, "partner error");
//       });
//   };
// };

/////// API CALL FOR CIT LIST /////

const citList = (data) => {
  ////console.log(data, "CITreducers");
  return {
    type: "CIT_LIST",
    data: data,
  };
};
export const getCitList = (id) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "cit/list/"+id,config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(citList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "CIT error");
      });
  };
};


/////// API CALL FOR CITDimensionQuestion LIST /////

const citDimensionQuestionList = (data) => {
  ////console.log(data, "CITDimensionQuestion reducers");
  return {
    type: "CIT_DIMENSION_QUESTION_LIST",
    data: data,
  };
};
export const getCitDimensionQuestionList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "cit-dimension-question/list",config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(citDimensionQuestionList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "CITDimensionQuestion error");
      });
  };
};


const citDimensionQuestionListByDimension = (data) => {
  ////console.log(data, "CITDimensionQuestion reducers");
  return {
    type: "CIT_DIMENSION_QUESTION_LIST_BY_DIMENSION",
    data: data,
  };
};
// export const getCitDimensionQuestionsById = (id) => {
//   return (dispatch) => {
//     axios
//       .get(api + "cit-dimension-question/list-by-dimension/"+id,axiosConfig)
//       .then((response) => {
//         ////console.log(response);
//         if (response.data && response.data.error === false) {
//           const { data } = response;

//           dispatch(citDimensionQuestionListByDimension(data.data));
//         }
//       })
//       .catch((error) => {
//         ////console.log(error, "CITDimensionQuestion error");
//       });
//   };
// };
export const getCitDimensionQuestionsById = (id) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return new Promise((resolve, reject)=>{
    axios
      .get(api + "cit-dimension-question/list-by-dimension/"+id,config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

         resolve(data.data);
        }
      })
      .catch((error) => {
        reject(error);
        ////console.log(error, "CITDimensionQuestion error");
      });
  })
};

export const getCITStarDetails = (id) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return new Promise((resolve, reject)=>{
    axios
      .get(api + "cit/star/"+id,config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error !== true) {
          const { data } = response;
          let arr =[] ;
          if(data.starData){
            arr = data.starData.sort((a, b) => {return b.cits.length - a.cits.length})

          }
          // console.log(arr,"arr")
        //  resolve(data.starData);
          resolve(arr)
        }
      })
      .catch((error) => {
        reject(error);
        ////console.log(error, "CITDimensionQuestion error");
      });
  })
};
export const getCitListOfActionsByCitId = (id) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return new Promise((resolve, reject)=>{
    axios
      .get(api + "cit-goal/list-by-cit/"+id,config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

         resolve(data.data);
        }
      })
      .catch((error) => {
        reject(error);
        ////console.log(error, "CITDimensionQuestion error");
      });
  })
};
export const getCitDDetailsListById= (id) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return new Promise((resolve, reject)=>{
    axios
      .get(api + "cit_detail/list-by-cit/"+id,config)
      .then((response) => {
        if (response.data && response.data.error === false) {
          const { data } = response;

         resolve(data.data);
        }
      })
      .catch((error) => {
        reject(error);
        ////console.log(error, "CITDimensionQuestion error");
      });
  })
};
export const createCITDetailApi = (data) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return new Promise((resolve, reject)=>{
    axios
      .post(api + "cit_detail/create",data,config)
      .then((response) => {
        if (response.data && response.data.error === false) {
          const { data } = response;

          resolve(data.data);
        }
        else{
         reject(response.data.message);
        }
      })
      .catch((error) => {
       reject(error);
      });
  })
};
export const createCITListOfAction = (data) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return new Promise((resolve, reject)=>{
    axios
      .post(api + "cit-goal/create",data,config)
      .then((response) => {
        if (response.data && response.data.error === false) {
          const { data } = response;

          resolve(data.data);
        }
      })
      .catch((error) => {
       reject(error);
      });
  })
};



export const deleteCitDimensionQues = (id) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .patch(api + "cit-dimension-question/delete/"+id,config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(getCitDimensionQuestionList());
        }
      })
      .catch((error) => {
        ////console.log(error, "partner error");
      });
  };
};


const changeLogList = (data) => {
  ////console.log(data, "CITreducers");
  return {
    type: "CHANGE_LOG_LIST",
    data: data,
  };
};

export const getChangeLog = (type,id) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  //console.log(type,id,"type,id");
  return (dispatch) => {
    axios
    .get(api + "change-log/list/"+type+"/"+id,config)
      .then((response) => {
        if (response.data && response.data.error === false) {
          const { data } = response;
          //console.log(data,"data")
          dispatch(changeLogList(data.data));
        }
        else{
          dispatch(changeLogList({}));
        }
      })
      .catch((error) => {
      });
  };
};

export const getModulesChangeLog = (type,userId,survivorId) => {
  //console.log(type,userId,"type,id");
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
    .get(api + "change-log/list2/"+type+"/"+userId+"/"+survivorId,config)
      .then((response) => {
        if (response.data && response.data.error === false) {
          const { data } = response;
          //console.log(data,"data")
          dispatch(changeLogList(data.data));
        }
        else{
          dispatch(changeLogList({}));
        }
      })
      .catch((error) => {
      });
  };
};


const allCitList = (data) => {
  ////console.log(data, "CITreducers");
  return {
    type: "ALL_CIT_LIST",
    data: data,
  };
};

export const getAllCitList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
    .get(api + "cit/all-list",config)
      .then((response) => {
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(allCitList(data.data));
        }
      })
      .catch((error) => {
      });
  };
};



const adminDashboardData = (data) => {
  ////console.log(data, "CITreducers");
  return {
    type: "DASHBOARD_DATA",
    data: data,
  };
};

const monthDashboardData = (data) => {
  ////console.log(data, "CITreducers");
  return {
    type: "MONTH_DASHBOARD_DATA",
    data: data,
  };
};

const stateDashboardData = (data) => {
  ////console.log(data, "CITreducers");
  return {
    type: "STATE_DASHBOARD_DATA",
    data: data,
  };
};

const ageDashboardData = (data) => {
  ////console.log(data, "CITreducers");
  return {
    type: "AGE_DASHBOARD_DATA",
    data: data,
  };
};


export const getAdminDashboardData = (location) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  //console.log(config,"axiosConfig")
  
  return (dispatch) => {
    axios
    .get(api + "admin-dashboard/data",config)
      .then((response) => {
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(adminDashboardData(data.data));
          dispatch(monthDashboardData(data.data.monthWiseSurvivor))
          dispatch(ageDashboardData(data.data.ageWiseSurvivor))
          dispatch(stateDashboardData(data.data.stateWiseSurvivor))

        }
      })
      .catch((error) => {
        //console.log(error,"error")
        if(error.response && error.response.status === 401){
          dispatch(unAuthorizedData(error.response && error.response.data))
          location.push("/adminlogin")
        }
      });
  };
};



const notificationList = (data) => {
  ////console.log(data, "CITreducers");
  return {
    type: "NOTIFICATION_LIST",
    data: data,
  };
};

export const getNotificationList = (id) => {
  //console.log(id,"id");
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
    .get(api + "notification/list/"+id,config)
      .then((response) => {
        if (response.data && response.data.error === false) {
          const { data } = response;
          //console.log(data,"data")
          dispatch(notificationList(data));
        }
        else{
          dispatch(notificationList({}));
        }
      })
      .catch((error) => {
      });
  };
};


const citVersionList = (data) => {
  return {
    type: "CIT_VERSION_LIST",
    data: data,
  };
};

export const getCITVersionList = (id) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "cit-version/list",config)
      .then((response) => {
        //console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(citVersionList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "partner error");
      });
  };
};



const pendingItemList = (data) => {
  ////console.log(data, "state reducers");
  return {
    type: "PENDING_ITEM_LIST",
    data: data,
  };
};
export const getPendingItemList = (id) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
return (dispatch) => {
    axios
      .get(api + "pending-action/list-by-userId/"+id,config)
      .then((response) => {
        // //console.log(response);
        if (response.data && response.data.error == false) {
          const { data } = response;
          dispatch(pendingItemList(data));
        }
      })
      .catch((error) => {
        ////console.log(error, "actList error");
      });
  };
};


const survivorArchiveItem = (data) => {
  ////console.log(data, "state reducers");
  return {
    type: "SURVIVOR_ARCHIVE_ITEM_LIST",
    data: data,
  };
};
export const getArchiveItem = (module,userId,survivorId) => {
  let url;
  if(survivorId === ' '){
    url=api + "deleted-data/list?module="+module+"&user="+userId
  }
  else{
    url=api + "deleted-data/list?module="+module+"&survivor="+survivorId
  }
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
return (dispatch) => {
    axios
      .get(url,config)
      .then((response) => {
        //console.log(response,'2428');
        if (response.data && response.data.error == false) {
          const { data } = response;
          dispatch(survivorArchiveItem(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "actList error");
      });
  };
};


const roleAccessLit = (data) => {
  ////console.log(data, "state reducers");
  return {
    type: "ROLE_ACCESS_LIST",
    data: data,
  };
};
export const getAccessLitByRoleId = (roleId) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
return (dispatch) => {
    axios
      .get(api + "role-module/list/"+roleId,config)
      .then((response) => {
        // //console.log(response);
        if (response.data && response.data.error == false) {
          const { data } = response;
          dispatch(roleAccessLit(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "actList error");
      });
  };
};


export const getAccessLitByUserId = (userId) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
      axios
        .get(api + "role-module-user/list/"+userId,config)
        .then((response) => {
          if (response.data && response.data.error == false) {
            const { data } = response;
            dispatch(roleAccessLit(data.data));
          }
        })
        .catch((error) => {
        });
    };
  };


const moduleList = (data) => {
  ////console.log(data, "state reducers");
  return {
    type: "MODULE_LIST",
    data: data,
  };
};
export const getmoduleList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
return (dispatch) => {
    axios
      .get(api + "module/list",config)
      .then((response) => {
        // //console.log(response);
        if (response.data && response.data.error == false) {
          const { data } = response;
          dispatch(moduleList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "actList error");
      });
  };
};


/////////// city list ////////////
const cityList = (data) => {
  ////console.log(data, "trafficker reducers");
  return {
    type: "CITY_LIST",
    data: data,
  };
};


export const getCityList = (id) => {
  console.log(id,"id")
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "city/list/"+id,config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(cityList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "trafficker error");
      });
  };
};


/////////// All city list ////////////
const allCityList = (data) => {
  return {
    type: "ALL_CITY_LIST",
    data: data,
  };
};


export const getAllCityList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "city/list",config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(allCityList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "trafficker error");
      });
  };
};



/////////// diary status list ////////////
const diaryStatusList = (data) => {
  ////console.log(data, "trafficker reducers");
  return {
    type: "DIARY_STATUS_LIST",
    data: data,
  };
};


export const getDiaryStatusList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "diary-status/list",config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(diaryStatusList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "trafficker error");
      });
  };
};



/////////// grant status list ////////////
const grantStatusList = (data) => {
  return {
    type: "GRANT_STATUS_LIST",
    data: data,
  };
};


export const getGrantStatusList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "grant-status/list",config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(grantStatusList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "trafficker error");
      });
  };
};



/////////// Investigation status list ////////////
const investigationStatusList = (data) => {
  return {
    type: "INVESTIGATION_STATUS_LIST",
    data: data,
  };
};


export const getInvestStatusList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "investigation-status/list",config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(investigationStatusList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "trafficker error");
      });
  };
};


/////////// VC status list ////////////
const vcStatusList = (data) => {
  return {
    type: "VC_STATUS_LIST",
    data: data,
  };
};


export const getVcStatusList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "vc-status/list",config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(vcStatusList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "trafficker error");
      });
  };
};




/////////// CIT status list ////////////
const citStatusList = (data) => {
  return {
    type: "CIT_STATUS_LIST",
    data: data,
  };
};


export const getCitStatusList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "cit-status/list",config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(citStatusList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "trafficker error");
      });
  };
};


/////////// Survivor status list ////////////
const survivorStatusList = (data) => {
  return {
    type: "SURVIVOR_STATUS_LIST",
    data: data,
  };
};


export const getSurvivorStatusList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "survivor-status/list",config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(survivorStatusList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "trafficker error");
      });
  };
};



/////////// Survivor status list ////////////
const traffickerActionData = (data) => {
  return {
    type: "TRAFFICKER_ACTION_LIST",
    data: data,
  };
};


export const getTraffickerActionData = (id) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "survival-trafficker/action-list/"+id,config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(traffickerActionData(data));
        }
      })
      .catch((error) => {
        ////console.log(error, "trafficker error");
      });
  };
};



/////////// Investigation result list ////////////
const investResultList = (data) => {
  return {
    type: "INVESTIGATION_RESULT_LIST",
    data: data,
  };
};


export const getInvestResultList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "investigation-result/list",config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(investResultList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "trafficker error");
      });
  };
};

/////////// Vc result list ////////////
const vcResultList = (data) => {
  return {
    type: "VC_RESULT_LIST",
    data: data,
  };
};


export const getVcResultList = (id) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "vc-result/list",config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(vcResultList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "trafficker error");
      });
  };
};

/////////// VC escalation result list ////////////
const vcEscResultList = (data) => {
  return {
    type: "VC_ESCALATION_RESULT_LIST",
    data: data,
  };
};


export const getVcEscResultList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "vc-escalation-result/list",config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(vcEscResultList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "trafficker error");
      });
  };
};


/////////// PC result list ////////////
const pcResultList = (data) => {
  return {
    type: "PC_RESULT_LIST",
    data: data,
  };
};


export const getPcResultList = (id) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "pc-result/list",config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(pcResultList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "trafficker error");
      });
  };
};

/////////// PC Escalation result list ////////////
const pcEscResultList = (data) => {
  return {
    type: "PC_ESCALATION_RESULT_LIST",
    data: data,
  };
};


export const getPcEscResultList = (id) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "pc-escalation-result/list",config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(pcEscResultList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "trafficker error");
      });
  };
};




/////////// agency Type  list ////////////
const agencyTypeList = (data) => {
  return {
    type: "AGENCY_TYPE_LIST",
    data: data,
  };
};

export const getAgencyTypeList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "type-of-agency/list",config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(agencyTypeList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "trafficker error");
      });
  };
};

/////////// agency   list ////////////
const agencyList = (data) => {
  return {
    type: "AGENCY_LIST",
    data: data,
  };
};

export const getAgencyList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "agency/list",config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(agencyList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "trafficker error");
      });
  };
};


/////////// agency   list ////////////
const agencyListbyType = (data) => {
  return {
    type: "AGENCY_LIST_BY_TYPE",
    data: data,
  };
};

export const getAencyListbyType = (id) => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "agency/list/"+id,config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(agencyListbyType(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "trafficker error");
      });
  };
};



/////////// loan where   list ////////////
const whereList = (data) => {
  return {
    type: "WHERE_LIST",
    data: data,
  };
};

export const getWhereListe = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "where/list",config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(whereList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "trafficker error");
      });
  };
};


/////////// income type   list ////////////
const incomeTypeList = (data) => {
  return {
    type: "INCOME_TYPE_LIST",
    data: data,
  };
};

export const getIncomeTypeList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "income-type/list",config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(incomeTypeList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "trafficker error");
      });
  };
};




/////////// Mode of earning   list ////////////
const modeOfearningList = (data) => {
  return {
    type: "MODE_OF_EARNING_LIST",
    data: data,
  };
};

export const getModeOfearningList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "mode-of-earning/list",config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(modeOfearningList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "trafficker error");
      });
  };
};



///////////Grant Purpose  list ////////////
const grantPurposeList = (data) => {
  return {
    type: "GRANT_PURPOSE_LIST",
    data: data,
  };
};

export const getGrantPurposeList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "purpose-of-grant/list",config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(grantPurposeList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "trafficker error");
      });
  };
};



/////////// Loan Purpose  list ////////////
const loanPurposeList = (data) => {
  return {
    type: "PURPOSE_LIST",
    data: data,
  };
};

export const getLoanPurposeList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api + "loan-purpose/list",config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(loanPurposeList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "trafficker error");
      });
  };
};


/////////////////GET ALL SURVIVAL GRANT LIST API CALL //////////

const grantList = (data) => {
  ////console.log(data, "grantList reducers");
  return {
    type: "GRANT_LIST",
    data: data,
  };
};


export const getGrantList = () => {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  return (dispatch) => {
    axios
      .get(api +"grant/list",config)
      .then((response) => {
        ////console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;

          dispatch(grantList(data.data));
        }
      })
      .catch((error) => {
        ////console.log(error, "grantList error");
      });
  };
};