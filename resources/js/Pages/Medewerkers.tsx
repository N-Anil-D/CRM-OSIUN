import React, {useState, useEffect} from 'react';
import {PageProps, User} from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {BuildingProps, CustomerProps, RouteAuths, MedewerkerDataProps, clientsContactPerson} from "@/types/globalProps";
import {Head, Link} from "@inertiajs/react";
import {SidebarDataProps} from "@/Layouts/Sidebar";
import {classNames} from 'primereact/utils';
import {FilterMatchMode, FilterOperator} from 'primereact/api';
import {DataTable, DataTableFilterMeta} from 'primereact/datatable';
import {Column, ColumnFilterElementTemplateOptions} from 'primereact/column';
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import {MultiSelect, MultiSelectChangeEvent} from "primereact/multiselect";
import "primereact/resources/themes/nano/theme.css";
import {InputIcon} from "primereact/inputicon";
import {IconField} from "primereact/iconfield";
import {Dropdown, DropdownChangeEvent} from "primereact/dropdown";
import {Tag} from "primereact/tag";
import {TriStateCheckbox, TriStateCheckboxChangeEvent} from "primereact/tristatecheckbox";
import {AddMedewerker} from '@/Layouts/MedewerkerModal';
import {SelectItemOptionsType} from "primereact/selectitem";
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
import {medewerkersColumnsCreator} from "@/Components/Columns";

interface MedewekersProps extends PageProps {
    medewerkers: MedewerkerDataProps[];
}

export default function Medewekers({auth, medewerkers}: MedewekersProps) {
    const [isSidebarExpanded, setSidebarExpanded] = useState<boolean>(false);
    const [pageAuth, setPageAuth] = useState<RouteAuths | undefined>();
    const [showUserEdit, setShowUserEdit] = useState<boolean>(false);
    const [editableUser, setEditableUser] = useState<MedewerkerDataProps | undefined>();
    const [showBannUser, setShowBannUser] = useState<boolean>(false);
    const [domMedewerkers, setDomMedewerkers] = useState<MedewerkerDataProps[]>();
    const [loading, setLoading] = useState<boolean>(true);
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: {value: null, matchMode: FilterMatchMode.CONTAINS},
        Naam: {value: null, matchMode: FilterMatchMode.STARTS_WITH},
        Emailadres: {value: null, matchMode: FilterMatchMode.STARTS_WITH},
        Personeelsnummer: {value: null, matchMode: FilterMatchMode.STARTS_WITH},
        Geboortedatum: {value: null, matchMode: FilterMatchMode.DATE_IS},
        Geslacht: {value: null, matchMode: FilterMatchMode.EQUALS},
        status: {value: null, matchMode: FilterMatchMode.EQUALS},
    });
    const [statuses] = useState<string[]>(['Active', 'Passive']);
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const [filterForNaams, setFilterForNaams] = useState<any[]>(medewerkers.map(x => ({
        value: x.id,
        label: x.first_name
    })));
    const defaultFilters: DataTableFilterMeta = {
        global: {value: null, matchMode: FilterMatchMode.CONTAINS},
        Naam: {
            operator: FilterOperator.AND,
            constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}],
        },
        Emailadres: {
            operator: FilterOperator.AND,
            constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}],
        },
        Personeelsnummer: {value: null, matchMode: FilterMatchMode.STARTS_WITH},
        Geboortedatum: {
            operator: FilterOperator.AND,
            constraints: [{value: null, matchMode: FilterMatchMode.DATE_IS}],
        },
        Geslacht: {
            operator: FilterOperator.AND,
            constraints: [{value: null, matchMode: FilterMatchMode.EQUALS}],
        },
        status: {
            operator: FilterOperator.OR,
            constraints: [{value: null, matchMode: FilterMatchMode.EQUALS}],
        },
    };
    useEffect(() => {
        if (medewerkers && medewerkers.length > 0) {
            setDomMedewerkers(medewerkers);
            setLoading(false);
            if (domMedewerkers)
                setFilterForNaams(domMedewerkers.map(x => ({value: x.id, label: x.first_name})))
        }
    }, [medewerkers]);
    const addMedewerkerPersonOnHide = (e: MedewerkerDataProps, isEdit: boolean) => {
        if (e.id != 0 && !isEdit) {
            setDomMedewerkers(prevState => {
                if (!prevState) return [e];
                return [...prevState, e];
            });
        } else if (e.id != 0 && isEdit && domMedewerkers) {
            let data = domMedewerkers.map(persona => {
                if (persona.id == e.id) {
                    return {...persona, ...e};
                }
                return persona;
            })
            setDomMedewerkers(data);
        }
        setShowUserEdit(false);
    }
    const roles = [
        {value: 'Client', label: 'Klant'},
        {value: 'personel', label: 'Medewerker'},
        {value: 'forman', label: 'Voorwerker'},
        {value: 'projectleider', label: 'Projectleider'},
        {value: 'admin', label: 'Admin'},]
    const sidebaritems: SidebarDataProps[] = [
        {
            tittle: 'Medewerkers',
            showAsTab: true,
            separateRoute: true,
            menu: [
                {
                    menuValue: 'Algemeen',
                    hasSubRoute: false,
                    showSubRoute: false,
                    hasNav: true,
                    NavDb: "#main",
                    route: "#",
                    icon: "la la-ticket",
                    subMenus: [],
                },
                {
                    menuValue: 'User',
                    hasSubRoute: false,
                    showSubRoute: false,
                    hasNav: true,
                    NavDb: "#tickets",
                    route: "#",
                    icon: "la la-ticket",
                    subMenus: [],
                },
                {
                    menuValue: 'Mailing',
                    hasSubRoute: false,
                    showSubRoute: false,
                    hasNav: true,
                    NavDb: "#notes",
                    route: "#",
                    icon: "la la-file",
                    subMenus: [],
                },
            ],
        }
    ];
    const handleTabClick = () => {

    }
    const notificationDataHandler = () => {

    }
    const onRowSelect = (e: any) => {
        const selectedId = e.data.id;
        // Yönlendirme işlemi
        window.location.href = `/medewerker/${selectedId}`;
    };
    const handleMedewerkerUpdateClick = (personID: number) => {
        if (domMedewerkers) {
            let data = domMedewerkers.find(x => x.id == personID);
            if (data)
                setEditableUser(data);
            setShowUserEdit(true);
        }
    }
    const handleMedewerkerDeleteClick = (id: number) => {
        const chosenUser = medewerkers.find(z => z.id === id)
        setEditableUser(chosenUser);
        setShowBannUser(true);
    };
    const [medewerkersTableColumns, setMedewerkersTableColumns] = useState(medewerkersColumnsCreator(handleMedewerkerDeleteClick, handleMedewerkerUpdateClick));
    return (
        <AuthenticatedLayout user={auth.user}
                             header={<h2
                                 className="font-semibold text-sm text-gray-800 dark:text-gray-200 leading-tight flex justify-center items-center h-auto">Osius
                                 CRM Panel</h2>}
                             collectNotification={false}
                             notificationDataHandler={notificationDataHandler} isSidebarExpanded={isSidebarExpanded}
                             setSidebarExpanded={setSidebarExpanded}
                             isTicketTableActive={false}
                             isMessageTableActive={false}
                             SidebarData={[]} handleTabClick={handleTabClick}

        >
            <Head title="Medewerkers"/>
            <div className="page-wrapper">
                <div className={'content container-fluid'}>
                    <div className="view-header">
                        <h4>Medewerkers</h4>
                        <ul>
                            <li>
                                <a className="btn btn-purple text-white" onClick={() => {
                                    setEditableUser(undefined);
                                    setShowUserEdit(true);
                                }}><i
                                    className="las la-plus-circle me-1"
                                />Medewerkers</a>
                            </li>
                        </ul>
                    </div>
                    <div className="calls-activity">
                        <div className="card contact-sidebar">
                            <div className="row">
                                <div className="col-12">
                                    <div className="card">
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="ag-theme-quartz ag-theme-mycustomtheme">
                                                    <AgGridReact<MedewerkerDataProps>
                                                        columnDefs={medewerkersTableColumns}
                                                        rowData={domMedewerkers}
                                                        pagination={false}
                                                        domLayout='autoHeight'
                                                        onGridReady={(params) => params.api.sizeColumnsToFit()}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AddMedewerker onHide={addMedewerkerPersonOnHide} showModel={showUserEdit} setShowModel={setShowUserEdit}
                           editPerson={editableUser}/>
        </AuthenticatedLayout>
    )
}
