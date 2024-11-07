import { router, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';
import React, {useState, useEffect, PropsWithChildren} from "react";
import {Modal} from "react-bootstrap";
import {XCircle, Phone } from "react-feather";
import { MedewerkerDataProps } from "@/types/globalProps";
import Select from "react-select";


export function MedewerkerEditModal({
        showModel,
        setShowModel,
        moduleData,
    }: PropsWithChildren<{
            showModel: boolean,
            setShowModel: React.Dispatch<React.SetStateAction<boolean>>,
            onHide: (e: MedewerkerDataProps, edited: boolean) => void,
            moduleData?: MedewerkerDataProps | any,
        }>
    ){
    const [title,           set_title] = useState<any>();
    const [first_name,      set_first_name] = useState('');
    const [last_name,       set_last_name] = useState('');
    const [email,           set_email] = useState('');
    const [phone_number,    set_phone_number] = useState('');
    const titles: { value: string, label: string }[] = [
        {value: 'De heer', label: 'De heer'},
        {value: 'Mevrouw', label: 'Mevrouw'},
        {value: 'Crediteurenadministratie', label: 'Crediteurenadministratie'},
        {value: 'Heer', label: 'Heer'}
    ];
    let selectedTitleIndex = titles.findIndex(item => item.value === moduleData?.title);
    let titleValue = titles[selectedTitleIndex];
    useEffect(() => {
        set_title(titleValue)
        set_first_name(moduleData?.first_name)
        set_last_name(moduleData?.last_name)
        set_email(moduleData?.email)
        set_phone_number(moduleData?.phone_number)
    }, [moduleData]);

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
    
    const save = (event: any) => {
        event.preventDefault();
        
        router.post('/medewerkers/update', {
            id              : moduleData?.id,
            title           : title,
            first_name      : first_name,
            last_name       : last_name,
            email           : email,
            phone_number    : phone_number,
        })
        router.on('success', (event) => {
            Toast.fire({
                icon: "success",
                text: "Employee edited successfully",
            });
            setShowModel(false);
        })
        router.on('error', (errors) => {
            Toast.fire({
                icon: "error",
                text: "Error!",
            });
        })

    }

    return (
        <Modal className={'pt-2'} key={'modalOfAddContact'} centered show={showModel} size={'lg'}>
            <div className="modal-dialog-centered modal-lg" role={'document'}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h6 className="modal-title">Edit Employee - id : {moduleData?.id}
                        </h6>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={() => setShowModel(false)}
                        >
                            <span aria-hidden="true"><XCircle className={'text-red-700'} size={20}></XCircle></span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="col-xl-12 d-flex m-0 p-0">
                            <div className="card flex-fill m-0 p-0">
                                <div className="modal-body col-12 centered m-0 p-0">
                                    <form onSubmit={save} id={'addContactPerson'} method={'POST'}>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <div className="input-block mb-1">
                                                    <label className="col-form-label">Title</label>
                                                    <Select
                                                        id={'titleSelect'}
                                                        value={title}
                                                        options={titles}
                                                        onChange={e => set_title(e)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="input-block mb-1">
                                                    <label className="col-form-label">Name</label>

                                                    <input type="text" className="form-control" 
                                                        defaultValue={first_name}
                                                        onChange={e => set_first_name(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3">

                                                <div
                                                    className="input-block mb-1">
                                                    <label className="col-form-label">Surname</label>
                                                    <input type="text" className="form-control" 
                                                        defaultValue={last_name}
                                                        onChange={e => set_last_name(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="input-block mb-1">
                                                    <label className="col-form-label">E-mail</label>
                                                    <input type="email" className="form-control" 
                                                        defaultValue={email}
                                                        onChange={e => set_email(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div
                                                    className="form-control-sm input-block mb-1 row flex items-center justify-center">
                                                    <label className="col-form-label">Phone</label>
                                                    <div className="input-group">
                                                        <span className="text-center input-group-text"
                                                              id="basic-addon1">
                                                            <Phone size={20}/>
                                                        </span>
                                                        <div className="col-lg-10">
                                                            <input type="number" className="form-control-sm col-md-12" 
                                                                defaultValue={phone_number}
                                                                onChange={e => set_phone_number(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-end">
                                            <button type="submit" className="btn btn-primary">
                                                Submit
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
