import React, { useEffect, useState } from "react";
import feedbackProfile from "../../assets/img/feedbackProfile.png";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import moment from "moment";
import { NavLink, useHistory } from "react-router-dom";
import { findAncestor, gotoSurvivorDetails } from "../../utils/helper";
import { Chart } from "primereact/chart";

const SocialWorkerVC = (props) => {
  const {vcSaData,
    vcDaData,
    showVcArray,
    loader,
    stateWiseSurvivorList,
    ageWiseSurvivor,
    countData,
  } = props;
  //   console.log(showVcArray, "showVcArray");
  const history = useHistory();

  const goToView = (e, survivorId) => {
    //console.log(survivorId,"survivorId")
    gotoSurvivorDetails(e, survivorId, history);
    // props.history.push({ pathname: "/profile-details", state: survivorId })
  };
  const [ageArr, setMonthArr] = useState([]);
  const [countArr, setCountArr] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],

        backgroundColor: ["#42A5F5", "#66BB6A", "#FFA726"],
        hoverBackgroundColor: ["#64B5F6", "#81C784", "#FFB74D"],
      },
    ],
  });

  useEffect(() => {
    let tempmonthArr = [];
    let tempcountArr = [];
    ageWiseSurvivor &&
      ageWiseSurvivor.length > 0 &&
      ageWiseSurvivor.map((item) => {
        return (
          (tempmonthArr.push(item && item.age),
          tempcountArr.push(item && item.count)),
          //console.log(tempcountArr, tempmonthArr, "arr")

          setMonthArr(tempmonthArr),
          setCountArr(tempcountArr)
        );
      });
  }, [ageWiseSurvivor]);

  //console.log(ageArr, countArr, "arr");
  useEffect(() => {
    setChartData({
      labels: ageArr && ageArr.length > 0 && ageArr,
      datasets: [
        {
          data: countArr && countArr.length > 0 && countArr,
          backgroundColor: ["#42A5F5", "#66BB6A", "#FFA726", "#eb81a2"],
          hoverBackgroundColor: ["#64B5F6", "#81C784", "#FFB74D", "#eb81a2"],
        },
      ],
    });
  }, [ageArr, countArr]);

  const [lightOptions] = useState({
    plugins: {
      legend: {
        labels: {
          color: "#495057",
        },
      },
    },
  });
 

  return (
    <>
      <div className="row">
        <div className="col-lg-12 col-xl-12">
          <div className="survivor_list_box survivors_table_wrap white_box_shadow_20 mb30">
            <div className="table-responsive">
              <table className="table table-borderless mb-0">
                <thead>
                  <tr>
                    <th>Survivor ID</th>
                    <th>Survivor name</th>
                    <th colSpan="2">Last update Date</th>
                  </tr>
                </thead>
                <tbody>
                  {loader && loader === true ? (
                    <tr>
                      <td colSpan={8} className="text-center">
                        <div class="spinner-border bigSpinner text-info"></div>
                      </td>
                    </tr>
                  ) : showVcArray && showVcArray.length > 0 ? (
                    showVcArray.map((data) => {
                      return (
                        <tr>
                          <td>
                            {data.survivor &&
                              data.survivor.survivor_id &&
                              data.survivor.survivor_id}
                          </td>
                          <td>
                            {data.survivor &&
                              data.survivor.survivor_name &&
                              data.survivor.survivor_name}
                          </td>
                          <td>
                            {data.updatedAt &&
                              moment(data.updatedAt).format("DD-MMM-YYYY")}
                          </td>
                          <td width="12%">
                            <a
                              onClick={(e) =>
                                goToView(e, data.survivor && data.survivor._id)
                              }
                            >
                              View
                            </a>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td className="text-center" colSpan={4}>
                        <b>NO Data Found !!</b>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* <div className="col-lg-5 col-xl-4">
                    <div className="tafteesh_feedback_box white_box_shadow_20 mb30">
                        <h3>Feedback from Tafteesh</h3>
                        <div className="tafteesh_feedback_box_list">
                            <div className="tafteesh_feedback_box_list_img">
                                <img src={feedbackProfile} alt="" />
                            </div>
                            <div className="tafteesh_feedback_box_list_text">
                                <h6>Jhon Deo</h6>
                                <   p>Lorem ipsum mum dolor site test content</p>
                            </div>
                        </div>
                        <div className="tafteesh_feedback_box_list">
                            <div className="tafteesh_feedback_box_list_img">
                                <img src={feedbackProfile} alt="" />
                            </div>
                            <div className="tafteesh_feedback_box_list_text">
                                <h6>Jhon Deo</h6>
                                <p>Lorem ipsum mum dolor site test content</p>
                            </div>
                        </div>
                        <div className="tafteesh_feedback_box_list">
                            <div className="tafteesh_feedback_box_list_img">
                                <img src={feedbackProfile} alt="" />
                            </div>
                            <div className="tafteesh_feedback_box_list_text">
                                <h6>Jhon Deo</h6>
                                <p>Lorem ipsum mum dolor site test content</p>
                            </div>
                        </div>
                        <div className="tafteesh_feedback_box_list">
                            <div className="tafteesh_feedback_box_list_img">
                                <img src={feedbackProfile} alt="" />
                            </div>
                            <div className="tafteesh_feedback_box_list_text">
                                <h6>Jhon Deo</h6>
                                <p>Lorem ipsum mum dolor site test content</p>
                            </div>
                        </div>
                        <div className="tafteesh_feedback_box_list">
                            <div className="tafteesh_feedback_box_list_img">
                                <img src={feedbackProfile} alt="" />
                            </div>
                            <div className="tafteesh_feedback_box_list_text">
                                <h6>Jhon Deo</h6>
                                <p>Lorem ipsum mum dolor site test content</p>
                            </div>
                        </div>
                    </div>
                </div> */}
      </div>
      {/* <div className="vc_case_history mb30">
                <h3 className="white_box_title">Case History: (VC)</h3>
                <div className="white_box_shadow_20">
                    <b>Dynamic Graph</b><br /><br />
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis praesentium impedit modi earum atque eos unde, nisi accusamus doloribus ipsa distinctio nobis a voluptas facere excepturi autem ullam esse harum!
                </div>
            </div> */}
      <div className="vc_case_history">
        <h3 className="white_box_title">Synopsis </h3>
        <div className="row">
          <div className="col-lg-6">
            <div className="white_box_shadow_20 mb30">
              <table className="table table-borderless mb-0">
                <thead>
                  <tr>
                    <th>Name of District/state</th>
                    <th className="text-end">Number of Case</th>
                  </tr>
                </thead>
                <tbody>
                  {stateWiseSurvivorList &&
                    stateWiseSurvivorList.length > 0 &&
                    stateWiseSurvivorList.map((item) => {
                      return (
                        <tr>
                          <td>
                            {item &&
                            item.stateDetail &&
                            item.stateDetail.length > 0
                              ? item.stateDetail[0].name
                              : "NA"}
                          </td>
                          <td className="text-end">{item.count}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="white_box_shadow_20 mb30 d-flex justify-content-center">
              <Chart
                type="pie"
                data={chartData}
                options={lightOptions}
                style={{ position: "relative", width: "70%" }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="vc_summary">
        <Tabs>
          <TabList
            
            className="vc_summary_tab_menu"
          >
            <Tab value={0} index={0}>
              SA
            </Tab>
            <Tab value={1} index={1}>
              DA
            </Tab>
          </TabList>
          <TabPanel index={0} value={0}>
            <div className="white_box_shadow_20 vc_summary_tab_text">
              
              <table className="table table-borderless mb-0">
                <tbody>
                  {
                    vcSaData && Object.keys(vcSaData).map(e => {
                      return (
                        <tr>
                          <td>{e.toUpperCase()}</td>
                          <td>{vcSaData[e]}</td>
                        </tr>
                      )
                    })
                  }
                  {/* <tr>
                    <td>VC applied</td>
                    <td>{countData && countData.totalVcSaApplied}</td>
                  </tr> */}
                  {/* <tr>
                    <td>VC order received</td>
                    <td>{countData && countData.totalVcSaApplied}</td>
                  </tr> */}
                  {/* <tr>
                    <td>VC lowest awarded amount</td>
                    <td>18,00,00</td>
                  </tr>
                  <tr>
                    <td>VC highest awarded amount</td>
                    <td>3,000,00</td>
                  </tr>
                  <tr>
                    <td>VC average awarded amount</td>
                    <td>18,00,00</td>
                  </tr> */}
                 
                  {/* <tr>
                    <td>VC Concluded</td>
                    <td>{countData && countData.totalVcSaConcluded}</td>
                  </tr>
                  <tr>
                    <td>VC Awarded</td>
                    <td>{countData && countData.totalVcSaAwarded}</td>
                  </tr>
                  <tr>
                    <td>VC Rejected</td>
                    <td>{countData && countData.totalVcSaRejected}</td>
                  </tr>
                  <tr>
                    <td>VC Escalated</td>
                    <td>{countData && countData.totalVcSaEscalated}</td>
                  </tr> */}
                  {/* <tr>
                    <td>VC money received in bank account</td>
                    <td>18,00,00</td>
                  </tr>
                  <tr>
                    <td>Time spent btw application and conclusion</td>
                    <td>6 Month</td>
                  </tr>
                  <tr>
                    <td>Time spent btw application and received in bank</td>
                    <td>6 Month</td>
                  </tr> */}
                </tbody>
              </table>
            </div>
          </TabPanel>
          <TabPanel index={1} value={1}>
            <div className="white_box_shadow_20 vc_summary_tab_text">
              <table className="table table-borderless mb-0">
                <tbody>
                {
                    vcDaData && Object.keys(vcDaData).map(e => {
                      return (
                        <tr>
                          <td>{e.toUpperCase()}</td>
                          <td>{vcDaData[e]}</td>
                        </tr>
                      )
                    })
                  }
                  {/* <tr>
                    <td>VC order received</td>
                    <td>{countData && countData.totalVcSaApplied}</td>
                  </tr> */}
                  {/* <tr>
                    <td>VC lowest awarded amount</td>
                    <td>18,00,00</td>
                  </tr>
                  <tr>
                    <td>VC highest awarded amount</td>
                    <td>3,000,00</td>
                  </tr>
                  <tr>
                    <td>VC average awarded amount</td>
                    <td>18,00,00</td>
                  </tr> */}
                 
                  {/* <tr>
                    <td>VC Concluded</td>
                    <td>{countData && countData.totalVcDaConcluded}</td>
                  </tr>
                  <tr>
                    <td>VC Awarded</td>
                    <td>{countData && countData.totalVcDaAwarded}</td>
                  </tr>
                  <tr>
                    <td>VC Rejected</td>
                    <td>{countData && countData.totalVcDaRejected}</td>
                  </tr>
                  <tr>
                    <td>VC Escalated</td>
                    <td>{countData && countData.totalVcDaEscalated}</td>
                  </tr> */}
                  {/* <tr>
                    <td>VC money received in bank account</td>
                    <td>18,00,00</td>
                  </tr>
                  <tr>
                    <td>Time spent btw application and conclusion</td>
                    <td>6 Month</td>
                  </tr>
                  <tr>
                    <td>Time spent btw application and received in bank</td>
                    <td>6 Month</td>
                  </tr> */}
                </tbody>
              </table>
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </>
  );
};

export default SocialWorkerVC;
