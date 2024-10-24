import React, {useState, PropsWithChildren, ReactNode, useEffect, useRef} from 'react';
import Dropdown from '@/Components/Dropdown';
import {Link, usePage} from '@inertiajs/react';
import {PageProps, User} from '@/types';
import {faBell, faComment} from "@fortawesome/free-regular-svg-icons";
import i18n from 'i18next';
import {useTranslation} from 'react-i18next';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Scrollbars from "react-custom-scrollbars-2";
import axios from 'axios';
import {Applogo, headerlogo} from "@/ImagePath";
import {extend} from "jquery";
import {Nav} from 'react-bootstrap';

export interface SubMenuProps {
    menuValue: string;
    route: string;
}

export interface MenuProps {
    menuValue: string;
    hasSubRoute: boolean;
    showSubRoute: boolean;
    hasNav: boolean;
    NavDb?: string;
    isNavActive?: boolean;
    isFilter?: boolean;
    route: string;
    icon: string;
    subMenus: SubMenuProps[] | MenuProps[];
}

export interface SidebarDataProps {
    tittle?: string;
    showAsTab?: boolean;
    separateRoute?: boolean;
    menu: MenuProps[];
}

function DashLinks(isSideMenu: string) {
    const {t} = useTranslation();
    const {auth} = usePage().props;
    let roleName = "";
    axios.post('/findrole', auth).then(response => {
        roleName = response.data as string;
        // roleName'i kullanarak başka bir şeyler yapabilirsiniz
    })
        .catch(error => {
            console.error('Error:', error);
        });
    const pathname = window.location.href;

    let buttons = '';

    if (auth && roleName) {
        if (roleName === 'admin') {
            buttons += (
                <>
                    <li>
                        <Link className={pathname.includes('admin-dashboard') ? 'active' : ''}
                              href={route('admin-dashboard')}>
                            {t('AdminDashboard')}
                        </Link>
                    </li>
                </>
            );
        } else if (roleName === 'Supervisor' || roleName === 'admin') {
            // Eğer kullanıcı rolü 'user' ise buraya butonları ekle
            buttons += (
                <>
                    <li>
                        <Link className={pathname.includes('Supervisor-dashboard') ? 'active' : ''}
                              href={route('Supervisor-dashboard')}>
                            {t('SupervisorDashboard')}
                        </Link>
                    </li>
                </>
            );
        } else if (roleName === 'Personnel' || roleName === 'admin') {
            // Eğer kullanıcı rolü 'user' ise buraya butonları ekle
            buttons += (
                <>
                    <li>
                        <Link className={pathname.includes('Personnel-dashboard') ? 'active' : ''}
                              href={route('Personnel-dashboard')}>
                            {t('Personnel Dashboard')}
                        </Link>
                    </li>
                </>
            );
        } else if (roleName === 'Client Manager' || roleName === 'admin') {
            // Eğer kullanıcı rolü 'user' ise buraya butonları ekle
            buttons += (
                <>
                    <li>

                        <Link className={pathname.includes('CManager.Dashboard') ? 'active' : ''}
                              href={route('CManager.Dashboard')}>

                            {t('Client Manager Dashboard')}

                        </Link>

                    </li>
                </>
            );
        } else {
            // Eğer kullanıcı rolü 'user' ise buraya butonları ekle
            buttons += (
                <>
                    <li>

                        <Link className={pathname.includes('User.Dashboard') ? 'active' : ''}
                              href={route('User.Dashboard')}>

                            {t('Client Dashboard')}

                        </Link>

                    </li>
                </>
            );
        }
    }

    return <ul style={{
        display: isSideMenu == "dashboard" ? "block" : "none",
    }}>{buttons}</ul>;
}

interface PropsWithData extends PropsWithChildren {
    sidebardata?: SidebarDataProps[];
    handleMenuClick: (menu: MenuProps) => void;
    isSidebarExpanded: boolean;
    setSidebarExpanded: (expanded: boolean) => void;
    user: User;
    closeMainButtons?:boolean;
}

export default function Sidebar({
                                    sidebardata, handleMenuClick,
                                    isSidebarExpanded,
                                    setSidebarExpanded, user,closeMainButtons
                                }: PropsWithData) {
    const [isMouseOverSidebar, setMouseOverSidebar] = useState<boolean>(false);
    const [isSideCanHide, setSideCanHide] = useState<boolean>(false);
    const [isSideMenu, setSideMenu] = useState("");
    const [level2Menu, setLevel2Menu] = useState("");
    const [level3Menu, setLevel3Menu] = useState("");
    const [isSideMenunew, setSideMenuNew] = useState("dashboard");
    const sideBarMain = useRef<HTMLDivElement>(null);

    const [SidebarData, setSidebarData] = useState<SidebarDataProps[]>([
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
            ],
        }
    ]);

    useEffect(() => {
        if (user.permissions && Array.isArray(user.permissions)) {
            if (user.permissions.find(x => x.page_name === 'Meldingen')?.read) {
                setSidebarData(prevState => {
                    const newState = [...prevState]; // Önceki state'i klonla
                    newState[0].menu.push({
                        menuValue: 'Meldingen',
                        hasSubRoute: false,
                        showSubRoute: false,
                        hasNav: false,
                        route: route('tickets'),
                        icon: "la la-ticket",
                        subMenus: [],
                    });
                    return newState; // Yeni state'i geri döndür
                });
            }
            if (user.permissions.find(x => x.page_name === 'Bedrijven')?.read) {
                setSidebarData(prevState => {
                    const newState = [...prevState]; // Önceki state'i klonla
                    newState[0].menu.push({
                        menuValue: 'Bedrijven',
                        hasSubRoute: false,
                        showSubRoute: false,
                        hasNav: false,
                        route: route('clients'),
                        icon: "la la-briefcase",
                        subMenus: [],
                    });
                    return newState; // Yeni state'i geri döndür
                });
            }
            if (user.permissions.find(x => x.page_name === 'Gebouwen')?.read) {
                setSidebarData(prevState => {
                    const newState = [...prevState]; // Önceki state'i klonla
                    newState[0].menu.push({
                        menuValue: 'Gebouwen',
                        hasSubRoute: false,
                        showSubRoute: false,
                        hasNav: false,
                        route: route('locations'),
                        icon: "la la-building",
                        subMenus: [],
                    });
                    return newState; // Yeni state'i geri döndür
                });
            }
            if (user.permissions.find(x => x.page_name === 'Medewerkers')?.read) {
                setSidebarData(prevState => {
                    const newState = [...prevState]; // Önceki state'i klonla
                    newState[0].menu.push({
                        menuValue: 'Medewerkers',
                        hasSubRoute: false,
                        showSubRoute: false,
                        hasNav: false,
                        route: route('medewerkers'),
                        icon: "la la-user",
                        subMenus: [],
                    });
                    return newState; // Yeni state'i geri döndür
                });
            }
            if (user.permissions.find(x => x.page_name === 'UserManagment')?.read) {
                setSidebarData(prevState => {
                    const newState = [...prevState]; // Önceki state'i klonla
                    newState[0].menu.push({
                        menuValue: 'UserManagment',
                        hasSubRoute: false,
                        showSubRoute: false,
                        hasNav: false,
                        route: route('userboard'),
                        icon: "la la-user",
                        subMenus: [],
                    });
                    return newState; // Yeni state'i geri döndür
                });
            }
        }
        if (sidebardata && Array.isArray(sidebardata) && !closeMainButtons) {
            setSidebarData(prevState => [
                ...prevState,
                ...sidebardata
            ]);
        }
        if(closeMainButtons) {
            setSidebarData([]);
        }
    }, []);
    useEffect(() => {
        if (!closeMainButtons && sidebardata && Array.isArray(sidebardata) && SidebarData[1] && SidebarData[1].menu.length != sidebardata[0].menu.length  ) {
            setSidebarData((prevState) => {
                const updatedState = prevState.map((item, index) => {
                    if (index === 1) {
                        // Menü güncellemesi yapılacak kısım burası
                        return {
                            ...item,
                            menu: sidebardata[0].menu, // Burada menu'yu güncelliyoruz
                        };
                    }
                    return item;
                });
                return updatedState;
            });
        }
    }, [sidebardata]);
    useEffect(() => {
        if (
            isMouseOverSidebar &&
            document.body.classList.contains("mini-sidebar")
        ) {
            document.body.classList.add("expand-menu");
            return;
        }
        document.body.classList.remove("expand-menu");
    }, [isMouseOverSidebar]);
    useEffect(() => {
        setSideCanHide(true);
        if (window.innerWidth < 995) {
            setSidebarExpanded(false);
            document.body.classList.add("expand-menu");
        } else setSidebarExpanded(true);
        if (sideBarMain.current) sideBarMain.current.style.marginLeft = '0';
    }, [window.innerWidth]);
    const handleMouseEnter = () => {
        setMouseOverSidebar(true);
    };

    const handleMouseLeave = () => {
        setMouseOverSidebar(false);
    };
    const {t} = useTranslation();


    const toggleSidebar = (value: any) => {
        setSideMenu(value);
        setSideMenuNew(value);
    };

    const toggleLvelTwo = (value: any) => {
        setLevel2Menu(value);
    };
    const toggleLevelThree = (value: any) => {
        setLevel3Menu(value);
    };


    const MenuMore = () => {
        const moreMenu = document.getElementById("more-menu-hidden");
        if (moreMenu) {
            moreMenu.classList.toggle("hidden");
        }
    };

    const pathname = window.location.href;
    return (
        <div
            className={"z-10 sidebar sidebar-verticalset " + (isSideCanHide ? isSidebarExpanded ? "" : "hidden" : "")}
            id="sidebar"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
                if (!isSideCanHide)
                    setSideCanHide(!isSideCanHide);
            }}
            style={{zIndex: 1150}}
            ref={sideBarMain}
        >
            <div className="sidebar-inner slimscroll">
                <div id="sidebar-menu" className="sidebar-menu">
                    {/* Logo */}
                    <div className="header-left">
                        <Link href='/' className="logo2 sm:hidden md:hidden">
                            <img src={Applogo} width={40} height={40} alt="img"/>
                        </Link>
                    </div>

                    <Scrollbars
                        autoHide={false}
                        autoHideTimeout={1000}
                        autoHideDuration={200}
                        autoHeight
                        autoHeightMin={0}
                        autoHeightMax="100vh"
                        thumbMinSize={30}
                        universal={false}
                        hideTracksWhenNotNeeded={true}
                    >
                        <ul className={"sidebar-vertical"} id="veritical-sidebar">

                            {SidebarData.map((mainTittle: any, index: number) => {
                                return (
                                    <React.Fragment key={index + 1}>
                                        <li className="menu-title">
                                            <span>{t(mainTittle.tittle)}</span>
                                        </li>
                                        {mainTittle.menu.map((menu: MenuProps, menuIndex: number) => (
                                            <React.Fragment key={menuIndex + 1}>
                                                {menu.isFilter === true ? (
                                                    <li>
                                                        <a onClick={() => handleMenuClick(menu)}>
                                                            <i className={menu?.icon}/>
                                                            <span>{menu.menuValue}</span>
                                                        </a>
                                                    </li>) : (!menu.hasSubRoute && !menu.hasNav ? (
                                                    <li className={pathname == menu.route ? "active" : ""}>
                                                        <Link href={menu.route} hrefLang={menu.route}
                                                              onClick={() => handleMenuClick(menu)}>
                                                            <i className={menu?.icon}/>
                                                            <span>{t(menu.menuValue)}</span>
                                                        </Link>
                                                    </li>
                                                ) : (menu.hasNav ? (
                                                    <li>
                                                        <a
                                                            className={"nav-link " + (menu.isNavActive ? 'active' : "")}
                                                            onClick={() => {
                                                                handleMenuClick(menu);
                                                            }}>
                                                            <i className={menu?.icon}/>
                                                            <span>{t(menu.menuValue)}</span>
                                                        </a>
                                                    </li>
                                                ) : (
                                                    <li className="submenu">
                                                        <Link
                                                            href="#"
                                                        >
                                                            <i className={menu?.icon}/>
                                                            <span
                                                                className={menu?.menuValue == "Employees" ? "noti-dot" : ""}>
                                                                {t(menu.menuValue)}
                                                            </span>
                                                            <span className="menu-arrow"></span>
                                                        </Link>
                                                        <ul style={{display: menu.showSubRoute ? "block" : "none"}}>
                                                            {menu.subMenus &&
                                                                menu.subMenus.map((subMenus: any, subMenu: number) => (
                                                                    <React.Fragment key={subMenu + 1}>
                                                                        {subMenus && 'showMenuRoute' in subMenus && subMenus.showMenuRoute ? (
                                                                            <li>
                                                                                <Link
                                                                                    href={subMenus.route}>
                                                                                    {t(subMenus.menuValue)}
                                                                                    <span className="menu-arrow"></span>
                                                                                </Link>
                                                                                <ul style={{display: "block"}}>
                                                                                    {subMenus.subMenusValues?.map((value: any, index: number) => (
                                                                                        <li key={index}>
                                                                                            <Link
                                                                                                href={value.route}>
                                                                                                <span>{t(value.menuValue)}</span>
                                                                                            </Link>
                                                                                        </li>
                                                                                    ))}
                                                                                </ul>
                                                                            </li>) : (<li>
                                                                                <Link href={subMenus.route}
                                                                                      className={pathname == subMenus?.route ? "active" : ""}>
                                                                                    {t(subMenus.menuValue)}
                                                                                </Link>
                                                                                <ul>
                                                                                    <li key={index}>
                                                                                        <Link href={subMenus.route}
                                                                                              className={pathname == subMenus?.route ? "active" : ""}>
                                                                                            {t(subMenus.menuValue)}
                                                                                        </Link>
                                                                                    </li>
                                                                                </ul>
                                                                            </li>
                                                                        )}
                                                                    </React.Fragment>)
                                                                )
                                                            }
                                                        </ul>
                                                    </li>)))}
                                            </React.Fragment>
                                        ))}
                                    </React.Fragment>
                                );
                            })}
                        </ul>

                    </Scrollbars>
                </div>
            </div>

        </div>
    );
};

