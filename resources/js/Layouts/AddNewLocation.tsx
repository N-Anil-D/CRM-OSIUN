import React, {useEffect, useState} from 'react'
import {Head, Link} from '@inertiajs/react';
import axios from "axios";
import Select from "react-select";
import {BuildingProps, CustomerProps} from '@/types/globalProps'
import {User} from '@/types';
import {build} from "vite";
import {Modal} from "react-bootstrap";
import {XCircle} from 'react-feather'

interface Props {
    locationAddedHandle: (locationData: BuildingProps) => void;
}

interface UpProps {
    building: BuildingProps;
    locationUpdateHandle: (locationData: BuildingProps) => void;
    onHide: () => void;
    showUpdateLocation: boolean;
}

const EditLocation: React.FC<UpProps> = ({
                                             building,
                                             locationUpdateHandle,
                                             onHide,
                                             showUpdateLocation
                                         }) => {
    const [formData, setFormData] = useState<BuildingProps>(building);
    useEffect(() => {
        setFormData(building);
    }, [building]);
    const SendChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // formData'yı kullanarak yapmak istediğiniz işlemleri gerçekleştirin (örneğin, API'ye gönderme)
        try {
            console.log('formdata', formData);
            // Kullanıcı verilerini içeren bir nesne gönderiyoruz
            axios.post('/api/buildingupdate', formData).then(response => {
                console.log('Location added sucsessfully:', response.data);
                locationUpdateHandle(response.data as BuildingProps);
                onHide();
            }).catch(err => {
                console.error('There is an error accured while adding a location:', err);
            });
            //return response.data; // Eklendikten sonra dönen veriyi işlemek için isteğin yanıtını döndürebilirsiniz
        } catch (error) {
            console.error('There is an error accured while adding a room:', error);
            throw error; // Hata durumunda hatayı yakalayabilir veya yukarıya iletebilirsiniz
        }
    };

    const customStyles = {
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.isFocused ? "#667eea" : "#fff",
            color: state.isFocused ? "#fff" : "#000",
            "&:hover": {
                backgroundColor: "#667eea",
            },
        }),
    };
    return (
        <>
            {/* Add Note */}
            <Modal
                show={showUpdateLocation}
                onHide={onHide}
                className="modal custom-modal fade modal-padding"
                id="edit_location"
                role="dialog"
            >
                    <div className="modal-content p-0 m-0">
                        <div className="modal-header header-border align-items-center justify-content-between p-0">
                            <h5 className="modal-title">Edit Locatie</h5>
                            <button
                                type="button"
                                className="btn-close position-static d-flex justify-content-center align-items-center"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            onClick={()=>onHide()}>
                                <span aria-hidden="true"><XCircle className={'text-gray-200'} size={25}/></span>
                            </button>
                        </div>
                        <div className="modal-body p-0">
                            <form id='newLocation' onSubmit={handleSend} method='post'>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">Locatie Name</label>
                                            <input className="form-control"
                                                   type="text"
                                                   onChange={SendChange}
                                                   name='BuildingName'
                                                   value={formData.BuildingName}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">Locatie ID</label>
                                            <input className="form-control"
                                                   type="text"
                                                   onChange={SendChange}
                                                   name='LocationID'
                                                   value={formData.LocationID}/>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">E-Mail</label>
                                            <input className="form-control"
                                                   type="text"
                                                   aria-rowcount={1}
                                                   onChange={SendChange}
                                                   name='email'
                                                   value={formData.email}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-10">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">Locatie Adres</label>
                                            <input className="form-control"
                                                   type="text"
                                                   aria-rowcount={4}
                                                   onChange={SendChange}
                                                   name='locationadress'
                                                   value={formData.locationadress}/>
                                        </div>
                                    </div>

                                    <div className="col-sm-2">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">Huis Nr.</label>
                                            <input className="form-control"
                                                   type="text"
                                                   aria-rowcount={1}
                                                   onChange={SendChange}
                                                   name='dnumber'
                                                   value={formData.dnumber}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">Postcode</label>
                                            <input className="form-control"
                                                   type="text"
                                                   aria-rowcount={1}
                                                   onChange={SendChange}
                                                   name='postalcode'
                                                   value={formData.postalcode}/>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">Plaats</label>
                                            <input className="form-control"
                                                   type="text"
                                                   aria-rowcount={1}
                                                   onChange={SendChange}
                                                   name='bolge'
                                                   value={formData.bolge}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">Note</label>
                                            <input className="form-control"
                                                   type="text"
                                                   onChange={SendChange}
                                                   name='Note'
                                                   value={formData.Note}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-12 text-end form-wizard-button">
                                    <button onClick={onHide} className="button btn-lights reset-btn" type="reset"
                                            data-bs-dismiss="modal">
                                        Cancel
                                    </button>
                                    <button className="btn btn-primary"
                                            data-bs-dismiss="modal"
                                            aria-label="Close"
                                            type="submit">
                                        Save Locatie
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
            </Modal>
            {/* /Add Note */}
        </>

    )
}
const AddLocation: React.FC<Props> = ({locationAddedHandle}) => {
    const [formData, setFormData] = useState<BuildingProps>({
        id: 0,
        LocationID: '',
        BuildingName: '',
        locationadress: '',
        postalcode: '',
        email: '',
        passive: 0,
        Note: ' ',
        dnumber: '',
        bolge: '',
        created_at: new Date(),
        updated_at: new Date(),
    });
    const SendChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        console.log(e.target.name, e.target.value);
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('before Insert', formData);
        // formData'yı kullanarak yapmak istediğiniz işlemleri gerçekleştirin (örneğin, API'ye gönderme)
        try {
            console.log('formdata', formData);
            // Kullanıcı verilerini içeren bir nesne gönderiyoruz
            axios.post('/locationstore', formData).then(response => {
                console.log('Location added sucsessfully:', response.data);
                locationAddedHandle(formData);
            }).catch(err => {
                console.error('There is an error accured while adding a location:', err);
            });
            //return response.data; // Eklendikten sonra dönen veriyi işlemek için isteğin yanıtını döndürebilirsiniz
        } catch (error) {
            console.error('There is an error accured while adding a room:', error);
            throw error; // Hata durumunda hatayı yakalayabilir veya yukarıya iletebilirsiniz
        }
    };

    const customStyles = {
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.isFocused ? "#667eea" : "#fff",
            color: state.isFocused ? "#fff" : "#000",
            "&:hover": {
                backgroundColor: "#667eea",
            },
        }),
    };
    return (
        <>
            {/* Add Note */}
            <div
                className="modal custom-modal fade modal-padding"
                id="add_location"
                role="dialog"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header header-border align-items-center justify-content-between p-0">
                            <h5 className="modal-title">Add Locatie</h5>
                            <button
                                type="button"
                                className="btn-close position-static d-flex justify-content-center align-items-center"
                                data-bs-dismiss="modal"
                                aria-label="Close">
                                <span aria-hidden="true"><XCircle className={'text-gray-200'} size={25}/></span>
                            </button>
                        </div>
                        <div className="modal-body p-0">
                            <form id='newLocation' onSubmit={handleSend} method='post'>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">Locatie Name</label>
                                            <input className="form-control"
                                                   type="text"
                                                   onChange={SendChange}
                                                   name='BuildingName'
                                                   value={formData.BuildingName}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">Locatie ID</label>
                                            <input className="form-control"
                                                   type="text"
                                                   onChange={SendChange}
                                                   name='LocationID'
                                                   value={formData.LocationID}/>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">E-Mail</label>
                                            <input className="form-control"
                                                   type="text"
                                                   aria-rowcount={1}
                                                   onChange={SendChange}
                                                   name='email'
                                                   value={formData.email}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-10">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">Locatie Adres</label>
                                            <input className="form-control"
                                                   type="text"
                                                   aria-rowcount={4}
                                                   onChange={SendChange}
                                                   name='locationadress'
                                                   value={formData.locationadress}/>
                                        </div>
                                    </div>

                                    <div className="col-sm-2">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">Huis Nr.</label>
                                            <input className="form-control"
                                                   type="text"
                                                   aria-rowcount={1}
                                                   onChange={SendChange}
                                                   name='dnumber'
                                                   value={formData.dnumber}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">Postcode</label>
                                            <input className="form-control"
                                                   type="text"
                                                   aria-rowcount={1}
                                                   onChange={SendChange}
                                                   name='postalcode'
                                                   value={formData.postalcode}/>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">Plaats</label>
                                            <input className="form-control"
                                                   type="text"
                                                   aria-rowcount={1}
                                                   onChange={SendChange}
                                                   name='bolge'
                                                   value={formData.bolge}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">Note</label>
                                            <input className="form-control"
                                                   type="text"
                                                   onChange={SendChange}
                                                   name='Note'
                                                   value={formData.Note}/>
                                        </div>
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
                                        Save Locatie
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Add Note */}
        </>

    )
}
export {AddLocation, EditLocation}
