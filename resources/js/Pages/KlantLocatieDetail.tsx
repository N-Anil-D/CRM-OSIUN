import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link} from '@inertiajs/react';
import {PageProps} from '@/types';
import React, {useState, useEffect, useRef, memo} from 'react';
import axios, {all} from 'axios';
import Select from 'react-select';
import Sidebar, {MenuProps, SidebarDataProps} from "@/Layouts/Sidebar";
import {Edit, Mail, MessageCircle, MoreVertical, PlusCircle, UserPlus} from "react-feather";
import {AddRoom, UpdateRoom} from "@/Layouts/AddRoom";
import {AddTicket, UpTicket} from "@/Layouts/AddTicket"
import {
    CustomerProps,
    BuildingProps,
    RoomProps,
    TicketsDataProps,
    MemberProps,
    OtherUsersProps, NotificationDataProps, TicketMessagesProps, RouteAuths
} from "@/types/globalProps";
import {AddMember, UpdateMember} from "@/Layouts/AddMember";
import {AgTicketColumCreator} from "@/Components/Columns";
import {AgGridReact} from "ag-grid-react";
import {ColDef, ICellRendererParams, ValueGetterParams} from "ag-grid-community";

interface LocationDetailProps extends PageProps {
    from: string;
    location: BuildingProps;
    allLocaitons: BuildingProps[];
    rooms: RoomProps[];
    clients: CustomerProps[];
    tickets: TicketsDataProps[];
    members: MemberProps[];
    otherusers: OtherUsersProps[];
    klant?: string;
}

export default function KlantLocationDetail({
                                                from,
                                                auth,
                                                location,
                                                rooms,
                                                clients,
                                                tickets,
                                                allLocaitons,
                                                members, otherusers, klant
                                            }: LocationDetailProps) {
    const [upTicketShow, setUpTicketShow] = useState(false);

    const [selectedTab, setSelectedTab] = useState<string>("basisinformatie");
    const [selectedRoom, setSelectedRoom] = useState<RoomProps | null>(rooms && rooms.length > 0 ? rooms[0] : null);
    const [selectedTicket, setSelectedTicket] = useState<TicketsDataProps>(tickets[0]);
    const [SelectedMember, setSelectedMember] = useState<MemberProps>(members[0]);
    const [membersDomData, setMembersDomData] = useState<MemberProps[]>(members);
    const [AddTicketModelShow, setAddTicketModelShow] = useState<boolean>(false);
    const [writeAuth, setWriteAuth] = useState<boolean>(false);
    const [deleteAuth, setDeleteAuth] = useState<boolean>(false);
    const [pageAuth, setPageAuth] = useState<RouteAuths | undefined>();
    const [ticketwriteAuth, setTicketwriteAuth] = useState<boolean>(false);
    const [ticketlar, setTickData] = useState<TicketsDataProps[]>(tickets);
    const [TicketDomData, setTicketDomData] = useState<TicketsDataProps[]>([]);
    const [egerKlant, setEgerKlant] = useState<boolean>(from === 'klant' ? true : false);
    const [egerKlantData, setEgerKlantData] = useState<CustomerProps | null>(null)

    useEffect(() => {
        // Sadece ticketlar'ı filtreleyip TicketDomData'yı güncelleyip takeNotifications çağırıyoruz
        let filteredTickets: TicketsDataProps[] = ticketlar.filter(x => x.status !== 'Closed' && x.status !== 'Cancelled');
        console.log('filtered tickets:', filteredTickets);

        if (JSON.stringify(TicketDomData) !== JSON.stringify(filteredTickets)) {
            setTicketDomData(filteredTickets);
            takeNotifications(filteredTickets); // takeNotifications, yeni filtrelenmiş veriler ile çağrılıyor
        }
    }, [ticketlar]);
    useEffect(() => {
        setTickData(tickets);
        console.log('tickets', tickets);
    }, [tickets]);
    const takeNotifications = (updatedTicketDomData: TicketsDataProps[]) => {
        console.log('before Notis Dom data', updatedTicketDomData);
        axios.get('/api/notifications').then(resp => {
            let notis: NotificationDataProps[] = resp.data as NotificationDataProps[];
            if (updatedTicketDomData.length > 0) {
                notis.forEach(item => {
                    const data = JSON.parse(item.data);
                    if (data.message) {
                        let mesNoti: TicketMessagesProps = data.message;
                        let markTicket = updatedTicketDomData.find(x => x.id === mesNoti.ticket_id);
                        if (markTicket) {
                            markTicket.hasNotis = markTicket.hasNotis ? markTicket.hasNotis + 1 : 1;
                        }
                    } else if (data.tickets) {
                        let tickNoti: TicketsDataProps = data.tickets;
                        let markTicket = updatedTicketDomData.find(x => x.id === tickNoti.id);
                        if (markTicket) {
                            markTicket.hasNotis = markTicket.hasNotis ? markTicket.hasNotis + 1 : 1;
                        }
                    }
                });

                setTicketDomData([...updatedTicketDomData]); // Güncellenmiş array'i setTicketDomData ile atayın
            }
        }).then(() => {
            console.log('afterNotice Dom data', updatedTicketDomData);
        }).catch(err => {
            console.log(err);
        });
    }
    const handleTabClick = (menu: MenuProps) => {
        setSelectedTab(menu.menuValue.toLowerCase());
    };
    const handleClick = (ticketId: number) => {
        setSelectedTicket(ticketlar.filter(x => x.id == ticketId)[0]); // Update state with clicked ticket ID
        console.log("Clicked ticket ID:", ticketId);
    };
    const handleUpdateClick = (ticketId: number) => {
        ticketlar.map((item) => {
            if (item.id === ticketId) {
                setSelectedTicket(item);
                setUpTicketShow(true);
            }
        });
    };
    const handleSelectedRoom = (data: number) => {
        setSelectedRoom(rooms.filter((room: RoomProps) => room.id === data)[0]);
    }
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
    const SidebarData = (): SidebarDataProps[] => {
        console.log(pageAuth);
        let data: SidebarDataProps[] = [
            {
                tittle: 'Locatiedetail',
                showAsTab: true,
                separateRoute: true,
                menu: [
                    {
                        menuValue: 'Basisinformatie',
                        hasSubRoute: false,
                        showSubRoute: false,
                        hasNav: true,
                        NavDb: "#main",
                        route: "#",
                        icon: "la la-home",
                        subMenus: [],
                    },
                ],
            }
        ];
        const ra = [
            {
                menuValue: 'Rooms',
                hasSubRoute: false,
                showSubRoute: false,
                hasNav: true,
                NavDb: "#rooms",
                route: "#",
                icon: "la la-file",
                subMenus: [],
            }, {
                menuValue: 'Meldingen',
                hasSubRoute: false,
                showSubRoute: false,
                hasNav: true,
                NavDb: "#tickets",
                route: "#",
                icon: "la la-file",
                subMenus: [],
            },
            {
                menuValue: 'Prices',
                hasSubRoute: false,
                showSubRoute: false,
                hasNav: true,
                NavDb: "#fiyatlar",
                route: "#",
                icon: "la la-building",
                subMenus: [],
            },
            {
                menuValue: 'Members',
                hasSubRoute: false,
                showSubRoute: false,
                hasNav: true,
                NavDb: "#members",
                route: "#",
                icon: "la la-building",
                subMenus: [],
            },
            {
                menuValue: 'Klants',
                hasSubRoute: false,
                showSubRoute: false,
                hasNav: true,
                NavDb: "#klants",
                route: "#",
                icon: "la la-building",
                subMenus: [],
            },
            {
                menuValue: 'Projects',
                hasSubRoute: false,
                showSubRoute: false,
                hasNav: true,
                NavDb: "#members",
                route: "#",
                icon: "la la-building",
                subMenus: [],
            }, {
                menuValue: 'Contracts',//Client'in sözleşmesi filitrelenecek
                hasSubRoute: false,
                showSubRoute: false,
                hasNav: true,
                NavDb: "#members",
                route: "#",
                icon: "la la-building",
                subMenus: [],
            },
            {
                menuValue: 'Contactpersonen',
                hasSubRoute: false,
                showSubRoute: false,
                hasNav: true,
                NavDb: "#ontactPerson",
                route: "#",
                icon: "la la-building",
                subMenus: [],
            }, {
                menuValue: 'Planing',
                hasSubRoute: false,
                showSubRoute: false,
                hasNav: true,
                NavDb: "#members",
                route: "#",
                icon: "la la-building",
                subMenus: [],
            }, {
                menuValue: 'Staff',
                hasSubRoute: false,
                showSubRoute: false,
                hasNav: true,
                NavDb: "#members",
                route: "#",
                icon: "la la-building",
                subMenus: [],
            },
        ];
        if (pageAuth) {
            pageAuth.children?.forEach(function (x) {
                let z = ra.find(l => l.menuValue == x.page_name);
                if (z && x.read) {
                    data[0].menu.push(z);
                }
            })
        }
        console.log(data);
        return data;
    };
    const SidesssbarData: SidebarDataProps[] = [
        {
            tittle: 'Location Detail',
            showAsTab: true,
            separateRoute: true,
            menu: [
                {
                    menuValue: 'Basisinformatie',
                    hasSubRoute: false,
                    showSubRoute: false,
                    hasNav: true,
                    NavDb: "#basisinformatie",
                    route: "#",
                    icon: "la la-ticket",
                    subMenus: [],
                },
            ]
        }
    ];
    const RoomColumns: ColDef[] = [
        {
            headerName: "Floor Number",
            flex: 1,
            valueGetter: (params: ValueGetterParams) => {
                return `${params.data.floor_number}`;
            },
            cellRenderer: (params: ICellRendererParams) => {
                return (
                    <p>
                        {params.data.floor_number}
                    </p>
                );
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Room Number",
            flex: 1,
            valueGetter: (params: ValueGetterParams) => {
                return `${params.data.room_number}`;
            },
            cellRenderer: (params: ICellRendererParams) => {
                return (
                    <p>
                        {params.data.room_number}
                    </p>
                );
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Room Type",
            flex: 1,
            valueGetter: (params: ValueGetterParams) => {
                return `${params.data.room_type}`;
            },
            cellRenderer: (params: ICellRendererParams) => {
                return (
                    <p>
                        {params.data.room_type}
                    </p>
                );
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Usage Type",
            flex: 2,
            valueGetter: (params: ValueGetterParams) => {
                return `${params.data.useage_type}`;
            },
            cellRenderer: (params: ICellRendererParams) => {
                return (
                    <p>
                        {params.data.useage_type}
                    </p>
                );
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Floor Type",
            flex: 1,
            valueGetter: (params: ValueGetterParams) => {
                return `${params.data.floor_type}`;
            },
            cellRenderer: (params: ICellRendererParams) => {
                return (
                    <p>
                        {params.data.floor_type}
                    </p>
                );
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Wall Type",
            flex: 1,
            valueGetter: (params: ValueGetterParams) => {
                return `${params.data.wall_type}`;
            },
            cellRenderer: (params: ICellRendererParams) => {
                return (
                    <p>
                        {params.data.wall_type}
                    </p>
                );
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Floor Square",
            flex: 1,
            valueGetter: (params: ValueGetterParams) => {
                return `${params.data.floor_square}`;
            },
            cellRenderer: (params: ICellRendererParams) => {
                return (
                    <p>
                        {params.data.floor_square}
                    </p>
                );
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Seperastie glas",
            flex: 1,
            valueGetter: (params: ValueGetterParams) => {
                return `${params.data.Binnenzijde}`;
            },
            cellRenderer: (params: ICellRendererParams) => {
                return (
                    <p>
                        {params.data.Binnenzijde}
                    </p>
                );
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Binnenzijde",//iç cam
            flex: 1,
            valueGetter: (params: ValueGetterParams) => {
                return `${params.data.Buitenzijde}`;
            },
            cellRenderer: (params: ICellRendererParams) => {
                return (
                    <p>
                        {params.data.Buitenzijde}
                    </p>
                );
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Buitenzijde",
            flex: 1,
            valueGetter: (params: ValueGetterParams) => {
                return `${params.data.Seperstie_glas}`;
            },
            cellRenderer: (params: ICellRendererParams) => {
                return (
                    <p>
                        {params.data.Seperstie_glas}
                    </p>
                );
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Action",
            flex: 1,
            cellRenderer: (params: ICellRendererParams) => {
                return (
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
                                data-bs-target="#update_room"
                                onClick={() => handleSelectedRoom(params.data)}
                            >
                                <i className="fa fa-pencil m-r-5"/> Edit
                            </Link>
                            <Link
                                className="dropdown-item"
                                href="#"
                                data-bs-toggle="modal"
                                data-bs-target="#delete"
                                //onClick={() => handleClick(data.id)}
                            >
                                <i className="fa fa-trash m-r-5"/> Delete
                            </Link>
                        </div>
                    </div>
                )
            },
        },
    ];
    const [ticketColumns, setTicketColumns] = useState(AgTicketColumCreator(clients, [location], handleClick, handleUpdateClick, false, false));
    const memberColumns: ColDef[] = [
        {
            headerName: "Member Id",
            flex: 1,
            valueGetter: (params: ValueGetterParams) => {
                return `${params.data.member_id}`;
            },
            cellRenderer: (params: ICellRendererParams) => {
                return (
                    <a href={`/members/${params.data.member_id}`}>
                        {params.data.member_id}
                    </a>
                );
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Member Name",
            flex: 2,
            valueGetter: (params: ValueGetterParams) => {
                return `${params.data.member_name}`;
            },
            cellRenderer: (params: ICellRendererParams) => {
                return (
                    <a href={`/members/${params.data.member_id}`}>
                        {params.data.member_name}
                    </a>
                );
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Location",
            flex: 1,
            valueGetter: (params: ValueGetterParams) => {
                return `${params.data.location_id}`;
            },
            cellRenderer: (params: ICellRendererParams) => {
                return (
                    <a href={`/members/${params.data.member_id}`}>
                        {params.data.location_id}
                    </a>
                );
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Customer",
            flex: 2,
            valueGetter: (params: ValueGetterParams) => {
                return `${params.data.CustomerID}`;
            },
            cellRenderer: (params: ICellRendererParams) => {
                return (
                    <a href={`/members/${params.data.member_id}`}>
                        {params.data.CustomerID}
                    </a>
                );
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Action",
            flex: 1,
            cellRenderer: (params: ICellRendererParams) => (
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
                            data-bs-target="#up_member"
                            onClick={() => setSelectedMember(params.data)}
                        >
                            <i className="fa fa-pencil m-r-5"/> Edit
                        </Link>
                        <Link
                            className="dropdown-item"
                            href="#"
                            data-bs-toggle="modal"
                            data-bs-target="#delete"
                            //onClick={() => setSelectedTicket(data)}
                        >
                            <i className="fa fa-trash m-r-5"/> Delete
                        </Link>
                    </div>
                </div>
            ),
        },
    ];
    useEffect(() => {
        if (!egerKlant && !window.location.pathname.includes("klantdetail")) {
            let pageauth = auth.user.permissions.find(x => x.page_name == 'Gebouwen');
            if (pageauth) {
                setWriteAuth(pageauth.write);
                setDeleteAuth(pageauth.delete);
                setPageAuth(pageauth);
                let meldingAuths = pageauth.children?.find(x => x.page_name == 'Meldingen');
                if (meldingAuths) {
                    setTicketColumns(AgTicketColumCreator(clients, [location], handleClick, handleUpdateClick, meldingAuths.delete, meldingAuths.write));
                    setTicketwriteAuth(meldingAuths.write);
                } else setTicketColumns(AgTicketColumCreator(clients, [location], handleClick, handleUpdateClick, false, false));
            }
        } else {
            let pageauth = auth.user.permissions.find(x => x.page_name == 'Bedrijven')?.children?.find(x => x.page_name == 'Locatie');
            if (pageauth) {
                setWriteAuth(pageauth.write);
                setDeleteAuth(pageauth.delete);
                setPageAuth(pageauth);
                let meldingAuths = pageauth.children?.find(x => x.page_name == 'Meldingen');
                if (meldingAuths) {
                    setTicketColumns(AgTicketColumCreator(clients, [location], handleClick, handleUpdateClick, meldingAuths.delete, meldingAuths.write));
                    setTicketwriteAuth(meldingAuths.write);
                } else setTicketColumns(AgTicketColumCreator(clients, [location], handleClick, handleUpdateClick, false, false));
            }
        }
        if (egerKlant && klant) {
            let cl = clients.find(item => item.CustomerID == klant);
            if (cl) setEgerKlantData(cl);
        }
    }, [auth]);
    const UpsateTicketRenew = (updatedTicket: TicketsDataProps) => {
        const updatedList = ticketlar.map(ticket => {
            if (ticket.id === updatedTicket.id) {
                return {...ticket, ...updatedTicket};
            }
            return ticket;
        })
        setTickData(updatedList);
    }
    const addingNewTicketHandler = (newTicket: TicketsDataProps) => {
        setTickData(prevState => [
            newTicket, ...prevState
        ])
    };
    const handleAddMemberClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (selectedTab != 'members') setSelectedTab('members');
    }
    const addMemberHandle = (addedMember: MemberProps) => {
        setMembersDomData(prevState => [addedMember, ...prevState]);
    }
    const upMemberHandle = (updatedMember: MemberProps) => {
        const updatedList = members.map(member => {
            if (member.id === updatedMember.id) {
                return {...member, ...updatedMember};
            }
            return member;
        })
        setMembersDomData(updatedList);
    }
    const handleTicket = (Ticket: TicketsDataProps | null) => {
        if (Ticket) setTicketDomData(prev => [Ticket, ...prev]);
    }
    const ticketMessageDataHandler = (args: {
        newTicketMessage?: TicketMessagesProps;
        detailUpdateNeeded?: number;
    } | null) => {
        if (args?.newTicketMessage?.ticket_id) {
            let message: TicketMessagesProps = args.newTicketMessage as TicketMessagesProps;
            let action = TicketDomData.find(x => x.id === message.ticket_id);
            if (action) {
                action.hasNotis ? action.hasNotis++ : action.hasNotis = 1;
            }
        }
    }
    const totalRoomSquere = () => {
        let total: number = 0;
        rooms.forEach(item => {
            if (item.useage_type != 'NVT')
                total += parseFloat(item.floor_square);
        });
        return (Math.round(total * Math.pow(10, 2)) / Math.pow(10, 2)).toString();
    }
    const totalUsageSqueres = () => {
        let usage = rooms.reduce((acc, current) => {
            const key = `${current.useage_type}`;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(current);
            return acc;
        }, {} as Record<string, typeof rooms>);
        const data: { type: string; totalSquere: number; persant: number }[] = [];
        Object.keys(usage).forEach(item => {
            const groupname = item;
            let totalofGroup = 0;
            usage[item].map(x => {
                totalofGroup += parseFloat(x.floor_square);
            });
            data.push({type: item, totalSquere: totalofGroup, persant: 0});
        })
        let grandTotal: number = 0;
        data.map(x => {
            if (x.type != 'NVT') {
                grandTotal += x.totalSquere;
            }
        });
        return data.map(x => {
            if (x.type != 'NVT') {
                x.persant = (x.totalSquere / grandTotal) * 100;
            }
            return (
                <ul>
                    <li>
                        <p>{x.type}</p>
                    </li>
                    <li>
                        <p>{Math.round(x.totalSquere * Math.pow(10, 2)) / Math.pow(10, 2)}</p>
                    </li>
                    <li>
                        <p>%{Math.round(x.persant * Math.pow(10, 2)) / Math.pow(10, 2)} </p>
                    </li>
                </ul>
            )
        });

    }
    const [isSidebarExpanded, setSidebarExpanded] = useState<boolean>(false);
    return (
        <AuthenticatedLayout user={auth.user}
                             header={<h2>&nbsp;Location Detail of {location.BuildingName}</h2>}
                             collectNotification={false}
                             notificationDataHandler={handleTicket} isSidebarExpanded={isSidebarExpanded}
                             setSidebarExpanded={setSidebarExpanded}
                             isTicketTableActive={selectedTab == 'meldingen' ? true : false}
                             isMessageTableActive={false}
                             ticketMessageDataHandler={ticketMessageDataHandler}
                             SidebarData={SidebarData()} handleTabClick={handleTabClick}
        >
            <Head title={'Locatiegegevens'}/>
            <div className="page-wrapper">
                <div className="content container-fluid">
                    {/* Page Header */}
                    <div className="page-header">
                        <div className="row align-items-start">
                            <div className="col-sm-2">
                                <h3 className="page-title">Locatiegegevens</h3>
                                {egerKlant && egerKlantData ? (
                                    <ul className="breadcrumb">
                                        <li className="breadcrumb-item"><Link href={route('dashboard')}>Dashboard</Link>
                                        </li>
                                        <li className="breadcrumb-item"><Link
                                            href={`/klantdetail/${egerKlantData.CustomerID}`}>{egerKlantData.Unvan}</Link>
                                        </li>
                                        <li className="breadcrumb-item active"><Link
                                            href={'#'}>{location.BuildingName}</Link>
                                        </li>
                                    </ul>
                                ) : (
                                    <ul className="breadcrumb">
                                        <li className="breadcrumb-item"><Link
                                            href={route('dashboard')}>Dashboard</Link>
                                        </li>
                                        <li className="breadcrumb-item"><Link
                                            href={route('locations')}>Locatie</Link>
                                        </li>
                                        <li className="breadcrumb-item active"><Link
                                            href={'#'}>{location.BuildingName}</Link>
                                        </li>
                                    </ul>)}
                            </div>
                            <div className="col-sm-10">
                                <div className="col-sm-12">
                                    <div className="contact-wrap">
                                        <div className="contact-profile">
                                            <div className="name-user flex flex-row">
                                                <Select id='customerSelect'
                                                        options={allLocaitons?.map((item) => ({
                                                            value: item.id,
                                                            label: item.BuildingName
                                                        }))}
                                                        defaultValue={
                                                            allLocaitons && allLocaitons.length > 0 ?
                                                                allLocaitons.filter((item: BuildingProps) => location.id === item.id).map((item: BuildingProps) => ({
                                                                    value: item.id,
                                                                    label: item.BuildingName
                                                                })) : null}
                                                        styles={customStyles}
                                                        onChange={(e: any) => {
                                                            if (e) {
                                                                let locationUrl;
                                                                if (egerKlant && egerKlantData) {
                                                                    locationUrl = `/klantdetail/${egerKlantData.CustomerID}/locatie/${e.value}`;
                                                                } else locationUrl = `/locations/detail/${e.value}`;
                                                                window.location.href = locationUrl;
                                                            }
                                                        }}
                                                />
                                                <br/>
                                                <p className={'ml-3 mt-2'}><i
                                                    className="las la-map-marker"/>{location.locationadress}</p>
                                            </div>
                                        </div>
                                        {writeAuth ? (<div className="contacts-action">
                                            <a data-bs-toggle="modal" data-bs-target="#add_room"
                                               className="btn btn-pink"> <PlusCircle className='me-1' size={25}/>Add
                                                Room</a>
                                            {ticketwriteAuth ? (<a onClick={() => setAddTicketModelShow(true)}
                                                                   className="btn btn-primary px-2 mx-2">
                                                <i className="fa fa-plus"/> <span></span>{"New Meldingen"}
                                            </a>) : null}
                                            <a onClick={(e) => handleAddMemberClick(e)} className="btn btn-primary"
                                               data-bs-toggle="modal"
                                               data-bs-target="#add_member"> <UserPlus className='me-1' size={25}/>Add
                                                Member</a>
                                            {deleteAuth ? (<div className="dropdown">
                                                <Link href="#" className="dropdown-toggle marg-tp"
                                                      data-bs-toggle="dropdown"
                                                      aria-expanded="false"><MoreVertical size={25}/></Link>
                                                <div className="dropdown-menu dropdown-menu-right">
                                                    <Link className="dropdown-item" href="#" data-bs-toggle="modal"
                                                          data-bs-target="#delete_company">Delete</Link>
                                                </div>
                                            </div>) : null}
                                        </div>) : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* /Page Header */}
                    {/* /Information */}
                    <hr/>
                    <div className="row">
                        {/* Contact User */}

                    </div>
                    {/* /Information */}
                    {/*Tab Content*/}
                    <div className="contact-tab-view">
                        <div className="tab-content pt-0">
                            {/*BaseInfo*/}
                            <div className={"tab-pane " + (selectedTab === "basisinformatie" ? "active show" : "fade")}
                                 id="main">
                                Bilgi verilebilir ya da iş planına evrilebilir.
                            </div>
                            {/*BaseInfo*/}
                            {/*Rooms*/}
                            <div className={"tab-pane " + (selectedTab === "rooms" ? "active show" : "fade")}
                                 id="rooms">
                                <div className="view-header">
                                    <ul>
                                        <li>
                                            <p className="com-add">Total squere</p>
                                            <p className="com-add">{totalRoomSquere()}</p>
                                        </li>
                                        <li>
                                            <p className="com-add">Usage/ Square/ percentage</p>
                                            {totalUsageSqueres()}
                                        </li>
                                    </ul>
                                </div>
                                <div className={'ag-theme-quartz ag-theme-mycustomtheme'}>
                                    <AgGridReact<RoomProps>
                                        columnDefs={RoomColumns}
                                        rowData={rooms}
                                        pagination={false}
                                        domLayout='autoHeight'
                                        onGridReady={(params) => params.api.sizeColumnsToFit()}
                                    />
                                </div>
                            </div>
                            {/*Rooms*/}
                            {/*Prices*/}
                            {/*Prices*/}
                            {/*Members*/}
                            <div className={"tab-pane " + (selectedTab === "members" ? "active show" : "fade")}
                                 id="tickets">
                                <div className={"ag-theme-quartz ag-theme-mycustomtheme"}>
                                    <AgGridReact<MemberProps>
                                        columnDefs={memberColumns}
                                        rowData={membersDomData && membersDomData.length > 0 ? membersDomData : []}
                                        pagination={false}
                                        domLayout='autoHeight'
                                        onGridReady={(params) => params.api.sizeColumnsToFit()}
                                    />
                                </div>
                            </div>
                            {/*Members*/}
                            {/*Tickets*/}
                            <div className={"tab-pane " + (selectedTab === "meldingen" ? "active show" : "fade")}
                                 id="tickets">
                                <div className={'ag-theme-quartz ag-theme-mycustomtheme'}>
                                    <AgGridReact<TicketsDataProps>
                                        columnDefs={ticketColumns}
                                        rowData={TicketDomData}
                                        pagination={false}
                                        domLayout='autoHeight'
                                        onGridReady={(params) => params.api.sizeColumnsToFit()}
                                    />
                                </div>
                            </div>
                            {/*Tickets*/}
                        </div>
                    </div>
                    {/*Tab Content*/}
                </div>
            </div>
            <div className="modal custom-modal fade" id="delete" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="form-header">
                                <h3 className="text-rose-600">
                                    <li className="fa fa-warning"></li>
                                    Çalışmıyor!
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                writeAuth && rooms && rooms.length > 0 ? (
                    <>
                        <AddTicket AddTicketModelShow={AddTicketModelShow}
                                   ticketDataHandler={addingNewTicketHandler}
                                   otherUsers={otherusers}
                                   customer={clients}
                                   user={auth.user}
                                   buildings={[location]}
                                   islocationDetail={true}
                                   onHide={() => setAddTicketModelShow(false)}/>
                        <UpdateRoom room={selectedRoom ? selectedRoom : null} kullanici={auth.user}
                                    building={location}/>
                        {tickets && tickets.length > 0 ?
                            (<UpTicket ticketDataHandler={UpsateTicketRenew} otherUsers={otherusers} customer={clients}
                                       user={auth.user}
                                       buildings={[location]}
                                       islocationDetail={true}
                                       ticket={selectedTicket}
                                       UpTicketModelShow={upTicketShow}
                                       onHide={() => setUpTicketShow(false)}
                            />) : null}
                    </>
                ) : null
            }
            {writeAuth && location ? (
                <>
                    <AddRoom kullanici={auth.user} building={location}/>
                    <AddMember addMemberHandle={addMemberHandle} building={location} customer={clients[0]}/>
                    {members.length > 0 ?
                        <UpdateMember updateMemberHandle={upMemberHandle} member={SelectedMember}/> : null}
                </>
            ) : null}

        </AuthenticatedLayout>
    )
}
