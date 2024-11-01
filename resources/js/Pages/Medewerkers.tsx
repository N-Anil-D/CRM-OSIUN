import {Head, usePage} from "@inertiajs/react";
import React, {useState, useEffect} from 'react';
import {PageProps, User} from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { MedewerkerDataProps } from "@/types/globalProps";
import "primereact/resources/themes/nano/theme.css";
import {AddMedewerker} from '@/Layouts/MedewerkerModal';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import {medewerkersColumnsCreator} from "@/Components/Columns";
import Swal from 'sweetalert2';
import {DeleteEmployee} from "@/Components/DeleteEmployee";


interface MedewekersProps extends PageProps {
    medewerkers: MedewerkerDataProps[];
}

export default function Medewekers({auth, medewerkers}: MedewekersProps) {
    const [isSidebarExpanded, setSidebarExpanded] = useState<boolean>(false);
    const [showUserEdit, setShowUserEdit] = useState<boolean>(false);
    const [domMedewerkers, setDomMedewerkers] = useState<MedewerkerDataProps[]>();
        const [editableUser, setEditableUser] = useState<MedewerkerDataProps | undefined>();
        const [showBannUser, setShowBannUser] = useState<boolean>(false);
    // const [deleteUser, setDeleteUser] = useState<MedewerkerDataProps | Array>(medewerkers);
    const [deleteUser, setDeleteUser] = useState<MedewerkerDataProps | Array>(medewerkers);
    const [loading, setLoading] = useState<boolean>(true);

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
            // setShowModel(false);
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        },
        didClose:()=>{
            // 
        }
    });

    useEffect(() => {
        if (medewerkers && medewerkers.length > 0) {
            setDomMedewerkers(medewerkers);
            setLoading(false);
            if (domMedewerkers)
                setFilterForNaams(domMedewerkers.map(x => ({value: x.id, label: x.first_name})))
        }
    }, [medewerkers]);
    const addMedewerkerPersonOnHide = (e: MedewerkerDataProps, isEdit: boolean) => {
        if (e.id != 0 && !isEdit) {
            setDomMedewerkers(prevState => {
                if (!prevState) return [e];
                return [...prevState, e];
            });
        } else if (e.id != 0 && isEdit && domMedewerkers) {
            let data = domMedewerkers.map(persona => {
                if (persona.id == e.id) {
                    return {...persona, ...e};
                }
                return persona;
            })
            setDomMedewerkers(data);
        }
        setShowUserEdit(false);
    }
    const handleTabClick = () => {

    }
    const notificationDataHandler = () => {

    }
    const handleMedewerkerUpdateClick = (personID: number) => {
        if (domMedewerkers) {
            let data = domMedewerkers.find(x => x.id == personID);
            if (data)
                setEditableUser(data);
            setShowUserEdit(true);
        }
    }
    const handleMedewerkerDeleteClick = (id: number) => {
        let chosenUser = medewerkers.find(z => z.id === id)
        setDeleteUser(chosenUser);
        setShowBannUser(true);
    };

    const [medewerkersTableColumns] = useState(medewerkersColumnsCreator(handleMedewerkerDeleteClick, handleMedewerkerUpdateClick));
    
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
                                        setShowUserEdit(true);
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
                                                            columnDefs={medewerkersTableColumns}
                                                            rowData={domMedewerkers}
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
            <AddMedewerker onHide={addMedewerkerPersonOnHide} showModel={showUserEdit} setShowModel={setShowUserEdit} editPerson={editableUser}/>
            <DeleteEmployee showBannUser={showBannUser} onHide={() => setShowBannUser(false)} deleteEmployee={deleteUser}/>

        </AuthenticatedLayout>
    )
}
