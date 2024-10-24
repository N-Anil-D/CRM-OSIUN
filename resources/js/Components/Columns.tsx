import {
    BuildingProps,
    CustomerProps,
    TicketsDataProps,
    clientsContactPerson,
    RouteAuths, RoomProps, CustomerAsignedRoomsDataProps,
} from "@/types/globalProps";
import React, {useState} from 'react';
import moment from 'moment';
import {Head, Link} from '@inertiajs/react';
import {Table} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import {XCircle, CheckCircle, Filter} from 'react-feather';
import {ICellRendererParams, ColDef, ValueGetterParams} from 'ag-grid-community';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export const rowClassName = (record: TicketsDataProps) => {
    let className = '';

    // Eğer bildirim varsa 'new-ticket' sınıfını ekle
    if (record.hasNotis && record.hasNotis > 0) {
        className = 'new-ticket';
    }
    return className.trim();
}

export function LocationsColumnCreator(
    locationDeleteClick: (ticketId: number) => void,
    locationUpdateClick: (ticketId: number) => void,
    customerid: string,
    locationsDomData: BuildingProps[],
    writeAuth: boolean,
    deleteAuth: boolean,
): ColDef[] {
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
                const url = `/klantdetail/${customerid}/locatie/${params.data.id}`;

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
                const locatie = locationsDomData.find(x => x.id == params.data.id);
                let id = 0;
                if (locatie) id = locatie.id;
                const url = `/klantdetail/${customerid}/locatie/${id}`;
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
                const url = `/klantdetail/${customerid}/locatie/${params.data.id}`;

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
                const url = `/klantdetail/${customerid}/locatie/${params.data.id}`;

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
                const url = `/klantdetail/${customerid}/locatie/${params.data.id}`;

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
                                locationUpdateClick(params.data.id);
                            }}> <i className="fa fa-pencil m-r-5"/> Edit
                            </MenuItem>) : null}
                            {deleteAuth ? (<MenuItem onClick={(e) => {
                                e.preventDefault();
                                locationDeleteClick(params.data.id);
                            }}><i className="fa fa-trash m-r-5"/> Delete
                            </MenuItem>) : null}
                        </Menu>
                    </>
                );
            },
            filter: false,
        },
    ];
    return LocationColumns;
}

export function TicketColumCreator(
    customers: CustomerProps[],
    buildings: BuildingProps[],
    handleClick: (ticketId: number) => void,
    handleUpdateClick: (ticketId: number) => void,
): ColumnsType<TicketsDataProps> {
    const numericSorter = (a: any, b: any, key: string) => {
        return a[key] - b[key];
    };
    const alphabeticSorter = (a: any, b: any, key: string) => {
        if (a[key] < b[key]) return -1;
        if (a[key] > b[key]) return 1;
        return 0;
    };
    const typeSorter = (a: any, b: any) => {
        let tipa = a.assigned_type ? a.assigned_type : a.ticket_type;
        let tipb = b.assigned_type ? b.assigned_type : b.ticket_type;
        if (tipa < tipb) return -1;
        if (tipa > tipb) return 1;
        return 0;
    };
    const dateSorter = (a: any, b: any, key: string) => {
        return new Date(a[key]).getTime() - new Date(b[key]).getTime();
    };

    const choseRibbon = (status: string) => {
        let className = '';
        // Ticket statusüne göre sınıf ekle
        switch (status) {
            case 'New':
                className += ' !bg-purple-400';
                break;
            case 'Open':
                className += ' bg-info';
                break;
            case 'On Hold':
                className += ' bg-danger';
                break;
            case 'Closed':
                className += ' bg-success';
                break;
            case 'In Progress':
                className += ' bg-warning';
                break;
            case 'Cancelled':
                className += ' bg-secondary';
                break;
            default:
                break;
        }
        return className;
    }
    const columns: ColumnsType<TicketsDataProps> = [
        {
            title: "ID",
            render: (data: any) => (
                <>

                    <Link
                        onClick={() => localStorage.setItem("minheight", "true")}
                        href={"/ticketdetail/" + data.id.toString()}
                    >
                        <div className='power-ribbone power-ribbone-top-left'>
                <span className={choseRibbon(data.status)}>
                </span>
                        </div>
                        {data.hasNotis > 0 ? (<>{data.id} <span className="badge bg-danger ms-1"><span
                                className="visually-hidden">{data.hasNotis}</span> </span></>)
                            : data.id}
                    </Link>
                </>
            ),
            sorter: (a: any, b: any) => numericSorter(a, b, "id"),
        },
        {
            title: "Status",
            render: (data: any) => {
                let statusText = "";
                let statusIcon = "";
                let statusClass = "";

                switch (data.status) {
                    case "New":
                        statusText = "Nieuw";
                        statusIcon = "far fa-dot-circle text-white";
                        statusClass = 'text-white';
                        break;
                    case "On Hold":
                        statusText = "On Hold";
                        statusIcon = "far fa-dot-circle text-white";
                        statusClass = 'text-white';
                        break;
                    case "Open":
                        statusText = "Open";
                        statusIcon = "far fa-dot-circle text-black";
                        statusClass = 'text-black';
                        break;
                    case "Closed":
                        statusText = "Afgehandeld";
                        statusIcon = "far fa-dot-circle text-black";
                        statusClass = 'text-black';
                        break;
                    case "In Progress":
                        statusText = "In bewerking";
                        statusIcon = "far fa-dot-circle text-black";
                        statusClass = 'text-black';
                        break;
                    case "Cancelled":
                        statusText = "Vervallen";
                        statusIcon = "far fa-dot-circle text-white";
                        statusClass = 'text-white';
                        break;
                    default:
                        statusText = "Unknown";
                        statusIcon = "far fa-dot-circle text-white";
                        statusClass = 'text-white';
                }
                return (<div className="dropdown action-label text-center">
                    <Link
                        className={statusClass + " btn btn-white btn-sm btn-rounded" + choseRibbon(data.status)}
                        href={"/ticketdetail/" + data.id.toString()}
                        aria-expanded="true"
                    >
                        <i className={statusIcon}/> {statusText}
                    </Link>

                </div>)
            },
            sorter: (a: any, b: any) => alphabeticSorter(a, b, "status"),
        },
        {
            title: "Klant Naam",
            render: (item: any) => (
                <Link
                    href={"/ticketdetail/" + item.id.toString()}>
                    {item.customer === 'ALL' ? 'Alles' : (customers?.find((x) => (x.CustomerID === item.customer))?.Unvan ?? "Undefined or passive client")}
                </Link>
            ),
            sorter: (a: any, b: any) => alphabeticSorter(a, b, "customer"),
        },
        {
            title: "Locatie",
            render: (item: any) => (
                <Link
                    href={"/ticketdetail/" + item.id.toString()}>
                    {item.building == -1 ? 'Alles' : (buildings?.find((x) => (x.id.toString() === item.building.toString()))?.BuildingName ?? item.building)}
                </Link>
            ),
            sorter: (a: any, b: any) => alphabeticSorter(a, b, "building"),
        },
        {
            title: "Melding Maker",
            render: (text: any) => (
                <span className="table-avatar">
    <Link
        href={"/ticketdetail/" + text.id.toString()}>{text.opener_name}</Link>
        </span>
            ),
            sorter: (a: any, b: any) => alphabeticSorter(a, b, "opener_name"),
        },
        {
            title: "Type",
            render: (data: any) => (
                <Link
                    onClick={() => localStorage.setItem("minheight", "true")}
                    href={"/ticketdetail/" + data.id.toString()}
                >{data.assigned_type ? data.assigned_type : data.ticket_type}
                </Link>
            ),
            sorter: (a: any, b: any) => typeSorter(a, b),
        },
        {
            title: "Title",
            render: (data: any) => (
                <Link
                    onClick={() => localStorage.setItem("minheight", "true")}
                    href={"/ticketdetail/" + data.id.toString()}
                >
                    {data.title}
                </Link>
            ),
            sorter: (a: any, b: any) => alphabeticSorter(a, b, "title"),
        },
        {
            title: "Ruimte",
            render: (item: any) => (
                <Link
                    href={"/ticketdetail/" + item.id.toString()}>{item.room == "-2" ? "Overige" : item.room}</Link>
            ),
            sorter: (a: any, b: any) => alphabeticSorter(a, b, "room"),
        },
        {
            title: "Melding Datum",
            dataIndex: "created_at",
            render: (text: Date) => {
                // Eğer text bir tarih nesnesi ise moment.js kullanmaya gerek yok
                if (text instanceof Date) {
                    return text.toLocaleDateString(); // Yerel tarih formatına göre dönüştürür
                } else if (typeof text === 'string') {
                    // Eğer text bir tarih string'i ise moment.js ile formatlama yap
                    return moment(text).format('DD-MM-YYYY HH:mm'); // İstediğiniz formata dönüştürür
                } else {
                    // Diğer veri tipleri için varsayılan değer (boş string)
                    return '';
                }
            },
            sorter: (a: any, b: any) => dateSorter(a, b, "created_at"),
        },
        {
            title: "Sluiting Datum",
            dataIndex: "closing_date",
            render: (text: Date) => {
                // Eğer text bir tarih nesnesi ise moment.js kullanmaya gerek yok
                if (text instanceof Date) {
                    return text.toLocaleDateString(); // Yerel tarih formatına göre dönüştürür
                } else if (typeof text === 'string') {
                    // Eğer text bir tarih string'i ise moment.js ile formatlama yap
                    return moment(text).format('DD-MM-YYYY HH:mm'); // İstediğiniz formata dönüştürür
                } else {
                    // Diğer veri tipleri için varsayılan değer (boş string)
                    return '';
                }
            },
            sorter: (a: any, b: any) => dateSorter(a, b, "created_at"),
        },
        {
            title: "Actie",
            render: (data: any) => (
                <div className="dropdown dropdown-action text-end">
                    <Link
                        href="#"
                        className="action-icon dropdown-toggle"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <i className="material-icons">more_vert</i>
                    </Link>
                    <div className="dropdown-menu dropdown-menu-right">
                        <Link
                            className="dropdown-item"
                            href="#"
                            data-bs-toggle="modal"
                            data-bs-target="#edit_ticket"
                            onClick={() => handleUpdateClick(data.id)}
                        >
                            <i className="fa fa-pencil m-r-5"/> Edit
                        </Link>
                        <Link
                            className="dropdown-item"
                            href="#"
                            data-bs-toggle="modal"
                            data-bs-target="#delete"
                            onClick={() => handleClick(data.id)}
                        >
                            <i className="fa fa-trash m-r-5"/> Cancel
                        </Link>
                    </div>
                </div>
            ),
            sorter: true,
        },
    ];
    return columns;
}

export function AgTicketColumCreator(
    customers: CustomerProps[],
    buildings: BuildingProps[],
    handleDeleteClick: (ticketId: number) => void,
    handleUpdateClick: (ticketId: number) => void,
    deleteAuth: boolean,
    writeAuth: boolean,
): ColDef[] {
    const choseRibbon = (status: string) => {
        let className = '';
        // Ticket statusüne göre sınıf ekle
        switch (status) {
            case 'New':
                className += ' !bg-purple-400';
                break;
            case 'Open':
                className += ' bg-info';
                break;
            case 'On Hold':
                className += ' bg-danger';
                break;
            case 'Closed':
                className += ' bg-success';
                break;
            case 'In Progress':
                className += ' bg-warning';
                break;
            case 'Cancelled':
                className += ' bg-secondary';
                break;
            default:
                break;
        }
        return className;
    }
    const columns: ColDef[] = [
        {
            headerName: "ID",
            flex: 1,
            valueGetter: (params: ValueGetterParams) => {
                return `${params.data.id}`;
            },
            cellRenderer: (params: ICellRendererParams) => {
                return (
                    <>
                        <Link
                            onClick={() => localStorage.setItem("minheight", "true")}
                            href={"/ticketdetail/" + params.data.id.toString()}
                        >
                            <div className='power-ribbone power-ribbone-top-left'>
                <span className={choseRibbon(params.data.status)}>
                </span>
                            </div>
                            {params.data.hasNotis > 0 ? (<>{params.data.id} <span className="badge bg-danger ms-1"><span
                                    className="visually-hidden">{params.data.hasNotis}</span> </span></>)
                                : params.data.id}
                        </Link>
                    </>
                )
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Status",
            flex: 2,
            valueGetter: (params: ValueGetterParams) => {
                return `${params.data.status}`;
            },
            cellRenderer: (params: ICellRendererParams) => {
                let statusText = "";
                let statusIcon = "";
                let statusClass = "";

                switch (params.data.status) {
                    case "New":
                        statusText = "Nieuw";
                        statusIcon = "far fa-dot-circle text-white";
                        statusClass = 'text-white';
                        break;
                    case "On Hold":
                        statusText = "On Hold";
                        statusIcon = "far fa-dot-circle text-white";
                        statusClass = 'text-white';
                        break;
                    case "Open":
                        statusText = "Open";
                        statusIcon = "far fa-dot-circle text-black";
                        statusClass = 'text-black';
                        break;
                    case "Closed":
                        statusText = "Afgehandeld";
                        statusIcon = "far fa-dot-circle text-black";
                        statusClass = 'text-black';
                        break;
                    case "In Progress":
                        statusText = "In bewerking";
                        statusIcon = "far fa-dot-circle text-black";
                        statusClass = 'text-black';
                        break;
                    case "Cancelled":
                        statusText = "Vervallen";
                        statusIcon = "far fa-dot-circle text-white";
                        statusClass = 'text-white';
                        break;
                    default:
                        statusText = "Unknown";
                        statusIcon = "far fa-dot-circle text-white";
                        statusClass = 'text-white';
                }
                return (<div className="dropdown action-label text-center">
                    <Link
                        className={statusClass + " btn btn-white btn-sm btn-rounded" + choseRibbon(params.data.status)}
                        href={"/ticketdetail/" + params.data.id.toString()}
                        aria-expanded="true"
                    >
                        <i className={statusIcon}/> {statusText}
                    </Link>

                </div>)
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Klant Naam",
            flex: 2,
            valueGetter: (params: ValueGetterParams) => {
                return (params.data.customer === 'ALL' ? 'Alles' : (customers?.find((x) => (x.CustomerID === params.data.customer))?.Unvan ?? "Undefined or passive client"));
            },
            cellRenderer: (params: ICellRendererParams) => (
                <Link
                    href={"/ticketdetail/" + params.data.id.toString()}>
                    {params.data.customer === 'ALL' ? 'Alles' : (customers?.find((x) => (x.CustomerID === params.data.customer))?.Unvan ?? "Undefined or passive client")}
                </Link>
            ),
            filter: true, floatingFilter: true
        },
        {
            headerName: "Locatie",
            flex: 2,
            valueGetter: (params: ValueGetterParams) => {
                return (params.data.building == -1 ? 'Alles' : (buildings?.find((x) => (x.id.toString() === params.data.building.toString()))?.BuildingName ?? params.data.building));
            },
            cellRenderer: (params: ICellRendererParams) => {
                return (
                    <Link
                        href={"/ticketdetail/" + params.data.id.toString()}>
                        {params.data.building == -1 ? 'Alles' : (buildings?.find((x) => (x.id.toString() === params.data.building.toString()))?.BuildingName ?? params.data.building)}
                    </Link>
                )
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Melding Maker",
            flex: 1,
            valueGetter: (params: ValueGetterParams) => {
                return `${params.data.status}`;
            },
            cellRenderer: (params: ICellRendererParams) => {
                return (
                    <span className="table-avatar">
                        <Link href={"/ticketdetail/" + params.data.id.toString()}>
                            {params.data.opener_name}
                        </Link>
                    </span>
                )
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Type",
            flex: 1,
            valueGetter: (params: ValueGetterParams) => {
                return (params.data.assigned_type ? params.data.assigned_type : params.data.ticket_type);
            },
            cellRenderer: (params: ICellRendererParams) => {
                return (
                    <Link
                        onClick={() => localStorage.setItem("minheight", "true")}
                        href={"/ticketdetail/" + params.data.id.toString()}
                    >{params.data.assigned_type ? params.data.assigned_type : params.data.ticket_type}
                    </Link>
                )
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Title",
            flex: 2,
            valueGetter: (params: ValueGetterParams) => {
                return (params.data.title);
            },
            cellRenderer: (params: ICellRendererParams) => {
                return (
                    <Link
                        onClick={() => localStorage.setItem("minheight", "true")}
                        href={"/ticketdetail/" + params.data.id.toString()}
                    >
                        {params.data.title}
                    </Link>
                )
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Ref. nr.",
            flex: 1,
            valueGetter: (params: ValueGetterParams) => {
                return (params.data.refnum);
            },
            cellRenderer: (params: ICellRendererParams) => (
                <Link
                    href={"/ticketdetail/" + params.data.id.toString()}>{params.data.refnum}</Link>
            ),
            filter: true, floatingFilter: true
        },
        {
            headerName: "Melding Datum",
            flex: 2,
            valueGetter: (params: ValueGetterParams) => {
                return (moment(params.data.created_at).format('DD-MM-YYYY'));
            },
            cellRenderer: (params: ICellRendererParams) => {
                return (moment(params.data.created_at).format('DD-MM-YYYY'))
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Sluiting Datum",
            flex: 2,
            valueGetter: (params: ValueGetterParams) => {
                return (moment(params.data.closing_date).format('DD-MM-YYYY'));
            },
            cellRenderer: (params: ICellRendererParams) => {
                return (moment(params.data.closing_date).format('DD-MM-YYYY'))
            },
            filter: true, floatingFilter: true
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
    return columns;
}

export function contactPersonsColumnsCreator(
    handleDeleteClick: (ticketId: number) => void,
    handleUpdateClick: (ticketId: number) => void,
    writeAuth: boolean,
    deleteAuth: boolean,
): ColDef[] {
    const columns: ColDef[] = [
        {
            headerName: "Naam",
            flex: 4,
            valueGetter: (params: ValueGetterParams) => {
                return `${params.data.title} ${params.data.first_name} ${params.data.tussen} ${params.data.last_name}`;
            },
            cellRenderer: (params: ICellRendererParams) => {
                return (
                    <a href={`/contactpersondetail/${params.data.id}`}>
                        <p>{params.data.title} {params.data.first_name} {params.data.tussen} {params.data.last_name}</p>
                    </a>
                );
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Functie",
            flex: 2,
            valueGetter: (params: ValueGetterParams) => params.data.function,
            cellRenderer: (params: ICellRendererParams) => <p>{params.data.function}</p>,
            filter: true, floatingFilter: true
        },
        {
            headerName: "e-Mailadres",
            flex: 2,
            valueGetter: (params: ValueGetterParams) => params.data.email,
            cellRenderer: (params: ICellRendererParams) => <p>{params.data.email}</p>,
            filter: true, floatingFilter: true
        },
        {
            headerName: "Telefoonnummer",
            flex: 2,
            valueGetter: (params: ValueGetterParams) => params.data.phone_number,
            cellRenderer: (params: ICellRendererParams) => <p>{params.data.phone_number}</p>,
            filter: true, floatingFilter: true
        },
        {
            headerName: "Mobilenummer",
            flex: 2,
            valueGetter: (params: ValueGetterParams) => params.data.mobilenum,
            cellRenderer: (params: ICellRendererParams) => <p>{params.data.mobilenum}</p>,
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
            headerName: "Account",
            flex: 1,
            valueGetter: (params: ValueGetterParams) => params.data.is_user ? "Ja" : 'Nee',
            cellRenderer: (params: ICellRendererParams) => (
                <div className="dropdown action-label  mt-2">
                    {params.data.is_user ? <CheckCircle className={'text-green-700 mt-2'} size={20}/> :
                        <XCircle className={'text-red-700 mt-2'} size={20}/>}
                </div>
            ),
            filter: true, floatingFilter: true
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
    return columns;
}

export function medewerkersColumnsCreator(
    handleDeleteClick: (ticketId: number) => void,
    handleUpdateClick: (ticketId: number) => void,
): ColDef[] {
    const columns: ColDef[] = [
        {
            headerName: "Pers. nr.",
            flex: 1,
            valueGetter: (params: ValueGetterParams) => {
                return `${params.data.personnel_number}`;
            },
            cellRenderer: (params: ICellRendererParams) => {
                return (
                    <a href={`/medewerker/${params.data.id}`}>
                        <p>{params.data.personnel_number}</p>
                    </a>
                );
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Naam",
            flex: 2,
            valueGetter: (params: ValueGetterParams) => {
                return `${params.data.first_name}  ${params.data.tussen} ${params.data.tussen} ${params.data.last_name}`
            },
            cellRenderer: (params: ICellRendererParams) => {
                return (
                    <a href={`/medewerker/${params.data.id}`}>
                        <p>{params.data.first_name} {params.data.tussen && params.data.tussen != 'null' ? params.data.tussen : null} {params.data.last_name}</p>
                    </a>
                );
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "e-Mailadres",
            flex: 2,
            valueGetter: (params: ValueGetterParams) => params.data.email,
            cellRenderer: (params: ICellRendererParams) => {
                return (<p>{params.data.email}</p>)
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Geboortedatum",
            flex: 2,
            valueGetter: (params: ValueGetterParams) => moment(params.data.date_of_birth).format('DD-MM-YYYY'),
            cellRenderer: (params: ICellRendererParams) =>
                <p>{moment(params.data.date_of_birth).format('DD-MM-YYYY')}</p>,
            filter: true, floatingFilter: true
        },
        {
            headerName: "Geslacht",
            flex: 2,
            valueGetter: (params: ValueGetterParams) => params.data.gender,
            cellRenderer: (params: ICellRendererParams) => <p>{params.data.gender}</p>,
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
            headerName: "Account",
            flex: 1,
            valueGetter: (params: ValueGetterParams) => params.data.is_user ? "Ja" : 'Nee',
            cellRenderer: (params: ICellRendererParams) => (
                <div className="dropdown action-label  mt-2">
                    {params.data.is_user ? <CheckCircle className={'text-green-700 mt-2'} size={20}/> :
                        <XCircle className={'text-red-700 mt-2'} size={20}/>}
                </div>
            ),
            filter: true, floatingFilter: true
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
                            <MenuItem onClick={(e) => {
                                e.preventDefault();
                                handleUpdateClick(params.data.id);
                            }}> <i className="fa fa-pencil m-r-5"/> Edit
                            </MenuItem>
                            <MenuItem onClick={(e) => {
                                e.preventDefault();
                                handleDeleteClick(params.data.id);
                            }}><i className="fa fa-trash m-r-5"/> Delete
                            </MenuItem>
                        </Menu>
                    </>
                )
            },
            filter: false,
        },
    ];
    return columns;
}

export function customersColumnsCreator(
    handleDeleteClick: (record: CustomerProps) => void,
    handleUpdateClick: (record: CustomerProps) => void,
    writeAuth: boolean,
    deleteAuth: boolean,
): ColDef[] {
    const columns: ColDef[] = [
        {
            headerName: "Klanten ID",
            flex: 1,
            valueGetter: (params: ValueGetterParams) => {
                return `${params.data.CustomerID}`;
            },
            cellRenderer: (params: ICellRendererParams) => {
                return (
                    <a href={route('klantdetail', {customerid: params.data.CustomerID})}>
                        <p>{params.data.CustomerID}</p>
                    </a>
                );
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Naam",
            flex: 2,
            valueGetter: (params: ValueGetterParams) => params.data.Unvan,
            cellRenderer: (params: ICellRendererParams) => {
                return (
                    <a href={route('klantdetail', {customerid: params.data.CustomerID})}>
                        <p>{params.data.Unvan}</p>
                    </a>
                );
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Phone",
            flex: 2,
            valueGetter: (params: ValueGetterParams) => params.data.phone_number,
            cellRenderer: (params: ICellRendererParams) => {
                return (<a href={route('klantdetail', {customerid: params.data.CustomerID})}>
                    <p>{params.data.phone_number}</p>
                </a>);
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "e-Mailadres",
            flex: 2,
            valueGetter: (params: ValueGetterParams) => params.data.email,
            cellRenderer: (params: ICellRendererParams) => {
                return (<a href={"mailto:" + params.data.email} className="profile-split">
                    <p>{params.data.email}</p>
                </a>)
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Tags",
            flex: 2,
            valueGetter: (params: ValueGetterParams) => params.data.tag,
            cellRenderer: (params: ICellRendererParams) => <p>{params.data.tag}</p>,
            filter: true, floatingFilter: true
        },
        {
            headerName: "Status",
            flex: 1,
            valueGetter: (params: ValueGetterParams) => params.data.passive ? "Pasive" : "Active",
            cellRenderer: (params: ICellRendererParams) => (
                <div className="dropdown action-label">
                    <span
                        className={params.data.passive > 0 ? "btn btn-white btn-sm badge-outline-danger status-color-dg" :
                            "btn btn-white btn-sm badge-outline-success status-color"}> {params.data.passive > 0 ? "Pasive" : "Active"} </span>
                </div>
            ),
            filter: true, floatingFilter: true
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
                                handleUpdateClick(params.data);
                            }}> <i className="fa fa-pencil m-r-5"/> Edit
                            </MenuItem>) : null}
                            {deleteAuth ? (<MenuItem onClick={(e) => {
                                e.preventDefault();
                                handleDeleteClick(params.data);
                            }}><i className="fa fa-trash m-r-5"/> Delete
                            </MenuItem>) : null}
                        </Menu>
                    </>
                );
            },
            filter: false,
        },
    ];
    return columns;
}

export function asignedCustomersColumnsCreator(
    handleDeleteClick: (record: CustomerProps) => void,
    handleUpdateClick: (record: CustomerProps) => void,
    writeAuth: boolean,
    deleteAuth: boolean,
): ColDef[] {
    const columns: ColDef[] = [
        {
            headerName: "Klanten ID",
            flex: 1,
            valueGetter: (params: ValueGetterParams) => {
                return `${params.data.CustomerID}`;
            },
            cellRenderer: (params: ICellRendererParams) => {
                return (
                    <a href={route('klantdetail', {customerid: params.data.CustomerID})}>
                        <p>{params.data.CustomerID}</p>
                    </a>
                );
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Naam",
            flex: 2,
            valueGetter: (params: ValueGetterParams) => params.data.Unvan,
            cellRenderer: (params: ICellRendererParams) => {
                return (
                    <a href={route('klantdetail', {customerid: params.data.CustomerID})}>
                        <p>{params.data.Unvan}</p>
                    </a>
                );
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Totale oppervlakte",
            flex: 2,
            valueGetter: (params: ValueGetterParams) => Math.round(parseFloat(params.data.totalArea)*Math.pow(10,2))/Math.pow(10,2),
            cellRenderer: (params: ICellRendererParams) => {
                return (<a href={route('klantdetail', {customerid: params.data.CustomerID})}>
                    <p>{Math.round(parseFloat(params.data.totalArea)*Math.pow(10,2))/Math.pow(10,2)}</p>
                </a>);
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Aantal kamers",
            flex: 2,
            valueGetter: (params: ValueGetterParams) => params.data.totalRoom,
            cellRenderer: (params: ICellRendererParams) => {
                return (<a href={"mailto:" + params.data.email} className="profile-split">
                    <p>{params.data.totalRoom}</p>
                </a>)
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Ratio",
            flex: 2,
            valueGetter: (params: ValueGetterParams) => Math.round(parseFloat(params.data.ratio)*Math.pow(10,2))/Math.pow(10,2),
            cellRenderer: (params: ICellRendererParams) => <p>{Math.round(parseFloat(params.data.ratio)*Math.pow(10,2))/Math.pow(10,2)}</p>,
            filter: true, floatingFilter: true
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
                                handleUpdateClick(params.data);
                            }}> <i className="fa fa-pencil m-r-5"/>Asign a room
                            </MenuItem>) : null}
                            {deleteAuth ? (<MenuItem onClick={(e) => {
                                e.preventDefault();
                                handleDeleteClick(params.data);
                            }}><i className="fa fa-trash m-r-5"/> Show asigned rooms
                            </MenuItem>) : null}
                        </Menu>
                    </>
                );
            },
            filter: false,
        },
    ];
    return columns;
}
export function clientProjectColumnsCreator(
    handleDeleteClick: (record: CustomerProps) => void,
    handleUpdateClick: (record: CustomerProps) => void,
    writeAuth: boolean,
    deleteAuth: boolean,
    knownLocaties: BuildingProps[],
): ColDef[] {
    const columns: ColDef[] = [
        {
            headerName: "Project ID",
            flex: 1,
            valueGetter: (params: ValueGetterParams) => {
                return `${params.data.project_id}`;
            },
            cellRenderer: (params: ICellRendererParams) => {
                return (
                    <a href={route('projectdetail', {projectid: params.data.id})}>
                        <p>{params.data.project_id}</p>
                    </a>
                );
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Project Naam",
            flex: 2,
            valueGetter: (params: ValueGetterParams) => params.data.project_name,
            cellRenderer: (params: ICellRendererParams) => {
                return (
                    <a href={route('projectdetail', {projectid: params.data.id})}>
                        <p>{params.data.project_name}</p>
                    </a>
                );
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Phone",
            flex: 2,
            valueGetter: (params: ValueGetterParams) => params.data.relevant_contract_id,
            cellRenderer: (params: ICellRendererParams) => {
                return (<a href={route('projectdetail', {projectid: params.data.id})}>
                    <p>{params.data.relevant_contract_id}</p>
                </a>);
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Locatie",
            flex: 2,
            valueGetter: (params: ValueGetterParams) => params.data.email,
            cellRenderer: (params: ICellRendererParams) => {
                return (<a href={route('projectdetail', {projectid: params.data.id})} className="profile-split">
                    <p>{params.data.building == -1 ? 'Niet gespecificeerd' : (knownLocaties?.find((x) => (x.id.toString() === params.data.building.toString()))?.BuildingName ?? params.data.building)}</p>
                </a>)
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Taakaantal",
            flex: 2,
            valueGetter: (params: ValueGetterParams) => params.data.tasks.lenght,
            cellRenderer: (params: ICellRendererParams) => <p>{params.data.tasks.length}</p>,
            filter: true, floatingFilter: true
        },
        {
            headerName: "Startdatum",
            flex: 1,
            valueGetter: (params: ValueGetterParams) => params.data.tasks.startDate,
            cellRenderer: (params: ICellRendererParams) => {
                // const dates = params.data.tasks.flatMap(a: any => [a.startDate, a.endDate].filter(date => date !== null)) as Date[];
                // let startDate = new Date(Math.min(...params.data.tasks.map(date=> date.startDate.getTime())))
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Einddatum",
            flex: 1,
            valueGetter: (params: ValueGetterParams) => params.data.passive ? "Pasive" : "Active",
            cellRenderer: (params: ICellRendererParams) => (
                <div className="dropdown action-label">
                    <span
                        className={params.data.passive > 0 ? "btn btn-white btn-sm badge-outline-danger status-color-dg" :
                            "btn btn-white btn-sm badge-outline-success status-color"}> {params.data.passive > 0 ? "Pasive" : "Active"} </span>
                </div>
            ),
            filter: true, floatingFilter: true
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
    return columns;
}

export const permitionsTableColumns = (
    dataSource: RouteAuths[],
    setDataSource: React.Dispatch<React.SetStateAction<RouteAuths[]>>
): ColumnsType<RouteAuths> => {
    const handleCheckboxChange = (record: RouteAuths, type: string, checked: boolean) => {
        const updatedData = dataSource.map((item) => {
            if (item.page_name === record.page_name) {
                let newItem = {...item, [type]: checked};

                if (type === 'read' && !checked) {
                    newItem.delete = false;
                    newItem.write = false;
                }
                if (type === 'write' && !checked) {
                    newItem.delete = false;
                }
                if (type === 'write' && checked) {
                    newItem.read = true;
                }
                if (type === 'delete' && checked) {
                    newItem.read = true;
                    newItem.write = true;
                }

                return newItem;
            }
            return item;
        });

        setDataSource(updatedData);
    };

    return [
        {
            title: 'Naam',
            dataIndex: 'page_name',
            key: 'page_name',
        },
        {
            title: 'Read',
            dataIndex: 'read',
            render: (read: boolean, record: RouteAuths) => (
                <input
                    type="checkbox"
                    checked={read}
                    onChange={(e) => handleCheckboxChange(record, 'read', e.target.checked)}
                />
            ),
        },
        {
            title: 'Write',
            dataIndex: 'write',
            render: (write: boolean, record: RouteAuths) => (
                <input
                    type="checkbox"
                    checked={write}
                    onChange={(e) => handleCheckboxChange(record, 'write', e.target.checked)}
                />
            ),
        },
        {
            title: 'Delete',
            dataIndex: 'delete',
            render: (del: boolean, record: RouteAuths) => (
                <input
                    type="checkbox"
                    checked={del}
                    onChange={(e) => handleCheckboxChange(record, 'delete', e.target.checked)}
                />
            ),
        },
    ];
};
export default {TicketColumCreator, rowClassName, permitionsTableColumns};
