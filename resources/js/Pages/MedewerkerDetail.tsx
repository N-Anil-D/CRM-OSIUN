//region css imports
import '../bootstrap';
import '../../css/app.css';
import '../../css/all.min.css'
import '../../css/bootstrap.css'
import '../../css/bootstrap-datetimepicker.min.css'
import '../../css/bootstrap.min.css'
import '../../css/ckeditor.css'
import '../../css/dataTables.bootstrap4.min.css'
import '../../css/feather.css'
import '../../css/fullcalendar.min.css'
import '../../css/line-awesome.min.css'
import '../../css/material.css'
import '../../css/owl.carousel.min.css'
import '../../css/select2.min.css'
import '../../css/CameraComponent.css'
import '../../css/PhotoGallery.css'
import '../../scss/main.scss'
import '../../css/ticketMain.css'
import "bootstrap/dist/js/bootstrap.bundle.js";
import 'ag-grid-community/styles/ag-grid.css';  // AG Grid ana stili
import 'ag-grid-community/styles/ag-theme-quartz.css';  // Tema stili (quartz)
//endregion
import React, {useState, useEffect} from "react";
import {PageProps} from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {MedewerkerDataProps} from "@/types/globalProps";
import {Head, Link, router} from "@inertiajs/react";
import {SidebarDataProps} from "@/Layouts/Sidebar";
import {UserCheck} from "react-feather";
import moment from "moment";
// import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Box, Tabs, Tab, Typography } from '@mui/material';
import Swal from 'sweetalert2';

interface MedewekerDetailProps extends PageProps {
    medewerker: MedewerkerDataProps;
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function MedewekerDetail({auth, medewerker}: MedewekerDetailProps) {
    const [value, setValue] = useState(0);

    const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    const [isSidebarExpanded, setSidebarExpanded] = useState<boolean>(false);
    const [medewerkersDomData, setMedewerkersDomData] = useState<MedewerkerDataProps>(medewerker);
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
    const [editnotesorright, setEditnotesorright] = useState<boolean>(false)
    const [defaultRightsOrNotes, setDefaultRightsOrNotes] = useState<string>(medewerkersDomData.rights);
    const [editBaseInfo, setEditBaseInfo] = useState<boolean>(false);
    const [editBankInfo, setEditBankInfo] = useState<boolean>(false);
    const [editContractInfo, setEditContractInfo] = useState<boolean>(false);
    const handleTabClick = () => {

    }
    const notificationDataHandler = () => {

    }
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        },
        didClose:()=>{
            // 
        }
    });
    
    const [personalData, set_personalData] = useState({
        Adres: '',
        Postcode: '',
        Woonplaats: '',
        Huisnummer: '',
        proeftijd: '',
    });
    useEffect(() => {
        set_personalData({
            Adres: medewerkersDomData.address ? medewerkersDomData.address : '',
            Postcode: medewerkersDomData.postal_code ? medewerkersDomData.postal_code : '',
            Woonplaats: medewerkersDomData.residence ? medewerkersDomData.residence : '',
            Huisnummer: medewerkersDomData.house_number ? medewerkersDomData.house_number : '',
            proeftijd: medewerkersDomData.proeftijd ? moment(medewerkersDomData.proeftijd).format('DD-MM-YYYY') : '',
            });
    }, [medewerkersDomData]);

    const [personalBankData, set_personalBankData] = useState({
        iban_number: '',
        bsn_number: '',
        hourly_rate: '',
        travel_allowance: '',
        travel_expenses: '',
        // bonus_amount: '',
    });
    useEffect(() => {
        set_personalBankData({
            iban_number: medewerkersDomData.iban_number ? medewerkersDomData.iban_number : '',
            bsn_number: medewerkersDomData.bsn_number ? medewerkersDomData.bsn_number : '',
            hourly_rate: medewerkersDomData.hourly_rate ? medewerkersDomData.hourly_rate.toString() : '',
            travel_allowance: medewerkersDomData.travel_allowance ? medewerkersDomData.travel_allowance : '',
            travel_expenses: medewerkersDomData.travel_expenses ? medewerkersDomData.travel_expenses.toString() : '',
            // bonus_amount: medewerkersDomData.bonus_amount ? moment(medewerkersDomData.bonus_amount).format('DD-MM-YYYY') : '',
            });
    }, [medewerkersDomData]);

    const [personalContractData, set_personalContractData] = useState({
        contracttype: '',
        contracturen: '',
        contract_starten: '',
        einde_contract: '',
        Registratiedatum: '',
    });
    useEffect(() => {
        set_personalContractData({
            contracttype: medewerkersDomData.contract_type ? medewerkersDomData.contract_type : '',
            contracturen: medewerkersDomData.contract_hours ? medewerkersDomData.contract_hours : '',
            contract_starten: medewerkersDomData.created_at ? moment(medewerkersDomData.created_at).toString() : '',
            einde_contract: medewerkersDomData.created_at ? moment(medewerkersDomData.created_at).toString() : '',
            Registratiedatum: medewerkersDomData.created_at ? moment(medewerkersDomData.created_at).toString() : '',
            });
            
    }, [medewerkersDomData]);

    const updateTabOne = () => {
        router.post('/medewerkers/update', {
            id: medewerker.id,
            tab_one: true,
            ...personalData
        });
        router.on('success', () => {
            Toast.fire({
                icon: "success",
                text: "Employee edited successfully",
            });
            setEditBaseInfo(false);
        });
    }

    const updateTabTwo = () => {
        router.post('/medewerkers/update', {
            id: medewerker.id,
            tab_two: true,
            ...personalBankData
        });
        router.on('success', () => {
            Toast.fire({
                icon: "success",
                text: "Employee edited successfully",
            });
            setEditBankInfo(false);
        });
    }

    const updateTabThree = () => {
        router.post('/medewerkers/update', {
            id: medewerker.id,
            tab_three: true,
            ...personalContractData
        });
        router.on('success', () => {
            Toast.fire({
                icon: "success",
                text: "Employee edited successfully",
            });
            setEditContractInfo(false);
        });
    }

    const updateTabFour = () => {
        router.post('/medewerkers/update', {
            id: medewerker.id,
            tab_four: true,
            rights : medewerkersDomData.rights
        });
        router.on('success', () => {
            Toast.fire({
                icon: "success",
                text: "Employee edited successfully",
            });
            setEditnotesorright(false);
        });
    }

    const handleChange = (e:any) => {
        set_personalData({
            ...personalData,
            [e.target.name]: e.target.value
        });
    };
    const handleChangetwo = (e:any) => {
        set_personalBankData({
            ...personalBankData,
            [e.target.name]: e.target.value
        });
    };
    const handleChangethree = (e:any) => {
        set_personalContractData({
            ...personalContractData,
            [e.target.name]: e.target.value
        });
    };
    const personalDataEditReset = () =>{
    }
    return (
            <AuthenticatedLayout user={auth.user}
                header={<h2
                    className="font-semibold text-sm text-gray-800 dark:text-gray-200 leading-tight flex justify-center items-center h-auto">Osius
                    CRM Panel</h2>}
                collectNotification={false}
                notificationDataHandler={notificationDataHandler} 
                isSidebarExpanded={isSidebarExpanded}
                setSidebarExpanded={setSidebarExpanded}
                isTicketTableActive={false}
                isMessageTableActive={false}
                SidebarData={sidebaritems} 
                handleTabClick={handleTabClick}
                >
                    
                    <Head title={`${medewerkersDomData.first_name} Detail`}/>
                    <div className="page-wrapper">
                        <div className="content container-fluid">
                            <div className="page-header">
                                <div className="row align-items-center">
                                    <div className="col-md-4">
                                        <h3 className={'page-title'}>Medewerkers</h3>
                                        <ul className="breadcrumb">
                                            <li className="breadcrumb-item">
                                                <Link href={route('dashboard')}>Dashboard</Link>
                                            </li>
                                            <li className="breadcrumb-item">
                                                <Link href={route('medewerkers')}>Medewerkers</Link>
                                            </li>
                                            <li className="breadcrumb-item active">
                                                {medewerkersDomData.id}
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-md-8">
                                        <div className="contact-wrap">
                                            <div className="contact-profile">
                                                <div className="name-user">
                                                    <h3>
                                                        {medewerkersDomData.title} {medewerkersDomData.first_name} {medewerkersDomData.tussen} {medewerkersDomData.last_name}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xl-12">
                                    <div className="card mb-0">
                                        <div className="card-body">
                                            <Box sx={{ width: '100%' }}>
                                                <Tabs value={value} onChange={handleChangeTab} aria-label="basic tabs example">
                                                    <Tab label="Personeelskaart" {...a11yProps(0)} />
                                                    <Tab label="Basisinformatie" {...a11yProps(1)} />
                                                    <Tab label="Commerciëleinformatie" {...a11yProps(2)} />
                                                    <Tab label="Overeenkomstinformatie" {...a11yProps(3)} />
                                                    <Tab label="Rechten of aantekeningen" {...a11yProps(4)} />
                                                </Tabs>
                                                <TabPanel value={value} index={0}>
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="profile-view">
                                                                <div className="profile-img-wrap">
                                                                    <div className="profile-img">
                                                                        <a>
                                                                            <UserCheck style={{width: '100%'}} size={150}/>
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                <div className="profile-basic">
                                                                    <div className="row">
                                                                        <div className="col-md-5">
                                                                            <div className="profile-info-left">
                                                                                <h3 className="user-name m-t-0 mb-0">
                                                                                    {medewerkersDomData.title} {medewerkersDomData.first_name} {medewerkersDomData.tussen} {medewerkersDomData.last_name}
                                                                                </h3>
                                                                                <h6 className="text-muted">
                                                                                    {medewerkersDomData.employment_type}
                                                                                </h6>
                                                                                <small className="text-muted">
                                                                                    {medewerkersDomData.contract_type}
                                                                                </small>
                                                                                <div className="small doj text-muted">
                                                                                    Date of Join
                                                                                    :
                                                                                    {moment(medewerkersDomData.start_date).format("DD-MM-YYYY")}
                                                                                </div>
                                                                                <div className="staff-msg">
                                                                                    <a className="btn btn-custom">
                                                                                        Send Message??
                                                                                    </a>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-7">
                                                                            <ul className="personal-info">
                                                                                <li>
                                                                                    <div className="title">Phone:</div>
                                                                                    <div className="text">
                                                                                        <a href={`tel:${medewerkersDomData.phone_number}`}>
                                                                                        {medewerkersDomData.phone_number}
                                                                                        </a>
                                                                                    </div>
                                                                                </li>
                                                                                <li>
                                                                                    <div className="title">Email:</div>
                                                                                    <div className="text">
                                                                                        <a href={`mailto:${medewerkersDomData.email}`}>
                                                                                        {medewerkersDomData.email}
                                                                                        </a>
                                                                                    </div>
                                                                                </li>
                                                                                <li>
                                                                                    <div className="title">Birthday:</div>
                                                                                    <div
                                                                                        className="text">
                                                                                        {moment(medewerkersDomData.date_of_birth).format('DD-MM-YYYY')}
                                                                                    </div>
                                                                                </li>
                                                                                <li>
                                                                                    <div className="title">Address:</div>
                                                                                    <div className="text">
                                                                                        {medewerkersDomData.address}
                                                                                    </div>
                                                                                </li>
                                                                                <li>
                                                                                    <div className="title">Gender:</div>
                                                                                    <div className="text">
                                                                                        {medewerkersDomData.gender}
                                                                                    </div>
                                                                                </li>
                                                                                <li>
                                                                                    <div className="title">Reports to:</div>
                                                                                    <div className="text">
                                                                                        <div className="avatar-box">
                                                                                            <div className="avatar avatar-xs">
                                                                                                <UserCheck size={50}/>
                                                                                            </div>
                                                                                        </div>
                                                                                        <a>
                                                                                            Supervisor ya da formen ile ilişki kurulacak
                                                                                        </a>
                                                                                    </div>
                                                                                </li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TabPanel>
                                                <TabPanel value={value} index={1}>
                                                    <div className="row">
                                                        <div className="col-md-12 d-flex">
                                                            <div className="card profile-box flex-fill">
                                                                <div className="card-body ">
                                                                    <h4 className={'d-flex justify-between items-center'}>Basisinformatie
                                                                        <a className={'ml-auto bg-gray-400 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-200'}
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                if (editBaseInfo) {
                                                                                    setEditBaseInfo(false);
                                                                                } else setEditBaseInfo(true);
                                                                            }}
                                                                        >
                                                                            <i className={'fa fa-pencil hover:scale-105 transition-transform duration-200 ease-out'}/>
                                                                        </a>
                                                                    </h4>
                                                                    {!editBaseInfo ? 
                                                                    <div className="profile-basic">
                                                                        <div className="row">
                                                                            <div className="col">
                                                                                <ul className="personal-info">
                                                                                    <li>
                                                                                        <div className="title">Address:</div>
                                                                                        <div className="text">
                                                                                            {personalData.Adres}
                                                                                        </div>
                                                                                    </li>
                                                                                    <li>
                                                                                        <div className="title">Postcode:</div>
                                                                                        <div className="text">
                                                                                            {personalData.Postcode}
                                                                                        </div>
                                                                                    </li>
                                                                                    <li>
                                                                                        <div className="title">Woonplaats:</div>
                                                                                        <div className="text">
                                                                                            {personalData.Woonplaats}
                                                                                        </div>
                                                                                    </li>
                                                                                    <li>
                                                                                        <div className="title">Huisnummer:</div>
                                                                                        <div className="text">
                                                                                            {personalData.Huisnummer}
                                                                                        </div>
                                                                                    </li>
                                                                                    {/* <li>
                                                                                        <div className="title">Proeftijd:</div>
                                                                                        <div className="text">
                                                                                            {personalData.proeftijd}
                                                                                        </div>
                                                                                    </li> */}
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    : 
                                                                    <form onSubmit={updateTabOne} id={'addContactPerson'}>
                                                                        <div className="row">
                                                                            <div className="col">
                                                                                <label className="col-form-label">Adres</label>
                                                                                <input type="text" name="Adres" className="form-control"
                                                                                    value={personalData.Adres}
                                                                                    onChange={handleChange}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="row">
                                                                            <div className="col">
                                                                                <label className="col-form-label">Postcode</label>
                                                                                <input type="text" name="Postcode" className="form-control"
                                                                                    value={personalData.Postcode}
                                                                                    onChange={handleChange}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="row">
                                                                            <div className="col">
                                                                                <label className="col-form-label">Woonplaats</label>
                                                                                <input type="text" name="Woonplaats" className="form-control"
                                                                                    value={personalData.Woonplaats}
                                                                                    onChange={handleChange}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="row">
                                                                            <div className="col">
                                                                                <label className="col-form-label">Huisnummer</label>
                                                                                <input type="text" name="Huisnummer" className="form-control"
                                                                                    value={personalData.Huisnummer}
                                                                                    onChange={handleChange}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        {/* <div className="row">
                                                                            <div className="col">
                                                                                <label className="col-form-label">Proeftijd</label>
                                                                                <input type="email" name="proeftijd" className="form-control"
                                                                                    value={personalData.proeftijd}
                                                                                    onChange={handleChange}
                                                                                />
                                                                            </div>
                                                                        </div> */}
                                                                        {editBaseInfo ?
                                                                            (<div className="flex flex-row-reverse mt-4">

                                                                                <button type="submit" className="btn btn-primary ml-2"
                                                                                        onClick={(e) => {
                                                                                            e.preventDefault();
                                                                                            updateTabOne();
                                                                                        }}
                                                                                >
                                                                                    Gereed
                                                                                </button>
                                                                                <button type="reset" className="btn btn-secondary"
                                                                                        onClick={(e) => {
                                                                                            e.preventDefault();
                                                                                            personalDataEditReset();
                                                                                        }}>
                                                                                    Annuleren
                                                                                </button>
                                                                            </div>)
                                                                            : null
                                                                            }
                                                                    </form>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TabPanel>
                                                <TabPanel value={value} index={2}>
                                                    <div className="row">
                                                        <div className="col-md-12 d-flex">
                                                            <div className="card profile-box flex-fill">
                                                                <div className="card-body ">
                                                                    <h4 className={'d-flex justify-between items-center'}>Commerciële
                                                                        informatie
                                                                        <a className={'ml-auto bg-gray-400 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-200'}
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                if (editBankInfo) {
                                                                                    setEditBankInfo(false);
                                                                                } else setEditBankInfo(true);
                                                                            }}
                                                                        >
                                                                            <i className={'fa fa-pencil hover:scale-105 transition-transform duration-200 ease-out'}/>
                                                                        </a>
                                                                    </h4>
                                                                    {!editBankInfo ? 
                                                                    <div className="profile-basic">
                                                                        <div className="row">
                                                                            <div className="col">
                                                                                <ul className="personal-info">
                                                                                    <li>
                                                                                        <div className="title">IBAN rekeningnummer:</div>
                                                                                        <div className="text">
                                                                                            {personalBankData.iban_number}
                                                                                        </div>
                                                                                    </li>
                                                                                    <li>
                                                                                        <div className="title">BSN nummer:</div>
                                                                                        <div className="text">
                                                                                            {personalBankData.bsn_number}
                                                                                        </div>
                                                                                    </li>
                                                                                    <li>
                                                                                        <div className="title">Uurloon:</div>
                                                                                        <div className="text">
                                                                                            {personalBankData.hourly_rate.toString()}
                                                                                        </div>
                                                                                    </li>
                                                                                    <li>
                                                                                        <div className="title">Reiskostenver:</div>
                                                                                        <div className="text">
                                                                                            {personalBankData.travel_allowance}
                                                                                        </div>
                                                                                    </li>
                                                                                    <li>
                                                                                        <div className="title">Reiskosten:</div>
                                                                                        <div className="text">
                                                                                            {personalBankData.travel_expenses.toString()}
                                                                                        </div>
                                                                                    </li>
                                                                                    {/* <li>
                                                                                        <div className="title">Bonusbedrag:</div>
                                                                                        <div className="text">
                                                                                            {personalBankData.bonus_amount.toString()}
                                                                                        </div>
                                                                                    </li> */}
                                                                                    {/* <li>
                                                                                        <div className="title">Proeftijd:</div>
                                                                                        <div className="text">
                                                                                            {personalData.proeftijd}
                                                                                        </div>
                                                                                    </li> */}
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    : 
                                                                    <form onSubmit={updateTabTwo} id={'addContactPerson'}>
                                                                        <div className="row">
                                                                            <div className="col">
                                                                                <label className="col-form-label">IBAN rekeningnummer</label>
                                                                                <input type="text" name="iban_number" className="form-control"
                                                                                    value={personalBankData.iban_number}
                                                                                    onChange={handleChangetwo}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="row">
                                                                            <div className="col">
                                                                                <label className="col-form-label">BSN nummer</label>
                                                                                <input type="text" name="bsn_number" className="form-control"
                                                                                    value={personalBankData.bsn_number}
                                                                                    onChange={handleChangetwo}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="row">
                                                                            <div className="col">
                                                                                <label className="col-form-label">Uurloon</label>
                                                                                <input type="text" name="hourly_rate" className="form-control"
                                                                                    value={personalBankData.hourly_rate.toString()}
                                                                                    onChange={handleChangetwo}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="row">
                                                                            <div className="col">
                                                                                <label className="col-form-label">Reiskostenver</label>
                                                                                <input type="text" name="travel_allowance" className="form-control"
                                                                                    value={personalBankData.travel_allowance}
                                                                                    onChange={handleChangetwo}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="row">
                                                                            <div className="col">
                                                                                <label className="col-form-label">Reiskosten</label>
                                                                                <input type="text" name="travel_expenses" className="form-control"
                                                                                    value={personalBankData.travel_expenses.toString()}
                                                                                    onChange={handleChangetwo}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        {/* <div className="row">
                                                                            <div className="col">
                                                                                <label className="col-form-label">Bonusbedrag</label>
                                                                                <input type="text" name="bonus_amount" className="form-control"
                                                                                    value={personalBankData.bonus_amount.toString()}
                                                                                    onChange={handleChangetwo}
                                                                                />
                                                                            </div>
                                                                        </div> */}
                                                                        {editBankInfo ?
                                                                            <div className="flex flex-row-reverse mt-4">

                                                                                <button type="submit" className="btn btn-primary ml-2"
                                                                                        onClick={(e) => {
                                                                                            e.preventDefault();
                                                                                            updateTabTwo();
                                                                                        }}
                                                                                >
                                                                                    Gereed
                                                                                </button>
                                                                                <button type="reset" className="btn btn-secondary"
                                                                                        onClick={(e) => {
                                                                                            e.preventDefault();
                                                                                            personalDataEditReset();
                                                                                        }}>
                                                                                    Annuleren
                                                                                </button>
                                                                            </div>
                                                                            : null
                                                                            }
                                                                    </form>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TabPanel>
                                                <TabPanel value={value} index={3}>
                                                    <div className="row">
                                                        <div className="col-md-12 d-flex">
                                                            <div className="card profile-box flex-fill">
                                                                <div className="card-body">
                                                                    <h4 className={'d-flex justify-between items-center'}>Overeenkomstinformatie
                                                                        <a className={'ml-auto bg-gray-400 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-200'}
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                if (editContractInfo) {
                                                                                    setEditContractInfo(false);
                                                                                } else setEditContractInfo(true);
                                                                            }}
                                                                        >
                                                                            <i className={'fa fa-pencil hover:scale-105 transition-transform duration-200 ease-out'}/>
                                                                        </a>
                                                                    </h4>
                                                                    {!editContractInfo ? 
                                                                    <div className="profile-basic">
                                                                        <div className="row">
                                                                            <div className="col">
                                                                                <ul className="personal-info">
                                                                                    <li>
                                                                                        <div className="title">Contracttype:</div>
                                                                                        <div className="text">
                                                                                            {personalContractData.contracttype}
                                                                                        </div>
                                                                                    </li>
                                                                                    <li>
                                                                                        <div className="title">Contracturen:</div>
                                                                                        <div className="text">
                                                                                            {personalContractData.contracturen}
                                                                                        </div>
                                                                                    </li>
                                                                                    <li>
                                                                                        <div className="title">Contract starten:</div>
                                                                                        <div className="text">
                                                                                            {personalContractData.contract_starten.toString()}
                                                                                        </div>
                                                                                    </li>
                                                                                    <li>
                                                                                        <div className="title">Einde contract:</div>
                                                                                        <div className="text">
                                                                                            {personalContractData.einde_contract}
                                                                                        </div>
                                                                                    </li>
                                                                                    <li>
                                                                                        <div className="title">Registratiedatum:</div>
                                                                                        <div className="text">
                                                                                            {personalContractData.Registratiedatum.toString()}
                                                                                        </div>
                                                                                    </li>
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    : 
                                                                    <form onSubmit={updateTabTwo} id={'addContactPerson'}>
                                                                        <div className="row">
                                                                            <div className="col">
                                                                                <label className="col-form-label">Contracttype</label>
                                                                                <input type="text" name="contracttype" className="form-control"
                                                                                    value={personalContractData.contracttype}
                                                                                    onChange={handleChangethree}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="row">
                                                                            <div className="col">
                                                                                <label className="col-form-label">Contracturen</label>
                                                                                <input type="text" name="contracturen" className="form-control"
                                                                                    value={personalContractData.contracturen}
                                                                                    onChange={handleChangethree}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="row">
                                                                            <div className="col">
                                                                                <label className="col-form-label">Contract Starten</label>
                                                                                <input type="text" name="contract_starten" className="form-control"
                                                                                    value={personalContractData.contract_starten}
                                                                                    onChange={handleChangethree}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="row">
                                                                            <div className="col">
                                                                                <label className="col-form-label">Einde Contract</label>
                                                                                <input type="text" name="einde_contract" className="form-control"
                                                                                    value={personalContractData.einde_contract}
                                                                                    onChange={handleChangethree}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="row">
                                                                            <div className="col">
                                                                                <label className="col-form-label">Registratiedatum</label>
                                                                                <input type="text" name="Registratiedatum" className="form-control"
                                                                                    value={personalContractData.Registratiedatum}
                                                                                    onChange={handleChangethree}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        {editContractInfo ?
                                                                            <div className="flex flex-row-reverse mt-4">
                                                                                <button type="submit" className="btn btn-primary ml-2"
                                                                                        onClick={(e) => {
                                                                                            e.preventDefault();
                                                                                            updateTabThree();
                                                                                        }}
                                                                                >
                                                                                    Gereed
                                                                                </button>
                                                                                {/* <button type="reset" className="btn btn-secondary"
                                                                                        onClick={(e) => {
                                                                                            e.preventDefault();
                                                                                            personalDataEditReset();
                                                                                        }}>
                                                                                    Annuleren
                                                                                </button> */}
                                                                            </div>
                                                                            : null
                                                                            }
                                                                    </form>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TabPanel>
                                                <TabPanel value={value} index={4}>
                                                    <div className="row">
                                                        <div className="col-md-12 d-flex">
                                                            <div className="card profile-box flex-fill">
                                                                <div className="card-body">
                                                                    <h4 className={'d-flex justify-between items-center'}>Rights or
                                                                        Notes
                                                                        <a className={'ml-auto bg-gray-400 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-200'}
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                if (editnotesorright) {
                                                                                    setMedewerkersDomData(prev => ({
                                                                                        ...prev,
                                                                                        rights: defaultRightsOrNotes
                                                                                    }));
                                                                                    setEditnotesorright(false);
                                                                                } else setEditnotesorright(true);
                                                                            }}
                                                                        >
                                                                            <i className={'fa fa-pencil hover:scale-105 transition-transform duration-200 ease-out'}/>
                                                                        </a>
                                                                    </h4>
                                                                    {editnotesorright ?
                                                                    <textarea // !editnotesorright
                                                                            className={'form-control-sm col-md-12 mt-2'}
                                                                            name="rights" rows={10} id="rights"
                                                                        value={medewerkersDomData.rights}
                                                                        onChange={e => {
                                                                            if (e) {
                                                                                setMedewerkersDomData(prevState => ({
                                                                                    ...prevState,
                                                                                    rights: e.target.value
                                                                                }))
                                                                            }
                                                                        }}
                                                                    ></textarea>
                                                                    : 
                                                                    <p>{medewerkersDomData.rights}</p>
                                                                    }
                                                                    {editnotesorright ?
                                                                    (<div className="flex flex-row-reverse">
                                                                        <button type="submit" className="btn btn-primary ml-2"
                                                                                onClick={(e) => {
                                                                                    e.preventDefault();
                                                                                    updateTabFour();
                                                                                    //    updateRightsOrNotes();
                                                                                }}
                                                                        >
                                                                            Gereed
                                                                        </button>
                                                                        {/* <button type="reset" className="btn btn-secondary"
                                                                                onClick={(e) => {
                                                                                    e.preventDefault();
                                                                                    setEditnotesorright(false);
                                                                                    setMedewerkersDomData(prevState => ({
                                                                                        ...prevState,
                                                                                        rights: defaultRightsOrNotes
                                                                                    }))
                                                                                }}>
                                                                            Annuleren
                                                                        </button> */}
                                                                    </div>)
                                                                    : null}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TabPanel>
                                            </Box>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </AuthenticatedLayout>
    );
}
