import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link} from '@inertiajs/react';
import {PageProps} from '@/types';
import MainMenuButtons from '@/Layouts/MainMenuButtons';
import Sidebar, {MenuProps, SidebarDataProps, SubMenuProps} from '@/Layouts/Sidebar';
import React, {useEffect, useState} from "react";
import Select from "react-select";
import {Mail, MessageCircle, MoreVertical, PlusCircle, UserPlus, ShoppingBag, Phone, Calendar} from "react-feather";
import {Table} from "antd";
import moment from "moment";
import axios from "axios";
import {CreateProject} from "@/Components/CrateProject";
import {
    CustomerProps,
    BuildingProps,
    RoomProps,
    MemberProps,
    memberRommsProps,
    TicketsDataProps, OtherUsersProps, TicketMessagesProps, NotificationDataProps
} from "@/types/globalProps";
import {AddMember, UpdateMember} from "@/Layouts/AddMember";
import {TicketColumCreator} from "@/Components/Columns";
import {AddTicket, UpTicket} from "@/Layouts/AddTicket";
import {AddRoom, UpdateRoom} from "@/Layouts/AddRoom";

interface dataProps extends PageProps {
    projects: string;
    contracts: string;
    member: MemberProps;
    location: BuildingProps;
    allLocaitons: BuildingProps[];
    rooms: RoomProps[];
    client: CustomerProps;
    memberRoom: memberRommsProps[];
    tickets: TicketsDataProps[];
    otherusers: OtherUsersProps[];
}

export default function MemberDetail({
                                         auth,
                                         member,
                                         client,
                                         location,
                                         allLocaitons,
                                         rooms,
                                         memberRoom,
                                         tickets, otherusers
                                     }: dataProps) {
    const [upTicketShow, setUpTicketShow] = useState(false);
    const [triggerRender, setTriggerRender] = useState(false);
    const [selectedTab, setSelectedTab] = useState<string>("basisinformatie");
    const [ticketlar, setTickData] = useState<TicketsDataProps[]>(tickets);
    const [clickedTicketId, setClickedTicketId] = useState<number | null>(null);
    const [updateTicket, setUpdateTicket] = useState({
        id: 0,
        opener_name: auth.user.name,
        customer: "",
        building: "-1",
        refnum: "",
        status: "New",
        title: "",
        delete: "0",
        created_at: new Date(),
        updated_at: new Date(),
        ticketsubject: ""
    });
    const [selectedTicket, setSelectedTicket] = useState<TicketsDataProps>(tickets[0]);
    const [TicketDomData, setTicketDomData] = useState<TicketsDataProps[]>([]);

    useEffect(() => {
        setTicketDomData(ticketlar.filter(x => x.status !== 'Closed' && x.status !== 'Cancelled'));
        takeNotifications();
        setTriggerRender(prev => !prev);
    }, [ticketlar]);
    useEffect(() => {
        takeNotifications();
        setTriggerRender(prev => !prev);
    }, [TicketDomData]);
    const takeNotifications =  () => {
        axios.get('/api/notifications').then(resp => {
            let notis: NotificationDataProps[] = resp.data as NotificationDataProps[];
            notis.forEach(item => {
                const data = JSON.parse(item.data);
                if (data.message) {
                    let mesNoti: TicketMessagesProps = data.message;
                    let markTicket = TicketDomData.filter(x => x.id === mesNoti.ticket_id)[0];
                    if (markTicket) if(markTicket.hasNotis) markTicket.hasNotis++; else markTicket.hasNotis = 1;
                    setTriggerRender(prev => !prev);
                } else if (data.tickets) {
                    let tickNoti: TicketsDataProps = data.tickets;
                    let markTicket = TicketDomData.filter(x => x.id === tickNoti.id)[0];
                    if (markTicket) if(markTicket.hasNotis) markTicket.hasNotis++; else markTicket.hasNotis = 1;
                    setTriggerRender(prev => !prev);
                }
            })
        }).then(()=>{
            setTriggerRender(prev => !prev);
        }).catch(err => {
            console.log(err);
            setTriggerRender(prev => !prev);
        });
    }
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
    const [AddTicketModelShow, setAddTicketModelShow] = useState<boolean>(false);
    const SidebarData: SidebarDataProps[] = [
        {
            tittle: 'MAIN',
            showAsTab: true,
            separateRoute: true,
            menu: [
                {
                    menuValue: 'Dashboard',
                    hasSubRoute: false,
                    showSubRoute: false,
                    hasNav: false,
                    route: route('dashboard'),
                    icon: "la la-dashcube",
                    subMenus: [],
                },
                {
                    menuValue: 'Meldingen',
                    hasSubRoute: false,
                    showSubRoute: false,
                    hasNav: false,
                    route: route('tickets'),
                    icon: "la la-ticket",
                    subMenus: [],
                },
            ],
        }, {
            tittle: 'Member Detail',
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
            ]
        }
    ];
    if (auth.user.roleName != 'user') {
        SidebarData[0].menu.push({
                menuValue: 'Klanten',
                hasSubRoute: false,
                showSubRoute: false,
                hasNav: false,
                route: route('clients'),
                icon: "la la-building",
                subMenus: [],
            },
            {
                menuValue: 'Locations',
                hasSubRoute: false,
                showSubRoute: false,
                hasNav: false,
                route: route('locations'),
                icon: "la la-building",
                subMenus: [],
            },)
    }
    const handleClick = (ticketId: number) => {
        setClickedTicketId(ticketId); // Update state with clicked ticket ID
        console.log("Clicked ticket ID:", ticketId);
    };
    const handleUpdateClick = (ticketId: number) => {
        ticketlar.map((item) => {
            if (item.id === ticketId) {
                console.log(item);
                setUpdateTicket(item);
            } else {
                console.log("Somethink is wrong with ticket: ", ticketId);
            }
        })

    };
    const ticketsColumns = TicketColumCreator([client], [location], handleClick, handleUpdateClick);
    const handleTabClick = (menu: MenuProps) => {
        setSelectedTab(menu.menuValue.toLowerCase());
    };
    const customStyles = {
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.isFocused ? "#ff9b44" : "#fff",
            color: state.isFocused ? "#fff" : "#000",
            "&:hover": {
                backgroundColor: "#ff9b44",
            },
            width: "100%"
        }),
    };
    const memberColumns = [
        {
            title: "Room Number",
            dataIndex: "room_number",
            render: (text: any) => (
                <span className={'flex flex-row-reverse'}>{text}</span>
            ),
            sorter: (a: any, b: any) => a.ticketid.length - b.ticketid.length,
        },
        {
            title: "Movein Date",
            dataIndex: "start_date",
            render: (text: any) => (
                <span className={'flex flex-row-reverse'}>{text}</span>
            ),
            sorter: (a: any, b: any) => a.ticketsubject.length - b.ticketsubject.length,
        },
        {
            title: "Moveout Date",
            dataIndex: "cıkıs_tarihi",
            render: (text: any) => (
                <span className={'flex flex-row-reverse'}>{text}</span>
            ),
            sorter: (a: any, b: any) => a.name.length - b.name.length,
        },
        {
            title: "Floor Number",
            dataIndex: "floor_number",
            sorter: (a: any, b: any) => a.name.length - b.name.length,
        },
        {
            title: "Room Type",
            dataIndex: "room_type",
            sorter: (a: any, b: any) => a.name.length - b.name.length,
        },
        {
            title: "Usage Type",
            dataIndex: "useage_type",
            sorter: (a: any, b: any) => a.name.length - b.name.length,
        },
        {
            title: "Action",
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
                            data-bs-target="#up_member"
                            //onClick={() => setSelectedMember(data)}
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
            sorter: true,
        },
    ];
    const RoomColumns = [
        {
            title: "Action",
            dataIndex: "id",
            render: (data: number) => (
                <Link href="#" onClick={(e) => {
                    const formData = {member_id: member.member_id, room_id: data.toString()};
                    axios.post('/api/selectmembersrooms', formData).then(response => {
                        console.log('Room added sucsessfully:', response.data);
                        window.location.reload();
                    }).catch(err => {

                        console.error('There is an error accured while adding a room:', err);
                    });
                }} className="btn-icon flex flex-row-reverse"><PlusCircle size={15}/></Link>
            ),
            sorter: true,
        },
        {
            title: "Floor Number",
            dataIndex: "floor_number",
            sorter: (a: any, b: any) => a.ticketid.length - b.ticketid.length,
        },
        {
            title: "Room Number",
            dataIndex: "room_number",
            render: (text: any) => (
                <span className={'flex flex-row-reverse'}>{text}</span>
            ),
            sorter: (a: any, b: any) => a.ticketsubject.length - b.ticketsubject.length,
        },
        {
            title: "Room Type",
            dataIndex: "room_type",
            sorter: (a: any, b: any) => a.ticketsubject.length - b.ticketsubject.length,
        },
        {
            title: "Usage Type",
            dataIndex: "useage_type",
            sorter: (a: any, b: any) => a.ticketsubject.length - b.ticketsubject.length,
        },
        {
            title: "Floor Type",
            dataIndex: "floor_type",
            sorter: (a: any, b: any) => a.ticketsubject.length - b.ticketsubject.length,
        },
        {
            title: "Floor Square",
            dataIndex: "floor_square",
            render: (text: any) => (
                <span className={'flex flex-row-reverse'}>{text}</span>
            ),
            sorter: (a: any, b: any) => a.ticketsubject.length - b.ticketsubject.length,
        },
    ];
    const handleTicket = (Ticket: TicketsDataProps | null) => {
        if (Ticket) setTicketDomData(prev => [Ticket, ...prev]);
    }
    const ticketMessageDataHandler = (args: {
        newTicketMessage?: TicketMessagesProps;
        detailUpdateNeeded?: number;
    } | null) => {
        if (args && args.newTicketMessage ) {
            let message: TicketMessagesProps = args.newTicketMessage as TicketMessagesProps;
            let action = TicketDomData.find(x => x.id === message.ticket_id);
            if (action) {
                action.hasNotis ? action.hasNotis++ : action.hasNotis = 0;
            }
        }
        setTriggerRender(prev => !prev);
    };

    const [isSidebarExpanded, setSidebarExpanded] = useState<boolean>(false);
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2>&nbsp;Member Detail
                of {client.Unvan}'s {location && location.BuildingName ? location.BuildingName : ' '}</h2>}
            collectNotification={false}
            notificationDataHandler={handleTicket} isSidebarExpanded={isSidebarExpanded}
            setSidebarExpanded={setSidebarExpanded}
            isTicketTableActive={selectedTab == 'meldingen' ? true : false}
            isMessageTableActive={false}
            ticketMessageDataHandler={ticketMessageDataHandler}
            SidebarData={SidebarData} handleTabClick={handleTabClick}
        >
            <div className="page-wrapper">
                <div className="content container-fluid">
                    {/* Page Header */}
                    <div className="page-header">
                        <div className="row align-items-center">
                            <div className="col-md-12">
                                <h3 className="page-title">Member Detail</h3>
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link href={route('dashboard')}>Dashboard</Link>
                                    </li>
                                    <li className="breadcrumb-item active"><Link href={route('clients')}>Klanten</Link>
                                    </li>
                                    <li className="breadcrumb-item active"><Link
                                        href={client?.CustomerID ? route('showRealitedCustomer', {customerid: client.CustomerID}) : route('clients')}>{client.Unvan}</Link>
                                    </li>
                                    <li className="breadcrumb-item active"><Link
                                        href={'/locations/detail/'+ location.id}>{location.BuildingName}</Link>
                                    </li>
                                    <li className="breadcrumb-item active"><Link
                                        href={'#'}>{member.member_name}</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {/* /Page Header */}
                    {/* /Information */}
                    <hr/>
                    <div className="row">
                        {/* Contact User */}
                        <div className="col-md-12">
                            <div className="contact-wrap">
                                <div className="contact-profile">
                                    <div className="name-user">
                                        <h3>{member.member_name}</h3>
                                        <h4>{location.BuildingName}</h4>

                                        <p><i className="las la-map-marker"/>{location.locationadress}</p>
                                    </div>
                                </div>
                                <div className="contacts-action">
                                    <Link href="#" data-bs-toggle="modal" data-bs-target="#add_room"
                                          className="btn btn-pink"> <PlusCircle className='me-1' size={25}/>Add
                                        Room</Link>
                                    <a className="btn btn-primary" onClick={() => setAddTicketModelShow(true)}>
                                        <Mail className='me-1' size={25}/>Send
                                        Ticket</a>
                                    <Link href="#" className="btn btn-primary" data-bs-toggle="modal"
                                          data-bs-target="#add_project"> <ShoppingBag className='me-1' size={25}/>Add
                                        Project</Link>
                                    <div className="dropdown">
                                        <Link href="#" className="dropdown-toggle marg-tp" data-bs-toggle="dropdown"
                                              aria-expanded="false"><MoreVertical size={25}/></Link>
                                        <div className="dropdown-menu dropdown-menu-right">
                                            <Link className="dropdown-item" href="#" data-bs-toggle="modal"
                                                  data-bs-target="#delete_company">Delete</Link>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="contact-tab-view">
                                <div className="tab-content pt-0">
                                    <div
                                        className={"tab-pane " + (selectedTab === "basisinformatie" ? "active show" : "fade")}
                                        id="basisinformatie">
                                        <div className="col-xl-12">
                                            <div className="card contact-sidebar">
                                                <h5>Basisinformatie</h5>
                                                <ul className="basic-info">
                                                    <li>
                                            <span>
                                                <Mail size={15}/>
                                            </span>
                                                        <p>{member.email}</p>
                                                    </li>
                                                    <li>
                                            <span>
                                                <Phone size={15}/>
                                            </span>
                                                        <p>{member.phone_number}</p>
                                                    </li>
                                                    <li>
                                            <span>
                                                <Calendar size={15}/>
                                            </span>
                                                        <p>Gemaakt
                                                            op {moment(member.created_at).format('YYYY-MM-DD HH:mm')}</p>
                                                    </li>
                                                </ul>
                                                <h5>Other Information</h5>
                                                <ul className="other-info">
                                                    <li><span
                                                        className="other-title">Laatste update</span><span>{moment(member.updated_at).format('YYYY-MM-DD HH:mm')}</span>
                                                    </li>
                                                    <li><span
                                                        className="other-title">Postcode</span><span>{member.postal_code}</span>
                                                    </li>
                                                    <li><span
                                                        className="other-title">Land</span><span>{member.adres}</span>
                                                    </li>
                                                    <li><span
                                                        className="other-title">Land</span><span>{member.billsendtype}</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={"tab-pane " + (selectedTab === "rooms" ? "active show" : "fade")}
                                         id="rooms">
                                        <Table
                                            className="table-striped"
                                            rowKey={(record) => record.id}
                                            style={{overflowX: "auto"}}
                                            columns={memberColumns}
                                            dataSource={memberRoom && memberRoom.length > 0 ? memberRoom : []}
                                        />
                                    </div>
                                    <div className={"tab-pane " + (selectedTab === "meldingen" ? "active show" : "fade")}
                                         id="tickets">
                                        <Table
                                            className="table-striped"
                                            rowKey={(record) => record.id}
                                            style={{overflowX: "auto"}}
                                            columns={ticketsColumns}
                                            dataSource={ticketlar && ticketlar.length > 0 ? ticketlar : []}
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <CreateProject member={member} location={location} allLocaitons={allLocaitons}
                           rooms={rooms}
                           client={client} memberRoom={memberRoom}/>

            <div className="modal modal-fullscreen !w-full custom-modal fade" id="add_room"
                 role="dialog">
                <div className="modal-dialog modal-dialog-centered modal-xl">
                    <div className="modal-content modal-fullscreen !w-full">
                        <div className="modal-body !w-full">
                            <div className="form-header !w-full">
                                <Table
                                    className="table-striped !w-full"
                                    rowKey={(record) => record.id}
                                    style={{overflowX: "auto"}}
                                    columns={RoomColumns}
                                    dataSource={rooms && rooms.length > 0 ? rooms : []}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AddTicket AddTicketModelShow={AddTicketModelShow}
                       ticketDataHandler={addingNewTicketHandler}
                       otherUsers={otherusers}
                       customer={[client]}
                       user={auth.user}
                       buildings={[location]} islocationDetail={true}
                       onHide={() => setAddTicketModelShow(false)}/>
            {ticketlar && ticketlar.length > 0 ? (
                <UpTicket ticketDataHandler={UpsateTicketRenew} otherUsers={otherusers} customer={[client]}
                          user={auth.user}
                          buildings={[location]}
                          islocationDetail={true}
                          ticket={selectedTicket}
                          UpTicketModelShow={upTicketShow}
                          onHide={()=>setUpTicketShow(false)}
                />) : null}
        </AuthenticatedLayout>
    );
}
