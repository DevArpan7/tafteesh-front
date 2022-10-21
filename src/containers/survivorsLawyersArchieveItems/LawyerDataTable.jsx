import React, { useState, useEffect } from "react";
import { classNames } from "primereact/utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { ProgressBar } from "primereact/progressbar";
import { Calendar } from "primereact/calendar";
import { MultiSelect } from "primereact/multiselect";
import { Slider } from "primereact/slider";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
// import { CustomerService } from '../service/CustomerService';
// import './DataTableDemo.css';
import moment from "moment";

const LawyerDataTable = (props) => {
  const [customers1, setCustomers1] = useState([]);
  const [filters1, setFilters1] = useState(null);
  const { survivorLawyersList, onSelectRow,isLoading } = props;

  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [globalFilterValue2, setGlobalFilterValue2] = useState("");
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [selectedProduct5, setSelectedProduct5] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [representatives, setrepresentatives] = useState([]);

  useEffect(() => {
    ////console.log(props, "props");
    let obj = {};
    let arr = [];
    survivorLawyersList &&
      survivorLawyersList.length > 0 &&
      survivorLawyersList.map((item) => {
        ////console.log(item, "itemitemitem");
        return (
          (obj = { survivor_name: item.survivor_name, image: "amyelsner.png" }),
          arr.push(obj)
          ////console.log(representatives, obj, "representatives")
        );
      });
    setrepresentatives(arr);
  }, [props]);
  // const statuses = [
  //     'unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal'
  // ];

  const customerService =
    survivorLawyersList && survivorLawyersList.length > 0 && survivorLawyersList;

  ////console.log(customerService, "customer servicessssss");

  useEffect(() => {
    setCustomers1(customerService);
    setLoading1(false);
    initFilters1();
  }, [customerService]);

  useEffect(() => {
    ////console.log(representatives, "representatives");
  }, [representatives]);

  const getCustomers = (data) => {
    return [...(data || [])].map((d) => {
      d.date = new Date(d.date);
      return d;
    });
  };

  const formatDate = (value) => {
    ////console.log(value, "value");
    // return value.toLocaleDateString('en-US', {
    //     day: '2-digit',
    //     month: '2-digit',
    //     year: 'numeric',
    // });
    return moment(value).format("DD-MMM-YYYY");
  };

  
  const clearFilter1 = () => {
    initFilters1();
  };

  const onGlobalFilterChange1 = (e) => {
    const value = e.target.value;
    ////console.log(value, "value");
    let _filters1 = { ...filters1 };

    _filters1["global"].value = value;
    ////console.log(_filters1, " _filters1");
    setFilters1(_filters1);
    setGlobalFilterValue1(value);
  };

  ////console.log(filters1, "filters1");

  const initFilters1 = () => {
    setFilters1({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      source: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      lawyer_name: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      fromDate: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      },
      toDate: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      },
      lawyer_type: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      isleading_data: {
        operator: FilterOperator.OR,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      leading_at: {
        operator: FilterOperator.OR,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
    });
    setGlobalFilterValue1("");
  };

  const renderHeader1 = () => {
    return (
      <div className="p-d-flex p-jc-between">
        <Button
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

  const filterClearTemplate = (options) => {
    return (
      <Button
        type="button"
        icon="pi pi-times"
        onClick={options.filterClearCallback}
        className="p-button-secondary"
      ></Button>
    );
  };

  const filterApplyTemplate = (options) => {
    return (
      <Button
        type="button"
        icon="pi pi-check"
        onClick={options.filterApplyCallback}
        className="p-button-success"
      ></Button>
    );
  };

  const filterFooterTemplate = () => {
    return (
      <div className="p-px-3 p-pt-0 p-pb-3 p-text-center p-text-bold">
        {/* Customized Buttons */}
      </div>
    );
  };

  const received_onBodyTemplate = (rowData) => {
    return (rowData.toDate);
 
  };

  const representativeFilterTemplate = (options) => {
    ////console.log(options, "options");
    return (
      <MultiSelect
        value={options.value}
        options={representatives}
        itemTemplate={representativesItemTemplate}
        onChange={(e) => options.filterCallback(e.value)}
        optionLabel="source"
        placeholder="Any"
        className="p-column-filter"
      />
    );
  };

  const representativesItemTemplate = (option) => {
    ////console.log(option, "option");
    return (
      <div className="p-multiselect-representative-option">
        <img
          alt={option.survivor_name}
          src={`showcase/demo/images/avatar/${option.image}`}
          onError={(e) =>
            (e.target.src =
              "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
          }
          width={32}
          style={{ verticalAlign: "middle" }}
        />
        <span className="image-text">{option.survivor_name}</span>
      </div>
    );
  };

  const tenureBodyTemplate = (rowData) => {
    return (
      <span className={`customer-badge status-${rowData.leading_at && rowData.leading_at.toUpperCase()}`}>
        {rowData.leading_at && rowData.leading_at.toUpperCase()}
      </span>
    );
  };
  
  const purposeBodyTemplate = (rowData) => {
    return (
      <span className={`customer-badge status-${rowData.isleading_data}`}>
        {rowData.isleading_data}
      </span>
    );
  };

  

  const repayment_per_monthBodyTemplate = (rowData) => {
    return (rowData.fromDate);
  };


  const amountBodyTemplate = (rowData) => {
    return (
      <span className={`customer-badge status-${rowData.lawyer_name && rowData.lawyer_name}`}>
        {rowData.lawyer_name && rowData.lawyer_name}
      </span>
    );
  };

  

  const rateBodyTemplate = (rowData) => {
    return (
      <span className={`customer-badge status-${rowData.lawyer_type && rowData.lawyer_type}`}>
        {rowData.lawyer_type && rowData.lawyer_type}
      </span>
    );
  };
  

  const whereBodyTemplate = (rowData) => {
    return (
      <span className={`customer-badge status-${rowData.source && rowData.source.toUpperCase()}`}>
        {rowData.source && rowData.source.toUpperCase()}
      </span>
    );
  };
  
  const updatedAtBodyTemplate = (rowData) => {
    return formatDate(rowData.updatedAt);
  };

  const dateFilterTemplate = (options) => {
    return (
      <Calendar
        value={options.value}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        dateFormat="mm/dd/yy"
        placeholder="mm/dd/yyyy"
        mask="99/99/9999"
      />
    );
  };

  const balanceFilterTemplate = (options) => {
    return (
      <InputNumber
        value={options.value}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        mode="currency"
        currency="USD"
        locale="en-US"
      />
    );
  };

  const header1 = renderHeader1();
  // const header2 = renderHeader2();

  ////console.log(selectedProduct5, "selectedProduct5");

  const onSelectRowFunc = (value) => {
    setSelectedProduct5(value);
    onSelectRow(value);
  };

  return (
    <div className="dataTableFilter">
    
        {/* <h5>Filter Menu</h5>
                <p>Filters are displayed in an overlay.</p> */}
        <DataTable
          value={customers1}
          paginator
          className="dataTableFilter-customers"
          showGridlines
          rows={10}
          selection={selectedProduct5}
          onSelectionChange={(e) => onSelectRowFunc(e.value)}
          dataKey="_id"
          filters={filters1}
          filterDisplay="menu"
          loading={isLoading}
          responsiveLayout="scroll"
          globalFilterFields={[
            "source",
            "lawyer_name",
            "lawyer_type",
            "isleading_data",
            "leading_at",
            "fromDate",
            "toDate",
            // "updatedBy"
          ]}
          header={header1}
          emptyMessage="No Data found."
        >
          <Column selectionMode="single" />

          <Column
            header="source"
            filterField="source"
            // dataType="date"
            showFilterMatchModes={false}
            filterMenuStyle={{ width: "14rem" }}
            style={{ minWidth: "14rem" }}
            body={whereBodyTemplate}
            filter
            //filterElement={representativeFilterTemplate}
          />
          <Column
            header="Name"
            filterField="lawyer_name"
            // dataType="date"
            style={{ minWidth: "10rem" }}
            body={amountBodyTemplate}
            filter
            //filterElement={dateFilterTemplate}
          />
          <Column
            header="Type"
            filterField="lawyer_type"
            style={{ minWidth: "10rem" }}
            body={rateBodyTemplate}
            filter
            //filterElement={dateFilterTemplate}
          />
          <Column
            header="Isleading"
            // dataType="date"
            filterField="isleading_data"
            style={{ minWidth: "10rem" }}
            body={purposeBodyTemplate}
            filter
            //filterElement={balanceFilterTemplate}
          />
          <Column
            header="Leading At"
            filterField="leading_at"
            // dataType="date"
            style={{ minWidth: "10rem" }}
            body={tenureBodyTemplate}
            filter
            //filterElement={dateFilterTemplate}
          />
            <Column
            header="From date"
            filterField="fromDate"
            dataType="date"
            style={{ minWidth: "10rem" }}
            body={repayment_per_monthBodyTemplate}
            // filter
            filterElement={dateFilterTemplate}
          />
            <Column
            header="To date"
            filterField="toDate"
            dataType="date"
            style={{ minWidth: "10rem" }}
            body={received_onBodyTemplate}
            // filter
            filterElement={dateFilterTemplate}
          />
            
        </DataTable>
    </div>
  );
};

export default LawyerDataTable;