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
import {PageProps, User} from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {BuildingProps, CustomerProps, RouteAuths, MedewerkerDataProps} from "@/types/globalProps";
import {Head, Link} from "@inertiajs/react";
import {SidebarDataProps} from "@/Layouts/Sidebar";
import {AddMedewerker} from '@/Layouts/MedewerkerModal';
import {UserCheck} from "react-feather";
import moment from "moment";
import {preview} from "vite";

interface MedewekerDetailProps extends PageProps {
    medewerker: MedewerkerDataProps;
}

export default function MedewekerDetail({auth, medewerker}: MedewekerDetailProps) {
    const [isSidebarExpanded, setSidebarExpanded] = useState<boolean>(false);
    const [selectedTab, setSelectedTab] = useState<string>("algemeen");
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
    const personalInfoData: { id: number; title: string; text: string; }[] = [
        {
            id: 1,
            title: "Rijbewijsnummer",
            text: medewerkersDomData.rijbewijsnummer ? medewerkersDomData.rijbewijsnummer : '---'
        },
        {id: 2, title: "Afgegeven op.", text: moment(medewerkersDomData.rij_afgegeven_op).format('DD-MM-YYYY')},
        {id: 3, title: "Gedlig tot", text: moment(medewerkersDomData.rij_gedlig_tot).format('DD-MM-YYYY')},
        {id: 4, title: "Adres", text: medewerkersDomData.address},
        {id: 5, title: "Postcode", text: medewerkersDomData.postal_code},
        {id: 6, title: "Woonplaats", text: medewerkersDomData.residence},
        {id: 7, title: "Huisnummer", text: medewerkersDomData.house_number},
        {id: 8, title: "proeftijd", text: moment(medewerkersDomData.proeftijd).format('DD-MM-YYYY')},
    ];
    const contractInfo: { id: number; title: string; text: string; }[] = [
        {
            id: 1,
            title: "Contracttype",
            text: medewerkersDomData.contract_type ? medewerkersDomData.contract_type : '---'
        },
        {id: 2, title: "Contracturen", text: medewerkersDomData.contract_hours},
        {id: 3, title: "kontrakt baslangici", text: moment(medewerkersDomData.start_date).format('DD-MM-YYYY')},
        {id: 4, title: "kontrakt bitisi", text: moment(medewerkersDomData.end_date).format('DD-MM-YYYY')},
        {id: 5, title: "Kayit tarihi", text: moment(medewerkersDomData.created_at).format('DD-MM-YYYY')},
    ]
    const bankInfoData: { id: number; title: string; text: string; }[] = [
        {id: 1, title: "IBAN rekeningnummer", text: medewerkersDomData.iban_number},
        {id: 2, title: "BSN nummer", text: medewerkersDomData.bsn_number},
        {id: 3, title: "Uurloon", text: medewerkersDomData.hourly_rate.toString()},
        {id: 4, title: "Reiskostenver", text: medewerkersDomData.travel_allowance},
        {id: 5, title: "Reiskosten", text: medewerkersDomData.travel_expenses.toString()},
        {id: 6, title: "Bonusbedrag", text: medewerkersDomData.bonus_amount.toString()},
    ];
    const updateRightsOrNotes = () => {

    }
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
                             SidebarData={sidebaritems} handleTabClick={handleTabClick}
        >
            <Head title={`${medewerkersDomData.first_name} Detail`}/>
            <div className="page-wrapper">
                <div className="content container-fluid">
                    <div className="page-header">
                        <div className="row align-items-center">
                            <div className="col-md-4">
                                <h3 className={'page-title'}>Medewerkers</h3>
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link href={route('dashboard')}>Dashboard</Link>
                                    </li>
                                    <li className="breadcrumb-item"><Link href={route('medewerkers')}>Medewerkers</Link>
                                    </li>
                                    <li className="breadcrumb-item active">{medewerkersDomData.id}
                                    </li>
                                </ul>
                            </div>
                            <div className="col-md-8">
                                <div className="contact-wrap">
                                    <div className="contact-profile">
                                        <div className="name-user">
                                            <h3>{medewerkersDomData.title} {medewerkersDomData.first_name} {medewerkersDomData.tussen} {medewerkersDomData.last_name}</h3>
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
                                                                <h6 className="text-muted">{medewerkersDomData.employment_type}</h6>
                                                                <small className="text-muted">
                                                                    {medewerkersDomData.contract_type}
                                                                </small>
                                                                <div className="staff-id">
                                                                    Employee ID : {medewerkersDomData.personnel_number}
                                                                </div>
                                                                <div className="small doj text-muted">
                                                                    Date of Join
                                                                    : {moment(medewerkersDomData.start_date).format("DD-MM-YYYY")}
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
                                                                        className="text">{moment(medewerkersDomData.date_of_birth).format('DD-MM-YYYY')}</div>
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
                                </div>
                            </div>
                            <hr/>
                            <div className="tab-content pt-0 mt-2">
                                <div
                                    className={"pro-overview tab-pane " + (selectedTab === "algemeen" ? "active show" : "fade")}>
                                    <div className="row">
                                        <div className="col-md-6 d-flex">
                                            <div className="card profile-box flex-fill">
                                                <div className="card-body ">
                                                    <h4 className={'d-flex justify-between items-center'}>Basisinformatie
                                                        <a className={'ml-auto bg-gray-400 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-200'}
                                                           onClick={(e) => {
                                                               e.preventDefault();
                                                               if (editBaseInfo) {
                                                                   setEditBaseInfo(false);
                                                               } else setEditBaseInfo(true);
                                                           }}>
                                                            <i className={'fa fa-pencil hover:scale-105 transition-transform duration-200 ease-out'}/>
                                                        </a>
                                                    </h4>
                                                    <ul className="personal-info mt-2">
                                                        {personalInfoData.map((item, index) => (
                                                            <ListItem
                                                                id={item.id}
                                                                key={index}
                                                                title={item.title}
                                                                text={item.text}
                                                                editItem={editBaseInfo}/>
                                                        ))}
                                                    </ul>
                                                    {editBaseInfo ?
                                                        (<div className="flex flex-row-reverse">

                                                            <button type="submit" className="btn btn-primary ml-2"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        updateRightsOrNotes();
                                                                    }}
                                                            >
                                                                Gereed
                                                            </button>
                                                            <button type="reset" className="btn btn-secondary"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        setEditnotesorright(false);
                                                                        setMedewerkersDomData(prevState => ({
                                                                            ...prevState,
                                                                            rights: defaultRightsOrNotes
                                                                        }))
                                                                    }}>
                                                                Annuleren
                                                            </button>
                                                        </div>)
                                                        : null}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 d-flex">
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
                                                           }}>
                                                            <i className={'fa fa-pencil hover:scale-105 transition-transform duration-200 ease-out'}/>
                                                        </a>
                                                    </h4>
                                                    <ul className="personal-info mt-2">
                                                        {bankInfoData.map((item, index) => (
                                                            <ListItem
                                                                id={item.id}
                                                                key={index}
                                                                title={item.title}
                                                                text={item.text}
                                                                editItem={editBankInfo}
                                                            />
                                                        ))}
                                                    </ul>
                                                    {editBankInfo ?
                                                        (<div className="flex flex-row-reverse">

                                                            <button type="submit" className="btn btn-primary ml-2"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        updateRightsOrNotes();
                                                                    }}
                                                            >
                                                                Gereed
                                                            </button>
                                                            <button type="reset" className="btn btn-secondary"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        setEditnotesorright(false);
                                                                        setMedewerkersDomData(prevState => ({
                                                                            ...prevState,
                                                                            rights: defaultRightsOrNotes
                                                                        }))
                                                                    }}>
                                                                Annuleren
                                                            </button>
                                                        </div>)
                                                        : null}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <br/>
                                    <div className="row">
                                        <div className="col-md-6 d-flex">
                                            <div className="card profile-box flex-fill">
                                                <div className="card-body">
                                                    <h4 className={'d-flex justify-between items-center'}>Overeenkomstinformatie
                                                        <a className={'ml-auto bg-gray-400 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-200'}
                                                           onClick={(e) => {
                                                               e.preventDefault();
                                                               if (editContractInfo) {
                                                                   setEditContractInfo(false);
                                                               } else setEditContractInfo(true);
                                                           }}>
                                                            <i className={'fa fa-pencil hover:scale-105 transition-transform duration-200 ease-out'}/>
                                                        </a>
                                                    </h4>
                                                    <ul className="personal-info mt-2">
                                                        {contractInfo.map((item, index) => (
                                                            <ListItem
                                                                id={item.id}
                                                                key={index}
                                                                title={item.title}
                                                                text={item.text}
                                                                editItem={editContractInfo}
                                                            />
                                                        ))}
                                                    </ul>
                                                    {editContractInfo ?
                                                        (<div className="flex flex-row-reverse">

                                                            <button type="submit" className="btn btn-primary ml-2"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        updateRightsOrNotes();
                                                                    }}
                                                            >
                                                                Gereed
                                                            </button>
                                                            <button type="reset" className="btn btn-secondary"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        setEditnotesorright(false);
                                                                        setMedewerkersDomData(prevState => ({
                                                                            ...prevState,
                                                                            rights: defaultRightsOrNotes
                                                                        }))
                                                                    }}>
                                                                Annuleren
                                                            </button>
                                                        </div>)
                                                        : null}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 d-flex">
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
                                                           }}>
                                                            <i className={'fa fa-pencil hover:scale-105 transition-transform duration-200 ease-out'}/>
                                                        </a>
                                                    </h4>
                                                    <textarea disabled={!editnotesorright}
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
                                                    {editnotesorright ?
                                                        (<div className="flex flex-row-reverse">

                                                            <button type="submit" className="btn btn-primary ml-2"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        updateRightsOrNotes();
                                                                    }}
                                                            >
                                                                Gereed
                                                            </button>
                                                            <button type="reset" className="btn btn-secondary"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        setEditnotesorright(false);
                                                                        setMedewerkersDomData(prevState => ({
                                                                            ...prevState,
                                                                            rights: defaultRightsOrNotes
                                                                        }))
                                                                    }}>
                                                                Annuleren
                                                            </button>
                                                        </div>)
                                                        : null}
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
        </AuthenticatedLayout>
    );
}
const ListItem = ({key, id, title, text, editItem}: {
    key: number,
    id: number,
    title: string,
    text: string,
    editItem: boolean
}) => (
    <li key={key} id={id.toString()}>
        <div className="title">{title}</div>
        <input type={'text'} disabled={!editItem} value={text} className="text"></input>
    </li>
);
