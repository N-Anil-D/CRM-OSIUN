import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {PageProps} from '@/types';
import React, {useEffect, useRef, useState, useCallback} from 'react'
import {Head, Link} from '@inertiajs/react';
import {
    Calendar,
    Edit,
    Mail,
    MessageCircle,
    MoreVertical,
    Phone,
    PlusCircle,
    XCircle,
    MinusCircle
} from 'react-feather';
import axios from "axios";
import moment from "moment/moment";
import AddNotes from "@/Layouts/ClientsAddNote";
import Sidebar, {MenuProps, SidebarDataProps} from "@/Layouts/Sidebar";
import {AddTicket, UpTicket} from '@/Layouts/AddTicket';
import {
    CustomerProps,
    BuildingProps,
    NoteCommentProps,
    NoteProps,
    TicketsDataProps,
    OtherUsersProps,
    RoomProps,
    NotificationDataProps,
    TicketMessagesProps,
    clientsContactPerson,
    RouteAuths, TicketSum
} from "@/types/globalProps";
import {AddLocation, EditLocation} from "@/Layouts/AddNewLocation";
import {User} from '@/types';
import {
    AgTicketColumCreator,
    LocationsColumnCreator,
    contactPersonsColumnsCreator,
    rowClassName
} from "@/Components/Columns";
import {EditClient} from "@/Layouts/ClientsModal";
import DeleteModal from "@/Layouts/DeleteModal";
import {AddUser, UpUser, DeleteUser} from "@/Layouts/AddUser";
import {Modal, Button} from 'react-bootstrap';
import {forEach} from "react-bootstrap/ElementChildren";
import {AddContactPerson} from "@/Layouts/ContactPersonModal";
import Cookies from "js-cookie";
import {ticketFilter, TicketFilterProps} from "@/types/TicketFilter";
import Select, {GroupBase, SelectInstance} from "react-select";
import ReactDatePicker from "react-datepicker";
import {TicketCardView} from "@/Components/TicketCardView";
import {ClientProjects} from "@/Layouts/ClientProjects";
import {AgGridReact} from 'ag-grid-react';
import {themeQuartz} from '@ag-grid-community/theming';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import {ICellRendererParams, ColDef, ValueGetterParams} from 'ag-grid-community';

interface ClientDetailProps extends PageProps {
    data: CustomerProps;
    representative: User;
    tickets: TicketsDataProps[];
    notes: NoteProps[];
    note_comments: NoteCommentProps[];
    locations: BuildingProps[];
    rooms: RoomProps[];
    otherusers: OtherUsersProps[];
    contactPersons: clientsContactPerson[];
    otherLocations?: BuildingProps[];

}

export default function ClientDetail({
                                         auth,
                                         data,
                                         representative,
                                         tickets,
                                         notes,
                                         note_comments,
                                         locations,
                                         otherusers,
                                         rooms,
                                         contactPersons,
                                         otherLocations
                                     }: ClientDetailProps
) {
    const [triggerRender, setTriggerRender] = useState(false);
    const [clickedTicketId, setClickedTicketId] = useState<number | null>(null);
    const [ticketData, setTicketData] = useState<TicketsDataProps[]>(tickets);
    const [TicketDomData, setTicketDomData] = useState<TicketsDataProps[]>([]);
    const [selectedTab, setSelectedTab] = useState<string>("main");
    const [noteCommentInput, setNoteCommentInput] = useState<string>('');
    const [openedComment, setOpenedComment] = useState<HTMLElement>()
    const [openedCommentLink, setOpenedCommentLink] = useState<HTMLElement>()
    const [locationsDomData, setLocationsDomData] = useState<BuildingProps[]>(locations);
    const [AddTicketModelShow, setAddTicketModelShow] = useState<boolean>(false);
    const [UpTicketModelShow, setUpTicketModelShow] = useState<boolean>(false);
    const [showAddBeenLocation, setShowAddBeenLocation] = useState<boolean>(false);
    const [roomDomData, setRoomDomData] = useState<RoomProps[]>(rooms ? rooms : []);
    const [ticketWriteAuth, setTicketWriteAuth] = useState(false);
    const [updateTicket, setUpdateTicket] = useState<TicketsDataProps>(ticketData ? ticketData[0] : {
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
    const [isSidebarExpanded, setSidebarExpanded] = useState<boolean>(false);
    const [showEditClient, setShowEditClient] = useState<boolean>(false);
    const [showDeleteClient, setShowDeleteClient] = useState<boolean>(false)
    const [updateLocation, setUpdateLocation] = useState<BuildingProps>(locationsDomData[0]);
    const [showUpdateLocationModel, setShowUpdateLocationModel] = useState<boolean>(false);
    const [domContactPersons, setDomContactPersons] = useState<clientsContactPerson[]>();
    const [domClientUsers, setDomClientUsers] = useState<User[]>()
    const [editableUser, setEditableUser] = useState<User>();
    const [showBannUser, setShowBannUser] = useState<boolean>(false);
    const [showUserEdit, setShowUserEdit] = useState<boolean>(false);
    const [showAddUser, setShowAddUser] = useState<boolean>(false);
    const [writeAuth, setWriteAuth] = useState<boolean>(false);
    const [deleteAuth, setDeleteAuth] = useState<boolean>(false);
    const [selectedBestaandeLocatie, setSelectedBestaandeLocatie] = useState<BuildingProps[]>(locations);
    const [pageAuth, setPageAuth] = useState<RouteAuths | undefined>();
    const [showAddContactPerson, setShowAddContactPerson] = useState<boolean>(false);
    const [editContactPerson, setEditContactPerson] = useState<clientsContactPerson | undefined>()

    //Ticket values
    const defaultColDef: ColDef = {
        flex: 1,
    };
    const statusSelectRef = useRef<SelectInstance<any, false, GroupBase<any>>>(null);

    const startOfYear = new Date();
    startOfYear.setMonth(0); // Ocak (0. indeks) ayı
    startOfYear.setDate(1); // Ayın ilk günü
    const today = new Date();
    const pazartesi = today.getDate() - today.getDay() + 1;
    const startOfWeek = new Date(today.setDate(pazartesi));
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(today.setDate(pazartesi + 6));
    endOfWeek.setHours(23, 59, 59, 999);
    const [IDfocused, setIDFocused] = useState(false);
    const [Titlefocused, setTitleFocused] = useState(false);
    const [inputIDValue, setInputIDValue] = useState<string>('');
    const [inputTitleValue, setInputTitleValue] = useState("");
    const [LocationFilterOptions, setLocationFilterOptions] = useState<{
        value: number;
        label: string
    }[]>([{value: -2, label: 'Alle'}, ...locations.map(x => ({
        value: x.id,
        label: x.LocationID + '-' + x.BuildingName
    }))]);
    const [ticketSums, setTicketSums] = useState<TicketSum[] | null>(null)

    const [showT_Text, setShowT_Text] = useState<boolean>(true);
    const [listView, setListView] = useState<boolean>();
    const [showDetails, setShowDetails] = useState<boolean>(true);
    const [showFilters, setShowFilters] = useState<boolean>(true);
    const [filterConfigs, setFilterConfigs] = useState<TicketFilterProps>({
        allTickets: ticketData,
        id: -2,
        customer: 'all',
        building: "-2",
        status: 'New',
        filterforDate: false,
        startDate: startOfWeek,
        endDate: endOfWeek,
        ticketType: 'all',
        Title: '',
        dateRange: 'thisMonth',
    });
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
    const handleIdFilter = (e: any) => {
        setInputIDValue(e.target.value);
        if (e.target.value != '') {
            setFilterConfigs(prevConfig => ({
                ...prevConfig,
                id: parseInt(e.target.value),
            }));
        } else {
            setFilterConfigs(prevConfig => ({
                ...prevConfig,
                id: -2,
            }));
        }
    }
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
    const setFilteredConfigsToDefault = () => {
        setFilterConfigs({
            allTickets: ticketData,
            id: -2,
            customer: 'all',
            building: "-2",
            status: 'New',
            filterforDate: false,
            startDate: startOfYear,
            endDate: new Date(),
            ticketType: 'all',
            Title: '',
        })
    }
    useEffect(() => {
        setFilterConfigs(prev => ({
            ...prev,
            allTickets: ticketData
        }));
    }, [ticketData]);
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
    //TicketValues End
    useEffect(() => {
        let domTickets = ticketFilter(filterConfigs)
        setTicketDomData(domTickets);
    }, [filterConfigs]);
    useEffect(() => {
        if (auth.user.roleName != 'Client' && auth.user.roleName != 'admin')
            setPageAuth(auth.user.permissions.filter(z => z.CustomerID == data.CustomerID).find(x => x.page_name == 'Bedrijven'));
        else
            setPageAuth(auth.user.permissions.find(x => x.page_name == 'Bedrijven'));
        let selectedTab = Cookies.get('clientTap')
        if (selectedTab) setSelectedTab(selectedTab);
    }, [auth]);

    useEffect(() => {
        setTicketDomData(ticketData.filter(x => x.status !== 'Closed' && x.status !== 'Cancelled'));
        takeNotifications();
        setTriggerRender(prev => !prev);
    }, [ticketData]);
    useEffect(() => {
        takeNotifications();
        setTriggerRender(prev => !prev);
    }, [TicketDomData]);
    useEffect(() => {
        if (contactPersons)
            setDomContactPersons(contactPersons);
    }, [contactPersons]);

    const takeNotifications = () => {
        axios.get('/api/notifications').then(resp => {
            let notis: NotificationDataProps[] = resp.data as NotificationDataProps[];
            notis.forEach(item => {
                const data = JSON.parse(item.data);
                if (data.message) {
                    let mesNoti: TicketMessagesProps = data.message;
                    let markTicket = TicketDomData.filter(x => x.id === mesNoti.ticket_id)[0];
                    if (markTicket) if (markTicket.hasNotis) markTicket.hasNotis++; else markTicket.hasNotis = 1;
                    setTriggerRender(prev => !prev);
                } else if (data.tickets) {
                    let tickNoti: TicketsDataProps = data.tickets;
                    let markTicket = TicketDomData.filter(x => x.id === tickNoti.id)[0];
                    if (markTicket) if (markTicket.hasNotis) markTicket.hasNotis++; else markTicket.hasNotis = 1;
                    setTriggerRender(prev => !prev);
                }
            })
        }).then(() => {
            setTriggerRender(prev => !prev);
        }).catch(err => {
            console.log(err);
            setTriggerRender(prev => !prev);
        });
    }
    const handleTabClick = (menu: MenuProps) => {
        setSelectedTab(menu.menuValue.toLowerCase());
        Cookies.set('clientTap', menu.menuValue.toLowerCase());
    };
    const locationAddedHandle = (addedLocation: BuildingProps) => {
        setLocationsDomData(prevState => [
            addedLocation, ...prevState
        ])
    }
    const handleClick = (ticketId: number) => {
        setClickedTicketId(ticketId); // Update state with clicked ticket ID
        console.log("Clicked ticket ID:", ticketId);
    };
    const handleUpdateClick = (ticketId: number) => {
        tickets.map((item) => {
            if (item.id === ticketId) {
                setUpdateTicket(item);
                setUpTicketModelShow(true);
            }
        });
    };
    const locationDeleteClick = (e: any) => {
        console.log('delete clicked', e)
        const request = {
            locationID: e.id,
            clietnID: data.CustomerID,
        }

        axios.post('/api/bestaandeLocatieDelete', request).then(resp => {
                if (resp.status === 200) {
                    alert('Başarılı');
                    window.location.reload();
                }
            }
        ).catch(er => console.error(er));
    };
    const locationUpdateClick = (data: any) => {
        console.log('data', data as BuildingProps);
        setUpdateLocation(data);
        console.log('updateLocation', updateLocation);
        setShowUpdateLocationModel(true);
    };
    const locationModalOnHide = () => {
        setShowUpdateLocationModel(false);
    }
    const locationDomDataUpdate = (data: BuildingProps) => {
        let updatedLocations = locationsDomData.map(item => {
            if (item.id === data.id) {
                return {...item, ...data};
            }
            return item;
        })
        setLocationsDomData(updatedLocations);
    }
    const addingNewTicketHandler = (newTicket: TicketsDataProps) => {
        setTicketData(prevState => [
            newTicket, ...prevState
        ])
    };
    const handleContactPersonUpdateClick = (personID: number) => {
        if (domContactPersons) {
            let data = domContactPersons.find(x => x.id == personID);
            if (data)
                setEditContactPerson(data);
            setShowAddContactPerson(true);
        }
    }
    const handleContactPersonDeleteClick = (personID: number) => {

    }


    const SidebarData = (): SidebarDataProps[] => {
        console.log(pageAuth);
        let data: SidebarDataProps[] = [
            {
                tittle: 'Klantgegevens',
                showAsTab: true,
                separateRoute: true,
                menu: [
                    {
                        menuValue: 'Main',
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
                menuValue: 'Meldingen',
                hasSubRoute: false,
                showSubRoute: false,
                hasNav: true,
                NavDb: "#tickets",
                route: "#",
                icon: "la la-ticket",
                subMenus: [],
            },
            {
                menuValue: 'Notes',
                hasSubRoute: false,
                showSubRoute: false,
                hasNav: true,
                NavDb: "#notes",
                route: "#",
                icon: "fa fa-note-sticky",
                subMenus: [],
            },
            {
                menuValue: 'Locatie',
                hasSubRoute: false,
                showSubRoute: false,
                hasNav: true,
                NavDb: "#locations",
                route: "#",
                icon: "la la-building",
                subMenus: [],
            },
            {
                menuValue: 'Projects',
                hasSubRoute: false,
                showSubRoute: false,
                hasNav: true,
                NavDb: "#projects",
                route: "#",
                icon: "fa fa-file-signature",
                subMenus: [],
            },
            {
                menuValue: 'Contracts',
                hasSubRoute: false,
                showSubRoute: false,
                hasNav: true,
                NavDb: "#contracts",
                route: "#",
                icon: "fa fa-file-signature",
                subMenus: [],
            },
            {
                menuValue: 'Contactpersonen',
                hasSubRoute: false,
                showSubRoute: false,
                hasNav: true,
                NavDb: "#contactPerson",
                route: "#",
                icon: "la la-users",
                subMenus: [],
            },
            {
                menuValue: 'Facturen',
                hasSubRoute: false,
                showSubRoute: false,
                hasNav: true,
                NavDb: "#faturalar",
                route: "#",
                icon: "la  la-file-invoice",
                subMenus: [],
            },
            {
                menuValue: 'Eenheidsprijzen',
                hasSubRoute: false,
                showSubRoute: false,
                hasNav: true,
                NavDb: "#fiyatlar",
                route: "#",
                icon: "la la-tags",
                subMenus: [],
            },
            {
                menuValue: 'Kwaliteitsrapport',
                hasSubRoute: false,
                showSubRoute: false,
                hasNav: true,
                NavDb: "#kalite",
                route: "#",
                icon: "fa fa-chart-line",
                subMenus: [],
            },
            {
                menuValue: 'Gespreksrapport',
                hasSubRoute: false,
                showSubRoute: false,
                hasNav: true,
                NavDb: "#konusma",
                route: "#",
                icon: "fa fa-comments",
                subMenus: [],
            }
        ];
        if (pageAuth) {
            pageAuth.children?.forEach(function (x) {
                let z = ra.find(l => l.menuValue == x.page_name);
                if (z && x.read) {
                    data[0].menu.push(z);
                }
            })
        }
        return data;
    };
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
    const handleNoteComment = (itemid: number, event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        const commentText = document.getElementById('new-note-comment-text-' + itemid.toString());
        if (commentText) {
            let newComment: NoteCommentProps = {
                // @ts-ignore
                comment: commentText.value,
                client_id: data.CustomerID,
                note_id: itemid,
                writer: auth.user.name,
                delete: false,
                created_at: new Date(),
                updated_at: new Date()
            }

            axios.post('/api/notes/commentstore', newComment).then(response => {
                console.log('Comment added sucsessfully:', response.data);
                if (openedComment) {
                    openedComment.style.display = 'none';
                    if (openedCommentLink) openedCommentLink.style.display = 'block';
                }
                setOpenedComment(undefined);
                setOpenedCommentLink(undefined);
                window.location.reload();
            }).catch(err => {
                console.error('There is an error accured while adding a note:', err);
            });
        }
    }
    const NewNoteCommentInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setNoteCommentInput(value);
    };
    const handleTicket = (Ticket: TicketsDataProps | null) => {
        if (Ticket) setTicketDomData(prev => [Ticket, ...prev]);
    }
    const UpsateTicketRenew = (updatedTicket: TicketsDataProps) => {
        const updatedList = ticketData.map(ticket => {
            if (ticket.id === updatedTicket.id) {
                return {...ticket, ...updatedTicket};
            }
            return ticket;
        })
        setTicketData(updatedList);
    }
    const ticketMessageDataHandler = (args: {
        newTicketMessage?: TicketMessagesProps;
        detailUpdateNeeded?: number;
    } | null) => {
        if (args && args.newTicketMessage) {
            let message: TicketMessagesProps = args.newTicketMessage as TicketMessagesProps;
            let action = TicketDomData.find(x => x.id === message.ticket_id);
            if (action) {
                action.hasNotis ? action.hasNotis++ : action.hasNotis = 0;
            }
        }
        setTriggerRender(prev => !prev);
    };

    const addBeenLocationHandler = (data: BuildingProps) => {
        if (selectedBestaandeLocatie.includes(data)) {
            setSelectedBestaandeLocatie(selectedBestaandeLocatie.filter(item => item !== data)); // Seçiliyse çıkart
        } else {
            setSelectedBestaandeLocatie([...selectedBestaandeLocatie, data]); // Seçili değilse ekle
        }
    }
    const bestaandeHandler = async () => {
        setShowAddBeenLocation(false);
        const niuewLocatie = selectedBestaandeLocatie.filter(item => !locations.some(locatie => item.id === locatie.id));
        if (niuewLocatie && niuewLocatie.length > 0) {
            axios.post('/api/bestaandeLocatieStore', {
                locations: selectedBestaandeLocatie.filter(item => item),
                client: data,
            })
                .then(response => {
                    console.log('Succesvol:', response.data);
                    alert('Succesvol');
                })
                .catch(error => {
                    alert('Fout: ' + error.toString());
                });
        } else alert("Geen locatie geselecteerd");
    }
    const numericSorter = (a: any, b: any, key: string) => {
        return a[key] - b[key];
    };
    const alphabeticSorter = (a: any, b: any, key: string) => {
        if (a[key] < b[key]) return -1;
        if (a[key] > b[key]) return 1;
        return 0;
    };
    const dateSorter = (a: any, b: any, key: string) => {
        return new Date(a[key]).getTime() - new Date(b[key]).getTime();
    };
    const addBeenLocationColumns: ColDef[] = [
        {
            headerName: "Action",
            flex: 1,
            cellRenderer: (params: ICellRendererParams) => {
                return (
                    <a onClick={(e) => {
                        e.preventDefault();
                        addBeenLocationHandler(params.data)
                    }} className="btn-icon flex flex-row-reverse">
                        {selectedBestaandeLocatie.includes(params.data) ?
                            (<MinusCircle className={'bg-red-500 text-white rounded-full'} size={30}/>) :
                            (<PlusCircle className={'text-green-600 mt-1'} size={30}/>)}
                    </a>
                )
            },
        },
        {
            headerName: "Locatie ID",
            flex: 1,
            valueGetter: (params: ValueGetterParams) => {
                return (`${params.data.LocationID}`);
            },
            cellRenderer: (params: ICellRendererParams) => {
                return (
                    <a>{params.data.LocationID}</a>
                )
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Locatie Name",
            flex: 2,
            valueGetter: (params: ValueGetterParams) => {
                return `${params.data.BuildingName}`;
            },
            cellRenderer: (params: ICellRendererParams) => {
                return (
                    <a>{params.data.BuildingName}</a>
                )
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Location Address",
            flex: 2,
            valueGetter: (params: ValueGetterParams) => {
                return `${params.data.locationadress} ${params.data.dnumber} ${params.data.postalcode} ${params.data.bolge} `;
            },
            cellRenderer: (params: ICellRendererParams) => {
                return (
                    <a>{params.data.locationadress} {params.data.dnumber} {params.data.postalcode} {params.data.bolge}</a>
                )
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Status",
            flex: 1,
            valueGetter: (params: ValueGetterParams) => params.data.status > 0 ? "Pasive" : "Active",
            cellRenderer: (params: ICellRendererParams) => (
                <div className="dropdown action-label">
                    <span
                        className={params.data.status > 0 ? "btn btn-white btn-sm badge-outline-danger status-color-dg" :
                            "btn btn-white btn-sm badge-outline-success status-color"}> {params.data.status > 0 ? "Pasive" : "Active"} </span>
                </div>

            ),
            filter: true, floatingFilter: true
        }
    ]
    const [columns, setColumns] = useState(AgTicketColumCreator([data], locations, handleClick, handleUpdateClick, false, false));
    const [locationColumns, setLocationColumns] = useState(LocationsColumnCreator(locationDeleteClick, locationUpdateClick, data.CustomerID, locationsDomData, false, false))
    const [contactPersonsTableColumns, setContactPersonsTableColumns] = useState(contactPersonsColumnsCreator(handleContactPersonDeleteClick, handleContactPersonUpdateClick, false, false));
    useEffect(() => {
        if (pageAuth) {
            setWriteAuth(pageAuth.write);
            setDeleteAuth(pageAuth.delete);
            let meldingenAuth = pageAuth.children?.find(x => x.page_name == 'Meldingen');
            if (meldingenAuth) {
                setColumns(AgTicketColumCreator([data], locations, handleClick, handleUpdateClick, meldingenAuth.delete, meldingenAuth.write));
                setTicketWriteAuth(meldingenAuth.write);
            } else
                setColumns(AgTicketColumCreator([data], locations, handleClick, handleUpdateClick, false, false));

            let locaiteAuth = pageAuth.children?.find(x => x.page_name == 'Locatie');
            if (locaiteAuth) {
                setLocationColumns(LocationsColumnCreator(locationDeleteClick, locationUpdateClick, data.CustomerID, locationsDomData, locaiteAuth.write, locaiteAuth.delete));
            } else setLocationColumns(LocationsColumnCreator(locationDeleteClick, locationUpdateClick, data.CustomerID, locationsDomData, false, false));
            let contactPersonenAuth = pageAuth.children?.find(x => x.page_name == 'Contactpersonen');
            if (contactPersonenAuth) {
                setContactPersonsTableColumns(contactPersonsColumnsCreator(handleContactPersonDeleteClick, handleContactPersonUpdateClick, contactPersonenAuth.write, contactPersonenAuth.delete));
            } else contactPersonsColumnsCreator(handleContactPersonDeleteClick, handleContactPersonUpdateClick, false, false);
        }
    }, [pageAuth]);
    const addContactPersonOnHide = (e: clientsContactPerson, isEdit: boolean) => {
        if (e.id != 0 && !isEdit) {
            setDomContactPersons(prevState => {
                if (!prevState) return [e];
                return [...prevState, e];
            });
        } else if (e.id != 0 && isEdit && domContactPersons) {
            let data = domContactPersons.map(persona => {
                if (persona.id == e.id) {
                    return {...persona, ...e};
                }
                return persona;
            })
            setDomContactPersons(data);
        }
        setShowAddContactPerson(false);
    }
    const gridTheme = themeQuartz
        .withParams({
            backgroundColor: "#ffffff",
            browserColorScheme: "light",
            columnBorder: false,
            foregroundColor: "rgb(14,105,214)",
            headerBackgroundColor: "#F9FAFB",
            headerFontSize: 14,
            headerFontWeight: 600,
            headerTextColor: "#919191",
            oddRowBackgroundColor: "#F9FAFB",
            rowBorder: false,
            sidePanelBorder: false,
            spacing: "4px",
            wrapperBorder: true,
            wrapperBorderRadius: "8px"
        });
    return (
        <AuthenticatedLayout user={auth.user} header={<h2>&nbsp;Client Detail of {data.Unvan}</h2>}
                             collectNotification={false}
                             notificationDataHandler={handleTicket}
                             isSidebarExpanded={isSidebarExpanded}
                             setSidebarExpanded={setSidebarExpanded}
                             isMessageTableActive={false}
                             isTicketTableActive={selectedTab == 'meldingen' ? true : false}
                             ticketMessageDataHandler={ticketMessageDataHandler}
                             SidebarData={SidebarData()}
                             handleTabClick={handleTabClick}
        >

            <Head title="Klantgegevens"/>
            <div className="page-wrapper">
                <div className="content container-fluid">
                    {/* Page Header */}
                    <div className="page-header">
                        <div className="row align-items-center">
                            <div className="col-md-4">
                                <h3 className="page-title">Bedrijfsgegevens</h3>
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link href={route('dashboard')}>Dashboard</Link>
                                    </li>
                                    <li className="breadcrumb-item"><Link href={route('clients')}>Bedrijven</Link>
                                    </li>
                                    <li className="breadcrumb-item active">{data.Unvan}
                                    </li>
                                </ul>
                            </div>
                            <div className="col-md-8">
                                <div className="contact-wrap">
                                    <div className="contact-profile">
                                        <div className="name-user">
                                            <h3>{data.Unvan}</h3>
                                        </div>
                                    </div>
                                    {writeAuth ? (<div className="contacts-action">
                                        <Link href="#" data-bs-toggle="modal" data-bs-target="#add_deals"
                                              className="btn btn-pink"> <PlusCircle className='me-1' size={15}/>Add
                                            Contract</Link>
                                        {/*<Link href="#" className="btn btn-primary" data-bs-toggle="modal"
                                           data-bs-target="#add_compose"> <Mail className='me-1' size={15}/>Send
                                        Email</Link>*/}
                                        {ticketWriteAuth ? (<a onClick={() => {
                                            setAddTicketModelShow(true);
                                            console.log(AddTicketModelShow);
                                        }}
                                                               className="btn btn-primary px-2 mx-2">
                                            <i className="fa fa-plus"/><span/>{"  New Meldingen"}
                                        </a>) : null}
                                        <a data-bs-toggle="modal" data-bs-target="#add_notes"
                                           className="btn-icon"><MessageCircle size={15}/></a>
                                        <a onClick={() => setShowEditClient(true)} className="btn-icon"><Edit
                                            size={15}/></a>
                                        <div className="dropdown">
                                            <Link href="#" className="dropdown-toggle marg-tp"
                                                  data-bs-toggle="dropdown"
                                                  aria-expanded="false"><MoreVertical size={15}/></Link>
                                            <div className="dropdown-menu dropdown-menu-right">
                                                <a className="dropdown-item"
                                                   onClick={() => setShowDeleteClient(true)}>Add Contact Person</a>
                                                {deleteAuth ? (<a className="dropdown-item"
                                                                  onClick={() => setShowDeleteClient(true)}>Delete</a>) : null}
                                            </div>
                                        </div>
                                    </div>) : null}
                                </div>
                            </div>
                            {data.passive > 0 && (<div className="row dropdown action-label flex justify-end">
                    <span className={"btn btn-danger btn-lg badge-outline-danger status-color-dg"}>
                        <h3 className={'text-danger'}>Inactive</h3> </span>
                            </div>)}
                        </div>
                    </div>
                    {/* /Page Header */}
                    <hr/>
                    <div className="row">
                        {/* Contact User */}

                        {/* /Contact User */}
                        {/* Contact Sidebar */}

                        {/* /Contact Sidebar */}
                        {/* Contact Details */}
                        <div className="col-xl-12">

                            {/* Tab Content */}
                            <div className="contact-tab-view">
                                <div className="tab-content pt-0">
                                    <div
                                        className={"tab-pane " + (selectedTab === "main" ? "active show" : "fade")}>
                                        <div className="row">
                                            <div className="col-xl-4">
                                                <div className="card contact-sidebar">
                                                    <h5>Basisinformatie</h5>
                                                    <ul className="basic-info">
                                                        <li>
                                                            <span>
                                                                <Mail size={15}/>
                                                            </span>
                                                            <p>{data.email}</p>
                                                        </li>
                                                        <li>
                                                            <span>
                                                                <Phone size={15}/>
                                                            </span>
                                                            <p>{data.phone_number}</p>
                                                        </li>
                                                        <li>
                                                            <span>
                                                                <Calendar size={15}/>
                                                            </span>
                                                            <p>Gemaakt
                                                                op {moment(data.created_at).format('YYYY-MM-DD HH:mm')}</p>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="col-xl-4">

                                                <div className="card contact-sidebar">
                                                    <h5>Bedrijfsinformatie</h5>
                                                    <ul className="other-info">
                                                        <li>
                                                            <span className="other-title">Bedrijfsnaam</span>
                                                            <span>{data.Unvan}</span>
                                                        </li>
                                                        <li><span
                                                            className="other-title">Adres</span><span>{data.address}</span>
                                                        </li>
                                                        <li><span
                                                            className="other-title">Postcode</span><span>{data.postal_code}&nbsp; {data.city}</span>
                                                        </li>
                                                        <li>
                                                            <span
                                                                className="other-title">Land</span><span>{data.country}</span>
                                                        </li>
                                                        <li><span
                                                            className="other-title">KVK</span><span>{data.VergiNumarasi}</span>
                                                        </li>
                                                        <li>
                                                            <span className="other-title">BTW nummer</span>
                                                            <span>{data.VergiDairesi}</span>
                                                        </li>
                                                        <li><span
                                                            className="other-title">Laatste update</span><span>{moment(data.created_at).format('YYYY-MM-DD HH:mm')}</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="col-xl-4">

                                                <div className="card contact-sidebar">
                                                    <h5>Bedrijfsvertegenwoordiger informatie</h5>
                                                    <div className="row">
                                                        <div className="col-4">
                                                            <ul className="other-info">
                                                                <li>
                                                                    <span className="other-title">Naam:</span>
                                                                </li>
                                                                <li>
                                                                    <span className="other-title">E-mail:</span>
                                                                </li>
                                                                <li>
                                                                    <span className="other-title">Phone:</span>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <div className="col-8">
                                                            <ul className="other-info">
                                                                <li>
                                                                    <span>{representative?.name}</span>
                                                                </li>
                                                                <li>
                                                                    <span>{representative?.email}
                                                            </span>
                                                                </li>
                                                                <li>
                                                                    <span className="other-title"></span>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    {/* Activities */}
                                    <div
                                        className={"tab-pane " + (selectedTab === "meldingen" ? "active show" : "fade")}
                                    >
                                        <div className="view-header">
                                            <h4>Meldingen</h4>
                                            <div className="col-auto float-end ms-auto flex">
                                                {ticketWriteAuth ? (<a onClick={() => setAddTicketModelShow(true)}
                                                                       className="btn btn-primary px-2 mx-2">
                                                    <i className="fa fa-plus"/>{showT_Text && "  Nieuw Meldingen"}
                                                </a>) : null}
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
                                        <div className="contact-activity">
                                            {showFilters && (
                                                <div className="filter-row card-group my-2">
                                                    <div className="col-1 px-2">
                                                        <div className={
                                                            IDfocused || inputIDValue !== ""
                                                                ? "input-block form-focus focused"
                                                                : "input-block form-focus"
                                                        }>
                                                            <input type="text"
                                                                   className="form-control floating"
                                                                   value={inputIDValue}
                                                                   onFocus={handleIDClick} onBlur={handleInpuIDtBlur}
                                                                   onChangeCapture={handleIdFilter}/>
                                                            <label className="focus-label" onClick={handleIDClick}>Melding
                                                                ID</label>
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
                                                                   className="form-control floating"
                                                                   value={inputTitleValue}
                                                                   onFocus={handleTitleClick}
                                                                   onBlur={handleInputTitleBlur}
                                                                   onChange={handleTitleFilter}/>
                                                            <label className="focus-label"
                                                                   onClick={handleTitleClick}>Titel</label>
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
                                                        <div className="ag-theme-quartz ag-theme-mycustomtheme">
                                                            <AgGridReact<TicketsDataProps>
                                                                columnDefs={columns}
                                                                rowData={TicketDomData}
                                                                pagination={false}
                                                                domLayout='autoHeight'
                                                                onGridReady={(params) => params.api.sizeColumnsToFit()}
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
                                                                                    handleTicketStatusChange={() => {
                                                                                    }}
                                                                                    customers={[data]}
                                                                                    building={locations}
                                                                                    otherUsers={otherusers}
                                                                                    ticketDummySums={ticketSums}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* /Activities */}
                                    {/* Notes */}
                                    <div
                                        className={"tab-pane " + (selectedTab === "notes" ? "active show" : "fade")}
                                    >
                                        <div className="view-header">
                                            <h4>Notes</h4>
                                            <ul>
                                                <li>
                                                    <Link href="#" data-bs-toggle="modal"
                                                          data-bs-target="#add_notes"
                                                          className="com-add btn btn-pink">
                                                        <div className={"flex flex-row"}>
                                                            <PlusCircle className='me-2' size={20}/>
                                                            <span> Add New Note</span>
                                                        </div>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="notes-activity">
                                            {notes.length > 0 ? (notes.map((item: NoteProps) => (
                                                <div className="calls-box" key={item.id}>
                                                    <div className="caller-info">
                                                        <div className="calls-user">
                                                            <div>
                                                                <h6>{item.openername}</h6>
                                                                <p>{item.created_at instanceof Date ? item.created_at.toLocaleDateString() : moment(item.created_at).format('YYYY-MM-DD HH:mm')}</p>
                                                            </div>
                                                        </div>
                                                        <div className="calls-action">
                                                            <div className="dropdown action-drop">
                                                                <Link href="#" className="dropdown-toggle"
                                                                      data-bs-toggle="dropdown"
                                                                      aria-expanded="false">
                                                                    <MoreVertical size={15}/>
                                                                </Link>
                                                                <div className="dropdown-menu dropdown-menu-right">
                                                                    <Link className="dropdown-item" href="#">
                                                                        <i className="las la-edit me-1"/>Edit</Link>
                                                                    <Link className="dropdown-item" href="#">
                                                                        <i className="las la-trash me-1"/>Delete</Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <h5>{item.notetitle}</h5>
                                                    <p>{item.note}</p>
                                                    {
                                                        note_comments?.length > 0 ? (note_comments.filter((comment: NoteCommentProps) => comment.note_id === item.id)
                                                            .sort((a: NoteCommentProps, b: NoteCommentProps) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                                                            .map((comment: NoteCommentProps) => (
                                                                <div className="reply-box" key={comment.id}>
                                                                    <p>{comment.comment}</p>
                                                                    <p>Commented by <span
                                                                        className={"text-primary"}>{comment.writer}</span> on {comment.created_at instanceof Date ? comment.created_at.toLocaleDateString() : moment(comment.created_at).format('YYYY-MM-DD HH:mm')}
                                                                    </p>
                                                                </div>
                                                            ))) : ""}
                                                    <div className={"notes-editor"}>
                                                        <div id={"note-edit-wrap-" + item.id} style={{
                                                            display: "none",
                                                            marginBottom: "15px"
                                                        }}>
                                                            <div className="summernote">
                                                                <textarea
                                                                    className="form-control"
                                                                    name={"new-note-comment-text-" + item.id}
                                                                    id={"new-note-comment-text-" + item.id}
                                                                    cols={30}
                                                                    rows={3}
                                                                    onChange={NewNoteCommentInputChange}></textarea>
                                                            </div>
                                                            <div className="text-end note-btns">
                                                                <Link href={'#'}
                                                                      className="btn btn-lighter add-cancel"
                                                                      onClick={(event) => (handleShowEditWrap(item.id, event))}>
                                                                    Cancel</Link>
                                                                <Link href="#" className="btn btn-primary"
                                                                      onClick={(event) => (handleNoteComment(item.id, event))}>
                                                                    Save</Link>
                                                            </div>
                                                        </div>
                                                        <div className="text-end">
                                                            <Link id={"link-comment-" + item.id} href="#"
                                                                  className="add-comment"
                                                                  onClick={(event) => (handleShowEditWrap(item.id, event))}>
                                                                <i className="las la-plus-circle me-1"/>Add
                                                                Comment</Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))) : (
                                                <div className={"w-full place-items-center"}>
                                                    <h3>There is not any notes</h3>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* /Notes */}
                                    {/* Contracts */}
                                    <div
                                        className={"tab-pane " + (selectedTab === "contracts" ? "active show" : "fade")}
                                    >
                                        <div className="view-header">
                                            <h4>Contracts </h4>
                                            <ul>
                                                <li>
                                                    <a onClick={(e) => {
                                                        e.preventDefault();
                                                    }}
                                                       className="com-add"><i
                                                        className="las la-plus-circle me-1"/>Add
                                                        New</a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="calls-activity">
                                            <div className="calls-box">
                                                <div className="caller-info">
                                                    <div className="calls-user">
                                                        <p><span>Darlee Robertson</span> logged a call on 23 Jul
                                                            2023,
                                                            10:00 pm</p>
                                                    </div>
                                                    <div className="calls-action">
                                                        <div className="dropdown call-drop">
                                                            <Link href="#" className="dropdown-toggle"
                                                                  data-bs-toggle="dropdown" aria-expanded="false">Busy<i
                                                                className="las la-angle-down ms-1"/></Link>
                                                            <div className="dropdown-menu dropdown-menu-right">
                                                                <Link className="dropdown-item" href="#">Busy</Link>
                                                                <Link className="dropdown-item" href="#">No
                                                                    Answer</Link>
                                                                <Link className="dropdown-item"
                                                                      href="#">Unavailable</Link>
                                                                <Link className="dropdown-item" href="#">Wrong
                                                                    Number</Link>
                                                                <Link className="dropdown-item" href="#">Left Voice
                                                                    Message</Link>
                                                                <Link className="dropdown-item" href="#">Moving
                                                                    Forward</Link>
                                                            </div>
                                                        </div>
                                                        <div className="dropdown">
                                                            <Link href="#" className="dropdown-toggle"
                                                                  data-bs-toggle="dropdown" aria-expanded="false">
                                                                <MoreVertical size={15}/></Link>
                                                            <div className="dropdown-menu dropdown-menu-right">
                                                                <Link className="dropdown-item"
                                                                      href="#">Delete</Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p>A project review evaluates the success of an initiative and
                                                    identifies areas for improvement. It can also evaluate a current
                                                    project to determine whether it's on the right track. Or, it can
                                                    determine the success of a completed project. </p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* /Contracts */}
                                    {/* Projects */}
                                    <div
                                        className={"tab-pane " + (selectedTab === "projects" ? "active show" : "fade")}
                                    >
                                        <ClientProjects auth={auth.user} customer={data} pageAuth={pageAuth}/>
                                    </div>
                                    {/* /Projectd */}
                                    {/* Contact Person */}
                                    <div
                                        className={"tab-pane " + (selectedTab === "contactpersonen" ? "active show" : "fade")}
                                    >
                                        <div className="view-header">
                                            <h4>Contactpersonen</h4>
                                            <ul>
                                                <li>
                                                    <a className="btn btn-purple text-white" onClick={() => {
                                                        setEditContactPerson(undefined);
                                                        setShowAddContactPerson(true);
                                                    }}><i
                                                        className="las la-plus-circle me-1"
                                                    />Contactpersoon</a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="calls-activity">
                                            <div className="card contact-sidebar">
                                                <div className="row">
                                                    <div className="col-12">
                                                        <div className="ag-theme-quartz ag-theme-mycustomtheme">
                                                            <AgGridReact<clientsContactPerson>
                                                                columnDefs={contactPersonsTableColumns}
                                                                rowData={domContactPersons}
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
                                    {/* /Contact Person */}
                                    {/* Faturalar */}
                                    <div
                                        className={"tab-pane " + (selectedTab === "facturen" ? "active show" : "fade")}
                                    >
                                        <div className="view-header">
                                            <h4>Files</h4>
                                        </div>
                                        <div className="files-activity">
                                            <div className="files-wrap">
                                                <div className="row align-items-center">
                                                    <div className="col-md-8">
                                                        <div className="file-info">
                                                            <h4>Manage Documents</h4>
                                                            <p>Send customizable quotes, proposals and contracts to
                                                                close deals faster.</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 text-md-end">
                                                        <ul className="file-action">
                                                            <li>
                                                                <Link href="#" className="btn btn-primary"
                                                                      data-bs-toggle="modal"
                                                                      data-bs-target="#new_file">Create
                                                                    Document</Link>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="files-wrap">
                                                <div className="row align-items-center">
                                                    <div className="col-md-8">
                                                        <div className="file-info">
                                                            <h4>Collier-Turner Proposal</h4>
                                                            <p>Send customizable quotes, proposals and contracts to
                                                                close deals faster.</p>
                                                            <div className="file-user">
                                                                <div>
                                                                    <p><span>Owner</span> Vaughan</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 text-md-end">
                                                        <ul className="file-action">
                                                            <li>
                                                                    <span
                                                                        className="badge badge-soft-pink">Proposal</span>
                                                            </li>
                                                            <li>
                                                                    <span
                                                                        className="badge badge-soft-grey priority-badge"><i
                                                                        className="fa-solid fa-circle"/>Low</span>
                                                            </li>
                                                            <li>
                                                                <div className="dropdown action-drop">
                                                                    <Link href="#" className="dropdown-toggle"
                                                                          data-bs-toggle="dropdown"
                                                                          aria-expanded="false"> <MoreVertical
                                                                        size={15}/></Link>
                                                                    <div
                                                                        className="dropdown-menu dropdown-menu-right">
                                                                        <Link className="dropdown-item" href="#"><i
                                                                            className="las la-edit me-1"/>Edit</Link>
                                                                        <Link className="dropdown-item" href="#"><i
                                                                            className="las la-trash me-1"/>Delete</Link>
                                                                        <Link className="dropdown-item" href="#"><i
                                                                            className="las la-download me-1"/>Download</Link>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="files-wrap">
                                                <div className="row align-items-center">
                                                    <div className="col-md-8">
                                                        <div className="file-info">
                                                            <h4>Collier-Turner Proposal</h4>
                                                            <p>Send customizable quotes, proposals and contracts to
                                                                close deals faster.</p>
                                                            <div className="file-user">
                                                                <div>
                                                                    <p><span>Owner</span> Jessica</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 text-md-end">
                                                        <ul className="file-action">
                                                            <li>
                                                                <span className="badge badge-soft-info">Quote</span>
                                                            </li>
                                                            <li>
                                                                    <span
                                                                        className="badge badge-soft-success priority-badge"><i
                                                                        className="fa-solid fa-circle"/>Sent</span>
                                                            </li>
                                                            <li>
                                                                <div className="dropdown action-drop">
                                                                    <Link href="#" className="dropdown-toggle"
                                                                          data-bs-toggle="dropdown"
                                                                          aria-expanded="false"> <MoreVertical
                                                                        size={15}/></Link>
                                                                    <div
                                                                        className="dropdown-menu dropdown-menu-right">
                                                                        <Link className="dropdown-item" href="#"><i
                                                                            className="las la-edit me-1"/>Edit</Link>
                                                                        <Link className="dropdown-item" href="#"><i
                                                                            className="las la-trash me-1"/>Delete</Link>
                                                                        <Link className="dropdown-item" href="#"><i
                                                                            className="las la-download me-1"/>Download</Link>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="files-wrap">
                                                <div className="row align-items-center">
                                                    <div className="col-md-8">
                                                        <div className="file-info">
                                                            <h4>Collier-Turner Proposal</h4>
                                                            <p>Send customizable quotes, proposals and contracts to
                                                                close deals faster.</p>
                                                            <div className="file-user">
                                                                <div>
                                                                    <p><span>Owner</span> Vaughan</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 text-md-end">
                                                        <ul className="file-action">
                                                            <li>
                                                                    <span
                                                                        className="badge badge-soft-pink">Proposal</span>
                                                            </li>
                                                            <li>
                                                                    <span
                                                                        className="badge badge-soft-grey priority-badge"><i
                                                                        className="fa-solid fa-circle"/>Low</span>
                                                            </li>
                                                            <li>
                                                                <div className="dropdown action-drop">
                                                                    <Link href="#" className="dropdown-toggle"
                                                                          data-bs-toggle="dropdown"
                                                                          aria-expanded="false"> <MoreVertical
                                                                        size={15}/></Link>
                                                                    <div
                                                                        className="dropdown-menu dropdown-menu-right">
                                                                        <Link className="dropdown-item" href="#"><i
                                                                            className="las la-edit me-1"/>Edit</Link>
                                                                        <Link className="dropdown-item" href="#"><i
                                                                            className="las la-trash me-1"/>Delete</Link>
                                                                        <Link className="dropdown-item" href="#"><i
                                                                            className="las la-download me-1"/>Download</Link>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* /Faturalar */}
                                    {/* Locations */}
                                    <div
                                        className={"tab-pane " + (selectedTab === "locatie" ? "active show" : "fade")}
                                        id="locatie">
                                        <div className="view-header">
                                            <h4>Locations</h4>
                                            {pageAuth?.children?.find(x => x.page_name == 'Locatie')?.write ? (
                                                <ul>
                                                    <li>
                                                        <a data-bs-toggle="modal" data-bs-target="#add_location"
                                                           className="com-add btn btn-pink">
                                                            <div className={"flex flex-row"}>
                                                                <PlusCircle className='me-2' size={20}/>
                                                                <span>Nieuwe Locatie Toevoegen</span>
                                                            </div>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a className="com-add btn btn-purple" onClick={(e) => {
                                                            e.preventDefault();

                                                            setShowAddBeenLocation(true);
                                                        }}>
                                                            <div className={"flex flex-row"}>
                                                                <PlusCircle className='me-2' size={20}/>
                                                                <span>Bestaande Locatie Toevoegen</span>
                                                            </div>
                                                        </a>
                                                    </li>
                                                </ul>
                                            ) : null}
                                        </div>
                                        <div className="files-activity">
                                            <div className="files-wrap">
                                                <div className="email-content">
                                                    <div className="col-md-12">
                                                        <div className="ag-theme-quartz ag-theme-mycustomtheme">
                                                            <AgGridReact<BuildingProps>
                                                                columnDefs={locationColumns}
                                                                rowData={locationsDomData && locationsDomData.length > 0 ? locationsDomData : []}
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
                                    {otherLocations && <Modal show={showAddBeenLocation}
                                                              onHide={() => setShowAddBeenLocation(false)}
                                                              className="modal custom-modal fade modal-padding"
                                                              id="addbeenlocation"
                                                              role="dialog"
                                                              size={'xl'}>
                                        <div className="modal-content p-0 m-0">
                                            <div
                                                className="modal-header header-border align-items-center justify-content-between p-0 m-0">
                                                <h5 className="modal-title">Add Locatie</h5>
                                                <button
                                                    type="button"
                                                    className="btn-close position-static d-flex justify-content-center align-items-center"
                                                    data-bs-dismiss="modal"
                                                    aria-label="Close"
                                                    onClick={() => setShowAddBeenLocation(false)}>
                                                    <span aria-hidden="true"><XCircle className={'text-gray-200'}
                                                                                      size={25}/></span>
                                                </button>
                                            </div>

                                        </div>
                                        <div className="modal-body m-0 p-0">
                                            <div className="form-header col-md-12 m-0 p-0">
                                                <div className="ag-theme-quartz ag-theme-mycustomtheme">
                                                    <AgGridReact<BuildingProps>
                                                        pagination={false}
                                                        domLayout='autoHeight'
                                                        onGridReady={(params) => params.api.sizeColumnsToFit()}
                                                        columnDefs={addBeenLocationColumns}
                                                        rowData={otherLocations}
                                                    />

                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="modal-footer footer-border align-items-center justify-content-between p-0">
                                            <div className={'col-lg-12 text-end form-wizard-button'}>
                                                <button className="btn btn-secondary mr-4"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setSelectedBestaandeLocatie(locations);
                                                        }}>Opnieuw instellen
                                                </button>
                                                <button className="btn btn-primary wizard-next-btn"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            bestaandeHandler();
                                                        }}>
                                                    Opslaan
                                                </button>
                                            </div>
                                        </div>
                                    </Modal>}
                                    {/* /Locations */}
                                    {/* Fiyatlar */}
                                    <div
                                        className={"tab-pane " + (selectedTab === "eenheidsprijzen" ? "active show" : "fade")}
                                        id="fiyatlar">
                                        <div className="files-activity">
                                            <div className="files-wrap">
                                                <div className="row align-items-center">
                                                    <div className="col-md-7">
                                                        <div className="file-info">
                                                            <h4>Eenheidsprijzen</h4>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-5 text-md-end">
                                                        <ul className="file-action">
                                                            <li>
                                                                <a className="flex-row flex btn btn-primary"><i
                                                                    className={'la la-lg la-plus-circle'}/>&nbsp;Nieuwe
                                                                    eenheidsprijs</a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    {/* /Fiyatlar */}
                                    {/* Konuşma */}
                                    <div
                                        className={"tab-pane " + (selectedTab === "gespreksrapport" ? "active show" : "fade")}
                                        id="konusma">
                                        <div className="view-header">
                                            <h4>Konuşma Raporu</h4>
                                            <ul>
                                                <li>
                                                    <Link href="#" className="com-add create-mail"
                                                          data-bs-toggle="tooltip" data-bs-placement="left"
                                                          data-bs-custom-class="tooltip-dark"
                                                          data-bs-original-title="There are no email accounts configured, Please configured your email account in order to Send/ Create EMails"><i
                                                        className="las la-plus-circle me-1"/>Rapor Oluştur</Link>
                                                </li>
                                            </ul>
                                        </div>

                                    </div>
                                    {/* /Konuşma */}
                                    {/* Mail */}
                                    <div
                                        className={"tab-pane " + (selectedTab === "kwaliteitsrapport" ? "active show" : "fade")}
                                        id="email">
                                        <div className="view-header">
                                            <h4>Kalite Raporu</h4>
                                            <ul>
                                                <li>
                                                    <Link href="#" className="com-add create-mail"
                                                          data-bs-toggle="tooltip" data-bs-placement="left"
                                                          data-bs-custom-class="tooltip-dark"
                                                          data-bs-original-title="There are no email accounts configured, Please configured your email account in order to Send/ Create EMails"><i
                                                        className="las la-plus-circle me-1"/>Rapor Oluştur</Link>
                                                </li>
                                            </ul>
                                        </div>

                                    </div>
                                    {/* /Mail */}
                                </div>
                            </div>
                            {/* /Tab Content */}
                        </div>
                        {/* /Contact Details */}
                    </div>
                </div>
                <AddNotes kullanici={auth.user} customer={data}/>
                <AddTicket AddTicketModelShow={AddTicketModelShow}
                           ticketDataHandler={addingNewTicketHandler}
                           otherUsers={otherusers}
                           customer={[data]}
                           user={auth.user}
                           buildings={locations}
                           islocationDetail={false}
                           onHide={() => setAddTicketModelShow(false)}
                />
                {
                    tickets && tickets.length > 0 ?
                        <UpTicket customer={[data]} user={auth.user} buildings={locations}
                                  islocationDetail={false} ticket={updateTicket}
                                  otherUsers={otherusers} ticketDataHandler={UpsateTicketRenew}
                                  UpTicketModelShow={UpTicketModelShow}
                                  onHide={() => setUpTicketModelShow(false)}/> : null
                }
            </div>

            <EditClient allUser={otherusers} clientData={data} showEditClient={showEditClient}
                        onHide={() => setShowEditClient(false)} authUser={auth.user}/>
            <AddLocation locationAddedHandle={locationAddedHandle}/>
            {
                locationsDomData.length > 0 && (
                    <EditLocation building={updateLocation}
                                  locationUpdateHandle={locationDomDataUpdate} onHide={locationModalOnHide}
                                  showUpdateLocation={showUpdateLocationModel}/>
                )
            }
            <DeleteModal Name={data.Unvan} type={'ClientDetail'} Id={data.id} DeleteModelShow={showDeleteClient}
                         deleteOnHide={() => setShowDeleteClient(false)}/>
            <AddUser clients={[data]} buildings={locationsDomData} showUserAdd={showAddUser}
                     onHide={() => setShowAddUser(false)}/>

            <AddContactPerson onHide={addContactPersonOnHide} showModel={showAddContactPerson}
                              setShowModel={setShowAddContactPerson} klant={data} editPerson={editContactPerson}/>
            {
                domClientUsers && domClientUsers.length > 0 ? (
                    <>
                        <UpUser showUserEdit={showUserEdit} onHide={() => setShowUserEdit(false)}
                                editableUser={editableUser ?? auth.user} clients={[data]} buildings={locations}/>
                        <DeleteUser showBannUser={showBannUser} onHide={() => setShowBannUser(false)}
                                    editableUser={editableUser ?? auth.user}/>
                    </>
                ) : null
            }
        </AuthenticatedLayout>
    )
        ;
}
