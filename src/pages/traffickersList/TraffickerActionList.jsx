import React, { useEffect, useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { KamoTopbar } from "../../components";
import { MDBTooltip, MDBBtn } from "mdb-react-ui-kit";
import { Modal, Button } from "react-bootstrap";
import { Link, useHistory, useLocation } from "react-router-dom";
// import { findAncestor, goToTraffickerAction } from "../../utils/helper";
import queryString from "query-string";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";

import { getTraffickerActionData } from "../../redux/action";
const TraffickerActionList = (props) => {
  const traffickerActionData = useSelector(
    (state) => state.traffickerActionData
  );
  const search = useLocation().search;

  const traffickerId = new URLSearchParams(search).get("id");
  const module = new URLSearchParams(search).get("action");
  const [loader, setLoader] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(traffickerId,"traffickerId")
    if(traffickerId){
    dispatch(getTraffickerActionData(traffickerId));
    }
  }, [traffickerId]);

  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
    }, 1000);
  }, [traffickerActionData]);
  // console.log(traffickerActionData, "traffickerActionData");
  return (
    <>
      <KamoTopbar />
      <main className="main_body">
        <div className="bodyright">
          <div className="row justify-content-between">
            <div className="col-auto">
              <h2 className="page_title">{module =="survivor" ? "Survivors List" : module =="images" ? "Images List":  module == "fir" ? "FIR List" : module == "chargesheet" && "ChargeSheet List"}</h2>
            </div>
          </div>
          {loader === true ? (
            <div className="text-center">
              <div class="spinner-border smallSpinnerWidth text-info text-center"></div>
            </div>
          ) : (
            <div className="white_box_shadow_20 survivors_table_wrap position-relative">
              {module == "survivor" && (
                <div className="table-responsive">
                  <table className="table table-borderless mb-0">
                    <thead>
                      <tr>
                        <th width="33.33%">Name </th>
                        <th width="33.33%">Social Worker</th>
                      </tr>
                    </thead>
                    <tbody>
                      {traffickerActionData &&
                      traffickerActionData.survivorList &&
                      traffickerActionData.survivorList.length > 0 ? (
                        traffickerActionData.survivorList.map((item) => {
                          return (
                            <tr>
                              <td>
                                {item &&
                                  item.survivor &&
                                  item.survivor.survivor_name &&
                                  item.survivor.survivor_name}
                              </td>

                              <td>
                                {item &&
                                  item.social_worker &&
                                  item.social_worker.fname +
                                    " " +
                                    item.social_worker.lname}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td className="text-center" colSpan={2}>
                            <b>NO Data Found !!</b>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {module == "fir" && (
                <div className="table-responsive">
                  <table className="table table-borderless mb-0">
                    <thead>
                      <tr>
                        <th width="33.33%">FIR Number </th>
                        <th width="33.33%">Location</th>
                        <th width="33.33%">Date of FIR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {traffickerActionData &&
                      traffickerActionData.traffickerFir &&
                      traffickerActionData.traffickerFir.length > 0 ? (
                        traffickerActionData.traffickerFir.map((item) => {
                          return (
                            <tr>
                              <td>
                                {item &&
                                  item.fir &&
                                  item.fir.number &&
                                  item.fir.number}
                              </td>

                              <td>
                                {item &&
                                  item.location &&
                                  item.location.toUpperCase()}
                              </td>
                              <td>
                                {item &&
                                  item.fir &&
                                  item.fir.date &&
                                  moment(item.fir.date).format("DD-MMM-YYYY")}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td className="text-center" colSpan={3}>
                            <b>NO Data Found !!</b>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {module == "images" && (
                <div className="table-responsive">
                  <table className="table table-borderless mb-0">
                    <thead>
                      <tr>
                        <th width="33.33%">File Name </th>
                        <th width="33.33%">Download</th>
                        {/* <th width="33.33%">Date of FIR</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {traffickerActionData &&
                      traffickerActionData.traffickerImages &&
                      traffickerActionData.traffickerImages.image &&
                      traffickerActionData.traffickerImages.image.length > 0 ? (
                        traffickerActionData.traffickerImages.image.map(
                          (item) => {
                            return (
                              <tr>
                                <td>{item && item.split("/").pop()}</td>
                                <td>
                                  <a
                                    href={item && item}
                                    target={item ? "" : "_blank"}
                                  >
                                    {" "}
                                    {item}
                                  </a>
                                </td>
                              </tr>
                            );
                          }
                        )
                      ) : (
                        <tr>
                          <td className="text-center" colSpan={2}>
                            <b>NO Data Found !!</b>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

{module == "chargesheet" && (
                <div className="table-responsive">
                  <table className="table table-borderless mb-0">
                    <thead>
                      <tr>
                        <th width="33.33%">ChargeSheet Number </th>
                        <th width="33.33%">Location</th>
                        <th width="33.33%">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {traffickerActionData &&
                      traffickerActionData.traffickerChargesheet &&
                      traffickerActionData.traffickerChargesheet.length > 0 ? (
                        traffickerActionData.traffickerChargesheet.map((item) => {
                          return (
                            <tr>
                              <td>
                                {item &&
                                  item.charge_sheet &&
                                  item.charge_sheet.number &&
                                  item.charge_sheet.number}
                              </td>
                              <td>
                                {item &&
                                  item.location &&
                                  item.location.toUpperCase()}
                              </td>
                              <td>
                                {item &&
                                  item.charge_sheet &&
                                  item.charge_sheet.date && moment(item.charge_sheet.date).format("DD-MMM-YYYY")}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td className="text-center" colSpan={3}>
                            <b>NO Data Found !!</b>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default TraffickerActionList;
