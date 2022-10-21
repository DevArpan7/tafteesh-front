import React, { useState, useEffect } from "react";
import "react-tabs/style/react-tabs.css";

const SocialReportTab = (props) => {
  const {
    engagementCountData,
    survivorCountData,
    survivorListByStatus,
    actionList,
    allList,
    loading
  } = props;
  //console.log(actionList,allList, "engagementCountData,survivorCountData");

  const [openActionView, setOpenActionView] = useState(false);
  const [vcDetails, setVcDetails] = useState(false);
  const [pcDetails, setPcDetails] = useState(false);
  const [citDetails, setCitDetails] = useState(false);
  const [openSaPc, setOpenSaPc] = useState(false);
  const [percentValue, setPercentValue] = useState(0);
  useEffect(() => {
    let per = (actionList && actionList.totalAction && actionList.totalAction.close / actionList.totalAction.total) * 100 ||0
      // (actionList && actionList.totalAction && actionList.totalAction.close - actionList.totalAction.open);
      // let final = (actionList &&
      //   actionList.totalAction &&
      //   actionList.totalAction.total/per)*100 
    console.log( Math.round(per), "per");
   
    setPercentValue( Math.round(per));
  }, [actionList]);

  const selectAction = () => {
    setOpenActionView(!openActionView);
  };

  const onVcDetailsFunc = () => {
    setVcDetails(!vcDetails);
  };

  const onPcDetailsFunc = () => {
    setPcDetails(!pcDetails);
  };

  const onCitDetailsFunc = () => {
    setCitDetails(!citDetails);
  };

  const onSaPcFunc = () => {
    setOpenSaPc(!openSaPc);
  };

  return (
    <>
      <div className="row">
        <div className="col-lg-4">
          <div className="totla_profile_box white_box_shadow">
            <div className="totla_profile_box_top">
              <span>
                {allList && allList.survivor && allList.survivor.totalSurvivor}
              </span>
              <h3>Total Survivor </h3>
            </div>
            <div className="totla_profile_box_bottom">
              <ul>
                <li>
                  Total Active{" "}
                  <span>
                    {allList &&
                      allList.survivor &&
                      allList.survivor.totalActive}
                  </span>
                </li>
                <li>
                  Total Dropped Out{" "}
                  <span>
                    {allList &&
                      allList.survivor &&
                      allList.survivor.totalDropOUt}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="totla_profile_box white_box_shadow">
            <div className="totla_profile_box_top">
              <span>{allList && allList.VC && allList.VC.totalVc}</span>
              <h3>Victim Compensation </h3>
            </div>
            <div className="totla_profile_box_bottom">
              <ul>
                <li>
                  At source{" "}
                  <span>{allList && allList.VC && allList.VC.totalVcSa}</span>
                </li>
                <li>
                  At Destination{" "}
                  <span>{allList && allList.VC && allList.VC.totalVcDa}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="totla_profile_box white_box_shadow">
            <div className="totla_profile_box_top">
              <span>{allList && allList.PC && allList.PC.totalPc}</span>
              <h3>Procedural Correction </h3>
            </div>
            <div className="totla_profile_box_bottom">
              <ul>
                <li>
                  At source{" "}
                  <span>{allList && allList.PC && allList.PC.totalPcSa}</span>
                </li>
                <li>
                  At Destination{" "}
                  <span>{allList && allList.PC && allList.PC.totalPcDa}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <h3 className="mb-3 white_box_title">Survivors</h3>
      <div className="survivor_list_box survivors_table_wrap white_box_shadow_20 mb30">
        <div className="table-responsive">
          <table className="table table-borderless mb-0">
            <thead>
              <tr>
                <th>New Survivors</th>
                <th>Survivor Approved</th>
                {/* <th>Pending Approval</th> */}
                <th>Not Approved</th>
                <th>Dropped Out</th>
              </tr>
            </thead>
            <tbody>
            {loading && loading === true ? (
                      <div class="spinner-border bigSpinnerWidth text-info text-center"></div>
                    ) :
                    (
              <tr>
                <td>
                  {survivorCountData &&
                    survivorCountData.totalSurvivor &&
                    survivorCountData.totalSurvivor}
                </td>
                <td>
                  {survivorCountData &&
                    survivorCountData.totalApprovedSurvivor &&
                    survivorCountData.totalApprovedSurvivor}
                </td>

                <td>
                  {survivorCountData &&
                    survivorCountData.totalNotApprovedSurvivor &&
                    survivorCountData.totalNotApprovedSurvivor}
                </td>
                <td>
                  {survivorCountData &&
                    survivorCountData.totalDropOutSurvivor &&
                    survivorCountData.totalDropOutSurvivor}
                </td>
              </tr>
  )}
            </tbody>
          </table>
        </div>
      </div>

      <h3 className="mb-3 white_box_title">Engagement</h3>
      <div className="survivor_list_box survivors_table_wrap white_box_shadow_20 mb30">
        <div className="table-responsive">
          <table className="table table-borderless mb-4">
            <thead>
              <tr>
                <th>#Planned</th>
                <th>Conducted</th>
                <th>Next Month</th>
              </tr>
            </thead>
            <tbody>
            {loading && loading === true ? (
                      <div class="spinner-border bigSpinnerWidth text-info text-center"></div>
                    ) :
                    (
              <tr>
                <td>
                  {engagementCountData &&
                    engagementCountData.totalDairy &&
                    engagementCountData.totalDairy}
                  {/* <a className="tabledetails" href="/#">
                    View Details
                  </a> */}
                </td>
                <td>
                  {engagementCountData &&
                    engagementCountData.totalConducted &&
                    engagementCountData.totalConducted}
                </td>
                <td>
                  {engagementCountData &&
                    engagementCountData.nextMonth &&
                    engagementCountData.nextMonth}
                </td>
              </tr>
                    )}
            </tbody>
          </table>
        </div>

        <div className="table-responsive">
          <table className="table table-borderless mb-0">
            <thead>
              <tr>
                <th>Survivor</th>
                <th>#Planned</th>
                <th>#Conducted</th>
                <th>#Next Month</th>
              </tr>
            </thead>
            <tbody>
            {loading && loading === true ? (
                      <div class="spinner-border bigSpinnerWidth text-info text-center"></div>
                    ) :
                    (
              survivorListByStatus &&
                survivorListByStatus.length > 0 &&
                survivorListByStatus.map((item) => {
                  return (
                    <tr>
                      <td>{item && item.survivor && item.survivor.name}</td>
                      <td>{item && item.planned}</td>
                      <td>{item && item.conducted}</td>
                      <td>{item && item.next}</td>
                    </tr>
                  );
                })
                )}
            </tbody>
          </table>
        </div>
      </div>
      { 
      percentValue > 49 ? (
        <h3 className="mb-3 white_box_title actionBoxHeading">Action <b>{percentValue}%</b> <span>Close</span> &#128515;</h3>
      ) 
      : percentValue == 0 ?  (
        <h3 className="mb-3 white_box_title actionBoxHeading">Action</h3>
      ):
      (
        <h3 className="mb-3 white_box_title actionBoxHeading">Action <b>{percentValue}%</b> <span>Close</span> &#128542;</h3>
      )
      }
      <div className="survivor_list_box survivors_table_wrap white_box_shadow_20 mb30">
        <div className="table-responsive">
          <table className="table table-borderless mb-4">
            <thead>
              <tr>
                <th>Open</th>
                <th>Closed</th>
                <th>total</th>
              </tr>
            </thead>
            <tbody>
            {loading && loading === true ? (
                      <div class="spinner-border bigSpinnerWidth text-info text-center"></div>
                    ) :
                    (
              <tr onClick={() => selectAction()}>
                <td>
                  {actionList &&
                    actionList.totalAction &&
                    actionList.totalAction.open}{" "}
                  {/* <a
                    className="tabledetails"
                    // href="/#"
                  >
                    View Details
                  </a> */}
                </td>
                <td>
                  {actionList &&
                    actionList.totalAction &&
                    actionList.totalAction.close}
                </td>
                <td>
                  {actionList &&
                    actionList.totalAction &&
                    actionList.totalAction.total}
                </td>
              </tr>
                    )}
            </tbody>
          </table>
        </div>

        {/* {openActionView == true && <> */}
        <div className="table-responsive">
          <table className="table table-borderless mb-4">
            <thead>
              <tr>
                <th></th>
                <th>Open</th>
                <th>Closed</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
            {loading && loading === true ? (
                      <div class="spinner-border bigSpinnerWidth text-info text-center"></div>
                    ) :
                    (
              <tr onClick={() => onVcDetailsFunc()}>
                <td>
                  VC{" "}
                  {/* <a
                    className="tabledetails"
                    href="/#"
                  >
                    View Details
                  </a> */}
                </td>
                <td>{actionList && actionList.vc && actionList.vc.open}</td>
                <td>{actionList && actionList.vc && actionList.vc.close}</td>
                <td>{actionList && actionList.vc && actionList.vc.total}</td>
              </tr>
                    )}
                    
              <tr onClick={() => onPcDetailsFunc()}>
                <td>
                  PC{" "}
                  {/* <a
                    className="tabledetails"
                    href="/#"
                  >
                    View Details
                  </a> */}
                </td>
                <td>{actionList && actionList.pc && actionList.pc.open}</td>
                <td>{actionList && actionList.pc && actionList.pc.close}</td>
                <td>{actionList && actionList.pc && actionList.pc.total}</td>
              </tr>
              <tr onClick={() => onCitDetailsFunc()}>
                <td>
                  CIT{" "}
                  {/* <a
                    className="tabledetails"
                    href="/#"
                  >
                    View Details
                  </a> */}
                </td>
                <td>{actionList && actionList.cit && actionList.cit.open}</td>
                <td>{actionList && actionList.cit && actionList.cit.close}</td>
                <td>{actionList && actionList.cit && actionList.cit.total}</td>
              </tr>
              {/* <tr>
                            <td>Others <a className='tabledetails' 
                            // href="/#"
                            >View Details</a></td>
                            <td>5</td>
                            <td>5</td>
                            <td>10</td>
                        </tr> */}
            </tbody>
          </table>
        </div>
        {/* </>} */}

        {/* <div className="table-responsive">
          <table className="table table-borderless mb-0">
            <thead>
              <tr>
                <th>#Open Action (overall)</th>
                <th>#expected to Open (month)</th>
                <th>#expected to Close (month)</th>
                <th>#Remaining to Close during this month</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>20</td>
                <td>5</td>
                <td>5</td>
                <td>10</td>
              </tr>
            </tbody>
          </table>
        </div> */}
      </div>
      {/* { vcDetails == true &&
<> */}
      <div className="survivor_list_box survivors_table_wrap white_box_shadow_20 mb30">
        <h3 className="mb-3 white_box_title">Victim Compensation </h3>
        <div className="table-responsive">
          <table className="table table-borderless mb-4">
            <thead>
              <tr>
                <th># VC Application</th>
                <th>#Awarderd</th>
                <th>#Rejected</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {actionList &&
                    actionList.victimCompensation &&
                    actionList.victimCompensation.vc_application}
                </td>
                <td>
                  {actionList &&
                    actionList.victimCompensation &&
                    actionList.victimCompensation.awarded}
                </td>
                <td>
                  {actionList &&
                    actionList.victimCompensation &&
                    actionList.victimCompensation.rejected}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mb-3 white_box_title">VC (Status)</h3>
        <div className="table-responsive">
          <table className="table table-borderless mb-0">
            <thead>
              <tr>
                <th>Applied</th>
                <th>Awarded</th>
                <th>Concluded</th>
                <th>Escalated</th>
                <th>Rejected</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {actionList &&
                    actionList.vcStatus &&
                    actionList.vcStatus.applied}
                </td>
                <td>
                  {actionList &&
                    actionList.vcStatus &&
                    actionList.vcStatus.awarded}
                </td>
                <td>
                  {actionList &&
                    actionList.vcStatus &&
                    actionList.vcStatus.concluded}
                </td>
                <td>
                  {actionList &&
                    actionList.vcStatus &&
                    actionList.vcStatus.escalated}
                </td>
                <td>
                  {actionList &&
                    actionList.vcStatus &&
                    actionList.vcStatus.rejected}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/* </>} */}

      {/* {pcDetails == true &&
<>  */}
      <div className="survivor_list_box survivors_table_wrap white_box_shadow_20 mb30">
        <h3 className="mb-3 white_box_title">Procedural Correction</h3>
        <div className="table-responsive">
          <table className="table table-borderless mb-4">
            <thead>
              <tr>
                <th></th>
                <th>Overall PC record</th>
              </tr>
            </thead>
            <tbody>
              <tr onClick={() => onSaPcFunc()}>
                <td>
                  # PC At source{" "}
                  {/* <a className="tabledetails" 
                  href="/#"
                  >
                    View Details
                  </a> */}
                </td>
                <td>
                  {actionList &&
                    actionList.pcRecords &&
                    actionList.pcRecords.pcSource}
                </td>
              </tr>
              <tr>
                <td>
                  # PC At Destination{" "}
                  {/* <a className="tabledetails" 
                  href="/#"
                  >
                    View Details
                  </a> */}
                </td>
                <td>
                  {actionList &&
                    actionList.pcRecords &&
                    actionList.pcRecords.pcDestination}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="table-responsive">
          <table className="table table-borderless mb-0">
            <thead>
              <tr>
                <th></th>
                <th>Open</th>
                <th>Closed</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>SA</td>
                <td>
                  {actionList &&
                    actionList.pcRecords &&
                    actionList.pcRecords.pcSourceOpen}
                </td>
                <td>
                  {actionList &&
                    actionList.pcRecords &&
                    actionList.pcRecords.pcSourceClose}
                </td>
              </tr>
              <tr>
                <td>DA</td>
                <td>
                  {actionList &&
                    actionList.pcRecords &&
                    actionList.pcRecords.pcDestinationOpen}
                </td>
                <td>
                  {actionList &&
                    actionList.pcRecords &&
                    actionList.pcRecords.pcDestinationClose}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td>Total</td>
                <td>
                  {actionList &&
                    actionList.pcRecords &&
                    actionList.pcRecords.totalSaDaOpen}
                </td>
                <td>
                  {actionList &&
                    actionList.pcRecords &&
                    actionList.pcRecords.totalSaDaClose}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      {/* </>}
      {citDetails ==true &&
      <>  */}
      <div className="survivor_list_box survivors_table_wrap white_box_shadow_20 mb30">
        <h3 className="mb-3 white_box_title">Rehabilitations CIT (Review)</h3>
        <div className="table-responsive">
          <table className="table table-borderless">
            <thead>
              <tr>
                <th>Conducted</th>
                <th>Pending</th>
                <th>Total</th>
                <th>Targeted Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {actionList &&
                    actionList.citRehabilations &&
                    actionList.citRehabilations.concluded}
                </td>
                <td>
                  {actionList &&
                    actionList.citRehabilations &&
                    actionList.citRehabilations.due}
                </td>
                <td>
                  {actionList &&
                    actionList.citRehabilations &&
                    actionList.citRehabilations.totalCit}
                </td>
                <td>
                  {actionList &&
                    actionList.citRehabilations &&
                    actionList.citRehabilations.targatedDate}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/* </>} */}
    </>
  );
};

export default SocialReportTab;
