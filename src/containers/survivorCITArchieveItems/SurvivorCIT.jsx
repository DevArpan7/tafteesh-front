import React, { useEffect, useState } from "react";
import { Topbar } from "../../components";
import { Button as IconButton } from "primereact/button";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import {
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBTooltip,
  MDBBtn,
} from "mdb-react-ui-kit";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
import { Button, Form, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import './survivorcit.css'
import queryString from "query-string";

import {
  getArchiveItem
} from "../../redux/action";
// import ChargesheetArchieveDataTableFilter from "./ChargesheetArchieveDataTableFilter";

const SurvivorCIT = (props) => {
  let url = props.location.search;
  let getModule = queryString.parse(url, { parseNumbers: true });
  // const cit = useSelector((state) => state.survivorArchiveItem);
  const [modalCitShow, setModalCitShow] = useState(false);
  const [cit, setCits] = useState([]);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [filters1, setFilters1] = useState(null);
  const [isCitLoading, setIsCitLoading] = useState(true);
  const [modalDimensionsShow, setModalDimensionsShow] = useState(false);
  // const dispatch = useDispatch();
  const survivorDetails = useSelector((state) => state.survivorDetails);
  const citDimensionList = useSelector((state) => state.survivorArchiveItem);
  // const [isLoading, setIsLoading] = useState(true);
  const [cityDimensionStateList, setCityDimensionStateList] = useState([]);
  const [activityList, setActivityList] = useState([]);
  const [actionListToSend, setActionListToSend] = useState([]);
  const [isShowCitGoalModal, setIsShowCitGoalModal] = useState(false);
  const [isShowCitGoalEditModal, setIsShowCitGoalEditModal] = useState(false);
  const [activity, setActivity] = useState("");
  const [activityToEdit, setActivityToEdit] = useState({});
  const [selectedGoalToEdit, setSelectedGoalToEdit] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [starList, setStartList] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const userId = localStorage.getItem("userId");
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [editData, setEditData] = useState({})
  const [survivorId, setSurvivorId] = useState("");
  const initFilters1 = () => {
    setFilters1({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      status: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      createdAt: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      },
      assessment_date: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      },
    });
    setGlobalFilterValue1("");
  };
  const clearFilter1 = () => {
    initFilters1();
  };
  const onGlobalFilterChange1 = (e) => {
    const value = e.target.value;
    let _filters1 = { ...filters1 };

    _filters1["global"].value = value;
    setFilters1(_filters1);
    setGlobalFilterValue1(value);
  };
  const getBodyOfColumn = (row, e) => {
    return (
      <span>
        {e.column.props.dataType === "date"
          ? moment(row[e.column.props.filterField]).format("DD-MMM-YYYY")
          : e.column.props.header === "APPROVED"
            ? row[e.column.props.filterField] === true
              ? "Yes"
              : "No"
            : row[e.column.props.filterField]}
      </span>
    );
  };
  const renderHeader1 = () => {
    return (
      <div className="p-d-flex p-jc-between">
        <IconButton
          type="button"
          icon="pi pi-filter-slash"
          label="Clear"
          className="p-button-outlined"
          onClick={clearFilter1}
        />
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue1}
            onChange={onGlobalFilterChange1}
            placeholder="Keyword Search"
          />
        </span>
      </div>
    );
  };
  const header1 = renderHeader1();


  useEffect(() => {
    dispatch(getArchiveItem(getModule.module, userId, getModule.survivor));
    setIsCitLoading(false)
  }, [props]);


  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      //console.log(getModule, 'getModule')

    }, 1000);
    // initFilters1();
  }, [cit]);
  const onSelectRow = (value) => {
    //console.log(value, "value");
    // setActiveClass(true);
    setEditData(value)
    setSurvivorId(value._id);
  };
  const currentModule = localStorage.getItem("currentModule");


  return (
    <>
      <Topbar />
      <main className="main_body">
        <div className="bodyright">
          <div className="row justify-content-between mb-4">
            <div className="col-auto">
              <h2 className="page_title">Archive CIT</h2>
            </div>

          </div>

          <div className="white_box_shadow_20 position-relative">
            {/* <div className="vieweditdelete">
    
  </div> */}
            <div className="table-responsive medium-mobile-responsive">
              {currentModule && JSON.parse(currentModule).can_view == true && (
                <div className="dataTableFilter">
                  <DataTable
                    value={cit}
                    paginator
                    loading={isCitLoading}
                    className="dataTableFilter-customers"
                    showGridlines
                    rows={10}
                    selection={selectedRow}
                    onSelectionChange={(e) => onSelectRow(e.value)}
                    dataKey="_id"
                    filters={filters1}
                    filterDisplay="menu"
                    //loading={loading1}
                    responsiveLayout="scroll"
                    globalFilterFields={[
                      "createdAt",
                      "next_assesment_date",
                      "status",
                    ]}
                    header={header1}
                    emptyMessage="No records found."
                  >
                    <Column selectionMode="single" />
                    <Column
                      header="CIT DATE"
                      filterField="createdAt"
                      style={{ minWidth: "12rem" }}
                      dataType="date"
                      // filter
                      body={getBodyOfColumn}
                      filterPlaceholder="Search by cit date"
                    // filterClear={filterClearTemplate}
                    // filterApply={filterApplyTemplate}
                    // filterFooter={filterFooterTemplate}
                    />
                    <Column
                      header="WELL BEING SCORE"
                      filterField="overall_score"
                      style={{ minWidth: "14rem" }}
                      body={getBodyOfColumn}
                      filter
                    />
                    <Column
                      header="NEXT ASSESSMENT"
                      filterField="next_assesment_date"
                      dataType="date"
                      filterMenuStyle={{ width: "14rem" }}
                      style={{ minWidth: "14rem" }}
                      body={getBodyOfColumn}
                      // filter
                    //filterElement={representativeFilterTemplate}
                    />
                    <Column
                      header="STATUS"
                      filterField="status"
                      style={{ minWidth: "14rem" }}
                      body={getBodyOfColumn}
                      filter
                    //filterElement={dateFilterTemplate}
                    />
                    <Column
                      header="APPROVED"
                      filterField="approval"
                      style={{ minWidth: "14rem" }}
                      body={getBodyOfColumn}
                      filter
                    />
                  </DataTable>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

    </>
  );
};

export default SurvivorCIT;
