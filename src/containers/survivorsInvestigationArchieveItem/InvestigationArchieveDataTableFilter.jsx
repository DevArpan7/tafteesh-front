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

const InvestigationDataTable = (props) => {
  const [customers1, setCustomers1] = useState([]);
  const [filters1, setFilters1] = useState(null);
  const { investigationList,onSelectRow,isLoading } = props;

  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [globalFilterValue2, setGlobalFilterValue2] = useState("");
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [selectedProduct5, setSelectedProduct5] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [representatives, setrepresentatives] = useState([]);
  //   const representatives = [
  // { name: "Amy Elsner", image: "amyelsner.png" },
  // { name: "Anna Fali", image: "annafali.png" },
  // { name: "Asiya Javayant", image: "asiyajavayant.png" },
  // { name: "Bernardo Dominic", image: "bernardodominic.png" },
  // { name: "Elwin Sharvill", image: "elwinsharvill.png" },
  // { name: "Ioni Bowcher", image: "ionibowcher.png" },
  // { name: "Ivan Magalhaes", image: "ivanmagalhaes.png" },
  // { name: "Onyama Limba", image: "onyamalimba.png" },
  // { name: "Stephen Shaw", image: "stephenshaw.png" },
  // { name: "XuXue Feng", image: "xuxuefeng.png" },
  //   ];

  useEffect(() => {
    //console.log(props, "props");
    let obj = {};
    let arr = [];
    investigationList &&
      investigationList.length > 0 &&
      investigationList.map((item) => {
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
    investigationList && investigationList.length > 0 && investigationList;

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
    //console.log(value,"value");
    let _filters1 = { ...filters1 };
    
    _filters1["global"].value = value;
    //console.log( _filters1," _filters1");
    setFilters1(_filters1);
    setGlobalFilterValue1(value);
  };

  //console.log(filters1,"filters1");
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
      source: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      investigation_agency_type: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      investigation_agency_name: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      rank_of_inv_officer: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      status_of_investigation: {
        operator: FilterOperator.OR,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      }
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
       
        <span className="image-text">{rowData.source &&rowData.source.toUpperCase()}</span>
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
        {/* <img
          alt={representative.name}
          src={`showcase/demo/images/avatar/${representative.image}`}
          onError={(e) =>
            (e.target.src =
              "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
          }
          width={32}
          style={{ verticalAlign: "middle" }}
        /> */}
        <span className="image-text">{rowData.investigation_agency_type && rowData.investigation_agency_type}</span>
      </React.Fragment>
    );
  };

  const representativeFilterTemplate = (options) => {
    //console.log(options, "options");
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
      //console.log(option,"option")
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
    // return formatDate(rowData.name_of_agency);
    return (
      <span className={`customer-badge status-${rowData.investigation_agency_name && rowData.investigation_agency_name}`}>
        {rowData.investigation_agency_name && rowData.investigation_agency_name}
      </span>
    );
  };

  const dgenderBodyTemplate = (rowData) => {
    return (
      <span className={`customer-badge status-${rowData.rank_of_inv_officer}`}>
        {rowData.rank_of_inv_officer}
      </span>
    );
  };

  const phoneBodyTemplate = (rowData) => {
    return (
      <span className={`customer-badge status-${rowData.status_of_investigation}`}>
        {rowData.status_of_investigation}
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

  const onSelectRowFunc=(value)=>{
    setSelectedProduct5(value);
    onSelectRow(value)

  }

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
            "investigation_agency_type",
            "investigation_agency_name",
            "rank_of_inv_officer",
            "status_of_investigation",
          ]}
          header={header1}
          emptyMessage="No Data found."
        >
          <Column selectionMode="single" />
          <Column
            header="Location"
            filterField="source"
            style={{ minWidth: "14rem" }}
            body={survivorIdBodyTemplate}
            filter
            filterPlaceholder="Search by location"
          />
          <Column
            header={<>Type of <label>Investigation Agency</label></>}
            filterField="investigation_agency_type"
            showFilterMatchModes={false}
            filterMenuStyle={{ width: "16rem" }}
            style={{ minWidth: "16rem" }}
            body={survivorNameBodyTemplate}
            filter
            filterPlaceholder="Search by Agency Type"
          />
          <Column
            header="Investigation agency"
            filterField="investigation_agency_name"
            // dataType="date"
            style={{ minWidth: "16rem" }}
            body={dateOfTraffickingBodyTemplate}
            filter
            filterPlaceholder="Search by Agency"
          />
          <Column
            header={<>Rank of the <label>investigating officer</label></>}
            filterField="rank_of_inv_officer"
            style={{ minWidth: "16rem" }}
            body={dgenderBodyTemplate}
            filter
            filterPlaceholder="Search by Officer"
          />
          <Column
            header={<>Status of <label>investigation</label></>}
            filterField="status_of_investigation"
            style={{ minWidth: "10rem" }}
            body={phoneBodyTemplate}
            filter
            filterPlaceholder="Search by Status"
          />
         
        </DataTable>
    </div>
  );
};

export default InvestigationDataTable;