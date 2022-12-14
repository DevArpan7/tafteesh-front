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

const FirDataTable = (props) => {
  const [customers1, setCustomers1] = useState([]);
  const [filters1, setFilters1] = useState(null);
  const { firList, onSelectRow,isLoading } = props;

  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [globalFilterValue2, setGlobalFilterValue2] = useState("");
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [selectedProduct5, setSelectedProduct5] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [representatives, setrepresentatives] = useState([]);

  useEffect(() => {
    //console.log(props, "props");
    let obj = {};
    let arr = [];
    firList &&
      firList.length > 0 &&
      firList.map((item) => {
        //console.log(item, "itemitemitem");
        return (
          (obj = { survivor_name: item.survivor_name, image: "amyelsner.png" }),
          arr.push(obj)
          //console.log(representatives, obj, "representatives")
        );
      });
    setrepresentatives(arr);
  }, [props]);
  // const statuses = [
  //     'unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal'
  // ];

  const customerService =
    firList && firList.length > 0 && firList;

  //console.log(customerService, "customer servicessssss");

  useEffect(() => {
    setCustomers1(customerService);
    setLoading1(false);
    initFilters1();
  }, [customerService]);

  useEffect(() => {
    //console.log(representatives, "representatives");
  }, [representatives]);

  const getCustomers = (data) => {
    return [...(data || [])].map((d) => {
      d.date = new Date(d.date);
      return d;
    });
  };

  const formatDate = (value) => {
    //console.log(value, "value");
    // return value.toLocaleDateString('en-US', {
    //     day: '2-digit',
    //     month: '2-digit',
    //     year: 'numeric',
    // });
    return moment(value).format("DD-MMM-YYYY");
  };

  //   const formatCurrency = (value) => {
  //     return value.toLocaleString("en-US", {
  //       style: "currency",
  //       currency: "USD",
  //     });
  //   };

  const clearFilter1 = () => {
    initFilters1();
  };

  const onGlobalFilterChange1 = (e) => {
    const value = e.target.value;
    //console.log(value, "value");
    let _filters1 = { ...filters1 };

    _filters1["global"].value = value;
    //console.log(_filters1, " _filters1");
    setFilters1(_filters1);
    setGlobalFilterValue1(value);
  };

  //console.log(filters1, "filters1");
  // const onGlobalFilterChange2 = (e) => {
  //     const value = e.target.value;
  //     let _filters2 = { ...filters2 };
  //     _filters2['global'].value = value;

  //     setFilters2(_filters2);
  //     setGlobalFilterValue2(value);
  // }

  const initFilters1 = () => {
    setFilters1({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      location: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      policeStation_name: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      fir_date: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      },
      relation_with_defacto_complainer: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      fir_number: {
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

  // const renderHeader2 = () => {
  //     return (
  //         <div className="p-d-flex p-jc-end">
  //             <span className="p-input-icon-left">
  //                 <i className="pi pi-search" />
  //                 <InputText value={globalFilterValue2} onChange={onGlobalFilterChange2} placeholder="Keyword Search" />
  //             </span>
  //         </div>
  //     )
  // }

  const survivorIdBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        {/* <img
          alt="flag"
          src="showcase/demo/images/flag_placeholder.png"
          onError={(e) =>
            (e.target.src =
              "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
          }
          className={`flag flag-${rowData.country.code}`}
          width={30}
        /> */}
        <span className="image-text">{rowData.survivor_id}</span>
      </React.Fragment>
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

  const firDateBodyTemplate = (rowData) => {
    return (rowData.fir_date);
    
  };

  const representativeFilterTemplate = (options) => {
    //console.log(options, "options");
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

  const representativesItemTemplate = (option) => {
    //console.log(option, "option");
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

  const relationWithBodyTemplate = (rowData) => {
    return (
      <span className={`customer-badge status-${rowData.relation_with_defacto_complainer}`}>
        {rowData.relation_with_defacto_complainer}
      </span>
    );
  };

  const policeStationBodyTemplate = (rowData) => {
    // return formatDate(rowData.rescue_from_city);
    return (
      <span className={`customer-badge status-${rowData.policeStation_name && rowData.policeStation_name}`}>
        {rowData.policeStation_name && rowData.policeStation_name}
      </span>
    );
  };

  const firNumberBodyTemplate = (rowData) => {
    // return formatDate(rowData.received_on);
    
    return (
      <span className={`customer-badge status-${rowData.fir_number}`}>
        {rowData.fir_number}
      </span>
    );
  };

  const amountBodyTemplate = (rowData) => {
    return (
      <span className={`customer-badge status-${rowData.location && rowData.location.toUpperCase()}`}>
        {rowData.location && rowData.location.toUpperCase()}
      </span>
    );
  };

  

  const installmentBodyTemplate = (rowData) => {
    return (
      <span className={`customer-badge status-${rowData.rescue_conducted_by}`}>
        {rowData.rescue_conducted_by}
      </span>
    );
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

  //   const balanceBodyTemplate = (rowData) => {
  //     return formatCurrency(rowData.balance);
  //   };

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

  const statusBodyTemplate = (rowData) => {
    return (
      <span className={`customer-badge status-${rowData.status}`}>
        {rowData.status}
      </span>
    );
  };

  // const statusFilterTemplate = (options) => {
  //     return <Dropdown value={options.value} options={statuses} onChange={(e) => options.filterCallback(e.value, options.index)} itemTemplate={statusItemTemplate} placeholder="Select a Status" className="p-column-filter" showClear />;
  // }

  const statusItemTemplate = (option) => {
    return <span className={`customer-badge status-${option}`}>{option}</span>;
  };

  const activityBodyTemplate = (rowData) => {
    return (
      <ProgressBar value={rowData.activity} showValue={false}></ProgressBar>
    );
  };

  const activityFilterTemplate = (options) => {
    return (
      <React.Fragment>
        <Slider
          value={options.value}
          onChange={(e) => options.filterCallback(e.value)}
          range
          className="p-m-3"
        ></Slider>
        <div className="p-d-flex p-ai-center p-jc-between p-px-2">
          <span>{options.value ? options.value[0] : 0}</span>
          <span>{options.value ? options.value[1] : 100}</span>
        </div>
      </React.Fragment>
    );
  };

  const verifiedBodyTemplate = (rowData) => {
    return (
      <i
        className={classNames("pi", {
          "true-icon pi-check-circle": rowData.verified,
          "false-icon pi-times-circle": !rowData.verified,
        })}
      ></i>
    );
  };

  const verifiedFilterTemplate = (options) => {
    return (
      <TriStateCheckbox
        value={options.value}
        onChange={(e) => options.filterCallback(e.value)}
      />
    );
  };

  const representativeRowFilterTemplate = (options) => {
    return (
      <MultiSelect
        value={options.value}
        options={representatives}
        itemTemplate={representativesItemTemplate}
        onChange={(e) => options.filterApplyCallback(e.value)}
        optionLabel="name"
        placeholder="Any"
        className="p-column-filter"
        maxSelectedLabels={1}
      />
    );
  };

  // const statusRowFilterTemplate = (options) => {
  //     return <Dropdown value={options.value} options={statuses} onChange={(e) => options.filterApplyCallback(e.value)} itemTemplate={statusItemTemplate} placeholder="Select a Status" className="p-column-filter" showClear />;
  // }

  const verifiedRowFilterTemplate = (options) => {
    return (
      <TriStateCheckbox
        value={options.value}
        onChange={(e) => options.filterApplyCallback(e.value)}
      />
    );
  };

  const header1 = renderHeader1();
  // const header2 = renderHeader2();

  //console.log(selectedProduct5, "selectedProduct5");

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
            "location",
            "policeStation_name",
            "relation_with_defacto_complainer",
            "fir_number",
            "fir_date"         
          ]}
          header={header1}
          emptyMessage="No Data Found."
        >
          <Column selectionMode="single" />
         
          <Column
            header="Location"
            filterField="location"
            // dataType="date"
            style={{ minWidth: "12rem" }}
            body={amountBodyTemplate}
            filter
            // filterElement={dateFilterTemplate}
          />
            <Column
            header="Police Station"
            // dataType="date"
            filterField="policeStation_name"
            style={{ minWidth: "12rem" }}
            body={policeStationBodyTemplate}
            filter
            //filterElement={balanceFilterTemplate}
          />
          <Column
            header={<>Relationship <label>With Defacto complainer at SA</label></>}
            // dataType="date"
            filterField="relation_with_defacto_complainer"
            style={{ minWidth: "12rem" }}
            body={relationWithBodyTemplate}
            filter
            //filterElement={balanceFilterTemplate}
          />
        
          <Column
            header="FIR Number"
            // dataType="date"
            filterField="fir_number"
            style={{ minWidth: "12rem" }}
            body={firNumberBodyTemplate}
            filter
            //filterElement={balanceFilterTemplate}
          />

        <Column
            header="Date of FIR"
            dataType="date"
            filterField="fir_date"
            showFilterMatchModes={false}
            filterMenuStyle={{ width: "10rem" }}
            style={{ minWidth: "10rem" }}
            body={firDateBodyTemplate}
            // filter
            filterElement={representativeFilterTemplate}
          />
         
        </DataTable>
    </div>
  );
};

export default FirDataTable;