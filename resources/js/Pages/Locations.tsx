import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {PageProps} from '@/types';
import React, {useEffect, useState} from 'react'
import Select from 'react-select'
import {Head, Link} from '@inertiajs/react';
import {Calendar, Edit, Mail, MessageCircle, MoreVertical, Phone, PlusCircle, Star, Trash2} from 'react-feather';
import CompanyEditModal from "@/Components/CompanyEditModal";
import ReactTagInput from "@/Components/ReactTagInput";
import axios from "axios";
import moment from "moment/moment";
import {Table} from "antd";
import Sidebar, {MenuProps, SidebarDataProps} from "@/Layouts/Sidebar";
import {
    BuildingProps,
    TicketsDataProps,
    CustomerProps,
    RouteAuths
} from "@/types/globalProps";
import {AddLocation, EditLocation} from "@/Layouts/AddNewLocation";
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import {ICellRendererParams, ColDef, ValueGetterParams} from 'ag-grid-community';
import {User} from '@/types';
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

interface LocationProps extends PageProps {
    locations: BuildingProps[];

}

export default function Locations({
                                      auth,
                                      locations
                                  }: LocationProps) {
    const [clickedTicketId, setClickedTicketId] = useState<number | null>(null);
    const [openedComment, setOpenedComment] = useState<HTMLElement>();
    const [openedCommentLink, setOpenedCommentLink] = useState<HTMLElement>();
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerProps>();
    const [selectedTab, setSelectedTab] = useState<string>("rooms");
    const [selectedLocation, setSelectedLocation] = useState<BuildingProps>(locations[0]);
    const [locationsOnView, setLocationsOnView] = useState<BuildingProps[]>(locations);
    const [showLocationEdit, setShowLocationEdit] = useState<boolean>(false);
    const [writeAuth, setWriteAuth] = useState<boolean>(false);
    const [deleteAuth, setDeleteAuth] = useState<boolean>(false);

    const handleTabClick = (menu: MenuProps) => {
    };

    const handleDeleteClick = (locationID: number) => {
        setSelectedLocation(locations.find((x) => (x.id === locationID))??locations[0]);

    }
    const handleUpdateClick = (locationID: number) => {
        let sL = locations.find((x) => (x.id == locationID));
       if(sL) {
           console.log('locatie ID', locationID);
           console.log('finded Locatie', sL);
           setSelectedLocation(sL);
           setShowLocationEdit(true);
       }else alert('locatie can not find');
    }
    const locationAddedHandle = (addedLocation:BuildingProps) => {
        setLocationsOnView(prevState => ({
            ...prevState,
            addedLocation
        }))
        locations.push(addedLocation);
    }
    const locationUpdateHandle = (addedLocation:BuildingProps) => {

        const UpdatedList = locationsOnView.map(item => {
            if(item.id === addedLocation.id) {
                return {...item, ...addedLocation}
            }
            return item
        })
        setLocationsOnView(UpdatedList);
    }
    const LocationColumns: ColDef[] = [
        {
            headerName: "Locatie ID",
            valueGetter: (params: ValueGetterParams) => {
                return `${params.data.LocationID}`;
            },
            cellRenderer: (params: ICellRendererParams) => {
                const handleClick = () => {
                    localStorage.setItem("minheight", "true");
                };
                const url = `/locations/detail/${params.data.id}`;

                return (
                    <Link
                        onClick={handleClick}
                        href={url}>
                        {params.data.LocationID}
                    </Link>
                );
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Location Name",
            flex: 2,
            valueGetter: (params: ValueGetterParams) => {
                return `${params.data.BuildingName}`;
            },
            cellRenderer: (params: ICellRendererParams) => {
                const handleClick = () => {
                    localStorage.setItem("minheight", "true");
                };
                const url = `/locations/detail/${params.data.id}`;
                return (
                    <Link
                        onClick={handleClick}
                        href={url}>
                        {params.data.BuildingName}
                    </Link>
                );
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Location Address",
            flex: 2,
            valueGetter: (params: ValueGetterParams) => params.data.locationadress,
            cellRenderer: (params: ICellRendererParams) => {
                const handleClick = () => {
                    localStorage.setItem("minheight", "true");
                };
                const url = `/locations/detail/${params.data.id}`;

                return (
                    <Link
                        onClick={handleClick}
                        href={url}>
                        {params.data.locationadress}
                    </Link>
                );
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Postal Code",
            flex: 2,
            valueGetter: (params: ValueGetterParams) => params.data.postalcode,
            cellRenderer: (params: ICellRendererParams) => {
                const handleClick = () => {
                    localStorage.setItem("minheight", "true");
                };
                const url = `/locations/detail/${params.data.id}`;

                return (
                    <Link
                        onClick={handleClick}
                        href={url}>
                        {params.data.postalcode}
                    </Link>
                );
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "E-Mail",
            flex: 2,
            valueGetter: (params: ValueGetterParams) => params.data.email,
            cellRenderer: (params: ICellRendererParams) => {
                const handleClick = () => {
                    localStorage.setItem("minheight", "true");
                };
                const url = `/locations/detail/${params.data.id}`;

                return (
                    <Link
                        onClick={handleClick}
                        href={url}>
                        {params.data.email}
                    </Link>
                );
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Status",
            flex: 1,
            valueGetter: (params: ValueGetterParams) => params.data.passive ? "Pasive" : "Active",
            cellRenderer: (params: ICellRendererParams) => (
                <div className="dropdown action-label">
                    <span className={params.data.passive ? "btn btn-white btn-sm badge-outline-danger status-color-dg" :
                        "btn btn-white btn-sm badge-outline-success status-color"}>
                        {params.data.passive ? "Pasive" : "Active"}
                    </span>
                </div>
            ),
            filter: true, floatingFilter: true
        },
        {
            headerName: "Created Date",
            flex: 2,
            valueGetter: (params: ValueGetterParams) => moment(params.data.created_at).format('DD-MM-YYYY'),
            cellRenderer: (params: ICellRendererParams) => <p>{moment(params.data.created_at).format('DD-MM-YYYY')}</p>,
        },
        {
            headerName: "Actie",
            flex: 1,
            cellRenderer: (params: ICellRendererParams) => {
                const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

                const handleClick = (event: React.MouseEvent<HTMLElement>) => {
                    setAnchorEl(event.currentTarget);
                };

                const handleClose = () => {
                    setAnchorEl(null);
                };
                return (
                    <>
                        <IconButton onClick={handleClick}>
                            <i className="material-icons">more_vert</i>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            {writeAuth ? (<MenuItem onClick={(e) => {
                                e.preventDefault();
                                handleUpdateClick(params.data.id);
                            }}> <i className="fa fa-pencil m-r-5"/> Edit
                            </MenuItem>) : null}
                            {deleteAuth ? (<MenuItem onClick={(e) => {
                                e.preventDefault();
                                handleDeleteClick(params.data.id);
                            }}><i className="fa fa-trash m-r-5"/> Delete
                            </MenuItem>) : null}
                        </Menu>
                    </>
                );
            },
            filter: false,
        },
    ];
    const [locationColDefs, setLocationColDefs] = useState(LocationColumns);
    useEffect(() => {
        let pageAuth = auth.user.permissions.find(x => x.page_name == 'Gebouwen');
        if (pageAuth) {
            setWriteAuth(pageAuth.write);
            setDeleteAuth(pageAuth.delete);
            setLocationColDefs(LocationColumns);
        }
    }, [auth]);
    const onRowClick = (record: any) => {
    };
    const SidebarData: SidebarDataProps[] = [];

    const handleShowEditWrap = (itemid: number, event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        const editWrap = document.getElementById('note-edit-wrap-' + itemid.toString());
        const editLink = document.getElementById('link-comment-' + itemid.toString());
        if (editWrap) {
            if (editWrap.style.display === 'block') {
                if (editLink) editLink.style.display = 'block';
                setOpenedComment(undefined);
                setOpenedCommentLink(undefined);
                editWrap.style.display = 'none';
            } else {
                if (editLink) editLink.style.display = 'none';
                if (openedComment) {
                    openedComment.style.display = 'none';
                    if (openedCommentLink) openedCommentLink.style.display = 'block';
                }
                setOpenedComment(editWrap);
                if (editLink) setOpenedCommentLink(editLink);
                editWrap.style.display = 'block';
            }
        }
    };
    const handleTicket = (Ticket: TicketsDataProps | null) => {

    }
    const [isSidebarExpanded, setSidebarExpanded] = useState<boolean>(false);
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2>&nbsp;Locations</h2>}
            collectNotification={false}
            notificationDataHandler={handleTicket} isSidebarExpanded={isSidebarExpanded} setSidebarExpanded={setSidebarExpanded}
            isTicketTableActive={false}
            isMessageTableActive={false}
            SidebarData={SidebarData} handleTabClick={handleTabClick}
        >
            <Head title={'Gebouwen'}/>
            <div className="page-wrapper">
                <div className="content container-fluid">
                    <div className="row">
                        {/* Locations */}
                        <div
                            className={"tab-pane active show"}
                            id="locations">
                            <div className="view-header">

                                <div className="row align-items-center">
                                    <div className="col-md-4">
                                        <h3 className="page-title">Gebouwen</h3>
                                        <ul className="breadcrumb">
                                            <li className="breadcrumb-item"><Link
                                                href={route('dashboard')}>Dashboard</Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <ul>
                                    <li>
                                        {writeAuth ? (<a data-bs-toggle="modal" data-bs-target="#add_location"
                                                         className="com-add btn btn-pink">
                                            <div className={"flex flex-row"}>
                                                <PlusCircle className='me-2' size={20}/>
                                                <span> Add New Location</span>
                                            </div>
                                        </a>) : null}
                                    </li>
                                </ul>
                            </div>
                            <div className="files-activity">
                                <div className="files-wrap">
                                    <div className="email-content">
                                        <div className="ag-theme-quartz ag-theme-mycustomtheme">
                                            <AgGridReact<BuildingProps>
                                                columnDefs={LocationColumns}
                                                rowData={locationsOnView && locationsOnView.length > 0 ? locationsOnView : []}
                                                pagination={false}
                                                domLayout='autoHeight'
                                                onGridReady={(params) => params.api.sizeColumnsToFit()}

                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* /Locations */}
                    </div>
                </div>
                {/* /Tab Content */}
            </div>
            <EditLocation building={selectedLocation} locationUpdateHandle={locationUpdateHandle} onHide={() => {
                setShowLocationEdit(false)
            }} showUpdateLocation={showLocationEdit}/>
            <AddLocation locationAddedHandle={locationAddedHandle}/>
        </AuthenticatedLayout>
    );
}
