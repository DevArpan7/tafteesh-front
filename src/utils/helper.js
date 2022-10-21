import { useHistory } from "react-router-dom";

export function findAncestor(el, cls) {
  while ((el = el.parentElement) && !el.classList.contains(cls));
  return el;
}

export const goToAdd = (e, history) => {
  if (
    findAncestor(e.target, "anotherTarget") === undefined ||
    findAncestor(e.target, "anotherTarget") === null
  ) {
    history.push(`/add-survivor`);
    // history.go();
  }
};


export const goToEditSurvivor = (e, id, history) => {
  //console.log(e, e.target);

  if (
    findAncestor(e.target, "anotherTarget") === undefined ||
    findAncestor(e.target, "anotherTarget") === null
  ) {
    // history.push(`/add-survivor/${data}`);
    history.push(`/edit-survivor?survivorId=${id}`)
    // history.go();
  }
};

export const gotoSurvivorDetails = (e, id, history) => {
  if (
    findAncestor(e.target, "anotherTarget") === undefined ||
    findAncestor(e.target, "anotherTarget") === null
  ) {
    history.push(`/profile-details?survivorId=${id}`);
    // history.go();
  }
};


export const gotoSurvivorArchive = (e, type, survivor, history) => {
  //console.log(survivor,'surrrrrrrr')
  if (
    findAncestor(e.target, "anotherTarget") === undefined ||
    findAncestor(e.target, "anotherTarget") === null
  ) {
    if (survivor == ' ') {
      history.push(`/archive-list?module=${type}`);
    }
    // history.go();
    else {
      history.push(`/archive-list/${type}?module=${type}&survivor=${survivor}`);
    }
  }
}
export const goToSurvivorFir = (e, id, history) => {
  if (
    findAncestor(e.target, "anotherTarget") === undefined ||
    findAncestor(e.target, "anotherTarget") === null
  ) {
    history.push(`/survivor-fir?survivorId=${id}`);
    // history.go();
  }
};

export const goToSurvivorInvest = (e, data, history) => {
  if (
    findAncestor(e.target, "anotherTarget") === undefined ||
    findAncestor(e.target, "anotherTarget") === null
  ) {
    history.push(`/survivor-investigation?survivorId=${data.survivorId}&firId=${data.firId}`);
    // history.go();
  }
};



export const goToSurvivorInvestBysurvivor = (e, data, history) => {
  if (
    findAncestor(e.target, "anotherTarget") === undefined ||
    findAncestor(e.target, "anotherTarget") === null
  ) {
    history.push(`/survivor-investigation?survivorId=${data}`);
    // history.go();
  }
};


export const goToSurvivorChargeSheet = (e, data, history) => {
  if (
    findAncestor(e.target, "anotherTarget") === undefined ||
    findAncestor(e.target, "anotherTarget") === null
  ) {
    history.push(`/survivor-chargesheet?survivorId=${data.survivorId}&firId=${data.firId}&investigationId=${data.investigationId}`);
    // history.go();
  }
};


export const goToTraffickerAction = (e, id,flag, history) => {
  //console.log(e, id,flag, history,"history");

  if (
    findAncestor(e.target, "anotherTarget") === undefined ||
    findAncestor(e.target, "anotherTarget") === null
  ) {
    history.push(`/trafficker?id=${id}&action=${flag}`)
  }
};

export const gotoSurvivorChargeBySurv = (e, data, history) => {
  if (
    findAncestor(e.target, "anotherTarget") === undefined ||
    findAncestor(e.target, "anotherTarget") === null
  ) {
    history.push(`/survivor-chargesheet?survivorId=${data}`);
    // history.go();
  }
};

export const goToUserAdd = (e, id, history) => {
  //console.log(e, e.target);

  if (
    findAncestor(e.target, "anotherTarget") === undefined ||
    findAncestor(e.target, "anotherTarget") === null
  ) {
    // history.push(`/add-survivor/${data}`);
    history.push(`/add-user?id=${id}`)
    // history.go();
  }
};

/**
 * User detail function
 */
export const goToUserDetail = (e, id, history) => {
  //console.log(e, e.target);

  if (
    findAncestor(e.target, "anotherTarget") === undefined ||
    findAncestor(e.target, "anotherTarget") === null
  ) {
    // history.push(`/add-survivor/${data}`);
    history.push(`/user-details?id=${id}`)
    // history.go();
  }
};

export const goToTraffickerView = (e, id, history) => {
  //console.log(e, e.target);

  if (
    findAncestor(e.target, "anotherTarget") === undefined ||
    findAncestor(e.target, "anotherTarget") === null
  ) {
    // history.push(`/add-survivor/${data}`);
    history.push(`/traffickers-details?id=${id}`)
    // history.go();
  }
};

export const goToTraffickerPage = (e, id, history) => {
  //console.log(e, e.target);

  if (
    findAncestor(e.target, "anotherTarget") === undefined ||
    findAncestor(e.target, "anotherTarget") === null
  ) {
    history.push(`/survivor-traffickers?survivorId=${id}`)
  }
};

