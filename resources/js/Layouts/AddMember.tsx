import React, {useEffect, useState} from 'react'
import {Head, Link} from '@inertiajs/react';
import axios from "axios";
import Select from "react-select";
import {
    BuildingProps,
    RoomProps,
    memberRommsProps,
    MemberProps,
    CustomerProps
} from "@/types/globalProps";

interface Props {
    building: BuildingProps;
    customer: CustomerProps;
    addMemberHandle: (newMember:MemberProps) => void;
}

interface UpProps {
    member: MemberProps;
    updateMemberHandle: (newMember:MemberProps) => void;
}

const UpdateMember: React.FC<UpProps> = ({member}) => {
    const [formData, setFormData] = useState<MemberProps>(member);

    const NewRoomSendChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    useEffect(() => {
        setFormData(member);
    }, [member]);
    const handleNewRoomSend = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // formData'yı kullanarak yapmak istediğiniz işlemleri gerçekleştirin (örneğin, API'ye gönderme)
        try {
            console.log('formdata', formData);
            // Kullanıcı verilerini içeren bir nesne gönderiyoruz
            if (formData) {
                axios.post('/api/memberupdate/', formData).then(response => {
                    console.log('Room added sucsessfully:', response.data);
                    window.location.reload();
                }).catch(err => {

                    console.error('There is an error accured while adding a room:', err);
                });
            }
            //return response.data; // Eklendikten sonra dönen veriyi işlemek için isteğin yanıtını döndürebilirsiniz
        } catch (error) {
            console.error('There is an error accured while adding a room:', error);
            throw error; // Hata durumunda hatayı yakalayabilir veya yukarıya iletebilirsiniz
        }
    };

    const options = {
        billOptions: [
            {value: 'mail', label: 'e-Mail'},
            {value: 'fax', label: 'Fax'},
            {value: 'post', label: 'Met De Post'}
        ],
        statusOptionss: [{value: '0', label: 'Active'}, {
            value: '1',
            label: 'Passive'
        }],
        billtoOptions: [
            {value: '0', label: 'Client'},
            {value: '1', label: 'Location'},
            {value: '2', label: 'Member'}
        ]
    };
    return (
        <>
            {/* Add Note */}
            <div
                className="modal custom-modal fade modal-padding"
                id="up_member"
                role="dialog"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header header-border align-items-center justify-content-between p-0">
                            <h5 className="modal-title">Update Member</h5>
                            <button
                                type="button"
                                className="btn-close position-static"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            >
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body p-0">
                            <form id='newNote' onSubmit={handleNewRoomSend} method='post'>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">Member ID</label>
                                            <input className="form-control"
                                                   type="text"
                                                   onChange={NewRoomSendChange}
                                                   name='member_id'
                                                   value={formData.member_id}/>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">Member Name</label>
                                            <input className="form-control"
                                                   type="text"
                                                   onChange={NewRoomSendChange}
                                                   name='member_name'
                                                   value={formData.member_name}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">E-mail</label>
                                            <input className="form-control"
                                                   type="text"
                                                   onChange={NewRoomSendChange}
                                                   name='email'
                                                   value={formData.email}/>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">Phone Number</label>
                                            <input className="form-control"
                                                   type="text"
                                                   onChange={NewRoomSendChange}
                                                   name='phone_number'
                                                   value={formData.phone_number}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">Postal Code</label>
                                            <input className="form-control"
                                                   type="text"
                                                   onChange={NewRoomSendChange}
                                                   name='postal_code'
                                                   value={formData.postal_code}/>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="input-block mb-3">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <label className="col-form-label">Factuur Verzendvoorkeur <span
                                                    className="text-danger">*</span></label>
                                            </div>
                                            <Select options={options.billOptions} placeholder="Select Options"
                                                    value={options.billOptions.filter((item: any) => (item.value === formData.billsendtype))[0]}
                                                    onChange={(e: any) => {
                                                        if (e) {
                                                            formData.billsendtype = e.value;
                                                        }
                                                    }}/>

                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">Member Adres</label>
                                            <input className="form-control"
                                                   type="text"
                                                   onChange={NewRoomSendChange}
                                                   name='adres'
                                                   value={formData.adres}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">Status</label>
                                            <Select
                                                options={options.statusOptionss}
                                                defaultValue={{value: '0', label: 'Active'}}
                                                value={options.statusOptionss[formData.status]}
                                                onChange={(e: any) => {
                                                    if (e) {
                                                        setFormData(prevState => ({
                                                            ...prevState,
                                                            status: e.value
                                                        }));
                                                    }
                                                }}/>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">Bill to</label>
                                            <Select
                                                options={options.billtoOptions}
                                                value={options.billtoOptions[formData.bill_to_member]}
                                                onChange={(e: any) => {
                                                    if (e) {
                                                        setFormData(prevState => ({
                                                            ...prevState,
                                                            bill_to_member: e.value
                                                        }));
                                                        console.log(formData);
                                                    }
                                                }}/>
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
                                        Save Member
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
const AddMember: React.FC<Props> = ({building, customer, addMemberHandle}) => {
    const [formData, setFormData] = useState<MemberProps>({
        id: 0,
        member_id: '',
        member_name: '',
        location_id: building.id,
        CustomerID: customer.CustomerID,
        customerUnvan: customer.Unvan,
        adres: '',
        email: '',
        phone_number: '',
        postal_code: '',
        billsendtype: '',
        bill_to_member: 1,
        status: 0,
        created_at: new Date(),
        updated_at: new Date(),
    });
    const NewRoomSendChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleNewRoomSend = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // formData'yı kullanarak yapmak istediğiniz işlemleri gerçekleştirin (örneğin, API'ye gönderme)
        try {
            console.log('formdata', formData);
            // Kullanıcı verilerini içeren bir nesne gönderiyoruz
            axios.post('/api/memberstore', formData).then(response => {
                console.log('Member added sucsessfully:', response.data);
                addMemberHandle(response.data as MemberProps);
            }).catch(err => {

                console.error('There is an error accured while adding a Member:', err);
            });
            //return response.data; // Eklendikten sonra dönen veriyi işlemek için isteğin yanıtını döndürebilirsiniz
        } catch (error) {
            console.error('There is an error accured while adding a Member:', error);
            throw error; // Hata durumunda hatayı yakalayabilir veya yukarıya iletebilirsiniz
        }
    };
    const options = {
        billOptions: [
            {value: 'mail', label: 'e-Mail'},
            {value: 'fax', label: 'Fax'},
            {value: 'post', label: 'Met De Post'}
        ],
    };
    return (
        <>
            {/* Add Note */}
            <div
                className="modal custom-modal fade modal-padding"
                id="add_member"
                role="dialog"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header header-border align-items-center justify-content-between p-0">
                            <h5 className="modal-title">Add Member</h5>
                            <button
                                type="button"
                                className="btn-close position-static"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            >
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body p-0">
                            <form id='newNote' onSubmit={handleNewRoomSend} method='post'>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">Member ID</label>
                                            <input className="form-control"
                                                   type="text"
                                                   onChange={NewRoomSendChange}
                                                   name='member_id'
                                                   value={formData.member_id}/>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">Member Name</label>
                                            <input className="form-control"
                                                   type="text"
                                                   onChange={NewRoomSendChange}
                                                   name='member_name'
                                                   value={formData.member_name}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">E-mail</label>
                                            <input className="form-control"
                                                   type="email"
                                                   onChange={NewRoomSendChange}
                                                   name='email'
                                                   value={formData.email}/>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">Phone Number</label>
                                            <input className="form-control"
                                                   type="text"
                                                   onChange={NewRoomSendChange}
                                                   name='phone_number'
                                                   value={formData.phone_number}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">Postal Code</label>
                                            <input className="form-control"
                                                   type="text"
                                                   onChange={NewRoomSendChange}
                                                   name='postal_code'
                                                   value={formData.postal_code}/>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="input-block mb-3">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <label className="col-form-label">Factuur Verzendvoorkeur <span
                                                    className="text-danger">*</span></label>
                                            </div>
                                            <Select options={options.billOptions} placeholder="Select Options"
                                                    defaultValue={options.billOptions[0]}
                                                    onChange={(e: any) => {
                                                        if (e) {
                                                            formData.billsendtype = e.value;
                                                        }
                                                    }}/>

                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">Member Adres</label>
                                            <input className="form-control"
                                                   type="text"
                                                   onChange={NewRoomSendChange}
                                                   name='adres'
                                                   value={formData.adres}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">Status</label>
                                            <Select
                                                options={[{value: '0', label: 'Active'}, {
                                                    value: '1',
                                                    label: 'Passive'
                                                }]}
                                                defaultValue={{value: '0', label: 'Active'}}
                                                onChange={(e: any) => {
                                                    if (e) {
                                                        setFormData(prevState => ({
                                                            ...prevState,
                                                            status: e.value
                                                        }));
                                                    }
                                                }}/>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">Bill to</label>
                                            <Select
                                                options={[{value: '0', label: 'Client'}, {
                                                    value: '1',
                                                    label: 'Location'
                                                }, {value: '2', label: 'Member'}]}
                                                defaultValue={{value: '1', label: 'Location'}}
                                                onChange={(e: any) => {
                                                    if (e) {
                                                        setFormData(prevState => ({
                                                            ...prevState,
                                                            bill_to_member: e.value
                                                        }));
                                                    }
                                                }}/>
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
                                        Save Member
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

export {AddMember, UpdateMember};
