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
import React, {useEffect, useState} from "react";
import {PageProps} from "@/types";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    BuildingProps,
    clientsContactPerson, CustomerProps,
    RouteAuths,
    TicketMessagesProps,
    TicketsDataProps
} from "@/types/globalProps";
import Sidebar, {MenuProps, SidebarDataProps} from "@/Layouts/Sidebar";
import Cookies from "js-cookie";
import {Link, Head} from "@inertiajs/react";
import {XCircle, UserCheck, Mail, Phone, Smartphone,
    CheckCircle, Slash, MinusCircle, PlusCircle, Save} from "react-feather";
import UpdateOtherUserInformationForm from "@/Pages/Profile/Partials/UpdateOtherUserInformationForm";
import {User} from '@/types/index'
import {UpdateContactPersonUserInformation} from "@/Pages/Profile/Partials/UpdateOtherUserInformationForm";
import axios from "axios";
import {Inertia} from '@inertiajs/inertia';
import {permitableContactPersonList} from "@/types/PagePermitions";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {Table} from "antd";
import UpdateOthersPasswordForm from "@/Pages/Profile/Partials/UpdateOthersPasswordForm";


interface ContactPersonDetailProps extends PageProps {
    person: clientsContactPerson;
    account: User;
    buildings: BuildingProps[];
    clients: CustomerProps[];
    permissions: RouteAuths[];
}

export default function ContactPersonDetail({
                                                auth,
                                                person,
                                                account,
                                                buildings,
                                                clients,
    permissions
                                            }: ContactPersonDetailProps) {
    const [isSidebarExpanded, setSidebarExpanded] = useState<boolean>(false);
    const [domPerson, setDomPerson] = useState(person);
    const [selectedTab, setSelectedTab] = useState<string>("algemeen");
    const [pageAuth, setPageAuth] = useState<RouteAuths | undefined>();
    const [domKlanten, setDomKlanten] = useState<CustomerProps>();
    const [authsData, setAuthsData] = useState<RouteAuths[]>(permitableContactPersonList);
    const [BestaandeLocatie, setBestaandeLocatie] = useState<BuildingProps[]>(buildings);

    const MySwal = withReactContent(Swal);
    const accountStatusChanger =(e:any)=>{
        e.preventDefault();
        if(!account.bann){
            MySwal.fire({
                title: 'Weet je het zeker?',
                text: "Dit gebruikersaccount wordt inactief gemaakt.\nDeze actie heeft geen invloed op de contactpersoon.",
                showCancelButton: true,
                //confirmButtonColor: '#00ff00',
                confirmButtonText: "Akkoord",
                confirmButtonColor: '#FF902F',
                cancelButtonText: 'Annuleren',
                cancelButtonColor: '#FC133D',
            }).then((result) => {
                if(result.isConfirmed){
                    const req = {
                        user_id: account.id,
                    }
                    axios.post('/api/getpassivethatuser', req).then(response => {
                        if(response.status == 200){
                            MySwal.fire({
                                title: 'Verwijderd!',
                                text: 'Gebruikersaccount is succesvol inactief gemaakt.',
                                confirmButtonText: 'OK',
                                customClass: {
                                    confirmButton: 'btn btn-success',
                                },
                            }).then((result) => {
                                window.location.reload();
                            });
                        }

                    }).catch(error => {
                        MySwal.fire({
                            title: 'Fout!',
                            text: 'Er is iets misgegaan.\n' + error,
                            confirmButtonText: 'OK',
                            customClass: {
                                confirmButton: 'btn btn-danger',
                            },
                        });
                    })
                }else {
                    MySwal.fire({
                        title: 'Geannuleerd',
                        text: 'Gebruikersaccount is nog steeds inactief',
                        confirmButtonText: 'OK',
                        customClass: {
                            confirmButton: 'btn btn-success',
                        },
                    });
                }
            })
        }
        else {
            MySwal.fire({
                title: 'Weet je het zeker?',
                text: "Deze contactpersoon wordt actief gemaakt.",
                showCancelButton: true,
                confirmButtonText: "Akkoord",
                confirmButtonColor: '#FF902F',
                cancelButtonText: 'Annuleren',
                cancelButtonColor: '#FC133D',
            }).then((result) => {
                if(result.isConfirmed){
                    const req = {
                        person_id: person.id,
                    }
                    axios.post('/api/getactivethatuser', req).then(response => {
                        if(response.status == 200){
                            MySwal.fire({
                                title: 'Verwijderd!',
                                text: 'Gebruikersaccount is succesvol actief gemaakt.',
                                confirmButtonText: 'OK',
                                customClass: {
                                    confirmButton: 'btn btn-success',
                                },
                            }).then((result) => {
                                window.location.reload();
                            });
                        }

                    }).catch(error => {
                        MySwal.fire({
                            title: 'Fout!',
                            text: 'Er is iets misgegaan.\n' + error,
                            confirmButtonText: 'OK',
                            customClass: {
                                confirmButton: 'btn btn-danger',
                            },
                        });
                        console.log(error);
                    })
                }else {
                    MySwal.fire({
                        title: 'Geannuleerd',
                        text: 'Gebruikersaccount is nog steeds actief',
                        confirmButtonText: 'OK',
                        customClass: {
                            confirmButton: 'btn btn-success',
                        },
                    });
                }
            })
        }
    }
    const personStatusSwicher =(e:any)=>{
        e.preventDefault();
        if(!person.passive){
            MySwal.fire({
                title: 'Weet je het zeker?',
                text: "Deze contactpersoon wordt inactief gemaakt.\nAls er een gebruikersaccount is, wordt deze ook inactief gemaakt.",
                showCancelButton: true,
                //confirmButtonColor: '#00ff00',
                confirmButtonText: "Akkoord",
                confirmButtonColor: '#FF902F',
                cancelButtonText: 'Annuleren',
                cancelButtonColor: '#FC133D',
            }).then((result) => {
                if(result.isConfirmed){
                    const req = {
                        person_id: person.id,
                    }
                    axios.post('/api/getpassivethatcontact', req).then(response => {
                        if(response.status == 200){
                            MySwal.fire({
                                title: 'Verwijderd!',
                                text: 'Contactpersoon is succesvol inactief gemaakt.',
                                confirmButtonText: 'OK',
                                customClass: {
                                    confirmButton: 'btn btn-success',
                                },
                            }).then((result) => {
                                window.location.reload();
                            });
                        }

                    }).catch(error => {
                        MySwal.fire({
                            title: 'Fout!',
                            text: 'Er is iets misgegaan.\n' + error,
                            confirmButtonText: 'OK',
                            customClass: {
                                confirmButton: 'btn btn-danger',
                            },
                        });
                    })
                }else {
                    MySwal.fire({
                        title: 'Geannuleerd',
                        text: 'Contactpersoon is nog steeds actief',
                        confirmButtonText: 'OK',
                        customClass: {
                            confirmButton: 'btn btn-success',
                        },
                    });
                }
            })
        }
        else {
            MySwal.fire({
                title: 'Weet je het zeker?',
                text: "Deze contactpersoon wordt actief gemaakt.",
                showCancelButton: true,
                confirmButtonText: "Akkoord",
                confirmButtonColor: '#FF902F',
                cancelButtonText: 'Annuleren',
                cancelButtonColor: '#FC133D',
            }).then((result) => {
                if(result.isConfirmed){
                    const req = {
                        person_id: person.id,
                    }
                    axios.post('/api/getactivethatcontact', req).then(response => {
                        if(response.status == 200){
                            MySwal.fire({
                                title: 'Verwijderd!',
                                text: 'Contactpersoon is succesvol inactief gemaakt.',
                                confirmButtonText: 'OK',
                                customClass: {
                                    confirmButton: 'btn btn-success',
                                },
                            }).then((result) => {
                                window.location.reload();
                            });
                        }

                    }).catch(error => {
                        MySwal.fire({
                            title: 'Fout!',
                            text: 'Er is iets misgegaan.\n' + error,
                            confirmButtonText: 'OK',
                            customClass: {
                                confirmButton: 'btn btn-danger',
                            },
                        });
                        console.log(error);
                    })
                }else {
                    MySwal.fire({
                        title: 'Geannuleerd',
                        text: 'Contactpersoon is nog steeds actief',
                        confirmButtonText: 'OK',
                        customClass: {
                            confirmButton: 'btn btn-success',
                        },
                    });
                }
            })
        }
    }
    const showDeleteConfrimantion = () => {
        MySwal.fire({
            title: 'Weet je het zeker?',
            text: "Je kunt dit niet ongedaan maken!",
            showCancelButton: true,
            //confirmButtonColor: '#00ff00',
            confirmButtonText: "Ja, verwijder het!",
            confirmButtonColor: '#FF902F',
            cancelButtonText: 'Annuleren',
            cancelButtonColor: '#FC133D',
        }).then((result) => {
            if (result.isConfirmed) {
                const request = {userid: person.is_user, person_id: person.id}
                axios.post('/api/delete_that_user', request).then((response) => {
                    if (response.status == 200) {
                        MySwal.fire({
                            title: 'Verwijderd!',
                            text: 'Gebruikersaccount is verwijderd.',
                            confirmButtonText: 'OK',
                            customClass: {
                                confirmButton: 'btn btn-success',
                            },
                        }).then((result) => {
                            window.location.reload();
                        });
                    }
                }).catch(error => {
                    MySwal.fire({
                        title: 'Fout!',
                        text: 'Er is iets misgegaan.\n' + error,
                        confirmButtonText: 'OK',
                        customClass: {
                            confirmButton: 'btn btn-danger',
                        },
                    });
                })
            } else {
                MySwal.fire({
                    title: 'Geannuleerd',
                    text: 'Je account is veilig :)',
                    confirmButtonText: 'OK',
                    customClass: {
                        confirmButton: 'btn btn-success',
                    },
                });
            }

        });
    };
    const showMakeItUSerConfrimantion = () => {
        MySwal.fire({
            title: 'Weet je het zeker?',
            text: "Er zal een account voor deze persoon worden aangemaakt.",
            showCancelButton: true,
            confirmButtonText: "Akkoord",
            confirmButtonColor: '#FF902F',
            cancelButtonText: 'Annuleren',
            cancelButtonColor: '#FC133D',
        }).then((result) => {
            if (result.isConfirmed) {
                makeItUser();
            } else {
                MySwal.fire({
                    title: 'Geannuleerd',
                    text: 'Het aanmaken van het gebruikersaccount is geannuleerd.',
                    confirmButtonText: 'OK',
                    customClass: {
                        confirmButton: 'btn btn-success',
                    },
                });
            }

        });
    };
    const ticketMessageDataHandler = (args: {
        newTicketMessage?: TicketMessagesProps;
        detailUpdateNeeded?: number;
    } | null) => {
    };
    useEffect(() => {
        console.log('builds', buildings);
        let klant = clients.filter(x => x.CustomerID == person.connectedCustomer)[0];
        if (klant) {
            setDomKlanten(klant);
        }
    }, []);
    const handleTicket = (Ticket: TicketsDataProps | null) => {
    }
    const handleTabClick = (menu: MenuProps) => {
        setSelectedTab(menu.menuValue.toLowerCase());
        Cookies.set('clientTap', menu.menuValue.toLowerCase());
    };
    const sidebaritems: SidebarDataProps[] = [
        {
            tittle: 'Contactpersoon',
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
    const makeItUser = () => {
        try {
            let accnaam;
            if (person.tussen != "" && person.tussen != null) accnaam = person.first_name + " " + person.tussen + " " + person.last_name;
            else accnaam = person.first_name + " " + person.last_name;
            const request = {
                contactPersonID: person.id,
                name: accnaam,
                email: person.email,
                password: "1",
                roleName: "user",
                connectedBuild: 'various',
                connectedCustomer: person.connectedCustomer,
                passive: "0",
                permissions: authsData,
            };
            axios.post('/api/make_it_user', request)
                .then(response => {
                    MySwal.fire({
                        title: 'Succesvol!',
                        text: 'Gebruikersaccount is succesvol aangemaakt.',
                        confirmButtonText: 'OK',
                        customClass: {
                            confirmButton: 'btn btn-success',
                        },
                    }).then((result) => {
                        window.location.reload();
                    });
                })
                .catch(err => {
                    MySwal.fire({
                        title: 'Fout!',
                        text: 'Er is iets misgegaan.\n' + err,
                        confirmButtonText: 'OK',
                        customClass: {
                            confirmButton: 'btn btn-danger',
                        },
                    });
                });

        } catch (error) {
            console.error('Error occurred:', error);
            throw error;
        }
    }
    const fetchAccontActivity = (e: boolean) => {
        if (!e) {
            showDeleteConfrimantion();
        } else {
            showMakeItUSerConfrimantion();
        }
    }
    const addBeenLocationHandler = (data: BuildingProps) => {
        let i = BestaandeLocatie.map(item => {
            if(item.id == data.id) return{...item, is_assigned: !data.is_assigned};
            return item;
        })
        setBestaandeLocatie(i);
    }
    const alphabeticSorter = (a: any, b: any, key: string) => {
        if (a[key] < b[key]) return -1;
        if (a[key] > b[key]) return 1;
        return 0;
    };
    const addBeenLocationColumns = [
        {
            title: "Action",
            render: (data: BuildingProps) => (
                <a onClick={(e) => {
                    e.preventDefault();
                    addBeenLocationHandler(data)
                }} className="btn-icon flex flex-row-reverse">
                    {data.is_assigned ?
                        (<MinusCircle className={'bg-red-500 text-white rounded-full'} size={30}/>) :
                        (<PlusCircle className={'text-green-600 mt-1'} size={30}/>)}
                </a>
            ),
            sorter: false,
        }, {
            title: "Locatie ID",
            render: (location: any) => (
                <a>{location.LocationID}</a>
            ),
            sorter: (a: any, b: any) => alphabeticSorter(a, b, "LocationID"),
        },
        {
            title: "Locatie Name",
            render: (location: any) => (
                <a>{location.BuildingName}</a>
            ),
            sorter: (a: any, b: any) => alphabeticSorter(a, b, "BuildingName"),
        },
        {
            title: "Location Address",
            render: (location: any) => (
                <a>{location.locationadress} {location.dnumber} {location.postalcode} {location.bolge}</a>
            ),
            sorter: (a: any, b: any) => alphabeticSorter(a, b, "locationadress"),
        },
        {
            title: "Status",
            dataIndex: "passive",
            render: (status: number) => (
                <div className="dropdown action-label">
                    <span className={status > 0 ? "btn btn-white btn-sm badge-outline-danger status-color-dg" :
                        "btn btn-white btn-sm badge-outline-success status-color"}> {status > 0 ? "Inactive" : "Active"} </span>
                </div>

            ),
            sorter: (a: any, b: any) => alphabeticSorter(a, b, "status"),
        }
    ]
    const saveLocations = (e:any) => {
        e.preventDefault();
        MySwal.fire({
            title: 'Weet je het zeker?',
            text: "Weet je zeker dat je deze registratie wilt doen?",
            showCancelButton: true,
            //confirmButtonColor: '#00ff00',
            confirmButtonText: "Akkoord",
            confirmButtonColor: '#FF902F',
            cancelButtonText: 'Annuleren',
            cancelButtonColor: '#FC133D',
        }).then((result) => {
            if(result.isConfirmed){
                const req = {
                    user_id: account.id,
                    locations: BestaandeLocatie.filter(x=> x.is_assigned),
                }
                axios.post('/api/addbestaandelocatietocontact', req).then(response => {
                    if(response.status == 200){
                        MySwal.fire({
                            title: 'Verwijderd!',
                            text: 'Registratie is succesvol ontvangen.',
                            confirmButtonText: 'OK',
                            customClass: {
                                confirmButton: 'btn btn-success',
                            },
                        }).then((result) => {
                            window.location.reload();
                        });
                    }

                }).catch(error => {
                    MySwal.fire({
                        title: 'Fout!',
                        text: 'Er is iets misgegaan.\n' + error,
                        confirmButtonText: 'OK',
                        customClass: {
                            confirmButton: 'btn btn-danger',
                        },
                    });
                })
            }else {
                MySwal.fire({
                    title: 'Geannuleerd',
                    text: 'Gebruikersaccount is nog steeds inactief',
                    confirmButtonText: 'OK',
                    customClass: {
                        confirmButton: 'btn btn-success',
                    },
                });
            }
        })
    }
    const selectAllLocations = (e:any) => {
        e.preventDefault();
        let i = BestaandeLocatie.map(item => {
             return{...item, is_assigned: true};
            return item;
        })
        setBestaandeLocatie(i);
    }
    const unSelectAllLocations = (e:any) => {
        e.preventDefault();
        let i = BestaandeLocatie.map(item => {
            return{...item, is_assigned: false};
            return item;
        })
        setBestaandeLocatie(i);
    }
    const turnbackHandler = (e: any) => {
        e.preventDefault();
        Cookies.set('clientTap', 'main');
        Inertia.visit('/klantdetail/' + person.connectedCustomer);
    }

    return (
        <AuthenticatedLayout user={auth.user}
                             header={<h2>&nbsp;Person Detail</h2>}
                             collectNotification={false}
                             isSidebarExpanded={isSidebarExpanded}
                             setSidebarExpanded={setSidebarExpanded}
                             isMessageTableActive={false}
                             isTicketTableActive={false}
                             ticketMessageDataHandler={ticketMessageDataHandler}
                             notificationDataHandler={handleTicket}
                             handleTabClick={handleTabClick}
                             SidebarData={sidebaritems}
        >
            <Head title={'Contactpersonen'}></Head>
            <div className="page-wrapper">
                <div className="content container-fluid">
                    <div className="page-header">
                        <div className="d-flex justify-content-between mb-3">
                            <div className="col-md-6">
                                <h3 className="page-title">Contactpersonen</h3>
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link href={route('dashboard')}>Dashboard</Link>
                                    </li>
                                    <li className="breadcrumb-item"><Link href={route('clients')}>Bedrijven</Link>
                                    </li>
                                    <li className="breadcrumb-item"><a
                                        onClick={(e) => turnbackHandler(e)}>{domKlanten?.Unvan}</a>
                                    </li>
                                    <li className="breadcrumb-item active"><a
                                        href={'/klantdetail/' + person.connectedCustomer}>Contactpersonen</a>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-md-6 ">
                                <div className="col-sm-12">
                                    <div className="contact-wrap">
                                        <div className="contact-profile">
                                            <div className="flex flex-row items-center justify-between w-full">
                                                <h6 className="name-user flex flex-row">
                                                    {person.title}&nbsp;{person.first_name}&nbsp;{person.tussen}&nbsp;{person.last_name}&nbsp;
                                                </h6>
                                                <h5 className="name-user flex flex-row ml-8">
                                                    {domKlanten?.Unvan}
                                                </h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xl-12">
                            <div className="contact-tab-view">
                                <div className="tab-content pt-0">
                                    <div
                                        className={"tab-pane " + (selectedTab === "algemeen" ? "active show" : "fade")}>
                                        <div className="contact-sidebar card">
                                            <h5>Basisinformatie</h5>
                                            <table className={''}>
                                                <tr>
                                                    <td className={'col-1'}>
                                                        Relative
                                                    </td>
                                                    <td>
                                                        {person.connectedCustomer}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className={'col-1'}>
                                                        <UserCheck size={20}></UserCheck>
                                                    </td>
                                                    <td>
                                                        {person.title}&nbsp;{person.first_name}&nbsp;{person.tussen}&nbsp;{person.last_name}                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className={'col-1'}>
                                                        <Mail size={20}></Mail>
                                                    </td>
                                                    <td>
                                                        {person.email}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className={'col-1'}>
                                                        <Phone size={20}/>
                                                    </td>
                                                    <td>
                                                        {person.phone_number}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className={'col-1'}>
                                                        <Smartphone size={20}/>
                                                    </td>
                                                    <td>
                                                        {person.mobilenum}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className={'col-1'}>Status</td>
                                                    <td>
                                                        <div className="dropdown action-label">
                                                            <a onClick={(e) => personStatusSwicher(e)}
                                                                className={person.passive ? "btn btn-white btn-sm badge-outline-danger status-color-dg" :
                                                                    "btn btn-white btn-sm badge-outline-success status-color"}>
                                                                {person.passive ? "Inactive" : "Active"}
                                                            </a>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className={'col-1'}>Account</td>
                                                    <td>
                                                        <div className={"dropdown action-label"}>
                                                            {person.is_user > 0 ? <CheckCircle className={'text-green-700'}
                                                                                           size={20}></CheckCircle>
                                                                : <XCircle className={'text-red-700'}
                                                                           size={20}></XCircle>}
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>

                                    </div>
                                    <div
                                        className={"tab-pane mb-4 " + (selectedTab === "user" ? "active show" : "fade")}>
                                        <div className="contact-sidebar card row flex flex-row mb-4">
                                            <div className="radio-button-group view-icons col-2 mb-3">
                                                <div className="btn-group">
                                                    <a className={"grid-view btn btn-link" + (domPerson.is_user != 0 && " active mx-2")}
                                                       onClick={() => {
                                                           fetchAccontActivity(true);
                                                       }}>
                                                        <UserCheck className={'m-2'} size={20}></UserCheck>
                                                    </a>
                                                    <a className={"list-view btn btn-link" + (domPerson.is_user == 0 && " active mx-2")}
                                                       onClick={() => {
                                                           fetchAccontActivity(false);
                                                       }}>
                                                        <Slash className={'text-red-500 m-2'} size={20}></Slash>
                                                    </a>
                                                </div>
                                            </div>
                                            {auth.user.roleName != 'user' && auth.user.roleName != 'Client' && domPerson.is_user != 0 && auth.user.id != account.id ?(<div className="dropdown action-label col-2 mt-2">
                                                <a onClick={(e) => accountStatusChanger(e)}
                                                   className={person.passive ? "btn btn-white btn-sm badge-outline-danger status-color-dg" :
                                                       "btn btn-white btn-sm badge-outline-success status-color"}>
                                                    {person.passive ? "Inactive" : "Active"}
                                                </a>
                                            </div>): null}
                                        </div>
                                        {auth.user.roleName != 'user' && auth.user.roleName != 'Client' && domPerson.is_user != 0 && auth.user.id != account.id ? (
                                            <div className="contact-activity card">
                                                <div className={'col-12 activity-wrap'}>

                                                    <UpdateContactPersonUserInformation
                                                        className={'m-0 p-0 col-12'}
                                                        mustVerifyEmail={account.email_verified_at ? true : false}
                                                        status={account.bann.toString()}
                                                        user={account}
                                                        buildings={buildings}
                                                        client={clients[0]}
                                                        permissions={permissions}
                                                    />
                                                </div>
                                                <div className="col-12 activity-wrap">
                                                    <UpdateOthersPasswordForm
                                                        className="max-w-xl"
                                                        user={account}
                                                        onHide={() => {
                                                        }}
                                                    />
                                                </div>
                                                <div className={'col-12 activity-wrap'}>
                                                    <div className="form-header col-md-12 m-0 p-0">
                                                        <Table
                                                            className="custom-table table-striped col-md-12"
                                                            rowKey={(record) => record.id}
                                                            style={{overflowX: "hidden", overflowY: "auto"}}
                                                            size={'small'}
                                                            pagination={false}
                                                            columns={addBeenLocationColumns}
                                                            dataSource={BestaandeLocatie}
                                                        />
                                                        <div className="radio-button-group view-icons">
                                                            <div className="btn-group flex flex-row">
                                                                <a className="grid-view btn btn-secondary flex flex-row m-2 px-2" onClick={(e)=>selectAllLocations(e)}><i className="la la-check-circle"></i>Selecteer alles</a>
                                                                <a className="grid-view btn btn-secondary flex flex-row m-2 px-2" onClick={(e)=>unSelectAllLocations(e)}><i className="la la-undo"></i>De selecteer alles</a>
                                                                <a className="grid-view btn btn-link flex flex-row m-2 px-2 active" onClick={(e)=>saveLocations(e)}><i className="la la-save"></i>Opslaan</a>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>
                                    <div
                                        className={"tab-pane " + (selectedTab === "mailing" ? "active show" : "fade")}>
                                        <div className="contact-sidebar card">
                                            <h4>Mail Data</h4>
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
