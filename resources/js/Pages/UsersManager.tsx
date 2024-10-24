import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link, useForm, usePage} from '@inertiajs/react';
import {PageProps} from '@/types';
import React, {useEffect, useState} from "react";
import Sidebar, {MenuProps, SidebarDataProps} from "@/Layouts/Sidebar";
import {PlusCircle} from 'react-feather';
import {Table} from "antd";
import {AddUser, DeleteUser, UpUser} from "@/Layouts/AddUser"
import {BuildingProps, CustomerProps, MedewerkerDataProps, TicketsDataProps} from "@/types/globalProps";
import {User} from '@/types';
import {ICellRendererParams, ColDef, ValueGetterParams} from 'ag-grid-community';
import {AgGridReact} from "ag-grid-react";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

interface dataProps extends PageProps {
    kullanicilar: User[];
    clients: CustomerProps[];
    buildings: BuildingProps[];
}

interface Route {
    userid: number;
    page_name: string;
    read: boolean;
    write: boolean;
    delete: boolean;
}

export default function UsersManager({auth, kullanicilar, clients, buildings}: dataProps) {
    const thisUser = usePage<PageProps>().props.auth.user;
    const [selectedTab, setSelectedTab] = useState<string>("rooms");
    const [showUserEdit, setShowUserEdit] = useState<boolean>(false);
    const [showAddUser, setShowAddUser] = useState<boolean>(false)
    const [editableUser, setEditableUser] = useState<User>(auth.user);
    const [showBannUser, setShowBannUser] = useState<boolean>(false);
    const [routes, setRoutes] = useState<Route[]>([]);
    useEffect(() => {
    }, []);
    const handleTabClick = (menu: MenuProps) => {
        setSelectedTab(menu.menuValue.toLowerCase());
    };
    const handleDeleteClick = (userid: number) => {
        const chosenUser = kullanicilar.find(z => z.id === userid) ?? auth.user
        setEditableUser(chosenUser);

        if (auth.user === editableUser) alert('kendini silemezsin...');
        else setShowBannUser(true);
    };
    const handleUpdateClick = (userid: number) => {
        setEditableUser(kullanicilar.find(z => z.id === userid) ?? auth.user);
        setShowUserEdit(true);

    };
    const ActionMenu = ({data}: { data: any }) => {
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
                    <MenuItem onClick={(e) => {
                        e.preventDefault();
                        handleUpdateClick(data.id);
                    }}> <i className="fa fa-pencil m-r-5"/> Edit
                    </MenuItem>
                    <MenuItem onClick={(e) => {
                        e.preventDefault();
                        handleDeleteClick(data.id);
                    }}><i className="fa fa-trash m-r-5"/> Delete
                    </MenuItem>
                </Menu>
            </>
        );
    };
    const roles = [
        {value: 'Client', label: 'Klant'},
        {value: 'personel', label: 'Medewerker'},
        {value: 'forman', label: 'Voorwerker'},
        {value: 'projectleider', label: 'Projectleider'},
        {value: 'admin', label: 'Admin'},]
    const columns: ColDef[] = [
        {
            headerName: "User Id",
            flex: 1,
            valueGetter: (params: ValueGetterParams) => {
                return `${params.data.id}`;
            },
            cellRenderer: (params: ICellRendererParams) => (
                <p>{params.data.id}</p>
            ),
            filter: true, floatingFilter: true
        },
        {
            headerName: "User Name",
            flex: 3,
            valueGetter: (params: ValueGetterParams) => {
                return `${params.data.name}`;
            },
            cellRenderer: (params: ICellRendererParams) => (
                <p>{params.data.name}</p>
            ),
            filter: true, floatingFilter: true,
        },
        {
            headerName: "e-Mail",
            flex: 3,
            valueGetter: (params: ValueGetterParams) => {
                return `${params.data.email}`;
            },
            cellRenderer: (params: ICellRendererParams) => (
                <p>{params.data.email}</p>
            ),
            filter: true, floatingFilter: true,
        },
        {
            headerName: "User Role",
            flex: 1,
            valueGetter: (params: ValueGetterParams) => {
                return `${params.data.roleName}`;
            },
            cellRenderer: (params: ICellRendererParams) => (
                <p>{params.data.roleName}</p>
            ),
            filter: true, floatingFilter: true,
        },
        {
            headerName: "Connected Location",
            flex: 2,
            valueGetter: (params: ValueGetterParams) => {
                return `${params.data.connectedBuild}`;
            },
            cellRenderer: (params: ICellRendererParams) => (
                <p>{params.data.connectedBuild}</p>
            ),
            filter: true, floatingFilter: true,
        },
        {
            headerName: "Connected Client",
            valueGetter: (params: ValueGetterParams) => {
                return `${params.data.connectedCustomer}`;
            },
            cellRenderer: (params: ICellRendererParams) => (
                <p>{params.data.connectedCustomer}</p>
            ),
            filter: true, floatingFilter: true,
        },
        {
            headerName: "Status",
            flex: 1,
            valueGetter: (params: ValueGetterParams) => params.data.bann ? "Pasive" : "Active",
            cellRenderer: (params: ICellRendererParams) => (
                <div className="dropdown action-label">
                    <span className={params.data.bann ? "btn btn-white btn-sm badge-outline-danger status-color-dg" :
                        "btn btn-white btn-sm badge-outline-success status-color"}>
                        {params.data.bann ? "Pasive" : "Active"}
                    </span>
                </div>
            ),
            filter: true, floatingFilter: true
        },
        {
            headerName: "Action",
            flex: 1,
            cellRenderer: ActionMenu,
        },
    ];
    const handleTicket = (Ticket: TicketsDataProps | null) => {

    }
    const [isSidebarExpanded, setSidebarExpanded] = useState<boolean>(false);
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2
                className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight flex justify-center items-center h-auto">Osius
                CRM Panel</h2>}
            collectNotification={false}
            notificationDataHandler={handleTicket} isSidebarExpanded={isSidebarExpanded}
            setSidebarExpanded={setSidebarExpanded}
            isTicketTableActive={false}
            isMessageTableActive={false}
            SidebarData={[]} handleTabClick={handleTabClick}
        >
            <div className="page-wrapper">
                <Head title="Users"/>
                <div className="content container-fluid">
                    <div className="row">
                        <div className="col">
                            <h3 className="page-title">
                                User Managements
                            </h3>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link href={route('dashboard')}>Dashboard</Link>
                                </li>
                                <li className="breadcrumb-item active">User Managements</li>
                            </ul>
                        </div>
                        <div className="col-auto float-end ms-auto contacts-action">
                            <a
                                className="btn btn-primary flex flex-row"
                                onClick={() => setShowAddUser(true)}
                            >
                                <PlusCircle className="me-1" size={15}/>Create User
                            </a>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xl-12">
                            <div className="contact-activity">
                                <div className="ag-theme-quartz ag-theme-mycustomtheme">
                                    <AgGridReact<User>
                                        columnDefs={columns}
                                        rowData={kullanicilar && kullanicilar.length > 0 ? kullanicilar : []}
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
            <UpUser showUserEdit={showUserEdit} onHide={() => setShowUserEdit(false)} editableUser={editableUser}
                    clients={clients} buildings={buildings}/>
            <DeleteUser showBannUser={showBannUser} onHide={() => setShowBannUser(false)} editableUser={editableUser}/>
            <AddUser buildings={buildings} clients={clients} showUserAdd={showAddUser}
                     onHide={() => setShowAddUser(false)}/>
        </AuthenticatedLayout>
    );
}
