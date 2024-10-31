import { router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import React, {useState, PropsWithChildren} from "react";
import {Modal} from "react-bootstrap";
import {XCircle, Phone } from "react-feather";
import { MedewerkerDataProps } from "@/types/globalProps";
import Select from "react-select";

export function AddMedewerker({
        showModel,
        setShowModel,
    }: PropsWithChildren<{
    showModel: boolean,
    setShowModel: React.Dispatch<React.SetStateAction<boolean>>,
    onHide: (e: MedewerkerDataProps, edited: boolean) => void,
    editPerson?: MedewerkerDataProps | undefined,
}>) {
    const titles: { value: string, label: string }[] = [
        {value: 'De heer', label: 'De heer'},
        {value: 'Mevrouw', label: 'Mevrouw'},
        {value: 'Crediteurenadministratie', label: 'Crediteurenadministratie'},
        {value: 'Heer', label: 'Heer'}
    ];
    const today = new Date();
    const treeMLater = new Date(today);
    treeMLater.setMonth(today.getMonth() + 3);
    const [selectedTitle, setSelectedTitle] = useState(titles[0]);
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: (toast) => {
            setShowModel(false);
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        },
        didClose:()=>{
            // 
        }
    });

    const [data, setData] = useState<MedewerkerDataProps>({
        id: 0,
        title: titles[0].value,
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        gender: '',
        address: '',
        house_number: '',
        postal_code: '',
        residence: '',
        date_of_birth: new Date,
        employment_type: '',
        personnel_number: -1,
        iban_number: '',
        start_date: new Date(),
        travel_allowance: '',
        hourly_rate: 0,
        rights: '',
        contract_hours: '',
        bsn_number: '',
        travel_expenses: 0,
        bonus_amount: 0,
        passive: true,
        created_at: new Date(),
    })

    const resetValues = ()=>{
        data.id= 0;
        data.title= titles[0].value;
        data.first_name= '';
        data.last_name= '';
        data.email= '';
        data.phone_number= '';
        data.gender= '';
        data.address= '';
        data.house_number= '';
        data.postal_code= '';
        data.residence= '';
        data.date_of_birth= new Date;
        data.employment_type= '';
        data.personnel_number= -1;
        data.iban_number= '';
        data.start_date= new Date();
        data.travel_allowance= '';
        data.hourly_rate= 0;
        data.rights= '';
        data.contract_hours= '';
        data.bsn_number= '';
        data.travel_expenses= 0;
        data.bonus_amount= 0;
        data.passive= true;
        data.created_at= new Date();

    }
    
    const save = (event: any) => {
        event.preventDefault();
        router.post('/api/medewerkers/store', {
            // _token: props.csrf_token,
            title: data.title,
            name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            phone_number: data.phone_number,
          })
        router.on('success', (event) => {
            // console.log(`Successfully made a visit to ${event.detail.page.url}`);
            Toast.fire({
                icon: "success",
                text: "Employee added successfully",
            });
            resetValues();
        })
        router.on('error', (errors) => {
            console.log('errors')
        })
    }

    return (
        <Modal className={'pt-2'} key={'modalOfAddContact'} centered show={showModel} size={'lg'}>
            <div className="modal-dialog-centered modal-lg" role={'document'}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h6 className="modal-title">New Employee
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
                                                        value={selectedTitle}
                                                        placeholder={'Selecteer'}
                                                        options={titles}
                                                        onChange={(e: any) => {
                                                            if (e) {
                                                                setSelectedTitle(e);
                                                                setData(prev => ({...prev, title: e.value}))
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="input-block mb-1">
                                                    <label className="col-form-label">Name</label>
                                                    <input
                                                        type="text" className="form-control"
                                                        value={data.first_name}
                                                        onChange={(e) => {
                                                            setData(prev => ({...prev, first_name: e.target.value}))
                                                        }}/>
                                                </div>
                                            </div>
                                            <div className="col-md-3">

                                                <div
                                                    className="input-block mb-1">
                                                    <label className="col-form-label">Surname</label>
                                                    <input type="text" className="form-control"
                                                           value={data.last_name}
                                                           onChange={(e) => {
                                                               setData(prev => ({...prev, last_name: e.target.value}))
                                                           }}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="input-block mb-1">
                                                    <label className="col-form-label">E-mail</label>
                                                    <input type="email" className="form-control"
                                                           value={data.email}
                                                           onChange={(e) => {
                                                               setData(prev => ({
                                                                   ...prev,
                                                                   email: e.target.value
                                                               }))
                                                           }}/>
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
                                                                   value={data.phone_number} onChange={(e) => {
                                                                setData(prev => ({
                                                                    ...prev,
                                                                    phone_number: e.target.value
                                                                }))
                                                            }}/>
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
