import React, { useState } from "react";
import { Topbar } from "../../components";
import "./socialreport.css";
import { Form, InputGroup } from "react-bootstrap";
import axios from "axios";
import SocialReportTab from "./SocialReportTab";
import { useEffect } from "react";
import moment from "moment";
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";


const SocialReport = () => {
  var today = new Date();
  // const currentYear = JSON.stringify(today.getFullYear());
  // const currentMonth = today.toLocaleString("default", { month: "short" });
  // //console.log(typeof currentMonth, typeof currentYear, "types");
  const [selectedYear, setSelectedYear] = useState();
  const [selectedMonth, setSelectedMonth] = useState("");
  const [dateType,setDataType] = useState(moment(new Date()).format("YYYY-MMM"))
  const organization = localStorage.getItem("organizationName");
  const [socialWorkerDetail, setSocialWorkerDetail] =  useState("");
const[loading , setLoading] = useState (false)
  console.log(dateType, "dateType");
  const userId = localStorage.getItem("userId");

  const api = "https://tafteesh-staging-node.herokuapp.com/api/monthly-report";
  const token = localStorage.getItem("accessToken");
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    axios.get(`https://tafteesh-staging-node.herokuapp.com/api/user/detail/${userId}`,axiosConfig)
      .then((response) => {
        console.log(response,"social worker response");
        if (response.data && response.data.error === false) {
          const { data } = response;
          setSocialWorkerDetail(data.data)
          console.log(socialWorkerDetail);
        }
      })
      .catch((error) => {});
  }, [])

  /// print as pdf ///
  const printDocument = () => {
    const divToPrint = document.querySelector('#pdf-download-div');
    html2canvas(divToPrint).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 190;
      const pageHeight = 290;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      const doc = new jsPDF('pt', 'mm');
      let position = 0;
      doc.setTextColor(40);
      // doc.text(`Social worker mothly report`, 20, 10);
      
      //monthly Report Column
      const monthlyReportColumns = [
        "SW Name",
        "SW Email",
        "SW Mobile",
        "SW Address",
        "Month/Year"
      ];

      //monthly Report row
      const monthlyReportRows = [
        `${socialWorkerDetail.fname} ${socialWorkerDetail.lname}`,
        socialWorkerDetail.email,
        socialWorkerDetail.mobile,
        socialWorkerDetail.address || 'N/A',
        moment(dateType).format("MMMM, YYYY")
      ];

      doc.autoTable(monthlyReportColumns, [monthlyReportRows], { 
        tableLineColor: [189, 195, 199], 
        tableLineWidth: 0.75, 
        startY: 10, 
        startX: 25 , 
        headStyles: {
          lineWidth: 0.75,
          lineColor: [189, 195, 199]
        }, bodyStyles: {
          lineWidth: 0.75,
          lineColor: [189, 195, 199]
        }
      });
      doc.addImage(imgData, 'PNG', 10, 30, imgWidth, imgHeight + 25);
      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
          position = heightLeft - imgHeight + 29;
          doc.addPage();
          doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight + 25);
          heightLeft -= pageHeight;
      }
      doc.save(`Report_${socialWorkerDetail.fname}_${socialWorkerDetail.lname}_${moment(dateType).format("MMM")}_${moment(dateType).format("YYYY")}.pdf`);
    });
  }

  // const getMonthlyReport = async () => {

  //   var config = {
  //     method: 'GET',
  //     url: 'https://tafteesh-staging-node.herokuapp.com/api/monthly-report/survivor-and-engagement-count/624ecd65f5c2656385f2ed96',
  //     headers: {},
  //     data: data
  //   };

  //   //console.log(data,'dataaaaa')
  //   axios
  //       .post(`https://tafteesh-staging-node.herokuapp.com/api/monthly-report/survivor-and-engagement-count/${organization}`, data, config)
  //       .then((res) => {
  //         //console.log(res);
  //       })
  //       .catch((error) => {
  //         //console.log(error)
  //       });
  // }

 

  const [engagementCountData,setEngagementCountData] = useState({})
  const [survivorCountData,setSurvivorCountData] = useState({})


  const getSurvivorAndEngageReport = (year,month) => {
    // var data = { month: selectedMonth, year: selectedYear };

    let monthData = month ? month.toLowerCase() : moment(dateType).format("MMM").toLowerCase()
    let yearData = year ? year :  moment(dateType).format("YYYY")
    setLoading(true)
    axios.get(api + `/survivor-and-engagement-count/${userId}?month=${monthData}&year=${yearData}`,axiosConfig)
      .then((response) => {
        // //console.log(response,"response");
        setLoading(false)
        if (response.data && response.data.error === false) {
          const { data } = response;
          setEngagementCountData(data.diarydata)
          setSurvivorCountData(data.survivordata)

        }
      })
      .catch((error) => {
        setLoading(false)
      });
  };


  const [survivorListByStatus,setSurvivorListByStatus] = useState([])
  const getMonthlyReport = (year,month) => {
    // var data = { month: selectedMonth, year: selectedYear };
    let monthData = month ? month.toLowerCase() : moment(dateType).format("MMM").toLowerCase()
    let yearData = year ? year :  moment(dateType).format("YYYY")
    setLoading(true)
    axios.get(api + `/engagement-list/${userId}?month=${monthData}&year=${yearData}`,axiosConfig)
      .then((response) => {
        //console.log(response,"response");
        setLoading(false)
        if (response.data && response.data.length > 0) {
          const { data } = response;
          // //console.log(data,"responseData")
          setSurvivorListByStatus(data)

        }
      })
      .catch((error) => {setLoading(false)});
  };

  const [actionList,setActionList] = useState({})
  const getActionList = (year,month) => {
    // var data = { month: selectedMonth, year: selectedYear };
    let monthData = month ? month.toLowerCase() : moment(dateType).format("MMM").toLowerCase()
    let yearData = year ? year :  moment(dateType).format("YYYY")
    setLoading(true)
    axios.get(api + `/action-list-count/${userId}?month=${monthData}&year=${yearData}`,axiosConfig)
      .then((response) => {
        // //console.log(response,"response");
        setLoading(false)
        if (response.data) {
          const { data } = response;
          //console.log(data,"responseData")
          setActionList(data)

        }
      })
      .catch((error) => {setLoading(false)});
  };

  const[allList,setAllList] = useState({})

  const getMonthlyReportAllList = (year,month) => {
    // var data = { month: selectedMonth, year: selectedYear };
    let monthData = month ? month.toLowerCase() : moment(dateType).format("MMM").toLowerCase()
    let yearData = year ? year :  moment(dateType).format("YYYY")
    setLoading(true)
    axios.get(api + `/all-list/${userId}?month=${monthData}&year=${yearData}`,axiosConfig)
      .then((response) => {
        //console.log(response,"responseAllList");
        setLoading(false)
        if (response.data) {
          const { data } = response;
          // //console.log(data,"responseData")
          setAllList(data)

        }
      })
      .catch((error) => {setLoading(false)});
  };
  const dateOnchage=(e)=>{
    console.log(e.target.value)
    let year =moment(e.target.value).format("YYYY")
    let month = moment(e.target.value).format("MMM")

    getSurvivorAndEngageReport(year,month);
    getMonthlyReport(year,month);
    getActionList(year,month);
    getMonthlyReportAllList(year,month);
    setDataType(e.target.value)
    setSelectedYear(year)
    setSelectedMonth(month)
  }

  useEffect(() => {
    getSurvivorAndEngageReport();
    getMonthlyReport();
    getActionList();
    getMonthlyReportAllList();
  }, []);


  return (
    <>
      <Topbar />
      <main className="main_body">
        <div id="capture" className="bodyright">
          <div className="row justify-content-between">
            <div className="col-auto">
              <h2 className="page_title">
                Organization Name: <span>{organization && organization}</span>
              </h2>
            </div>
            <div className="col-auto">
              <div className="body_right_btn d-flex mb-3">
                {/* <div className="social_report_selectbox pe-2">
                  <Form.Select>
                    <option>Select Year</option>
                    <option>2022</option>
                    <option>2021</option>
                    <option>2022</option>
                  </Form.Select>
                </div> */}
                {/* <div className="social_report_selectbox pe-2">
                  <Form.Control
                 value= {dateType}
                  // "YYYY-MMM"
                  onChange={(e)=> dateOnchage(e)}
                    type="month"
                    className="monthbox"
                  />
                </div> */}

                <InputGroup className='date_box monthbox'>
                  <span className='hidebox'></span>
                  <Form.Control
                  className="disableMonth"
                    type="text"
                    placeholder="MMM-YYYY"
                    // value= {dateType}
                    value={dateType && moment(dateType).format("MMM-YYYY")}
                    //required={required}
                    disabled={true}
                  />
                  
                  <InputGroup.Text>
                    <Form.Control
                     onChange={(e)=> dateOnchage(e)}
                   
                      className='dateBtn'
                      type="month"
                      //required={required}
                      //onChange={datePickerChange}
                      //placeholder=""
                      //max={moment().format("YYYY-MM-DD")}
                    />
                    <i className="fal fa-calendar-alt"></i>
                  </InputGroup.Text>
                </InputGroup>
                <div className="">
                  <button disabled={loading == true ? true : false} className="btn addbtn shadow-0" onClick={() => printDocument()}>Download PDF</button>
                </div>
              </div>
            </div>
          </div>
          <div className="totla_profile" id="pdf-download-div">
            <SocialReportTab loading={loading} survivorCountData ={survivorCountData} engagementCountData={engagementCountData} survivorListByStatus={survivorListByStatus} actionList={actionList} allList={allList}/>
          </div>
        </div>
      </main>
    </>
  );
};

export default SocialReport;
