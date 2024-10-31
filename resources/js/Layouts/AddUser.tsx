import React, {FormEventHandler, useEffect, useRef, useState} from 'react'
import {Head, Link, useForm} from '@inertiajs/react';
import axios from "axios";
import Select, {GroupBase, SelectInstance} from 'react-select';
import PasswordComponent from "@/Components/PasswordComponent";
import {CustomerProps, BuildingProps, RouteAuths} from '@/types/globalProps'
import {User} from '@/types';
import UpdateOtherUserInformation from "@/Pages/Profile/Partials/UpdateOtherUserInformationForm";
import UpdateOthersPasswordForm from "@/Pages/Profile/Partials/UpdateOthersPasswordForm";
import {Modal} from "react-bootstrap";
import {Table} from "antd";
import {permitionsTableColumns} from '@/Components/Columns';
import {permitablePageList} from '@/types/PagePermitions';
import PermissionsTable from '@/Components/PermissionsTable';
interface newUserProps extends User {
    password: string;
}

interface addProps {
    clients: CustomerProps[];
    buildings: BuildingProps[];
    showUserAdd: boolean;
    onHide: () => void;
}

interface upProps {
    showUserEdit: boolean;
    onHide: () => void;
    editableUser: User;
    clients: CustomerProps[];
    buildings: BuildingProps[];
}

interface DeleteProps {
    showBannUser: boolean;
    onHide: () => void;
    editableUser: User;
}

const DeleteUser: React.FC<DeleteProps> = ({editableUser, onHide, showBannUser}) => {
    const handleBannUser: FormEventHandler = (e) => {
        e.preventDefault();
        const {data, setData, errors, put, reset, processing, recentlySuccessful} = useForm({
            user: editableUser
        });
        onHide();
    }
    return (
        <Modal show={showBannUser} onHide={onHide} size={"sm"}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 text-center py-3 px-2">Disabling
                    User: {editableUser.name}</h2>
            </header>
            <h2 className="mt-1 text-sm text-gray-600 text-center">
                Are you sure for get disable this user
            </h2>
            <div className="flex items-center py-4 justify-content-between gap-8 centered">

                <button className={'btn btn-lg btn-danger text-white'} onClick={handleBannUser}>
                    Yes
                </button>
                <button className={'btn btn-lg btn-secondary text-white'} onClick={onHide}>
                    No
                </button>
            </div>
        </Modal>
    );
}
const UpUser: React.FC<upProps> = ({showUserEdit, onHide, editableUser, clients, buildings}) => {
    useEffect(() => {
        // console.log(editableUser);
    }, [editableUser]);
    return (<>
        <Modal show={showUserEdit} onHide={onHide} centered size={'xl'} animation={true}>
            <div className="modal-header">
                <h5 className="modal-title">Edit {editableUser.name}</h5>
                <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={onHide}
                >
                    <span aria-hidden="true">×</span>
                </button>
            </div>
            <div className="py-2">
                <div className="max-w-7xl mx-auto sm:px-2 lg:px-2 space-y-2">
                    <div className="p-2 bg-white shadow sm:rounded-lg">
                        <UpdateOtherUserInformation
                            mustVerifyEmail={editableUser.email_verified_at ? true : false}
                            status={editableUser.bann.toString()}
                            className="col-12"
                            user={editableUser}
                            buildings={buildings}
                            clients={clients}
                        />
                    </div>
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <UpdateOthersPasswordForm
                            className="max-w-xl"
                            user={editableUser}
                            onHide={onHide}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    </>);
}
const AddUser: React.FC<addProps> = ({buildings, clients, showUserAdd, onHide}) => {
    const clientsSelect = useRef<SelectInstance<any, false, GroupBase<any>>>(null);
    const [authsData, setAuthsData] = useState<RouteAuths[]>(permitablePageList);
    const [clientVaules, selClientValues] = useState<{ value: string, label: string }[] | null>(null);
    const [locationValues, setLocationValues] = useState<{ value: string, label: string }[] | null>(null);
    const [selectsOptions, setselectOptions] = useState({
        role: [
            {value: 'Client', label: 'Klant'},
            {value: 'personel', label: 'Medewerker'},
            {value: 'forman', label: 'Voorwerker'},
            {value: 'projectleider', label: 'Projectleider'},
            {value: 'admin', label: 'Admin'},
        ],
        connectedBuild: [
            {value: 'ALL', label: 'All'},
            ...(buildings && buildings.length > 0 ? buildings.map((item: BuildingProps) => ({
                value: item.id,
                label: item.BuildingName
            })) : [])
        ],
        connectedCustomer: [
            {value: 'ALL', label: 'All'},
            ...(clients && clients.length > 0 ? clients.map((item: CustomerProps) => ({
                value: item.CustomerID,
                label: item.Unvan + " / " + item.CustomerID
            })) : [])
        ],
    });
    const [formData, setFormData] = useState<newUserProps>({
        id: 0,
        name: "",
        email: "",
        password: "1",
        roleName: "user",
        connectedBuild: "",
        connectedCustomer: "",
        bann: false,
        email_verified_at: '',
        permissions:[],
        buildings: [],
        customers: [],
    });
    useEffect(() => {
    }, [authsData]);
    useEffect(() => {
        if (clients.length === 1) {
            setFormData(prevState => ({
                ...prevState,
                connectedCustomer: clients[0].CustomerID
            }));
            let a = selectsOptions.connectedCustomer.find(x => x.value === clients[0].CustomerID);
            if (clientsSelect.current && a) {
                clientsSelect.current.setValue(a, 'select-option');
            }
        }
    }, [clients]);
    const fetchClientSelect = (e: any) => {
        if (Array.isArray(e) && e.some(x => x.value === 'ALL') && e.length > 1) {
            setFormData(prevState => ({
                ...prevState,
                connectedCustomer: 'ALL'
            }));
            const v = e.filter(x => x.value === 'ALL');
            selClientValues(v);
        } else {
            setFormData(prevState => ({
                ...prevState,
                connectedCustomer: 'various'
            }));
            selClientValues(e);
        }
    }
    const fetchLocationSelect = (e: any) => {
        if (Array.isArray(e) && e.some(x => x.value === 'ALL') && e.length > 1) {
            setFormData(prevState => ({
                ...prevState,
                connectedBuild: 'ALL'
            }));
            const v = e.filter(x => x.value === 'ALL');
            setLocationValues(v);
        } else {
            setFormData(prevState => ({
                ...prevState,
                connectedBuild: 'various'
            }));
            setLocationValues(e);
        }
    }
    const NewUserSendChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleNewUserSend = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const request = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                roleName: formData.roleName,
                connectedBuild: formData.connectedBuild,
                connectedCustomer: formData.connectedCustomer,
                passive: formData.bann ? "1" : "0",
                permissions: authsData,
                customers: clientVaules ? clientVaules : [],
                buildings: locationValues ? locationValues : [],
            };

            // Axios ile JSON formatında POST isteği yapıyoruz
            await axios.post('storenewuser', request)
                .then(response => {
                    console.log('User added successfully:', response.data);
                    window.location.reload();
                })
                .catch(err => {
                    console.error('There was an error while adding a user:', err);
                });

        } catch (error) {
            console.error('Error occurred:', error);
            throw error;
        }
    };

    const tableColumns = permitionsTableColumns(authsData,setAuthsData);
    return (
        <Modal className={'m-4'} show={showUserAdd} onHide={onHide} size={'xl'} animation={true}>
            <div className="p-4 modal-header header-border align-items-center justify-content-between p-0">
                <h5 className="modal-title">Add User</h5>
                <button
                    type="button"
                    className="btn-close position-static"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={onHide}
                >
                    <span aria-hidden="true">×</span>
                </button>
            </div>
            <div className="modal-body p-4">
                <form id={'adduserform'} onSubmit={handleNewUserSend} method={'post'}>
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="input-block mb-3">
                                <label className="col-form-label">User Name <span
                                    className="text-danger">*</span></label>
                                <input type="text"
                                       className="form-control"
                                       onChange={NewUserSendChange}
                                       name={'name'}
                                       value={formData.name}
                                />
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="input-block mb-3">
                                <label className="col-form-label">e-Mail adres <span
                                    className="text-danger">*</span></label>
                                <input type="email"
                                       className="form-control"
                                       onChange={NewUserSendChange}
                                       name={'email'}
                                       value={formData.email}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="input-block mb-3">
                                <label className="col-form-label">Role Name <span
                                    className="text-danger">*</span></label>
                                <Select options={selectsOptions.role}
                                        placeholder={'Please Select a Role'}

                                        onChange={(e: any) => {
                                            if (e) {
                                                setFormData(prevState => ({
                                                    ...prevState,
                                                    roleName: e.value
                                                }));
                                            }
                                        }}/>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="input-block mb-3">
                                <label className="col-form-label">Connected Client</label>
                                <Select options={selectsOptions.connectedCustomer}
                                        ref={clientsSelect}
                                        isMulti={true}
                                        placeholder={'Please Select a Client'}
                                        value={clientVaules}
                                        onChange={(e: any) => {
                                            if (e) {
                                                fetchClientSelect(e)
                                            }
                                        }}/>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="input-block mb-3">
                                <label className="col-form-label">Connected Location</label>
                                <Select options={selectsOptions.connectedBuild}
                                        id={'buildselect'}
                                        placeholder={'Please Select a Location'}
                                        isMulti={true}
                                        value={locationValues}
                                        onChange={(e: any) => {
                                            if (e) {
                                                fetchLocationSelect(e);
                                            }
                                        }}/>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="input-block mb-3">
                                <label className="col-form-label">Status</label>
                                <Select
                                    options={[{value: '0', label: 'Active'}, {value: '1', label: 'Passive'}]}
                                    defaultValue={{value: '0', label: 'Active'}}
                                    onChange={(e: any) => {
                                        if (e) {
                                            setFormData(prevState => ({
                                                ...prevState,
                                                passive: e.value
                                            }));
                                        }
                                    }}/>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            {(clientVaules?.some(x => x.value === 'ALL') || locationValues?.some(x => x.value === 'ALL')) ? (
                                <h4 className={'text-red-600'}>Indien een 'ALL'-item is geselecteerd, kunt u geen andere
                                    keuzes maken</h4>
                            ) : null}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <PermissionsTable dataSource={authsData ?? null} setDataSource={setAuthsData}/>
                        </div>
                    </div>
                    <div className="col-lg-12 text-end form-wizard-button">
                        <button className="button btn-lights reset-btn" type="reset"
                                data-bs-dismiss="modal">
                            Reset
                        </button>
                        <button className="btn btn-primary"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                type="submit">
                            Save User
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

export {AddUser, UpUser, DeleteUser}
