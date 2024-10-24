import React from "react";
import {Link} from '@inertiajs/react';
import axios from "axios";
import {Modal, Button} from 'react-bootstrap';
import { Inertia } from '@inertiajs/inertia';

//Bu sayfada delete işlemi olacak ta daha çok pasife alma yapalım şimdilik

interface DeleteModalProps {
    Name: string;
    type: string;
    Id: number | null; // Added ticketId property
    DeleteModelShow: boolean;
    deleteOnHide: () => void;
}

const DeleteModal = (props: DeleteModalProps) => {
    const DeleteHandle = () => {
       if(props.type === 'Ticket'){
           if (typeof props.Id !== 'undefined') {
               const encodedTicketId = encodeURIComponent(props.Id?.toString() ?? '');
               axios.post(`/api/tickets/delete/${encodedTicketId}`).then(response => {
                   console.log('Ticket deleted sucsessfully:', response.data);
                   window.location.reload();
               }).catch(err => {

                   console.error('There is an error accured while deleting a ticket:', err);
               });
           } else {
               console.error('props.ticketId is undefined. Cannot delete ticket.');
           }
           console.log("Deleted ticket ID:", props.Id);
       }
       else if(props.type === 'ClientDetail') {
           if (typeof props.Id !== 'undefined') {
               const encodedTicketId = encodeURIComponent(props.Id?.toString() ?? '');
               axios.post(`/api/clientsendtrash/${encodedTicketId}`).then(response => {
                   console.log('Ticket deleted sucsessfully:', response.data);
                   Inertia.get('/clients');
               }).catch(err => {

                   console.error('There is an error accured while deleting a client:', err);
               });
           } else {
               console.error('props.Id is undefined. Cannot delete client.');
           }
           console.log("Deleted Client ID:", props.Id);
       }else if(props.type === 'Client') {
           if (typeof props.Id !== 'undefined') {
               const encodedTicketId = encodeURIComponent(props.Id?.toString() ?? '');
               axios.post(`/api/clientsendtrash/${encodedTicketId}`).then(response => {
                   console.log('Ticket deleted sucsessfully:', response.data);
                   window.location.reload();
               }).catch(err => {

                   console.error('There is an error accured while deleting a client:', err);
               });
           } else {
               console.error('props.Id is undefined. Cannot delete client.');
           }
           console.log("Deleted Client ID:", props.Id);
       }
    };
    return (
        <>
            {/* Delete Performance Indicator Modal */}
            <Modal show={props.DeleteModelShow} onHide={props.deleteOnHide} className={'z-30'} centered>
                <div className="modal-dialog-centered modal-md">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="form-header">
                                <h3>{props.Name}</h3>
                                <p>Are you sure want to cancel?</p>
                            </div>
                            <div className="modal-btn delete-action">
                                <div className="row">
                                    <div className="col-6">
                                        <Link href="#"
                                              className="btn btn-primary continue-btn"
                                              onClick={()=>{
                                                  DeleteHandle();
                                                  props.deleteOnHide();
                                              }}>
                                            {props.type === 'Ticket'? 'Cancel Meldingen' : 'Delete Client'}
                                        </Link>
                                    </div>
                                    <div className="col-6">
                                        <a
                                            data-bs-dismiss="modal"
                                            className="btn btn-primary cancel-btn"
                                            onClick={props.deleteOnHide}
                                        >
                                            Close
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            {/* /Delete Performance Indicator Modal */}
        </>
    );
};

export default DeleteModal;
