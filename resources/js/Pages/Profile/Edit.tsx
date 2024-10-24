import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import {TicketsDataProps} from "@/types/globalProps";
import React, {useEffect, useState} from 'react'
import {MenuProps} from "@/Layouts/Sidebar";

export default function Edit({ auth, mustVerifyEmail, status }: PageProps<{ mustVerifyEmail: boolean, status?: string }>) {
    const handleTicket = (Ticket:TicketsDataProps | null) => {

    }
    const [isSidebarExpanded, setSidebarExpanded] = useState<boolean>(false);

    const handleTabClick = (menu: MenuProps) => {
    };
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Profile</h2>}
            collectNotification={false}
            notificationDataHandler={handleTicket} isSidebarExpanded={isSidebarExpanded} setSidebarExpanded={setSidebarExpanded}
            isTicketTableActive={false}
            isMessageTableActive={false}
            SidebarData={[]}
            handleTabClick={handleTabClick}
        >
            <Head title="Profile" />
            <h1 className="text-red-500">Burası başka bir yer mi ki?</h1>
            <div className="page-wrapper">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
