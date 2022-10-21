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

const DataTableVcFilter = (props) => {
  const [customers1, setCustomers1] = useState([]);
  const [filters1, setFilters1] = useState(null);
  const { survivalVcList, onSelectRow, survivorName,isLoading ,selectedProduct5} = props;

  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [globalFilterValue2, setGlobalFilterValue2] = useState("");
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  // const [selectedProduct5, setSelectedProduct5] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [representatives, setrepresentatives] = useState([]);

  useEffect(() => {
    // ////console.log(props, "props");
    let obj = {};
    let arr = [];
    survivalVcList &&
      survivalVcList.length > 0 &&
      survivalVcList.map((item) => {
        // ////console.log(item, "itemitemitem");
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
    survivalVcList && survivalVcList.length > 0 && survivalVcList;

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
    ////console.log(value, "value");
    let _filters1 = { ...filters1 };

    _filters1["global"].value = value;
    ////console.log(_filters1, " _filters1");
    setFilters1(_filters1);
    setGlobalFilterValue1(value);
  };

  ////console.log(filters1, "filters1");
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
      unique_id: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      survivor_name: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      source: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      applied_vc_date: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      },
      status: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      applied_at_vc: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      amount_awarded: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      amount_received_in_bank_date_Vc: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      },
      totalEscalation_vc: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      lawyer_name: {
        operator: FilterOperator.AND,
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

  const survivorNameBodyTemplate = (rowData) => {
    // const representative = rowData.representative;
    return (
      <React.Fragment>
       
        <span className="image-text">{rowData.source.toUpperCase()}</span>
      </React.Fragment>
    );
  };

  const surviovorDataShow = (rowData) => {
    // const representative = rowData.representative;
    return (
      <React.Fragment>
       
        <span className="image-text">{rowData.survivor_name && rowData.survivor_name}</span>
      </React.Fragment>
    );
  };

  
  const representativeFilterTemplate = (options) => {
    ////console.log(options, "options");
    return (
      <MultiSelect
        value={options.value}
        options={representatives}
        itemTemplate={representativesItemTemplate}
        onChange={(e) => options.filterCallback(e.value)}
        optionLabel="survivor_name"
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

  const dateOfTraffickingBodyTemplate = (rowData) => {
    return (rowData.applied_vc_date);
  };

  const dgenderBodyTemplate = (rowData) => {
    return (
      <span className={`customer-badge status-${rowData.applied_at_vc}`}>
        {rowData.applied_at_vc}
      </span>
    );
  };

  const phoneBodyTemplate = (rowData) => {
    return (
      <span className={`customer-badge status-${rowData.status && rowData.status}`}>
        {rowData.status && rowData.status}
      </span>
    );
  };

const survivorIDBodyTemplate =(rowData)=>{
  return (
    <span className={`customer-badge status-${rowData.unique_id}`}>
      {rowData.unique_id}
    </span>
  );
}

  const amountRecBodyTemplate = (rowData) => {
    return (rowData.amount_received_in_bank_date_Vc);
    // return (
    //   <span className={`customer-badge status-${rowData.amount_received_in_bank_date}`}>
    //     {rowData.amount_received_in_bank_date}
    //   </span>
    // );
  };

  const lawyerRecBodyTemplate =(rowData)=>{
  return (
      <span className={`customer-badge status-${rowData.lawyer_name && rowData.lawyer_name}`}>
        {rowData.lawyer_name && rowData.lawyer_name}
      </span>
    );
  }
  
  const countRecBodyTemplate =(rowData)=>{
    return (
        <span className={`customer-badge status-${rowData.totalEscalation_vc && rowData.totalEscalation_vc}`}>
          {rowData.totalEscalation_vc && rowData.totalEscalation_vc}
        </span>
      );
    }
  
    const numberFormat = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(value);

  const amountAwardeBodyTemplate = (rowData) => {
    return (
      <span className={`customer-badge status-${rowData.amount_awarded && numberFormat(rowData.amount_awarded)}`}>
        {rowData.amount_awarded &&  numberFormat(rowData.amount_awarded)}
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
    <Calendar
    value={options.value}
    onChange={(e) => options.filterCallback(e.value, options.index)}
    dateFormat="mm/dd/yy"
    placeholder="mm/dd/yyyy"
    mask="99/99/9999"
  />
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

  ////console.log(selectedProduct5, "selectedProduct5");

  // const onSelectRowFunc = (value) => {
  //   setSelectedProduct5(value);
  //   onSelectRow(value);
  // };

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
          onSelectionChange={(e) => onSelectRow(e.value)}
          dataKey="_id"
          filters={filters1}
          filterDisplay="menu"
          loading={isLoading}
          responsiveLayout="scroll"
          globalFilterFields={[
            "unique_id",
            "survivor_name",
            "source",
            "applied_vc_date",
            "applied_at_vc",
            "status",
            "amount_awarded",
            "amount_received_in_bank_date_Vc",
            "totalEscalation_vc",
            "lawyer_name"

          ]}
          header={header1}
          emptyMessage="No Survivor VC found."
        >
          <Column selectionMode="single" />
          <Column
            header="Id"
            filterField="unique_id"
            style={{ minWidth: "12rem" }}
            body={survivorIDBodyTemplate}
            filter
            filterPlaceholder="Search by survivor"
          />
          <Column
            header="Survivor"
            filterField="survivor_name"
            style={{ minWidth: "14rem" }}
            body={surviovorDataShow}
            filter
            filterPlaceholder="Search by survivor Name"
          />
          
          <Column
            header="Source"
            filterField="source"
            showFilterMatchModes={false}
            filterMenuStyle={{ width: "14rem" }}
            style={{ minWidth: "14rem" }}
            body={survivorNameBodyTemplate}
            filter
            filterPlaceholder="Search by Source"
          />
          <Column
            header="Applied Date"
            filterField="applied_vc_date"
            dataType="date"
            style={{ minWidth: "10rem" }}
            body={dateOfTraffickingBodyTemplate}
            // filter
            filterElement={dateFilterTemplate}
            filterPlaceholder="Search by Date"
          />
          <Column
            header="Applied At"
            // dataType="date"
            filterField="applied_at_vc"
            style={{ minWidth: "10rem" }}
            body={dgenderBodyTemplate}
            filter
            filterPlaceholder="Search by Applied"
          />
          <Column
            header="VC Status"
            filterField="status"
            style={{ minWidth: "12rem" }}
            body={phoneBodyTemplate}
            filter
            filterPlaceholder="Search by Status"
          />
          <Column
            header="First Awarded"
            filterField="amount_awarded"
            style={{ minWidth: "14rem" }}
            body={amountAwardeBodyTemplate}
            filter
            filterPlaceholder="Search by Awared"
          />
          <Column
            header="First Awarded Date"
            dataType="date"
            filterField="amount_received_in_bank_date_Vc"
            style={{ minWidth: "14rem" }}
            filterPlaceholder="Search by amount recieved date"
            body={amountRecBodyTemplate}
            // filter
            filterElement={dateFilterTemplate}
          />
           <Column
            header="Escalation Count"
            // dataType="date"
            filterField="totalEscalation_vc"
            style={{ minWidth: "14rem" }}
            body={countRecBodyTemplate}
            filter
            filterPlaceholder="Search by escalation count"
          />
            <Column
            header="Lawyer"
            // dataType="date"
            filterField="lawyer_name"
            style={{ minWidth: "12rem" }}
            body={lawyerRecBodyTemplate}
            filter
            filterPlaceholder="Search by Lawyer"
          />
          
        </DataTable>
      </div>
  );
};

export default DataTableVcFilter;