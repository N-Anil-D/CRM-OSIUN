import React, {useEffect, useState} from 'react'
import {Table} from "antd";
import {Head, Link} from '@inertiajs/react';
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import {CompaniesModal, EditClient} from '@/Layouts/ClientsModal';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import AddNotes from '@/Layouts/ClientsAddNote';
import moment from 'moment';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {PageProps} from '@/types';
import {ColumnsType} from "antd/es/table";
import axios from "axios";
import Sidebar, {SidebarDataProps, SubMenuProps, MenuProps} from "@/Layouts/Sidebar";
import {OtherUsersProps, TicketsDataProps} from "@/types/globalProps";
import {User} from '@/types';
import {CustomerProps} from "@/types/globalProps";
import {AddTicket} from "@/Layouts/AddTicket";
import DeleteModal from "@/Layouts/DeleteModal";
import {AgGridReact} from 'ag-grid-react';
import {themeQuartz} from '@ag-grid-community/theming';
import {
    ColDef,
    ColGroupDef,
    FirstDataRenderedEvent,
    GridApi,
    GridOptions,
    GridReadyEvent,
    GridSizeChangedEvent,
    ModuleRegistry,
    createGrid,
} from "@ag-grid-community/core";
import 'ag-grid-community/styles/ag-theme-quartz.css';
import {customersColumnsCreator, medewerkersColumnsCreator} from "@/Components/Columns";

interface PagePropsWithUsers extends PageProps {
    allUsers: User[];
    customers: CustomerProps[] | null;
}

export default function Clients({auth, allUsers, customers}: PagePropsWithUsers) {
    const [clientDomData, setClientDomData] = useState<CustomerProps[]>(customers?.filter(x => x.passive <= 0) ?? [])
    const [showFilter, setShowFilter] = useState(false);
    const [fieldInputs, setFieldInputs] = useState(false);
    const [focused, setFocused] = useState(false);
    const [focusedTwo, setFocusedTwo] = useState(false);
    const [focusedThree, setFocusedThree] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [inputValueTwo, setInputValueTwo] = useState("");
    const [inputValueThree, setInputValueThree] = useState("");
    const [showFilters, setShowFilters] = useState<boolean>(true);
    const [isSidebarExpanded, setSidebarExpanded] = useState<boolean>(false);
    const [showT_Text, setShowT_Text] = useState<boolean>(true);
    const [selectedClient, setSelectedClient] = useState<CustomerProps>();
    const [showDeleteClient, setShowDeleteClient] = useState<boolean>(false)
    const [showEditClient, setShowEditClient] = useState<boolean>(false);
    const [showPassives, setShowPassives] = useState<boolean>(false);
    const [writeAuth, setWriteAuth] = useState<boolean>(false);
    const [deleteAuth, setDeleteAuth] = useState<boolean>(false);
    useEffect(() => {
        let pageAuth = auth.user.permissions.find(x => x.page_name == 'Bedrijven');
        if (pageAuth) {
            setWriteAuth(pageAuth.write);
            setDeleteAuth(pageAuth.delete);
        }
    }, [auth]);
    useEffect(() => {
        if (showPassives) {
            setClientDomData(customers ?? []);
        } else {
            setClientDomData(customers?.filter(x => x.passive <= 0) ?? [])
        }
    }, [showPassives]);
    useEffect(() => {
        if (window.innerWidth < 992) {
            setShowFilters(false);
            setShowT_Text(false);
        }
    }, [window.innerWidth]);
    const handleCustomerUpdateClick = (record: CustomerProps) => {
        setSelectedClient(record);
        setShowEditClient(true);
    }
    const handleCustomerDeleteClick = (record: CustomerProps) => {
        setSelectedClient(record);
        setShowDeleteClient(true);
    }
    const [columns, setColumns] = useState(customersColumnsCreator(handleCustomerDeleteClick, handleCustomerUpdateClick, writeAuth, deleteAuth));
    useEffect(() => {
        setColumns(customersColumnsCreator(handleCustomerDeleteClick, handleCustomerUpdateClick, writeAuth, deleteAuth));
    }, [writeAuth, deleteAuth]);
    const handleLabelClick = () => {
        setFocused(true);
    };
    const handleInputBlur = () => {
        if (inputValue === "") {
            setFocused(false);
        }
    };
    const handleInputChange = (e: any) => {
        const value = e.target.value;
        setInputValue(value);
        if (value !== "" && !focused) {
            setFocused(true);
        }
    };
    const handleLabelClickTwo = () => {
        setFocusedTwo(true);
    };
    const handleInputBlurTwo = () => {
        if (inputValueTwo === "") {
            setFocusedTwo(false);
        }
    };
    const handleInputChangeTwo = (e: any) => {
        const value = e.target.value;
        setInputValueTwo(value);
        if (value !== "" && !focusedTwo) {
            setFocusedTwo(true);
        }
    };
    const handleLabelClickThree = () => {
        setFocusedThree(true);
    };
    const handleInputBlurThree = () => {
        if (inputValueThree === "") {
            setFocusedThree(false);
        }
    };
    const handleInputChangeThree = (e: any) => {
        const value = e.target.value;
        setInputValueThree(value);
        if (value !== "" && !focusedThree) {
            setFocusedThree(true);
        }
    };
    const customStyles = {
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.isFocused ? "#ff9b44" : "#fff",
            color: state.isFocused ? "#fff" : "#000",
            "&:hover": {
                backgroundColor: "#ff9b44",
            },
        }),
    };
    const SidebarData: SidebarDataProps[] = [];
    const handleTicket = (Ticket: TicketsDataProps | null) => {

    }
    const handleTabClick = (menu: MenuProps) => {
    };
    return (
        <AuthenticatedLayout
            user={auth.user}
            collectNotification={false}
            notificationDataHandler={handleTicket}
            isSidebarExpanded={isSidebarExpanded}
            setSidebarExpanded={setSidebarExpanded}
            isTicketTableActive={false}
            isMessageTableActive={false}
            SidebarData={SidebarData}
            handleTabClick={handleTabClick}
        >
            <Head title="Bedrijven"/>
            <div className="page-wrapper">
                {/* Page Content */}
                <div className="content container-fluid">
                    {/* Page Header */}
                    <div className="page-header">
                        <div className="d-flex justify-content-between mb-3">
                            <div className="col-md-4">
                                <h3 className="page-title">Bedrijven</h3>
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link href={route('dashboard')}>Dashboard</Link>
                                    </li>
                                    <li className="breadcrumb-item active">Bedrijven</li>
                                </ul>
                            </div>
                            <div className="col-md-8 float-end ms-auto">
                                <div className="d-flex title-head">
                                    <div className="view-icons">
                                        <a className="grid-view btn btn-link" onClick={() => {
                                            window.location.reload()
                                        }}>
                                            <i className="las la-redo-alt"/></a>
                                        <a className={fieldInputs ? "list-view btn btn-link active-filter" : "list-view btn btn-link"}
                                           id="filter_search"
                                           onClick={() => setFieldInputs(fieldInputs ? false : true)}><i
                                            className="las la-filter"/></a>
                                    </div>
                                    <div className="form-sort">
                                        <a onClick={() => setShowPassives(!showPassives)}
                                           className="list-view btn btn-link text-black"><i
                                            className={showPassives ? "las la-eye-slash" : "las la-eye"}/>{showT_Text && "Show Passives"}
                                        </a>
                                    </div>
                                    {writeAuth ? (<a className="btn add-btn text-white" data-bs-toggle="modal"
                                                     data-bs-target="#add_company"><i
                                        className="la la-plus-circle"/> {"Add Client"}
                                    </a>) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* /Page Header */}
                    {/* Search Filter */}
                    <div className="filter-filelds" id="filter_inputs"
                         style={{display: fieldInputs ? "block" : "none"}}>
                        <div className="row filter-row">
                            <div className="col-xl-2">
                                <div
                                    className={
                                        focused || inputValue !== ""
                                            ? "input-block form-focus focused"
                                            : "input-block form-focus"
                                    }
                                >
                                    <input
                                        type="text"
                                        className="form-control floating"
                                        value={inputValue}
                                        onFocus={handleLabelClick}
                                        onBlur={handleInputBlur}
                                        onChange={handleInputChange}
                                    />
                                    <label className="focus-label" onClick={handleLabelClick}>
                                        Company Name
                                    </label>
                                </div>
                            </div>
                            <div className="col-xl-2">
                                <div
                                    className={
                                        focusedTwo || inputValueTwo !== ""
                                            ? "input-block form-focus focused"
                                            : "input-block form-focus"
                                    }
                                >
                                    <input
                                        type="text"
                                        className="form-control floating"
                                        value={inputValueTwo}
                                        onFocus={handleLabelClickTwo}
                                        onBlur={handleInputBlurTwo}
                                        onChange={handleInputChangeTwo}
                                    />
                                    <label className="focus-label" onClick={handleLabelClickTwo}>
                                        Email
                                    </label>
                                </div>
                            </div>
                            <div className="col-xl-2">
                                <div
                                    className={
                                        focusedThree || inputValueThree !== ""
                                            ? "input-block form-focus focused"
                                            : "input-block form-focus"
                                    }
                                >
                                    <input
                                        type="text"
                                        className="form-control floating"
                                        value={inputValueThree}
                                        onFocus={handleLabelClickThree}
                                        onBlur={handleInputBlurThree}
                                        onChange={handleInputChangeThree}
                                    />
                                    <label className="focus-label" onClick={handleLabelClickThree}>
                                        Phone Number
                                    </label>
                                </div>
                            </div>
                            <div className="col-xl-2">
                                <div className="input-block mb-3 form-focus focused">
                                    <label className="focus-label">From - To Date</label>

                                </div>
                            </div>
                            <div className="col-xl-2">
                                <a className="btn btn-success w-100"> Search </a>
                            </div>
                        </div>
                    </div>
                    <hr/>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="ag-theme-quartz ag-theme-mycustomtheme">
                                <AgGridReact<CustomerProps>
                                    columnDefs={columns}
                                    rowData={clientDomData}
                                    pagination={false}
                                    domLayout='autoHeight'
                                    onGridReady={(params) => params.api.sizeColumnsToFit()}
                                    onRowClicked={(e) => {
                                        if (e.data) route('klantdetail', {customerid: e.data.CustomerID});
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <CompaniesModal allUser={allUsers} authUser={auth.user}/>
                {writeAuth && customers && customers.length > 0 ?
                    selectedClient && (
                        <>
                            <EditClient
                                allUser={allUsers}
                                clientData={selectedClient}
                                showEditClient={showEditClient}
                                onHide={() => setShowEditClient(false)}
                                authUser={auth.user}
                            />
                            {deleteAuth ? (<DeleteModal Name={selectedClient.Unvan} type={'Client'} Id={selectedClient.id}
                                                        DeleteModelShow={showDeleteClient}
                                                        deleteOnHide={() => setShowDeleteClient(false)}/>) : null}
                        </>
                    )
                    : null}
            </div>
        </AuthenticatedLayout>
    );
}
