import React, { useState, useEffect } from "react";
import {
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBTooltip,
  MDBBtn,
} from "mdb-react-ui-kit";
import moment from "moment";

const TestTable = (props) => {
  const {
    data,
    escalSelectedData,
    currencyFormat,
    onSelectVcEscal2,
    indexNo,
    vcEscalation2ListFunc,onAddSubVcEscalation,onAddSubVcEscalation2
  } = props;

  const [escalActive2Class, setEscalActive2Class] = useState(false);
  const [selectData, setSelectData] = useState({});
  const [selectVcEsData,setSelectVcEsData] = useState({})
  console.log(data, "datadata");

  const onSelectVcEscal = (e, data) => {
    console.log(e, data, "escalActive2Class");
    setSelectVcEsData(data)
    setEscalActive2Class(!escalActive2Class);
    setSelectData(data);
    
    onSelectVcEscal2(data);
    vcEscalation2ListFunc(data && data.survivor_vc, data._id)
  };
  // useEffect(() => {
  //   if (escalActive2Class == true) {
  //     setSelectData(selectVcEsData);
  //     onSelectVcEscal2(selectVcEsData);
  //     vcEscalation2ListFunc(selectVcEsData && selectVcEsData.survivor_vc, selectVcEsData._id)
  //   } 
  //   else {
  //     setSelectData({});
  //     onSelectVcEscal2({});
  //   }
  // }, [escalActive2Class== true]);

  console.log(selectVcEsData, "escalActive2Class");
  return (
    <>
      <div className="white_box_shadow_20 vieweditdeleteMargin survivors_table_wrap position-relative">
        <div className="vieweditdelete">
          <MDBTooltip
            tag="button"
            wrapperProps={{ className: "add_btn view_btn" }}
            title="Add Escalation for this Escalation"
          >
            <span onClick={() => onAddSubVcEscalation2()}>
              <i className="fal fa-plus-circle"></i>
            </span>
          </MDBTooltip>
        </div>
        <h4 className="mb-4 small_heading">
          Escalation {indexNo} Of {escalSelectedData && escalSelectedData.unique_id}
        </h4>
        <div className="table-responsive big-mobile-responsive">
          <table className="table table-borderless mb-0">
            <thead>
              <tr>
              <th width="16.66%">Id</th>
                <th width="16.66%">Source</th>
                <th width="16.66%">Applied date</th>
                <th width="16.66%">application number</th>
                <th width="16.66%">Amount claimed</th>
              </tr>
            </thead>
            <tbody>
              {data && data.length > 0 ? (
                data.map((item) => {
                  return (
                    <tr
                      className={[
                        item &&
                          item._id === selectData &&
                          selectData._id &&
                          escalActive2Class === true &&
                          "current",
                      ]}
                      onClick={(e) => onSelectVcEscal(e, item)}
                    >
                       <td>
                                {item && item.unique_id && item.unique_id}
                              </td>
                      <td>
                        {item && item.source && item.source.toUpperCase()}
                      </td>
                      <td>
                        {item &&
                          item.applied_date &&
                          moment(item.applied_date).format("DD-MMM-YYYY")}
                      </td>
                      <td>
                        {item &&
                          item.application_number &&
                          item.application_number}
                      </td>
                      <td>
                        {item &&
                          item.amount_claimed &&
                          currencyFormat(item.amount_claimed)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td>No Data Found !!!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TestTable;
