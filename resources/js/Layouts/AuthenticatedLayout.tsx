import React, {useState, PropsWithChildren, ReactNode, useEffect} from 'react';
import Dropdown from '@/Components/Dropdown';
import {Link, usePage} from '@inertiajs/react';
import {Inertia} from '@inertiajs/inertia';
import {PageProps, User} from '@/types';
import {faBell, faComment} from "@fortawesome/free-regular-svg-icons";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {headerlogo} from "@/ImagePath";
import {TicketMessagesProps, TicketsDataProps, NotificationDataProps, RouteAuths} from "@/types/globalProps";
import {AblyProvider, useChannel, useConnectionStateListener} from "ably/react";
import Push from "ably";
import * as Ably from 'ably';
import moment from "moment";
import Tickets from "@/Pages/Tickets";
import {getAblyClient} from "@/types/ablyClient";
import axios from "axios";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import Sidebar, {MenuProps, SidebarDataProps} from "@/Layouts/Sidebar";
import Cookies from "js-cookie";

const ScrollToTop = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    });
    return null;
};

interface NotiProps extends PageProps {
    unReadNotis: NotificationDataProps[];
}

const NotificationComponent: React.FC<{
    userID: string,
    tickcetNotificationDataHanler: (newTicket: TicketsDataProps | null) => void,
    isTicketNotificationCollect: boolean,
    isTicketMessageCollect?: boolean,
    isTicketTableActive: boolean,
    isMessageTableActive: boolean,
    ticketMessageDataHandler?: (args: {
        newTicketMessage?: TicketMessagesProps;
        detailUpdateNeeded?: number;
    } | null) => void,
    needNotificationRefresh?: boolean,
    setNeedNotificationRefresh?: (expanded: boolean) => void

}> = ({
          userID,
          tickcetNotificationDataHanler,
          isTicketNotificationCollect,
          ticketMessageDataHandler,
          isTicketTableActive, isMessageTableActive, needNotificationRefresh, setNeedNotificationRefresh
      }) => {
    const [notifications, setNotifications] = useState<TicketsDataProps[]>([]);
    const [notificationButton, setNotificationButton] = useState<boolean>(false);

    const [flag, setflag] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [profile, setProfile] = useState<boolean>(false);
    const [notificationsData, setNotificationsData] = useState<TicketsDataProps[]>([]);
    const [ticketMessageNotification, setticketMessageNotification] = useState<TicketMessagesProps[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                setticketMessageNotification([]);
                setNotifications([]);
                const response = await axios.get('/api/notifications');
                let notis: NotificationDataProps[] = response.data as NotificationDataProps[];
                notis.forEach(item => {
                    const data = JSON.parse(item.data);

                    if (item.type.includes('Message')) {
                        setticketMessageNotification(previousMessages => [data.message as TicketMessagesProps, ...previousMessages]);
                    } else if (data.tickets) {
                        setNotifications(previousMessages => [data.tickets as TicketsDataProps, ...previousMessages]);
                    }
                });
                if (needNotificationRefresh && setNeedNotificationRefresh) setNeedNotificationRefresh(false);
            } catch (error) {
                console.error('Veri çekme hatası:', error);
            }
        };
        fetchData();
    }, [, needNotificationRefresh]);
    const MySwal = withReactContent(Swal);
    const {channel} = useChannel(`notification:${userID}`, (message: any) => {
        try {
            console.log('channel recived', message);
            if (message.data.ticket) {
                let newTicket = message.data.ticket as TicketsDataProps;
                if (isTicketTableActive) {
                    if (newTicket.hasNotis) newTicket.hasNotis++;
                    else newTicket.hasNotis = 1;
                    tickcetNotificationDataHanler(newTicket);
                } else if (isTicketNotificationCollect) setNotifications(previousMessages => [newTicket, ...previousMessages]);
            } else if (message.data.message) {
                if (isMessageTableActive && ticketMessageDataHandler) {
                    ticketMessageDataHandler({newTicketMessage: message.data.message});
                } else {
                    let newTicketMessage = message.data.message as TicketMessagesProps;
                    setticketMessageNotification(previousMessages => [newTicketMessage, ...previousMessages]);
                    if (ticketMessageDataHandler) ticketMessageDataHandler(message.data.message);
                }
            } else if (message.data.ticketUpdates) {
                if (isMessageTableActive && ticketMessageDataHandler) {
                    ticketMessageDataHandler({detailUpdateNeeded: message.data.ticketUpdates});
                }
            } else if (message.data.reaction) {
                let newTicketMessage = message.data.reaction as TicketMessagesProps;
                setticketMessageNotification(previousMessages => [newTicketMessage, ...previousMessages]);
                if (ticketMessageDataHandler) ticketMessageDataHandler(message.data.reaction);
            }
            return () => {
                channel.unsubscribe(`notification:${userID}`);
            };
        } catch (e) {
            console.log('Bildirim sisteminde bir hata oluştu' + e)
        }
    });

    const handleNotification = () => {
        setNotificationButton(!notificationButton);
        setflag(false);
        setIsOpen(false);
        setProfile(false);
    };
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        setNotificationButton(false);
        setProfile(false);
        setflag(false);
    };
    return (
        <>
            <li className="nav-item dropdown">
                <Link
                    href="#"
                    className="dropdown-toggle nav-link"
                    data-bs-toggle="dropdown"
                    onClick={handleNotification}
                >
                    <i>
                        <FontAwesomeIcon icon={faBell}/>
                    </i>{" "}
                    <span className="badge badge-pill">{notifications.length}</span>
                </Link>
                <div
                    className={`dropdown-menu dropdown-menu-end notifications ${notificationButton ? "show" : ""
                    }`}
                >
                    <div className="topnav-dropdown-header">
                        <span className="notification-title">Notifications</span>
                    </div>
                    <div className="noti-content">
                        <ul className="notification-list">
                            {notifications && notifications.length > 0 ? notifications.map((item: TicketsDataProps) => (
                                    <li className="notification-message" key={item.id}>
                                        <Link
                                            onClick={() => localStorage.setItem("minheight", "true")}
                                            href={"/ticketdetail/" + item.id}
                                        >
                                            <div className="media d-flex">
                                                <div className="media-body">
                                                    <p className="noti-details">
                                                        {"New Ticket From: " + item.opener_name}
                                                        <br/>
                                                        <span className="noti-title">{item.title}</span>{" ("}
                                                        {item.ticket_type}{") "}
                                                        <span className="noti-title">
                                {item.ticketsubject}
                              </span>
                                                    </p>
                                                    <p className="noti-time">
                              <span className="notification-time">
                                {moment(item.updated_at).format("DD/MM/YYYY HH:mm")}
                              </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                )) :
                                <li>
                                    <p>You have been read all Notifications</p>
                                </li>}
                        </ul>
                    </div>
                </div>
            </li>
            {/* Message Notifications */}
            <li className={`nav-item dropdown ${isOpen ? "show" : ""}`}>
                <Link
                    href="#"
                    className="dropdown-toggle nav-link"
                    data-bs-toggle="dropdown"
                    onClick={toggleDropdown}
                >
                    <i>
                        <FontAwesomeIcon icon={faComment}/>
                    </i>{" "}
                    <span className="badge badge-pill">{ticketMessageNotification.length}</span>
                </Link>
                <div
                    className={`dropdown-menu dropdown-menu-end notifications ${isOpen ? "show" : ""
                    }`}
                >
                    <div className="topnav-dropdown-header">
                        <span className="notification-title">Messages</span>
                    </div>
                    <div className="noti-content">
                        <ul className="notification-list">
                            {ticketMessageNotification && ticketMessageNotification.length > 0 ? ticketMessageNotification.map((item: TicketMessagesProps) => (
                                    <li className="notification-message" key={item.id.toString()}>
                                        <Link
                                            onClick={() => localStorage.setItem("minheight", "true")}
                                            href={"/ticketdetail/" + item.ticket_id}
                                        >
                                            <div className="media d-flex">
                                                <div className="media-body">
                                                    <p className="noti-details">
                                                        {"New Ticket From: " + item.userName}
                                                        <br/>
                                                        <span className="noti-title">{item.Message}</span>{" ("}
                                                        {item.ticket_id}{") "}
                                                    </p>
                                                    <p className="noti-time">
                              <span className="notification-time">
                                {moment(item.updated_at).format("DD/MM/YYYY HH:mm")}
                              </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                )) :
                                <li>
                                    <p>You have been read all Notifications</p>
                                </li>}
                        </ul>
                    </div>
                </div>
            </li>
            {/* /Message Notifications */}
        </>
    );
};

function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
export default function Authenticated({
                                          user,
                                          header,
                                          children,
                                          collectNotification,
                                          notificationDataHandler,
                                          isSidebarExpanded,
                                          setSidebarExpanded,
                                          ticketMessageDataHandler,
                                          isTicketTableActive,
                                          isMessageTableActive,
                                          needNotificationRefresh,
                                          setNeedNotificationRefresh,
                                          SidebarData,
                                          handleTabClick,
                                      }: PropsWithChildren<{
    user: User,
    header?: ReactNode,
    collectNotification: boolean,
    notificationDataHandler: (newTicket: TicketsDataProps | null) => void,
    ticketMessageDataHandler?: (args: {
        newTicketMessage?: TicketMessagesProps;
        detailUpdateNeeded?: number;
    } | null) => void,
    isSidebarExpanded: boolean | false,
    isTicketTableActive: boolean,
    isMessageTableActive: boolean,
    setSidebarExpanded: (expanded: boolean) => void
    needNotificationRefresh?: boolean,
    setNeedNotificationRefresh?: (expanded: boolean) => void,
    SidebarData: SidebarDataProps[] | undefined,
    handleTabClick: (menu: MenuProps) => void,
}>) {

    const [notification, setNotifications] = useState<boolean>(false);
    const [flag, setflag] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [profile, setProfile] = useState<boolean>(false);
    const [newTicket, setnewTicket] = useState<TicketsDataProps>();
    const [ablyClient, setAblyClient] = useState<Ably.Types.RealtimePromise>(getAblyClient(user.id ? user.id.toString() : ''))
    useEffect(() => {
        const subscribeUserToPush = async () => {
            navigator.serviceWorker
                .register('/service-worker.js')
                .then(registration => {
                    console.log('Service Worker registered successfully:', registration);
                })
                .catch(error => {
                    console.error('Service Worker registration failed:', error);
                });
            const registration = await navigator.serviceWorker.ready;
            const existingSubscription = await registration.pushManager.getSubscription();
            const applicationServerKey = urlBase64ToUint8Array('BJVL77Cl3JRvxeqohUl2Ze1UWIQUtaa6h0XtORH1aONBuMjLIg3i9fyH6-YeLTeOTrzeRMp8bbjsWyKF2io0gnA');

            if (!existingSubscription) {
                console.log('sub yazılıyor...')
                const newSubscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: applicationServerKey,
                });
                axios.post('/subscribe', newSubscription)
                    .then(response => {
                        console.log('Abonelik başarılı:', response);
                    })
                    .catch(error => {
                        console.error('Abonelik hatası:', error);
                    });
            } else {
                console.log('Mevcut abonelik iptal ediliyor...');
                await existingSubscription.unsubscribe();
                console.log('Abonelik iptal edildi, yeni abonelik oluşturulacak...');
                subscribeUserToPush();
            }
            5
        };

        if ('serviceWorker' in navigator) {
            subscribeUserToPush();
        }

    }, []);
    const onMenuClik = () => {
        document.body.classList.toggle("slide-nav");
        setSidebarExpanded(!isSidebarExpanded);
    };
    const onSidebarHideClick = () => {
        console.log('sidebar Clicked', document.body.classList)
        document.body.classList.toggle("mini-sidebar");
        document.body.classList.toggle("slide-nav");
        setSidebarExpanded(!isSidebarExpanded);
    }
    const themes = localStorage.getItem("theme");
    const handleProfile = () => {
        setProfile(!profile);
        setNotifications(false);
        setflag(false);
        setIsOpen(false);
    };

    return (
        <AblyProvider client={ablyClient}>
            <div className="account-page">
                <div className='main-wrapper'>
                    <div className="header col-12" style={{right: "0px"}}>
                        {/* Header Title */}
                        <div className="page-title-box flex">

                            <a
                                id="toggle_btn"
                                style={{marginBottom: 10}}
                                onClick={onSidebarHideClick}
                            > <span
                                className="bar-icon"
                                style={{marginBottom: 15}}>          <span/>          <span/>          <span/>        </span>
                            </a>

                        </div>

                        <div className="row">
                            <div className="col-8">
                                <a className="flex col-sm-6  justify-center centered" href={route('dashboard')}>
                                    <img src={headerlogo} alt="img" className={"h-16 bg-cover bg-gray-100 p-1"}/>
                                </a>
                            </div>
                            <div className="col-4">

                                <a
                                    id="mobile_btn"
                                    className="mobile_btn"
                                    onClick={() => onMenuClik()}
                                >
                                    <i className="fa fa-bars"/>
                                </a>
                                {/* /Header Title */}
                                {/* Header Menu */}
                                <ul className="nav user-menu">
                                    {/* Search */}
                                    <li className="nav-item">
                                        <div className="top-nav-search">
                                            <Link href="#" className="responsive-search">
                                                <i className="fa fa-search"/>
                                            </Link>
                                            <form>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    placeholder="Search here"
                                                />
                                                <button className="btn" type="submit">
                                                    <i className="fa fa-search"/>
                                                </button>
                                            </form>
                                        </div>
                                    </li>
                                    {/* Notifications */}
                                    <NotificationComponent userID={user.id ? user.id.toString() : ''}
                                                           isTicketTableActive={isTicketTableActive}
                                                           isMessageTableActive={isMessageTableActive}
                                                           isTicketNotificationCollect={collectNotification}
                                                           tickcetNotificationDataHanler={notificationDataHandler}
                                                           ticketMessageDataHandler={ticketMessageDataHandler}
                                                           needNotificationRefresh={needNotificationRefresh}
                                                           setNeedNotificationRefresh={setNeedNotificationRefresh}
                                    />

                                    {/* /Notifications */}

                                    <li className="nav-item dropdown has-arrow main-drop">
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <Link
                                                    href="#"
                                                    className="dropdown-toggle nav-link"
                                                    data-bs-toggle="dropdown"
                                                    onClick={handleProfile}
                                                >
                                                    {" "}
                                                    <span className="user-img me-1">
                                        <span className="status online"/>
                                    </span>
                                                    <span>{user.name ? `${user.name}` : "Admin"}</span>
                                                </Link>
                                            </Dropdown.Trigger>

                                            <Dropdown.Content>
                                                <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                                <Dropdown.Link href={route('logout')} method="post" as="button">
                                                    Log Out
                                                </Dropdown.Link>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        {/* /Header Menu */}
                        {/* Mobile Menu */}
                        <div className="dropdown mobile-user-menu">
                            <Link
                                href="#"
                                className="nav-link dropdown-toggle"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <i className="fa fa-ellipsis-v"/>
                            </Link>
                            <div className="dropdown-menu dropdown-menu-end dropdown-menu-right">
                                <Link className="dropdown-item" href={route('profile.edit')}>
                                    My Profile
                                </Link>
                                <Link className="dropdown-item"
                                      href={route('profile.edit')}>{/* Company settings'e gidebilir. */}
                                    Settings
                                </Link>
                                <form method="POST" action={route('logout')}>
                                    <button type="submit">Logout</button>
                                </form>
                            </div>
                        </div>
                        {/* /Mobile Menu */}
                    </div>
                    <div className="col-12">

                        <Sidebar user={user} sidebardata={SidebarData} handleMenuClick={handleTabClick}
                                 isSidebarExpanded={isSidebarExpanded} setSidebarExpanded={setSidebarExpanded}/>
                        {children}
                    </div>
                </div>
            </div>
        </AblyProvider>
    );
}
