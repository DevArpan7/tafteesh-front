import React, { useState, useEffect } from "react";
import { Topbar } from "../../components";
import "./socialdashboard.css";
import axios from "axios";

import SocialDashboardTab from "./SocialDashboardTab";

import { useDispatch, useSelector } from "react-redux";

const Dashboard = (props) => {
  const organizationName = localStorage.getItem("organizationName");
  const dispatch = useDispatch();
  const userRememberMe = JSON.parse(localStorage.getItem("userRememberMe"));
  const api = "https://tafteesh-staging-node.herokuapp.com/api/";
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  };

  const [vcArray, setVcArray] = useState([]);
  const [pcArray, setPcArray] = useState([]);
  const [countData, setCountData] = useState({});
  const [loader, setLoader] = useState(false);
  const [stateWiseSurvivorList, setStateWiseSurvivorList] = useState([]);
  const [ageWiseSurvivor, setAgeWiseSurvivor] = useState([]);
  // //console.log(countData,countData)
  useEffect(() => {
    if (token && role && role == "Admin") {
      props.history.push("/admin");
    } else if (token && role && role == "Social Worker") {
      props.history.push("/dashboard");
    } else {
      props.history.push("/");
    }
  }, [token]);

const [vcSaData,setVcSaData] = useState({})
const [vcDaData,setVcDaData] = useState({})
const [pcSaCounts,setPcSaCounts] = useState({})
const [pcDaCounts,setPcDaCounts] = useState({})


  const servivorDashboardApi = () => {
    setLoader(true);
    axios
      .get(api + "survivor-dashboard/list-by-id/" + userId, axiosConfig)
      .then(function (response) {
        setLoader(false);
        console.log(response);
        if (response.data && response.data.error === false) {
          const { data } = response;
          setStateWiseSurvivorList(data.stateWiseSurvivor);
          setAgeWiseSurvivor(data.ageWiseSurvivor);
          setVcArray(data.dataVc);
          setPcArray(data.dataPc);
          setCountData({
            totalcountpc: data.totalCountPc,
            totalcountvc: data.totalCountVc,
            totalcountpcda: data.totalCountPcDa,
            totalcountpcsa: data.totalCountPcSa,
            totalcountvcda: data.totalCountVcDa,
            totalcountvcsa: data.totalCountVcSa,
            totalAwardedCountVc : data.totalAwardedCountVcDa + data.totalAwardedCountVcSa,
            totalConcludedCountPc : data.totalConcludedCountPcDa + data.totalConcludedCountPcSa
          });
          setVcSaData(data.vcSaCounts)
          setVcDaData(data.vcDaCounts)
          setPcSaCounts(data.pcSaCounts)
          setPcDaCounts(data.pcDaCounts)
        }
      })
      .catch(function (error) {
        //console.log(error);
        setLoader(false);
      });
  };
 
  useEffect(() => {
    if (props) {
      servivorDashboardApi();
      dispatch({ type: "SURVIVOR_DETAILS", data: {} });
    }
  }, [props]);

  return (
    <>
      <Topbar />
      <main className="main_body">
        <div className="bodyright">
          <h2 className="page_title">
            Organization Name:{" "}
            <span>{organizationName && organizationName}</span>
          </h2>
          <div className="totla_profile">
            <SocialDashboardTab
              {...props}
              pcDaCounts={pcDaCounts}
              pcSaCounts={pcSaCounts}
              vcSaData={vcSaData}
              vcDaData={vcDaData}
              
              loader={loader}
              countData={countData}
              pcArray={pcArray}
              vcArray={vcArray}
              stateWiseSurvivorList={stateWiseSurvivorList}
              ageWiseSurvivor={ageWiseSurvivor}
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
