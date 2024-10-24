import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link} from '@inertiajs/react';
import {PageProps} from '@/types';
import React, {useState, useEffect, useRef} from 'react';
import DeleteModal from '@/Layouts/DeleteModal';
import {Table} from "antd";
import Select, {GroupBase, SelectInstance} from 'react-select';
import Sidebar, {MenuProps, SidebarDataProps} from "@/Layouts/Sidebar";
import {AddTicket, UpTicket} from "@/Layouts/AddTicket";
import {User} from '@/types';
import {TicketCardView} from "@/Components/TicketCardView";
import Cookies from 'js-cookie';
import {
    TicketFilterProps,
    ticketFilter,
    calculateStatuses,
    isToday,
    isThisWeek,
    isThisYear,
    isThisMonth
} from '@/types/TicketFilter'
import {
    BuildingProps,
    TicketsDataProps,
    TicketSum,
    RoomProps,
    CustomerProps, OtherUsersProps, NotificationDataProps, TicketMessagesProps
} from "@/types/globalProps";
import "react-datepicker/dist/react-datepicker.css";
import ReactDatePicker from "react-datepicker";
import {TicketColumCreator, rowClassName} from '@/Components/Columns'
import axios from "axios";
import {Await} from "react-router-dom";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

interface PagePropsWithUsers extends PageProps {
    ticketsData: TicketsDataProps[] | null;
    roomlar: RoomProps[] | null;
    buildingler: BuildingProps[] | null;
    customers: CustomerProps[] | null;
    otherusers: OtherUsersProps[];
    notifications: NotificationDataProps[] | null;
}

function Tickets({
                     auth,
                     ticketsData,
                     buildingler,
                     roomlar,
                     customers,
                     otherusers,
                     notifications
                 }: PagePropsWithUsers) {
    const statusSelectRef = useRef<SelectInstance<any, false, GroupBase<any>>>(null);

    const [upTicketShow, setUpTicketShow] = useState(false);
    const [TicketDomData, setTicketDomData] = useState<TicketsDataProps[]>([]);
    const [TicketDataList, setTicketDataList] = useState<TicketsDataProps[]>(ticketsData ?? []);
    const [buildings, setBuildings] = useState<BuildingProps[]>(buildingler ?? []);
    const [rooms, setRoom] = useState<RoomProps[]>(roomlar ?? []);
    const [customer, setCustomers] = useState<CustomerProps[]>(customers ?? []);
    const [clickedTicketId, setClickedTicketId] = useState<number | null>(null);
    const [AddTicketModelShow, setAddTicketModelShow] = useState<boolean>(false);
    const [updateTicket, setUpdateTicket] = useState<TicketsDataProps>(ticketsData ? ticketsData[0] : {
        id: 0,
        ticket_to: "",
        customer: "",
        building: "-1",
        status: "",
        ticketsubject: "",
        refnum: "",
        delete: "1",
        title: "",
        opener_name: "",
        ticket_type: "new",
        created_at: new Date(),
        updated_at: new Date()
    });
    const [selectedTab, setSelectedTab] = useState<string>("rooms");
    const startOfYear = new Date();
    startOfYear.setMonth(0); // Ocak (0. indeks) ayı
    startOfYear.setDate(1); // Ayın ilk günü
    const today = new Date();
    const pazartesi = today.getDate() - today.getDay() +1;
    const startOfWeek = new Date(today.setDate(pazartesi));
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(today.setDate(pazartesi + 6));
    if (endOfWeek < startOfWeek) {
        endOfWeek.setMonth(startOfWeek.getMonth() + 1); // Yeni ayı ayarla
    }
    endOfWeek.setHours(23, 59, 59, 999);
    const [filterConfigs, setFilterConfigs] = useState<TicketFilterProps>({
        allTickets: TicketDataList,
        id: -2,
        customer: 'all',
        building: "-2",
        status: 'New',
        filterforDate: false,
        startDate: startOfWeek,
        endDate: endOfWeek,
        ticketType: 'all',
        Title: '',
        dateRange: 'thisWeek',
    });
    const [IDfocused, setIDFocused] = useState(false);
    const [Titlefocused, setTitleFocused] = useState(false);
    const [inputIDValue, setInputIDValue] = useState<string>('');
    const [inputTitleValue, setInputTitleValue] = useState("");
    const [showDetails, setShowDetails] = useState<boolean>(true);
    const [showFilters, setShowFilters] = useState<boolean>(true);
    const [showT_Text, setShowT_Text] = useState<boolean>(true);
    const [deleteShow, setDeleteShow] = useState<boolean>(false);
    const [LocationFilterOptions, setLocationFilterOptions] = useState<{
        value: number;
        label: string
    }[]>([{value: -2, label: 'Alle'}, ...buildings.map(x => ({
        value: x.id,
        label: x.LocationID + '-' + x.BuildingName
    }))]);
    const [CustomerFilterOptions, setCustomerFilterOptions] = useState<{
        value: string,
        label: string
    }[]>([{value: 'all', label: 'Alle'}, ...customer.sort((a, b) => {
        return a.CustomerID.localeCompare(b.CustomerID)
    }).map(x => ({value: x.CustomerID, label: x.Unvan}))]);
    const [ticketSums, setTicketSums] = useState<TicketSum[] | null>(null)
    const [listView, setListView] = useState<boolean>();
    const MySwal = withReactContent(Swal);

    const setFilteredConfigsToDefault = () => {
        setFilterConfigs({
            allTickets: TicketDataList,
            id: -2,
            customer: 'all',
            building: "-2",
            status: 'New',
            filterforDate: false,
            startDate: startOfWeek,
            endDate: endOfWeek,
            ticketType: 'all',
            Title: '',
            dateRange: 'thisWeek',
        })
    }
    useEffect(() => {
        const listcookie = Cookies.get('listView');
        if (listcookie === '1') {
            setListView(true);
            setFilterConfigs(prevConfig => ({
                ...prevConfig,
                status: 'all',
            }));
        } else setListView(false);
    }, []);
    useEffect(() => {
        if(listView === false && filterConfigs.status === 'New') {
            setFilterConfigs(prevConfig => ({
                ...prevConfig,
                status: 'all',
                startDate: startOfWeek,
                endDate: endOfWeek,
            }));
        }else if(listView === true && filterConfigs.status === 'all') {
            setFilterConfigs(prevConfig => ({
                ...prevConfig,
                status: 'New',
                startDate: startOfWeek,
                endDate: endOfWeek,
            }));
        }
    }, [listView]);
    useEffect(() => {
        if (window.innerWidth < 992) {
            setShowDetails(false);
            setShowFilters(false);
            setShowT_Text(false);
        }
    }, [window.innerWidth]);
    useEffect(() => {
        setFilterConfigs(prevConfig => ({
            ...prevConfig,
            allTickets: TicketDataList,
        }));
        takeNotifications('ticket data list');
    }, []);
    useEffect(() => {
        setFilterConfigs(prev => ({
            ...prev,
            allTickets: TicketDataList
        }));

        fetchTicketSums();
    }, [TicketDataList]);
    useEffect(() => {
        let domTickets = ticketFilter(filterConfigs)
        setTicketDomData(domTickets);
        fetchTicketSums();
    }, [filterConfigs]);
    const fetchTicketSums = async () => {
        let calculatbleData: TicketsDataProps[];
        switch (filterConfigs.dateRange) {
            case 'today':
                calculatbleData =  TicketDataList.filter((x) => isToday(new Date(x.created_at)));
                break;
            case 'thisWeek':
                calculatbleData =  TicketDataList.filter(x => isThisWeek(new Date(x.created_at)));
                break;
            case 'thisMonth':
                calculatbleData =  TicketDataList.filter(x => isThisMonth(new Date(x.created_at)));
                break;
            case 'thisYear':
                calculatbleData =  TicketDataList.filter(x => isThisYear(new Date(x.created_at)));
                break;
            default:
                calculatbleData = TicketDataList;
        }
        const result = await calculateStatuses(calculatbleData, listView);
        setTicketSums(result);
    };
    const takeNotifications = (test: string) => {
        axios.get('/api/notifications').then(resp => {
            let notis: NotificationDataProps[] = resp.data as NotificationDataProps[];
            TicketDomData.forEach(item => {
                item.hasNotis = 0
            });
            notis.forEach(item => {
                const data = JSON.parse(item.data);
                if (data.message) {
                    let mesNoti: TicketMessagesProps = data.message;
                    let markTicket = TicketDomData.filter(x => x.id === mesNoti.ticket_id)[0];
                    if (markTicket) if (markTicket.hasNotis) markTicket.hasNotis++; else markTicket.hasNotis = 1;
                } else if (data.tickets) {
                    let tickNoti: TicketsDataProps = data.tickets;
                    let markTicket = TicketDomData.filter(x => x.id === tickNoti.id)[0];
                    if (markTicket) if (markTicket.hasNotis) markTicket.hasNotis++; else markTicket.hasNotis = 1;
                }
            })
        }).catch(err => {
            console.log(err);
        });
    }
    const handleIDClick = () => {
        setIDFocused(true);
    };
    const handleTitleClick = () => {
        setTitleFocused(true);
    };
    const handleInpuIDtBlur = () => {
        if (inputIDValue === "") {
            setIDFocused(false);
            setFilteredConfigsToDefault();
        }
    };
    const handleInputTitleBlur = () => {
        if (inputTitleValue === "") {
            setTitleFocused(false);
            setFilteredConfigsToDefault();
        }
    };
    const handleSelectChange = (e: any, name: string) => {
        const today = new Date();
        let startDay = new Date();
        let endDay = new Date();
        switch (name) {
            case 'status' :
                setFilterConfigs(prev => ({
                    ...prev,
                    status: e.value
                }))
                break;
            case 'customer' :
                setFilterConfigs(prev => ({
                    ...prev,
                    customer: e.value
                }));
                break;
            case 'building' :
                setFilterConfigs(prev => ({
                    ...prev,
                    building: e.value
                }))
                break;
            case 'ticketType' :
                setFilterConfigs(prev => ({
                    ...prev,
                    ticketType: e.value
                }))
                break;
            case 'periots' :
                switch (e.value) {
                    case 'today':
                        setFilterConfigs(prev => ({
                            ...prev,
                            dateRange: e.value,
                            startDate: today,
                            endDate: today,
                        }));
                        break;
                    case 'thisWeek':
                        setFilterConfigs(prev => ({
                            ...prev,
                            dateRange: e.value,
                            startDate: startOfWeek,
                            endDate: endOfWeek,
                        }));
                        break;
                    case 'thisMonth':
                        startDay.setDate(1);
                        endDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
                        setFilterConfigs(prev => ({
                            ...prev,
                            dateRange: e.value,
                            startDate: startDay,
                            endDate: endDay,
                        }));
                        break;
                    case 'thisYear':
                        startDay = new Date(today.getFullYear(), 0, 1);
                        endDay = new Date(today.getFullYear(), 11, 31);
                        setFilterConfigs(prev => ({
                            ...prev,
                            dateRange: e.value,
                            startDate: startDay,
                            endDate: endDay,
                        }));
                        break;
                    default:
                        setFilterConfigs(prev => ({
                            ...prev,
                            dateRange: e.value,
                            startDate: startOfYear,
                            endDate: today,
                        }))
                }
                break;
            default :
                console.error(e, name);
                break;
        }
    }
    const handleTitleFilter = (e: any) => {
        const value = e.target.value;
        setInputTitleValue(value);
        if (value !== '') {
            setFilterConfigs(prevConfig => ({
                ...prevConfig,
                Title: value,
            }));
        } else {
            setFilterConfigs(prevConfig => ({
                ...prevConfig,
                Title: '',
            }));
        }
    };
    const handleIdFilter = (e: any) => {
        setInputIDValue(e.target.value);
        if (e.target.value != '') {
            setFilterConfigs(prevConfig => ({
                ...prevConfig,
                id: e.target.value as number,
            }));
        } else {
            setFilterConfigs(prevConfig => ({
                ...prevConfig,
                id: -2,
            }));
        }
    }
    const handleDateChange1 = (date: Date) => {
        setFilterConfigs(prev => ({
            ...prev,
            startDate: date,
            filterforDate: true
        }))
    };
    const handleDateChange2 = (date: Date) => {
        setFilterConfigs(prev => ({
            ...prev,
            endDate: date,
            filterforDate: true
        }))
    };
    const status = [
        {value: "all", label: "Alle"},
        {value: "New", label: "Nieuw"},
        {value: "In Progress", label: "In Bewerking"},
        {value: "Closed", label: "Afgehandeld"},
        {value: "On Hold", label: "On Hold"},
        {value: "Cancelled", label: "Vervallen"},
    ];
    const periots = [
        {value: "all", label: "Alle"},
        {value: "today", label: "Vandaag"},
        {value: "thisWeek", label: "Deze Week"},
        {value: "thisMonth", label: "Deze Maand"},
        {value: "thisYear", label: "Dit Jaar"},
    ];
    const ticketTypeOptions = [
        {value: "all", label: "Alle"},
        {value: 'complimenten', label: 'Complimenten'},
        {value: 'comentaar', label: 'Comentaar'},
        {value: 'vraag', label: 'Vraag'},
        {value: 'klacht', label: 'Klacht'},
        {value: 'Melding', label: 'Melding'},
        {value: 'Extrawerk', label: 'Extra werk'},
        {value: 'Ongegrond', label: 'Ongegrond'},
    ]

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
    const handleTabClick = (menu: MenuProps) => {
        setSelectedTab(menu.menuValue.toLowerCase());
    };
    const handleClick = (ticketId: number) => {
        setClickedTicketId(ticketId); // Update state with clicked ticket ID
        setDeleteShow(true);
    };
    const handleUpdateClick = (ticketId: number) => {
        TicketDomData.map((item) => {
            if (item.id === ticketId) {
                console.log(item);
                setUpdateTicket(item);
                setUpTicketShow(true);
            }
        });
    };
    const addingNewTicketHandler = (newTicket: TicketsDataProps) => {
        setTicketDataList(prevState => [
            newTicket, ...prevState
        ])
    };
    const UpsateTicketRenew = (updatedTicket: TicketsDataProps) => {
        const updatedList = TicketDataList.map(ticket => {
            if (ticket.id === updatedTicket.id) {
                return {...ticket, ...updatedTicket};
            }
            return ticket;
        })
        setTicketDataList(updatedList);
    }
    const SidebarData: SidebarDataProps[] = [];
    const handleTicket = (Ticket: TicketsDataProps | null) => {
        // MySwal.fire({
        //     title: 'Fout!',
        //     text: 'Er is iets misgegaan.\n',
        //     confirmButtonText: 'OK',
        //     customClass: {
        //         confirmButton: 'btn btn-danger',
        //     },
        // });
        if (Ticket) setTicketDataList(prev => [Ticket, ...prev]);
    }
    const columns = TicketColumCreator(customers ?? [], buildings ?? [], handleClick, handleUpdateClick);
    const [isSidebarExpanded, setSidebarExpanded] = useState<boolean>(false);
    const quickFilter = (index: string) => {
        let statusValue = 'all';
        switch (index) {
            case 'all':
                setFilterConfigs(prev => ({
                    ...prev,
                    status: 'all'
                }))
                break;
            case 'New':
                setFilterConfigs(prev => ({
                    ...prev,
                    status: 'New'
                }))
                statusValue = 'New';
                break;
            case 'Closed':
                setFilterConfigs(prev => ({
                    ...prev,
                    status: 'Closed&Canceled'
                }))
                statusValue = 'Closed&Canceled'
                break;
            case 'In Progress':
                setFilterConfigs(prev => ({
                    ...prev,
                    status: 'In Progress'
                }))
                statusValue = 'In Progress';
                break;
            case 'On Hold':
                setFilterConfigs(prev => ({
                    ...prev,
                    status: 'On Hold'
                }))
                statusValue = 'On Hold';
                break;
            default:
                setTicketDomData(TicketDataList);
        }
        if (statusSelectRef.current && statusValue != 'Closed&Canceled') {
            const selectedOption = status.find(x => x.value === statusValue);
            statusSelectRef.current.setValue(selectedOption ?? status[0], 'select-option');
        }
    }
    const ticketMessageDataHandler = (args: {
        newTicketMessage?: TicketMessagesProps;
        detailUpdateNeeded?: number;
    } | null) => {
        if (args && args.newTicketMessage) {
            let message: TicketMessagesProps = args.newTicketMessage as TicketMessagesProps;
            let action = TicketDomData.map((item) => {
                if(item.id === message.ticket_id) {
                    return {...item, hasNotis: item.hasNotis? item.hasNotis+1: 1};
                }
                return item;
            });
            setTicketDomData(action);
        }
    };
    const statusChangeHandler = (id: number) => {

    }
    return (
        <AuthenticatedLayout user={auth.user}
                             collectNotification={false}
                             notificationDataHandler={handleTicket}
                             isSidebarExpanded={isSidebarExpanded}
                             setSidebarExpanded={setSidebarExpanded}
                             isMessageTableActive={false}
                             isTicketTableActive={true}
                             ticketMessageDataHandler={ticketMessageDataHandler}
                             SidebarData={SidebarData}
                             handleTabClick={handleTabClick}
        >
            <Head title="Meldingen"/>
            <>
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <div className="row align-items-center">
                            <div className="col">
                                <h3 className="page-title">Meldingen</h3>
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link href={route('dashboard')}>Dashboard</Link>
                                    </li>
                                    <li className="breadcrumb-item active">Meldingen</li>
                                </ul>
                            </div>
                            <div className="col-auto float-end ms-auto flex">
                                <a onClick={() => setAddTicketModelShow(true)} className="btn btn-primary px-2 mx-2">
                                    <i className="fa fa-plus"/>{showT_Text && "  Nieuw Meldingen"}
                                </a>
                                {listView && (
                                    <a onClick={() => setShowDetails(!showDetails)}
                                       className="btn btn-primary px-2 mx-2">
                                        <i className="fa fa-bars"/>
                                    </a>)}
                                <a onClick={() => setShowFilters(!showFilters)}
                                   className="btn btn-primary px-2 mx-2">
                                    <i className="las la-filter"/>
                                </a>
                                <div className="card-body radio-button-group view-icons">
                                    <div className="btn-group">
                                        <a className={"grid-view btn btn-link" + (!listView && " active mx-2")}
                                           onClick={() => {
                                               setFilteredConfigsToDefault();
                                               setListView(false);
                                               Cookies.set('listView', '0')
                                           }}>
                                            <i className="fa fa-th"/>
                                        </a>
                                        <a className={"list-view btn btn-link" + (listView && " active mx-2")}
                                           onClick={() => {
                                               setFilteredConfigsToDefault();
                                               setListView(true);
                                               Cookies.set('listView', '1')
                                           }}>
                                            <i className="fa fa-bars"/>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {(showDetails && listView && (
                            <div className="row mt-3">
                                <div className="col-md-12">
                                    <div className="card-group m-b-30">
                                        <div key={'NewStatusCard'} className="card mr-1">
                                            <div className="card-body osi-board-lg">
                                                <div className="power-ribbone power-ribbone-top-left">
                                                    <span className="!bg-purple-400"></span>
                                                </div>
                                                <a onClick={() => {
                                                    quickFilter('New');
                                                }}>
                                                    <div className="d-flex justify-content-between mb-3">
                                                        <div>
                                                            <span className="d-block">Nieuw Melding</span>
                                                        </div>
                                                    </div>
                                                    {ticketSums && true && ticketSums.length > 0 ? (
                                                        <>
                                                            <h3 className="mb-3">
                                                                {ticketSums[0].value}
                                                            </h3>
                                                            <div className={'text-end '}>
                                                            <span className="text-success">
                                                                %{ticketSums[0].percentage}
                                                            </span>
                                                            </div>
                                                            <div className="progress mb-2" style={{height: "5px"}}>
                                                                <div
                                                                    className="progress-bar !bg-purple-400"
                                                                    role="progressbar"
                                                                    style={{width: `${ticketSums[0].percentage}%`}}
                                                                    aria-valuenow={40}
                                                                    aria-valuemin={0}
                                                                    aria-valuemax={100}
                                                                />
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div>
                                                            <i className="fas fa-spinner fa-spin fa-lg me-2"></i>
                                                        </div>
                                                    )}
                                                </a>
                                            </div>
                                        </div>
                                        <div key={'progressingsCard'} className="card mx-1">
                                            <div className="card-body osi-board-lg">
                                                <div className="power-ribbone power-ribbone-top-left">
                                                    <span className="bg-warning"></span>
                                                </div>
                                                <a onClick={() => {
                                                    quickFilter('In Progress');
                                                }}>
                                                    <div className="d-flex justify-content-between mb-3">
                                                        <div>
                                                            <span className="d-block">In Bewerking Meldingen</span>
                                                        </div>
                                                    </div>
                                                    {ticketSums && ticketSums.length > 0 ? (
                                                        <>
                                                            <h3 className="mb-3">
                                                                {ticketSums[1].value}
                                                            </h3>
                                                            <div className={'text-end '}>
                                                            <span className="text-success">
                                                                %{ticketSums[1].percentage}
                                                            </span>
                                                            </div>
                                                            <div className="progress mb-2" style={{height: "5px"}}>
                                                                <div
                                                                    className="progress-bar bg-warning"
                                                                    role="progressbar"
                                                                    style={{width: `${ticketSums[1].percentage}%`}}
                                                                    aria-valuenow={40}
                                                                    aria-valuemin={0}
                                                                    aria-valuemax={100}
                                                                />
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div>
                                                            <i className="fas fa-spinner fa-spin fa-lg me-2"></i>
                                                        </div>
                                                    )}
                                                </a>
                                            </div>
                                        </div>
                                        <div key={'solvedsCard'} className="card mx-1">
                                            <div className="card-body osi-board-lg">
                                                <div className="power-ribbone power-ribbone-top-left">
                                                    <span className="bg-success"></span>
                                                </div>
                                                <a onClick={() => {
                                                    quickFilter('Closed');
                                                }}>
                                                    <div className="d-flex justify-content-between mb-3">
                                                        <div>
                                                            <span className="d-block">Afgehandeld Meldingen</span>
                                                        </div>
                                                    </div>
                                                    {ticketSums && ticketSums.length > 0 ? (
                                                        <>
                                                            <h3 className="mb-3">
                                                                {ticketSums[2].value}
                                                            </h3>
                                                            <div className={'text-end '}>
                                                            <span className="text-success">
                                                                %{ticketSums[2].percentage}
                                                            </span>
                                                            </div>
                                                            <div className="progress mb-2" style={{height: "5px"}}>
                                                                <div
                                                                    className="progress-bar bg-success"
                                                                    role="progressbar"
                                                                    style={{width: `${ticketSums[2].percentage}%`}}
                                                                    aria-valuenow={40}
                                                                    aria-valuemin={0}
                                                                    aria-valuemax={100}
                                                                />
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div>
                                                            <i className="fas fa-spinner fa-spin fa-lg me-2"></i>
                                                        </div>
                                                    )}
                                                </a>
                                            </div>
                                        </div>
                                        <div key={'allsCard'} className="card mx-1">
                                            <div className="card-body osi-board-lg">
                                                <div className="power-ribbone power-ribbone-top-left">
                                                    <span className="bg-osl-alles"></span>
                                                </div>
                                                <a onClick={() => {
                                                    quickFilter('all');
                                                }}>
                                                    <div className="d-flex justify-content-between mb-3">
                                                        <div>
                                                            <span className="d-block">Alle Meldingen</span>
                                                        </div>
                                                    </div>
                                                    {ticketSums && ticketSums.length > 0 ? (
                                                        <>
                                                            <h3 className="mb-3">
                                                                {ticketSums[3].value}
                                                            </h3>
                                                            <div className={'text-end '}>
                                                            <span className="text-success">
                                                                %{ticketSums[3].percentage}
                                                            </span>
                                                            </div>
                                                            <div className="progress mb-2" style={{height: "5px"}}>
                                                                <div
                                                                    className="progress-bar bg-osl-alles"
                                                                    role="progressbar"
                                                                    style={{width: `${ticketSums[3].percentage}%`}}
                                                                    aria-valuenow={40}
                                                                    aria-valuemin={0}
                                                                    aria-valuemax={100}
                                                                />
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div>
                                                            <i className="fas fa-spinner fa-spin fa-lg me-2"></i>
                                                        </div>
                                                    )}
                                                </a>
                                            </div>
                                        </div>
                                        <div key={'onholdsCard'} className="card mx-1">
                                            <div className="card-body osi-board-lg">
                                                <div className="power-ribbone power-ribbone-top-left">
                                                    <span className="bg-danger"></span>
                                                </div>
                                                <a onClick={() => {
                                                    quickFilter('On Hold');
                                                }}>
                                                    <div className="d-flex justify-content-between mb-3">
                                                        <div>
                                                            <span className="d-block">On Hold Meldingen</span>
                                                        </div>
                                                    </div>
                                                    {ticketSums && ticketSums.length > 0 ? (
                                                        <>
                                                            <h3 className="mb-3">
                                                                {ticketSums[4].value}
                                                            </h3>
                                                            <div className={'text-end '}>
                                                            <span className="text-success">
                                                                %{ticketSums[4].percentage}
                                                            </span>
                                                            </div>
                                                            <div className="progress mb-2" style={{height: "5px"}}>
                                                                <div
                                                                    className="progress-bar bg-danger"
                                                                    role="progressbar"
                                                                    style={{width: `${ticketSums[4].percentage}%`}}
                                                                    aria-valuenow={40}
                                                                    aria-valuemin={0}
                                                                    aria-valuemax={100}
                                                                />
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div>
                                                            <i className="fas fa-spinner fa-spin fa-lg me-2"></i>
                                                        </div>
                                                    )}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>))}
                        {showFilters && (
                            <div className="filter-row card-group my-2">
                                <div className="col-1 px-2">
                                    <div className={
                                        IDfocused || inputIDValue !== ""
                                            ? "input-block form-focus focused"
                                            : "input-block form-focus"
                                    }>
                                        <input type="text"
                                               className="form-control floating" value={inputIDValue}
                                               onFocus={handleIDClick} onBlur={handleInpuIDtBlur}
                                               onChangeCapture={handleIdFilter}/>
                                        <label className="focus-label" onClick={handleIDClick}>Melding ID</label>
                                    </div>
                                </div>
                                <div className="flex-grow-1 px-2">
                                    <div className="input-block form-focus select-focus">
                                        <Select
                                            options={status}
                                            ref={statusSelectRef}
                                            styles={customStyles}
                                            value={listView ? status[1] : status[0]}
                                            name={'status'}
                                            onChange={(e) => {
                                                if (e) {
                                                    handleSelectChange(e, 'status');
                                                }
                                            }}
                                        />
                                        <label className="focus-label">Status</label>
                                    </div>
                                </div>
                                <div className="flex-grow-1 px-2">
                                    <div className="input-block form-focus select-focus">
                                        <Select
                                            options={CustomerFilterOptions}
                                            placeholder="--Selecteer--"
                                            styles={customStyles}
                                            name={'customer'}
                                            onChange={(e) => {
                                                if (e) {
                                                    handleSelectChange(e, 'customer');
                                                }
                                            }}
                                        />
                                        <label className="focus-label">Bedrijf</label>
                                    </div>
                                </div>
                                <div className="flex-grow-1 px-2">
                                    <div className="input-block form-focus select-focus">
                                        <Select options={LocationFilterOptions}
                                                placeholder="--Selecteer--"
                                                styles={customStyles}
                                                name={'building'}
                                                onChange={(e) => {
                                                    if (e) {
                                                        handleSelectChange(e, 'building');
                                                    }
                                                }}/>
                                        <label className="focus-label">Locatie</label>
                                    </div>
                                </div>
                                <div className="flex-grow-1 px-2">
                                    <div className="input-block form-focus select-focus">
                                        <Select options={ticketTypeOptions}
                                                placeholder="--Selecteer--"
                                                styles={customStyles}
                                                name={'ticketType'}
                                                onChange={(e) => {
                                                    if (e) {
                                                        handleSelectChange(e, 'ticketType');
                                                    }
                                                }}/>
                                        <label className="focus-label">Type</label>
                                    </div>
                                </div>
                                <div className="flex-grow-1 px-2">
                                    <div className={
                                        Titlefocused || inputTitleValue !== ""
                                            ? "input-block form-focus focused"
                                            : "input-block form-focus"
                                    }>
                                        <input type="text"
                                               className="form-control floating" value={inputTitleValue}
                                               onFocus={handleTitleClick} onBlur={handleInputTitleBlur}
                                               onChange={handleTitleFilter}/>
                                        <label className="focus-label" onClick={handleTitleClick}>Titel</label>
                                    </div>
                                </div>
                                <div className="flex-grow-1 px-2">
                                    <div className="input-block form-focus select-focus">
                                        <Select options={periots}
                                                defaultValue={periots[2]}
                                                styles={customStyles}
                                                name={'PeriotSelect'}
                                                onChange={(e) => {
                                                    if (e) {
                                                        handleSelectChange(e, 'periots');
                                                    }
                                                }}/>
                                        <label className="focus-label">Periode</label>
                                    </div>
                                </div>
                                <div className="flex-grow-1 px-2">
                                    <div className="input-block form-focus select-focus">
                                        <div className="cal-icon">
                                            <ReactDatePicker
                                                selected={filterConfigs.startDate}
                                                onChange={handleDateChange1}
                                                className="form-control floating datetimepicker"
                                                dateFormat="dd-MM-yyyy"
                                            />
                                        </div>
                                        <label className="focus-label">Van</label>
                                    </div>
                                </div>
                                <div className="flex-grow-1 px-2">
                                    <div className="input-block form-focus select-focus">
                                        <div className="cal-icon">
                                            <ReactDatePicker
                                                selected={filterConfigs.endDate}
                                                onChange={handleDateChange2}
                                                className="form-control floating datetimepicker"
                                                dateFormat="dd-MM-yyyy" // Add the placeholderText prop here
                                            />
                                        </div>
                                        <label className="focus-label">Tot</label>
                                    </div>
                                </div>
                            </div>)}
                        <div className="row">
                            <div className="col-md-12">
                                {listView ? (
                                    <div className="table-responsive col-12">
                                        <Table
                                            className="table-striped col-12"
                                            rowKey={(record) => record.id}
                                            style={{overflowX: "hidden", overflowY: "hidden"}}
                                            columns={columns}
                                            rowClassName={rowClassName}
                                            pagination={false}
                                            dataSource={TicketDomData}
                                        />
                                    </div>
                                ) : (
                                    <div className="kanban-board card mb-0">
                                        <div className="card-body">
                                            <div className="kanban-cont">
                                                <TicketCardView ticketDomData={TicketDomData}
                                                                setTicketDomData={setTicketDomData}
                                                                editTicket={handleUpdateClick}
                                                                deleteTicket={handleClick}
                                                                handleTicketStatusChange={statusChangeHandler}
                                                                customers={customers ?? []} building={buildings}
                                                                otherUsers={otherusers} ticketDummySums={ticketSums}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {customer && customer.length > 0 ? (<AddTicket
                    AddTicketModelShow={AddTicketModelShow}
                    otherUsers={otherusers}
                    customer={customer}
                    user={auth.user}
                    buildings={buildingler ? buildingler : buildings}
                    islocationDetail={false}
                    ticketDataHandler={addingNewTicketHandler}
                    onHide={() => setAddTicketModelShow(false)}
                />) : null}
                {ticketsData != null && ticketsData.length > 0 ? (
                    <UpTicket ticketDataHandler={UpsateTicketRenew}
                              otherUsers={otherusers} customer={customer} user={auth.user} buildings={buildings}
                              islocationDetail={false}
                              ticket={updateTicket}
                              onHide={() => setUpTicketShow(false)}
                              UpTicketModelShow={upTicketShow}
                    />) : null}
                <DeleteModal deleteOnHide={() => setDeleteShow(false)} DeleteModelShow={deleteShow}
                             Name="Cancel Meldingen" type={'Ticket'} Id={clickedTicketId}/>
            </>
        </AuthenticatedLayout>
    );
}

export default Tickets;
