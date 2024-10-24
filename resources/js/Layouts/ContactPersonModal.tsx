import React, {useState, useEffect, PropsWithChildren} from "react";
import {Modal} from "react-bootstrap";
import {XCircle, Smartphone, Phone, AtSign} from "react-feather";
import {CustomerProps, clientsContactPerson} from "@/types/globalProps";
import axios from "axios";
import Select from "react-select";

export function AddContactPerson({
                                     showModel,
                                     setShowModel,
                                     onHide,
                                     klant,
                                     editPerson
                                 }: PropsWithChildren<{
    showModel: boolean,
    setShowModel: React.Dispatch<React.SetStateAction<boolean>>,
    onHide: (e: clientsContactPerson, edited:boolean) => void,
    klant: CustomerProps,
    editPerson?: clientsContactPerson | undefined,
}>) {
    const titles: { value: string, label: string }[] = [{value: 'De heer', label: 'De heer'}, {
        value: 'Mevrouw',
        label: 'Mevrouw'
    },
        {value: 'Crediteurenadministratie', label: 'Crediteurenadministratie'}, {value: 'Heer', label: 'Heer'}];
    const [selectedTitle, setSelectedTitle] = useState<{ value: string; label: string }>(titles[0]);
    const [editData, setEditData] = useState(false)
    const [data, setData] = useState<clientsContactPerson>({
        id: 0,
        first_name: '',
        tussen: '',
        last_name: '',
        email: '',
        phone_number: '',
        title: titles[0].value,
        function: '',
        mobilenum: '',
        is_user: 0,
        passive: false,
        connectedCustomer: klant.CustomerID,
        hoofcontactperson: false,
        createDate: new Date(),
        updateDate: new Date(),
    })
    useEffect(() => {
        if(editPerson){
            setData(editPerson);
            setEditData(true);
        }else {
            setData({
                id: 0,
                first_name: '',
                tussen: '',
                last_name: '',
                email: '',
                phone_number: '',
                title: titles[0].value,
                function: '',
                mobilenum: '',
                is_user: 0,
                passive: false,
                connectedCustomer: klant.CustomerID,
                hoofcontactperson: false,
                createDate: new Date(),
                updateDate: new Date(),
            });
            setEditData(false);
        }
    }, [editPerson]);
    const save = (event: any) => {
        event.preventDefault();
        if(editData && editPerson && data.id != 0) {
            axios.post('/api/updatecontactperson', data).then((response) => {
                onHide(response.data[0] as clientsContactPerson, true);
                alert('başarılı');
            }).catch((error) => {
                console.log(error);
                alert('hata');
            });
        }
        else {
            axios.post('/api/storecontactperson', data).then((response) => {
                onHide(response.data[0] as clientsContactPerson, false);
                alert('başarılı');
            }).catch((error) => {
                console.log(error);
                alert('hata');
            });
        }
    }

    return (
        <Modal className={'pt-52'} key={'modalOfAddContact'} show={showModel} size={'lg'}>
            <div className="modal-dialog-centered modal-lg" role={'document'}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h6 className="modal-title">Nieuwe Contactpersoon
                        </h6>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={()=>setShowModel(false)}
                        >
                            <span aria-hidden="true"><XCircle className={'text-red-700'} size={20}></XCircle></span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="col-xl-12 d-flex m-0 p-0">
                            <div className="card flex-fill m-0 p-0">
                                <div className="card-body col-12 centered m-0 p-0">
                                    <form onSubmit={save} id={'addContactPerson'} method={'POST'}>
                                        <div className="input-block mb-3 row flex items-center justify-center">
                                            <h6 className="col-lg-3 col-form-h6">Titel</h6>
                                            <div className="col-lg-9">
                                                <Select id={'titleSelect'}
                                                        value={selectedTitle}
                                                        className={'form-control-sm'}
                                                        placeholder={'Selecteer'}
                                                        options={titles}
                                                        onChange={(e: any) => {
                                                            if (e) {
                                                                setSelectedTitle(e);
                                                                setData(prev => ({...prev, title: e.value}))
                                                            }
                                                        }}
                                                >
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="form-control-sm input-block mb-3 row flex items-center justify-center">
                                            <h6 className="form-control-sm col-lg-3 col-form-h6">Voornaam</h6>
                                            <div className="form-control-sm col-lg-9">
                                                <input type="text" className="form-control-sm col-md-12"
                                                       value={data.first_name}
                                                       onChange={(e) => {
                                                           setData(prev => ({...prev, first_name: e.target.value}))
                                                       }}/>
                                            </div>
                                        </div>
                                        <div className="form-control-sm input-block mb-3 row flex items-center justify-center">
                                            <h6 className="form-control-sm col-lg-3 col-form-h6">Tussenvoegsel</h6>
                                            <div className="form-control-sm col-lg-9">
                                                <input type="text" className="form-control-sm col-md-12"
                                                       value={data.tussen}
                                                       onChange={(e) => {
                                                           setData(prev => ({...prev, tussen: e.target.value}))
                                                       }}/>
                                            </div>
                                        </div>
                                        <div className="form-control-sm input-block mb-3 row flex items-center justify-center">
                                            <h6 className="form-control-sm col-lg-3 col-form-h6">Achternaam</h6>
                                            <div className="form-control-sm col-lg-9">
                                                <input type="text" className="form-control-sm col-md-12"
                                                       value={data.last_name}
                                                       onChange={(e) => {
                                                           setData(prev => ({...prev, last_name: e.target.value}))
                                                       }}/>
                                            </div>
                                        </div>
                                        <div className="form-control-sm input-block mb-3 row flex items-center justify-center">
                                            <h6 className="form-control-sm col-lg-3 col-form-h6">Functienaam</h6>
                                            <div className="form-control-sm col-lg-9">
                                                <input type="text" className="form-control-sm col-md-12"
                                                       value={data.function}
                                                       onChange={(e) => {
                                                           setData(prev => ({...prev, function: e.target.value}))
                                                       }}/>
                                            </div>
                                        </div>
                                        <div className="form-control-sm input-block mb-3 row flex items-center justify-center">
                                            <h6 className="form-control-sm col-lg-3 col-form-h6">Telefoonnummer</h6>
                                            <div className="form-control-sm col-lg-9">
                                                <div className="input-group">
                                                <span className="text-center input-group-text" id="basic-addon1">
                                                    <Phone size={20}/>
                                                </span>
                                                    <div className="col-lg-11">
                                                        <input type="text" className="form-control-sm col-md-12"
                                                               value={data.phone_number} onChange={(e) => {
                                                            setData(prev => ({...prev, phone_number: e.target.value}))
                                                        }}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-control-sm input-block mb-3 row flex items-center justify-center">
                                            <h6 className="form-control-sm col-lg-3 col-form-h6">Mobiel</h6>
                                            <div className="form-control-sm col-lg-9">
                                                <div className="input-group">
                                                <span className="input-group-text" id="basic-addon1">
                                                    <Smartphone size={20}/>
                                                </span>
                                                    <div className="col-lg-11">
                                                        <input type="text" className="form-control-sm col-md-12"
                                                               value={data.mobilenum} onChange={(e) => {
                                                            setData(prev => ({...prev, mobilenum: e.target.value}))
                                                        }}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-control-sm input-block mb-3 row flex items-center justify-center">
                                            <h6 className="form-control-sm col-lg-3 col-form-h6">
                                                E-mailadres
                                            </h6>
                                            <div className="form-control-sm col-lg-9">
                                                <div className="input-group">
                                                <span className="input-group-text" id="basic-addon1">
                                                    <AtSign size={20}/>
                                                </span>
                                                    <div className="col-lg-11">
                                                        <input type="text" className="form-control-sm col-md-12"
                                                               value={data.email}
                                                               onChange={(e) => {
                                                                   setData(prev => ({...prev, email: e.target.value}))
                                                               }}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-control-sm input-block mb-3 row flex items-center justify-center">
                                            <h6 className="form-control-sm col-lg-3 col-form-h6">Relatie</h6>
                                            <div className="form-control-sm col-lg-9">
                                                <div className="input-group">
                                                    <input
                                                        type="text"
                                                        className="form-control-sm col-8"
                                                        value={klant.Unvan}
                                                        disabled={true}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-white dropdown-toggle col-4"
                                                        data-bs-toggle="dropdown"
                                                    >
                                                        Klantgegevens
                                                    </button>
                                                    <div className="dropdown-menu dropdown-menu-right p-0 m-0">
                                                        <a className="dropdown-item">
                                                            <div
                                                                className="input-block mb-1 row flex items-center justify-center">
                                                                <h6
                                                                    className="col-lg-5 col-form-h6">ID</h6>
                                                                <div className="col-lg-7">
                                                                    <input disabled={true} type="text"
                                                                           className="form-control-sm col-md-12"
                                                                           value={klant.CustomerID}/>
                                                                </div>
                                                            </div>
                                                        </a>
                                                        <a className="dropdown-item">
                                                            <div
                                                                className="input-block mb-1 row flex items-center justify-center">
                                                                <h6
                                                                    className="col-lg-5 col-form-h6">Telefoonnummer</h6>
                                                                <div className="col-lg-7">
                                                                    <input disabled={true} type="text"
                                                                           className="form-control-sm col-md-12"
                                                                           value={klant.phone_number}/>
                                                                </div>
                                                            </div>
                                                        </a>
                                                        <a className="dropdown-item">
                                                            <div
                                                                className="input-block mb-1 row flex items-center justify-center">
                                                                <h6
                                                                    className="col-lg-5 col-form-h6">E-mailadres</h6>
                                                                <div className="col-lg-7">
                                                                    <input disabled={true} type="text"
                                                                           className="form-control-sm col-md-12"
                                                                           value={klant.email}/>
                                                                </div>
                                                            </div>
                                                        </a>
                                                        <a className="dropdown-item">
                                                            <div
                                                                className="input-block mb-1 row flex items-center justify-center">
                                                                <h6
                                                                    className="col-lg-5 col-form-h6">Klantgroep</h6>
                                                                <div className="col-lg-7">
                                                                    <input disabled={true} type="text"
                                                                           className="form-control-sm col-md-12"
                                                                           value={klant.customer_group}/>
                                                                </div>
                                                            </div>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-control-sm input-block mb-3 row flex items-center">
                                            <h6 className="form-control-sm col-lg-3 col-form-h6 text-justify">
                                                Hoofdcontactpersoon
                                            </h6>
                                            <div className="form-control-sm col-lg-1">
                                                <input
                                                type="checkbox"
                                                className="checkbox-checked"
                                                checked={data.hoofcontactperson}
                                                onChange={(e) => {
                                                    setData(prev => ({...prev, hoofcontactperson: e.target.checked}))
                                                }}
                                            />

                                            </div>
                                        </div>
                                        <div className="text-end">
                                            <button type="submit" className="btn btn-primary">
                                                Gereed
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}
