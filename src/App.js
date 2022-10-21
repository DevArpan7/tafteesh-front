import React from 'react';
// import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css"; 

import { Login,AdminLogin } from "./components";
import { Error, ForgotPasswordMail, ForgotPasswordOTP, ForgotPassword ,ForgotPasswordOTPUser,ForgotPasswordMailUser,ForgotPasswordUser} from './components';
import { SocialWorkerDashboard, SurvivorsList, SurvivorTraffickersList,SurvivorsLawyers, AddSurvivors, SurvivorsDocument ,SurvivorFir, SurvivorsRescue, SurvivorsInvestigation, SurvivorsParticipation, SurvivorShelterHome, SurvivorsNextPlan, SurvivorsLoan, SurvivorsIncome, SurvivorsGrant, SurvivorCIT, MyAccount, SurvivorProceduralCorrection, SurvivorVictimCompensation, SurvivorChargesheet, SurvivorProfileDetails, ChangeLog, SurvivorSupplimentaryChargesheet ,Notification,PendingItems,SurvivorArchiveItems,SurvivorCitArchiveItems,SurvivorFirArchiveItems, SurvivorRescueArchiveItems,SurvivorChargesheetArchiveItems,SurvivorInvestigationArchiveItems,SurvivorVcArchiveItems,SurvivorGrantArchiveItems, SurvivorIncomeArchiveItems, SurvivorLoanArchiveItems,SurvivorPcArchiveItems,SurvivorShelterHomeArchiveItems,SurvivorDocArchiveItems,AddTraffickers, SocialReport,SurvivorLawyerArchiveItems} from "./containers";
import { KamoAdmin, AddUser, UserList, TraffickersList, LawyersList, KamoPartners, KamoOrganizations, KamoSHG, KamoCollectives,KamoStates
,KamoBlocks ,KamoDistrict, LawyersCategory,PoliceStations,AuthorityType,AuthorityList, CitDimension,CitDimensionQues, CitVersion,ActList, SectionList, DocumentList ,AllCitList, AllSurvivorList,KamoUserDetails, TraffickersDetails , AddRole,KamoVcStatus, KamoCitStatus,TraffickerActionList,KamoInvestigationResult, KamoVcResult,KamoPcResult,KamoCourtList,TypeofAgency,KamoAgencyList,WhereLoanLsit,IncomeTypeList,ModeofEarningList,PurposeOfLoan,PurposeOfGrant,KamoCity,MortgageList,KamoGrantNameList,ShelterHomeQuestion} from "./pages";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import '../src/assets/css/fontawesome.css';
import './app.css';
import KamoDiaryStatus from './pages/kamoDiaryStatusList/KamoDiaryStatus';
import KamoGrantStatus from './pages/kamoGrantStatusList/KamoGrantStatus';
import KamoInvestigationStatus from './pages/kamoInvestigationStatusList/KamoInvestigationStatus';
import KamoSurvivorStatus from './pages/kamoSurvivorStatusList/KamoSurvivorStatus';
import KamoPcEscalationResult from './pages/kamoPcEscalationResultList/KamoPcEscalationResult';
import KamoVcEscalationResult from './pages/kamoVcEscalationResultList/KamoVcEscalationResult';


const App = () => {
  const token = localStorage.getItem("accessToken");
  //console.log(token,"tokennnn")

  return (
    <>
      <Router>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/adminlogin" component={AdminLogin} />
            {token &&<Route exact path="/dashboard" component={SocialWorkerDashboard} />}
           {token &&<Route exact path="/survivors" component={SurvivorsList} />}
           {token &&<Route exact path="/survivor-document" component={SurvivorsDocument} />}
           {token &&<Route exact path="/survivor-fir" component={SurvivorFir} />}
           {token &&<Route exact path="/survivor-rescue" component={SurvivorsRescue} />}
           {token &&<Route exact path="/survivor-investigation" component={SurvivorsInvestigation} />}
           {token &&<Route exact path="/survivor-participation" component={SurvivorsParticipation} />}
           {token &&<Route exact path="/survivor-shelter-home" component={SurvivorShelterHome} />}
           {token &&<Route exact path="/my_diary" component={SurvivorsNextPlan} />}
           {token &&<Route exact path="/survivor-loan" component={SurvivorsLoan} />}
           {token &&<Route exact path="/survivor-lawyer" component={SurvivorsLawyers} />}
           {token &&<Route exact path="/survivor-income" component={SurvivorsIncome} />}
           {token &&<Route exact path="/survivor-grant" component={SurvivorsGrant} />}
           {token &&<Route exact path="/survivor-cit" component={SurvivorCIT} />}
           {token &&<Route exact path="/myaccount" component={MyAccount} />}
           {token && <Route exact path="/survivor-pc" component={SurvivorProceduralCorrection} />}
           {token &&<Route exact path="/survivor-vc" component={SurvivorVictimCompensation} />}
           {token &&<Route exact path="/survivor-chargesheet" component={SurvivorChargesheet} />}
           {token &&<Route exact path="/survivor-supplimentary-chargesheet" component={SurvivorSupplimentaryChargesheet} />}
           {token &&<Route exact path="/add-survivor" component={AddSurvivors} />}
           {token && <Route exact path="/edit-survivor" component={AddSurvivors} />}
           {token &&<Route exact path="/traffickers" component={SurvivorTraffickersList} />}
           {token && <Route exact path="/survivor-traffickers" component={AddTraffickers} />}

           {token &&<Route exact path="/admin" component={KamoAdmin} />}
           {token &&<Route exact path="/add-user" component={AddUser} />}
           {token && <Route exact path="/user-list" component={UserList} />}
           {token && <Route exact path="/user-details" component={KamoUserDetails} />}
           {token && <Route exact path="/profile-details" component={SurvivorProfileDetails} />}
           {token && <Route exact path="/traffickers-list" component={TraffickersList} />}
           {token &&<Route exact path="/traffickers-details" component={TraffickersDetails} />}
           {token && <Route exact path="/lawyers-list" component={LawyersList} />}
           {token && <Route exact path="/partners" component={KamoPartners} />}
           {token &&<Route exact path="/organizations" component={KamoOrganizations} />}
           {token && <Route exact path="/states" component={KamoStates} />}
           {token && <Route exact path="/blocks" component={KamoBlocks} />}
           {token &&<Route exact path="/districts" component={KamoDistrict} />}
           {token &&<Route exact path="/lawyers-category" component={LawyersCategory} />}
           {token &&<Route exact path="/police-station" component={PoliceStations} />}
            {token &&<Route exact path="/all-cit" component={AllCitList} />}
            {token && <Route exact path="/all-survivor" component={AllSurvivorList} />}
            {token && <Route exact path="/role" component={AddRole} />}
            {token &&<Route exact path="/authority_type" component={AuthorityType} />}
            {token && <Route exact path="/authority_list" component={AuthorityList} />}
            {token &&<Route exact path="/act_list" component={ActList} />}
            {token && <Route exact path="/document_list" component={DocumentList} />}
            {token && <Route exact path="/section_list" component={SectionList} />}
            {token && <Route exact path="/cit_dimension" component={CitDimension} />}
            {token && <Route exact path="/cit_dimension_ques" component={CitDimensionQues} />}
            {token && <Route exact path="/cit_version" component={CitVersion} />}
            {token && <Route exact path="/social-report" component={SocialReport} />}
            {token && <Route  exact path="/social-report" component={SocialReport}/>}
            {token && <Route exact path="/vc_status" component={KamoVcStatus}/>}
            {token && <Route exact path="/trafficker" component={TraffickerActionList}/>}
            {token && <Route exact path="/cit_status" component={KamoCitStatus}/>}
            {token && <Route exact path="/diary_status" component={KamoDiaryStatus}/>}
            {token &&<Route exact path="/grant_status" component={KamoGrantStatus}/>}
            {token && <Route exact path="/investigation_status" component={KamoInvestigationStatus}/>}
            {token && <Route exact path="/survivor_status" component={KamoSurvivorStatus}/>}
            {token && <Route exact path="/investigation_results" component={KamoInvestigationResult}/>}
            {token && <Route exact path="/vc_results" component={KamoVcResult}/>}
            {token && <Route exact path="/vc_escalation_results" component={KamoVcEscalationResult}/>}
            {token && <Route exact path="/pc_results" component={KamoPcResult} />}
            {token && <Route exact path="/pc_escalation_results" component={KamoPcEscalationResult} />}
            {token && <Route exact path="/court" component={KamoCourtList} />}
            {token && <Route exact path="/agency_type" component={TypeofAgency} />}
            {token && <Route exact path="/shg-home" component={KamoSHG} />}
            {token && <Route exact path="/collectives" component={KamoCollectives} />}
            {token && <Route exact path="/change-log" component={ChangeLog} />}
            {token &&<Route exact path="/notification" component={Notification} />}
            {token && <Route exact path="/pending-case" component={PendingItems} />}
            {token && <Route exact path="/archive-list" component={SurvivorArchiveItems} />}
            {token && <Route exact path="/archive-list/fir" component={SurvivorFirArchiveItems} />}
            {token && <Route exact path="/archive-list/rescue" component={SurvivorRescueArchiveItems} />}
            {token && <Route exact path="/archive-list/chargesheet" component={SurvivorChargesheetArchiveItems} />}
            {token && <Route exact path="/archive-list/investigation" component={SurvivorInvestigationArchiveItems} />}
            {token && <Route exact path="/archive-list/vc" component={SurvivorVcArchiveItems} />}
            {token && <Route exact path="/archive-list/pc" component={SurvivorPcArchiveItems} />}
            {token && <Route exact path="/archive-list/grant" component={SurvivorGrantArchiveItems} />}
            {token &&  <Route exact path="/archive-list/income" component={SurvivorIncomeArchiveItems} />}
            {token && <Route exact path="/archive-list/loan" component={SurvivorLoanArchiveItems} />}
            {token && <Route exact path="/archive-list/document" component={SurvivorDocArchiveItems} />}
            {token &&  <Route exact path="/archive-list/shelterHome" component={SurvivorShelterHomeArchiveItems} />}
            {token &&  <Route exact path="/archive-list/lawyer" component={SurvivorLawyerArchiveItems} />}
             <Route exact path="/admin-forgot-password-mail" component={ForgotPasswordMail} />
            <Route exact path="/forgot-password-otp" component={ForgotPasswordOTP} />
           <Route exact path="/forgot-password" component={ForgotPassword} />
            <Route exact path="/user-forgot-password-mail" component={ForgotPasswordMailUser} />
           <Route exact path="/forgot-password-otp-user" component={ForgotPasswordOTPUser} />
           <Route exact path="/forgot-password-user" component={ForgotPasswordUser} />
            {token && <Route exact path ="/archive-list/cit" component={SurvivorCitArchiveItems}/>}
            {token && <Route exact path ="/agency" component={KamoAgencyList}/>}
            {token && <Route exact path ="/where-laon" component={WhereLoanLsit}/>}
            {token && <Route exact path ="/income-type" component={IncomeTypeList}/>}
            {token && <Route exact path ="/earning-mode" component={ModeofEarningList}/>}
            {token && <Route exact path ="/loan-purpose" component={PurposeOfLoan}/>}
            {token && <Route exact path ="/grant-purpose" component={PurposeOfGrant}/>}
            {token && <Route exact path ="/city" component={KamoCity}/>}
            {token && <Route exact path ="/mortgage" component={MortgageList}/>}
            {token && <Route exact path ="/grant-name" component={KamoGrantNameList}/>}
            {token && <Route exact path ="/shelter-home-question" component={ShelterHomeQuestion}/>}


            <Route component={Error} />
          </Switch>
        </Router>
    </>
  )
}

export default App