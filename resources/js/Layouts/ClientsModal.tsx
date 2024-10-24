import React, {useEffect, useState} from 'react'
import {Link} from '@inertiajs/react';
import Select from 'react-select';
import axios from "axios";
import {CustomerProps, OtherUsersProps} from "@/types/globalProps"
import {Modal, Button} from 'react-bootstrap';
import {User} from '@/types';


interface modalProps {
    allUser: OtherUsersProps[];
    authUser: User;
}

interface ClientUpdateProps extends CustomerProps {
    authusername: string;
    authusermail: string;
    authpassword: string;
    authuserid: string;
}

interface EditClientProps {
    allUser: OtherUsersProps[];
    clientData: CustomerProps;
    showEditClient: boolean;
    onHide: () => void;
    authUser: User;
}

const CompaniesModal: React.FC<modalProps> = ({allUser, authUser}) => {
    const [users, setUsers] = useState();
    const [newClientData, setNewClientData] = useState();
    const [addUser, setAddUser] = useState({id: 0, name: "", email: ""});
    const [showUserAdd, setShowUserAdd] = useState<boolean>(false);
    const options = {
        billOptions: [
            {value: 'mail', label: 'e-Mail'},
            {value: 'fax', label: 'Fax'},
            {value: 'post', label: 'Met De Post'}
        ],
        users: allUser && allUser.length > 0 ? allUser.map((item: OtherUsersProps) => ({
            value: item.id,
            label: item.name
        })) : [{value: authUser.id, label: authUser.name}],

    };
    const [formData, setFormData] = useState({
        CustomerID: "",
        Unvan: "",
        VergiNumarasi: "",
        Yetkili: "",
        email: "",
        phone_number: "",
        address: "",
        city: "",
        country: "",
        postal_code: "",
        passive: 0,
        customer_group: "",
        billsendtype: "",
        authusername: "",
        authusermail: "",
        authpassword: "",
        authuserid: "",
    });
    const userAddHandler = () => {
        if (!showUserAdd) setShowUserAdd(true);
        else setShowUserAdd(false);
    }
    const NewClientSendChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        console.log(formData);
    };
    const handleNewCustomerSend = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // formData'yı kullanarak yapmak istediğiniz işlemleri gerçekleştirin (örneğin, API'ye gönderme)
        try {
            const request = new FormData();
            request.append('CustomerID', formData.CustomerID);
            request.append('Unvan', formData.Unvan);
            request.append('isNewUser', showUserAdd.toString());
            request.append('VergiNumarasi', formData.VergiNumarasi);
            request.append('Yetkili', formData.Yetkili);
            request.append('email', formData.email);
            request.append('phone_number', formData.phone_number);
            request.append('address', formData.address);
            request.append('city', formData.city);
            request.append('country', formData.country);
            request.append('postal_code', formData.postal_code);
            request.append('customer_group', formData.customer_group);
            request.append('billsendtype', formData.billsendtype);
            request.append('passive', '0');

            // Kullanıcı verilerini içeren bir nesne gönderiyoruz
            axios.post('/api/customerstore', request).then(response => {
                console.log('Client added sucsessfully:', response.data);
                window.location.reload();

            }).catch(err => {
                console.error('There is an error accured while adding a client:', err);
            });
        } catch (error) {
            console.error('There is an error accured while adding a ticket:', error);
            throw error;
        }
    };
    return (

        <div>
            {/* Add Company */}
            <div className="modal custom-modal fade custom-modal-two modal-padding" id="add_company" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header header-border justify-content-between p-0">
                            <h5 className="modal-title">Add New Client</h5>
                            <button type="button" className="btn-close position-static" data-bs-dismiss="modal"
                                    aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body p-0">
                            <div className="add-info-fieldset">
                                <form id='newClient' onSubmit={handleNewCustomerSend} method='post'>
                                    <div className="contact-input-set">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="input-block mb-3">
                                                    <label className="col-form-label">Debiteurnr <span
                                                        className="text-danger">*</span></label>
                                                    <input className="form-control"
                                                           type="text"
                                                           name={"CustomerID"}
                                                           value={formData.CustomerID}
                                                           onChange={NewClientSendChange}/>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="input-block mb-3">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <label className="col-form-label">Bedrijfsnaam <span
                                                            className="text-danger"> *</span></label>
                                                    </div>
                                                    <input className="form-control" type="text" value={formData.Unvan}
                                                           name={'Unvan'}
                                                           onChange={NewClientSendChange}/>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="input-block mb-3">
                                                    <label className="col-form-label">E-mailadres<span
                                                        className="text-danger"> *</span></label>
                                                    <input className="form-control"
                                                           type="email"
                                                           value={formData.email}
                                                           name={'email'}
                                                           onChange={NewClientSendChange}/>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="input-block mb-3">
                                                    <label className="col-form-label">Telefoonnummer<span
                                                        className="text-danger"> *</span></label>
                                                    <input className="form-control" type="text"
                                                           value={formData.phone_number}
                                                           name={'phone_number'}
                                                           onChange={NewClientSendChange}/>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="input-block mb-3">
                                                    <label className="col-form-label">Adres <span
                                                        className="text-danger"> *</span></label>
                                                    <input className="form-control" type="text" value={formData.address}
                                                           name={'address'}
                                                           onChange={NewClientSendChange}/>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="input-block mb-3">
                                                    <label className="col-form-label">Postcode en plaats</label>
                                                    <input className="form-control" type="text"
                                                           value={formData.postal_code}
                                                           name={'postal_code'}
                                                           onChange={NewClientSendChange}/>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="input-block mb-3">
                                                    <label className="col-form-label">Stad</label>
                                                    <input className="form-control" type="text" value={formData.city}
                                                           name={'city'}
                                                           onChange={NewClientSendChange}/>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="input-block mb-3">
                                                    <label className="col-form-label">Land</label>
                                                    <input className="form-control" type="text" value={formData.country}
                                                           name={'country'}
                                                           onChange={NewClientSendChange}/>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="input-block mb-3">
                                                    <label className="col-form-label">KvK nummer</label>
                                                    <input className="form-control" type="text"
                                                           value={formData.VergiNumarasi}
                                                           name={'VergiNumarasi'}
                                                           onChange={NewClientSendChange}/>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="input-block mb-3">
                                                    <label className="col-form-label">Debiteurgroepen</label>
                                                    <input className="form-control" type="text"
                                                           value={formData.customer_group}
                                                           name={'customer_group'}
                                                           onChange={NewClientSendChange}/>
                                                </div>
                                            </div>

                                            <div className="col-lg-12 text-end form-wizard-button">
                                                <button className="button btn-lights reset-btn" type="reset">Reset
                                                </button>
                                                <button className="btn btn-primary wizard-next-btn"
                                                        type="submit">Save
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Add Company */}

            {/* Success Company */}
            <div className="modal custom-modal fade" id="success_msg" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="success-message text-center">
                                <div className="success-popup-icon">
                                    <i className="la la-building"/>
                                </div>
                                <h3>Company Created Successfully!!!</h3>
                                <p>View the details of Company</p>
                                <div className="col-lg-12 text-center form-wizard-button">
                                    <Link href="#" className="button btn-lights" data-bs-dismiss="modal">Close</Link>
                                    <Link href="/company-details" className="btn btn-primary">View Details</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Success Company */}

        </div>
    )
}

const EditClient: React.FC<EditClientProps> = ({allUser, clientData, showEditClient, onHide, authUser}) => {
    const [users, setUsers] = useState();
    const [newClientData, setNewClientData] = useState();
    const [addUser, setAddUser] = useState({id: 0, name: "", email: ""});
    const [showUserAdd, setShowUserAdd] = useState<boolean>(false);
    const options = {
        billOptions: [
            {value: 'mail', label: 'e-Mail'},
            {value: 'fax', label: 'Fax'},
            {value: 'post', label: 'Met De Post'}
        ],
        users: allUser && allUser.length > 0 ? [{
            value: authUser.id,
            label: authUser.name
        }, ...allUser.map((item: OtherUsersProps) => ({
            value: item.id,
            label: item.name
        }))] : [{value: authUser.id, label: authUser.name}],

    };
    const [formData, setFormData] = useState<ClientUpdateProps>(
        {
            ...clientData,
            authuserid: '',
            authusername: '',
            authusermail: '',
            authpassword: '',
        });
    const userAddHandler = () => {
        if (!showUserAdd) setShowUserAdd(true);
        else setShowUserAdd(false);
    }
    const NewClientSendChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        console.log(formData);
    };
    const handleNewCustomerSend = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // formData'yı kullanarak yapmak istediğiniz işlemleri gerçekleştirin (örneğin, API'ye gönderme)
        try {
            const request = new FormData();
            request.append('id', formData.id.toString());
            request.append('CustomerID', formData.CustomerID);
            request.append('Unvan', formData.Unvan);
            request.append('isNewUser', showUserAdd.toString());
            request.append('VergiNumarasi', formData.VergiNumarasi);
            request.append('Yetkili', formData.Yetkili);
            request.append('email', formData.email);
            request.append('phone_number', formData.phone_number);
            request.append('address', formData.address);
            request.append('city', formData.city);
            request.append('country', formData.country);
            request.append('postal_code', formData.postal_code);
            request.append('customer_group', formData.customer_group);
            request.append('billsendtype', formData.billsendtype);
            request.append('passive', '0'); // Ensure delete is a string
            // Kullanıcı verilerini içeren bir nesne gönderiyoruz
            axios.post('/api/customerupdate', request).then(response => {
                console.log('Client updated sucsessfully:', response.data);
                window.location.reload();
            }).catch(err => {
                console.error('There is an error accured while adding a client:', err);
            });
            //return response.data; // Eklendikten sonra dönen veriyi işlemek için isteğin yanıtını döndürebilirsiniz
        } catch (error) {
            console.error('There is an error accured while adding a ticket:', error);
            throw error; // Hata durumunda hatayı yakalayabilir veya yukarıya iletebilirsiniz
        }
    };
    useEffect(() => {
        console.log(formData);
    }, []);
    return (

        <div>
            {/* Add Company */}
            <Modal className="modal custom-modal fade custom-modal-two modal-padding" show={showEditClient}
                   onHide={onHide} id="edit_company" role="dialog">
                <div className="modal-lg modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header header-border justify-content-between p-0">
                            <h5 className="modal-title">Update Client</h5>
                            <button type="button" className="btn-close position-static" onClick={onHide}
                                    aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body p-0">
                            <div className="add-info-fieldset">
                                <form id='newClient' onSubmit={handleNewCustomerSend} method='post'>
                                    <div className="contact-input-set">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="input-block mb-3">
                                                    <label className="col-form-label">Debiteurnr <span
                                                        className="text-danger">*</span></label>
                                                    <input className="form-control"
                                                           type="text"
                                                           name={"CustomerID"}
                                                           value={formData.CustomerID}
                                                           onChange={NewClientSendChange}/>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="input-block mb-3">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <label className="col-form-label">Bedrijfsnaam <span
                                                            className="text-danger"> *</span></label>
                                                    </div>
                                                    <input className="form-control" type="text" value={formData.Unvan}
                                                           name={'Unvan'}
                                                           onChange={NewClientSendChange}/>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="input-block mb-3">
                                                    <label className="col-form-label">E-mailadres<span
                                                        className="text-danger"> *</span></label>
                                                    <input className="form-control"
                                                           type="email"
                                                           value={formData.email}
                                                           name={'email'}
                                                           onChange={NewClientSendChange}/>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="input-block mb-3">
                                                    <label className="col-form-label">Telefoonnummer<span
                                                        className="text-danger"> *</span></label>
                                                    <input className="form-control" type="text"
                                                           value={formData.phone_number}
                                                           name={'phone_number'}
                                                           onChange={NewClientSendChange}/>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="input-block mb-3">
                                                    <label className="col-form-label">Adres <span
                                                        className="text-danger"> *</span></label>
                                                    <input className="form-control" type="text" value={formData.address}
                                                           name={'address'}
                                                           onChange={NewClientSendChange}/>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="input-block mb-3">
                                                    <label className="col-form-label">Postcode en plaats</label>
                                                    <input className="form-control" type="text"
                                                           value={formData.postal_code}
                                                           name={'postal_code'}
                                                           onChange={NewClientSendChange}/>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="input-block mb-3">
                                                    <label className="col-form-label">Stad</label>
                                                    <input className="form-control" type="text" value={formData.city}
                                                           name={'city'}
                                                           onChange={NewClientSendChange}/>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="input-block mb-3">
                                                    <label className="col-form-label">Land</label>
                                                    <input className="form-control" type="text" value={formData.country}
                                                           name={'country'}
                                                           onChange={NewClientSendChange}/>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="input-block mb-3">
                                                    <label className="col-form-label">KvK nummer</label>
                                                    <input className="form-control" type="text"
                                                           value={formData.VergiNumarasi}
                                                           name={'VergiNumarasi'}
                                                           onChange={NewClientSendChange}/>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="input-block mb-3">
                                                    <label className="col-form-label">Debiteurgroepen</label>
                                                    <input className="form-control" type="text"
                                                           value={formData.customer_group}
                                                           name={'customer_group'}
                                                           onChange={NewClientSendChange}/>
                                                </div>
                                            </div>
                                            <div className="col-lg-12 text-end form-wizard-button">
                                                <button className="button btn-lights reset-btn" type="reset">Reset
                                                </button>
                                                <button className="btn btn-primary wizard-next-btn"
                                                        type="submit">Save
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            {/* /Add Company */}

            {/* Success Company */}
            <div className="modal custom-modal fade" id="success_msg" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="success-message text-center">
                                <div className="success-popup-icon">
                                    <i className="la la-building"/>
                                </div>
                                <h3>Company Created Successfully!!!</h3>
                                <p>View the details of Company</p>
                                <div className="col-lg-12 text-center form-wizard-button">
                                    <Link href="#" className="button btn-lights" data-bs-dismiss="modal">Close</Link>
                                    <Link href="/company-details" className="btn btn-primary">View Details</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Success Company */}

        </div>
    )
}

export {CompaniesModal, EditClient}
