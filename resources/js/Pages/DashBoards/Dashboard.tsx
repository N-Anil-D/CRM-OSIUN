import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import MainMenuButtons from '@/Layouts/MainMenuButtons';
import Sidebar, {MenuProps, SidebarDataProps, SubMenuProps} from '@/Layouts/Sidebar';
import React, {useEffect, useState} from 'react'
import {TicketsDataProps} from "@/types/globalProps";

export default function Dashboard({ auth }: PageProps) {

    const handleTicket = (Ticket:TicketsDataProps | null) => {

    }
    const handleTabClick = (menu: MenuProps) => {};
    useEffect(() => {
    }, []);
    const [isSidebarExpanded, setSidebarExpanded] = useState<boolean>(false);
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2>Admin Dashboard</h2>}
            collectNotification={true}
            notificationDataHandler={handleTicket}
            isSidebarExpanded={isSidebarExpanded}
            setSidebarExpanded={setSidebarExpanded}
            isMessageTableActive={false}
            isTicketTableActive={false}
            handleTabClick={handleTabClick}
            SidebarData={[]}
        >
            <div className="page-wrapper">
                <div className="content container-fluid">
                    {auth.user.name === 'Ozan' ? <MainMenuButtons user = {auth.user}/>: null}
                </div>
            </div>
        </AuthenticatedLayout>
);
}
