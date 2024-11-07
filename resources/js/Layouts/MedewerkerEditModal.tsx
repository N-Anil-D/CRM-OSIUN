import { router, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';
import React, { useState, useEffect, PropsWithChildren } from "react";
import { Modal } from "react-bootstrap";
import { XCircle, Phone } from "react-feather";
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
}>) {
    const [title, set_title] = useState<any>();
    const [datas, set_datas] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
    });

    const titles = [
        { value: 'De heer', label: 'De heer' },
        { value: 'Mevrouw', label: 'Mevrouw' },
        { value: 'Crediteurenadministratie', label: 'Crediteurenadministratie' },
        { value: 'Heer', label: 'Heer' }
    ];

    const selectedTitle = titles.find(item => item.value === moduleData?.title);

    useEffect(() => {
        set_datas({
            first_name: moduleData?.first_name || '',
            last_name: moduleData?.last_name || '',
            email: moduleData?.email || '',
            phone_number: moduleData?.phone_number || '',
        });
        set_title(selectedTitle);
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
        }
    });

    const save = (event:any) => {
        event.preventDefault();
        router.post('/medewerkers/update', {
            id: moduleData?.id,
            title: title?.value, // title nesnesinden sadece value alanını gönder
            ...datas
        });
        router.on('success', () => {
            Toast.fire({
                icon: "success",
                text: "Employee edited successfully",
            });
            setShowModel(false);
        });
        router.on('error', () => {
            Toast.fire({
                icon: "error",
                text: "Error!",
            });
        });
    };

    const handleChange = (e:any) => {
        set_datas({
            ...datas,
            [e.target.name]: e.target.value
        });
    };

    const handleSelectChange = (selectedOption:any) => {
        set_title(selectedOption); // `react-select` nesnesini doğrudan set ediyoruz
    };

    return (
        <Modal className={'pt-2'} centered show={showModel} size={'lg'}>
            <div className="modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h6 className="modal-title">Edit Employee - id : {moduleData?.id}</h6>
                        <button type="button" className="btn-close" onClick={() => setShowModel(false)}>
                            <XCircle className={'text-red-700'} size={20} />
                        </button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={save} id={'addContactPerson'}>
                            <div className="row">
                                <div className="col-md-3">
                                    <label className="col-form-label">Title</label>
                                    <Select
                                        id={'titleSelect'}
                                        value={title}
                                        options={titles}
                                        onChange={handleSelectChange}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="col-form-label">Name</label>
                                    <input type="text" name="first_name" className="form-control"
                                        value={datas.first_name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="col-form-label">Surname</label>
                                    <input type="text" name="last_name" className="form-control"
                                        value={datas.last_name}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <label className="col-form-label">E-mail</label>
                                    <input type="email" name="email" className="form-control"
                                        value={datas.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="col-form-label">Phone</label>
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <Phone size={20} />
                                        </span>
                                        <input type="number" name="phone_number" className="form-control"
                                            value={datas.phone_number}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="text-end mt-3">
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
