import React, { useState, useEffect } from 'react';
import { MDBAccordion, MDBAccordionItem } from 'mdb-react-ui-kit';
import moment from 'moment';
import { useSelector } from "react-redux";

const SurvivorTopCard = (props) => {
  // //console.log(props,"survivor card......")
  // const {survivorDetails } = props;
  const [loader, setLoader] = useState(true);
  const survivorActionDetails = useSelector((state) => state.survivorActionDetails);
  const survivorDetails = useSelector((state) => state.survivorDetails);

  const survivalLoanList = useSelector((state) => state.survivalLoanList);
  const incomeList = useSelector((state) => state.incomeList);
  const survivalGrantList = useSelector((state) => state.survivalGrantList);

  
  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
    }, 1000);
  }, [survivorDetails]);
  

  return (
    <>

{/* {loader && loader === true ?
            <div class="spinner-border bigSpinner text-info"></div>
            : */}
        <MDBAccordion flush 
        // initialActive={1}
        >
         
            <MDBAccordionItem className="survivor_cardbar_wrap" collapseId={1} headerTitle='Survivor'>
              <div className="survivor_card_bar">
                <ul>
                  <li>
                    <h6 className="mb-2">Survivor ID</h6>
                    <h5 className="mb-0">{survivorDetails && survivorDetails.survivor_id && survivorDetails.survivor_id}</h5>
                  </li>
                  <li>
                    <h6 className="mb-2">Name</h6>
                    <h5>{survivorDetails && survivorDetails.survivor_name && survivorDetails.survivor_name}</h5>
                  </li>
                  <li>
                    <h6 className="mb-2">Gender</h6>
                    <h5>{survivorDetails && survivorDetails.gender && survivorDetails.gender}</h5>
                  </li>
                  <li>
                    <h6 className="mb-2">Date of Trafficking</h6>
                    <h5>{survivorDetails && survivorDetails.date_of_trafficking && moment(survivorDetails.date_of_trafficking).format("DD-MMM-YYYY")}</h5>
                  </li>
                  <li>
                    <h6 className="mb-2">Rescue?</h6>
                    <h5>{survivorActionDetails && survivorActionDetails.rescue && survivorActionDetails.rescue.exist === true ? "Yes" : "No"}</h5>
                  </li>
                  <li>
                    <h6 className="mb-2">Procedural Correction </h6>
                    <h5>{survivorActionDetails && survivorActionDetails.pc && survivorActionDetails.pc.exist === true ?"Yes" :"No" }</h5>
                  </li>
                  <li>
                    <h6 className="mb-2">Victim Compensation </h6>
                    <h5>{survivorActionDetails && survivorActionDetails.vc && survivorActionDetails.vc.exist === true ?"Yes" :"No" }</h5>
                  </li>
                  <li>
                    <h6 className="mb-2">CIT</h6>
                    <h5>{survivorActionDetails &&  survivorActionDetails.cit && survivorActionDetails.cit.exist === true ? "Yes" : "No"}</h5>
                  </li>
                  <li>
                    <h6 className="mb-2">Leadership</h6>
                    <h5>No</h5>
                  </li>
                  <li>
                    <h6 className="mb-2">Financial Inclusion</h6>
                    <h5>{survivalGrantList && survivalGrantList.length >0 ? "Yes" :incomeList && incomeList.data && incomeList.data.length >0 ? "Yes" : survivalLoanList &&  survivalLoanList.data && survivalLoanList.data.length >0 ? "Yes": "No"}</h5>
                  </li>
                  <li>
                    <h6 className="mb-2">Status of Tafteesh</h6>
                    <h5>{survivorDetails && survivorDetails.status_in_tafteesh && survivorDetails.status_in_tafteesh}</h5>
                  </li>
                  <li>
                    <h6 className="mb-2">Place of rescue</h6>
                    <h5>{survivorActionDetails && survivorActionDetails.rescue && survivorActionDetails.rescue.place_of_rescue ? survivorActionDetails.rescue.place_of_rescue :"NA" }</h5>
                  </li>
                </ul>
              </div>
            </MDBAccordionItem>
            
        </MDBAccordion>
{/* } */}
    </>
  )
}

export default SurvivorTopCard
