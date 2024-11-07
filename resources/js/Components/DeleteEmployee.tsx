import React from 'react'
import {Modal} from "react-bootstrap";
import Swal from 'sweetalert2';
import {MedewerkerDataProps} from '@/types/globalProps'
import {router} from '@inertiajs/react';

interface DeleteProps {
    showBannUser: boolean;
    onHide: () => void;
    deleteEmployee: MedewerkerDataProps,
}


const DeleteEmployee: React.FC<DeleteProps> = ({deleteEmployee, onHide, showBannUser}) => {
    
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: (toast) => {
            onHide();
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        },
        didClose:()=>{
            // 
        }
    });
    const handleBannEmployee= () => {
        router.post('/medewerkers/delete/'+deleteEmployee.id, {})//delete Request
        
        router.on('success', (event) => {
            // console.log(`Successfully made a visit to ${event.detail.page.url}`);
            Toast.fire({
                icon: "success",
                text: "Employee deleted successfully",
            });
        })
        router.on('error', (errors) => {
            console.log('errors')
        })
            
            
    }

    return (
        <Modal show={showBannUser} onHide={onHide} size={"sm"}>
            <header>
                <h2 className="text-lg text-gray-900 text-center py-3 px-2">Disable User</h2>
            </header>
            <div>
                <p className='my-1 text-gray-800 ml-5'>Name : {deleteEmployee.first_name + ' ' + deleteEmployee.last_name}</p>
                <p className='my-1 text-gray-800 ml-5'>Email : {deleteEmployee.email}</p>
            </div>
            <div className="flex items-center py-4 justify-content-between gap-8 centered">

                <button className={'btn btn-lg btn-danger text-white'} onClick={handleBannEmployee}>
                    Delete
                </button>
                <button className={'btn btn-lg btn-secondary text-white'} onClick={onHide}>
                    Cancel
                </button>
            </div>
        </Modal>
    );
}

export {DeleteEmployee}
