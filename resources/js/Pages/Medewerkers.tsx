import {PageProps} from '@/types';
import Swal from 'sweetalert2';
import {Head, router} from "@inertiajs/react";
import React, {useState, useEffect} from 'react';
import { MedewerkerDataProps } from "@/types/globalProps";
import {AgGridReact} from 'ag-grid-react';
import "primereact/resources/themes/nano/theme.css";
import 'ag-grid-community/styles/ag-theme-quartz.css';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {AddMedewerker} from '@/Layouts/MedewerkerModal';
import {MedewerkerEditModal} from '@/Layouts/MedewerkerEditModal';
import {medewerkersColumnsCreator} from "@/Components/Columns";
import {DeleteEmployee} from "@/Components/DeleteEmployee";


interface MedewekersProps extends PageProps {
    medewerkers: MedewerkerDataProps[];
}

export default function Medewekers({auth, medewerkers}: MedewekersProps) {
    const [isSidebarExpanded,   setSidebarExpanded  ] = useState<boolean>(false);
    const [showUserEdit,        setShowUserAdd      ] = useState<boolean>(false);
    const [editableUser,        setEditableUser     ] = useState<MedewerkerDataProps | any>();
    const [showBannUser,        setShowBannUser     ] = useState<boolean>(false);
    const [editEmployeeModal,   setEditEmployeeModal] = useState<boolean>(false);
    const [deleteUser,          setDeleteUser       ] = useState<MedewerkerDataProps | any>(medewerkers);
    const [loading,             setLoading          ] = useState<boolean>(true);

    const [filterForNaams, setFilterForNaams] = useState<any[]>(medewerkers.map(x => ({
        value: x.id,
        label: x.first_name
    })));
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

    useEffect(() => {
        if (medewerkers.length > 0) {
            setLoading(false);
            if (medewerkers){
                setFilterForNaams(medewerkers.map(x => ({value: x.id, label: x.first_name})))
            }
        }
    }, [medewerkers]);

    const handleTabClick = () => {}
    const notificationDataHandler = () => {}

    const handleMedewerkerUpdateClick = (id: number) => {
        let chosenUser = medewerkers?.find(z => z.id === id)
        setEditableUser(chosenUser);
        setEditEmployeeModal(true);
    }
    const handleMedewerkerDeleteClick = (id: number) => {
        let chosenUser = medewerkers.find(z => z.id === id)
        setDeleteUser(chosenUser);
        setShowBannUser(true);
    };

    const medewerkersTableColumns = medewerkersColumnsCreator(handleMedewerkerDeleteClick, handleMedewerkerUpdateClick);
    
    return (
        <AuthenticatedLayout user={auth.user}
            header={<h2 className="font-semibold text-sm text-gray-800 dark:text-gray-200 leading-tight flex justify-center items-center h-auto">Osius CRM Panel</h2>}
            collectNotification={false}
            notificationDataHandler={notificationDataHandler} isSidebarExpanded={isSidebarExpanded}
            setSidebarExpanded={setSidebarExpanded}
            isTicketTableActive={false}
            isMessageTableActive={false}
            SidebarData={[]} handleTabClick={handleTabClick}
            >
            <Head title="Medewerkers"/>
                <div className="page-wrapper">
                    <div className={'content container-fluid'}>
                        <div className="view-header">
                            <h4>EMPLOYEES</h4>
                            {/* add medewerkers */}
                            <ul>
                                <li>
                                    <a className="btn btn-purple text-white" onClick={() => {
                                        setEditableUser(undefined);
                                        setShowUserAdd(true);
                                    }}><i
                                    className="las la-plus-circle me-1"
                                    />Add Employee</a>
                                </li>
                            </ul>
                            {/* add medewerkers */}
                        </div>
                        <div className="calls-activity">
                            <div className="card contact-sidebar">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="card">
                                            <div className="row">
                                                <div className="col-12">
                                                    <div className="ag-theme-quartz ag-theme-mycustomtheme">
                                                        <AgGridReact<MedewerkerDataProps>
                                                            key={medewerkers.length}
                                                            columnDefs={medewerkersTableColumns}
                                                            rowData={[...medewerkers]}
                                                            pagination={true}
                                                            domLayout='autoHeight'
                                                            onGridReady={(params) => params.api.sizeColumnsToFit()}
                                                        />
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
            <AddMedewerker onHide={() => setShowUserAdd(false)} showModel={showUserEdit} setShowModel={setShowUserAdd}/>
            <MedewerkerEditModal onHide={() => setEditEmployeeModal(false)} showModel={editEmployeeModal} setShowModel={setEditEmployeeModal} moduleData={editableUser}/>
            <DeleteEmployee onHide={() => setShowBannUser(false)} showBannUser={showBannUser} deleteEmployee={deleteUser}/>
        </AuthenticatedLayout>
    )
}
