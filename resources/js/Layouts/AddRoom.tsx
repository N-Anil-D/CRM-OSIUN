import React, {useEffect, useState} from 'react'
import {Head, Link} from '@inertiajs/react';
import axios from "axios";
import Select from "react-select";
import { BuildingProps, RoomProps} from "@/types/globalProps";
import {User} from '@/types';
interface Props {
    kullanici: User;
    building: BuildingProps;
}

interface UpProps {
    room: RoomProps | null;
    kullanici: User;
    building: BuildingProps;
}

const UpdateRoom: React.FC<UpProps> = ({kullanici, building, room}) => {
    const [formData, setFormData] = useState<RoomProps | null>(room ? room : null);
    const NewRoomSendChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData(prevState => {
            if (!prevState) {
                // prevState null ise tüm zorunlu alanları içeren yeni bir nesne döndürüyoruz
                return {
                    id: 0,
                    building_id: 0,
                    floor_number: '',
                    room_number: '',
                    room_type: '',
                    useage_type: '',
                    floor_type: '',
                    wall_type: '',
                    floor_square: '',
                    Binnenzijde: '',
                    Buitenzijde: '',
                    Seperstie_glas: '',
                    created_at: new Date(),
                    updated_at: new Date()
                } as RoomProps;
            }

            return {
                ...prevState,
                [name]: value
            };
        });
    };

    useEffect(() => {
        setFormData(room);
    }, []);
    const handleNewRoomSend = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // formData'yı kullanarak yapmak istediğiniz işlemleri gerçekleştirin (örneğin, API'ye gönderme)
        try {
            console.log('formdata', formData);
            // Kullanıcı verilerini içeren bir nesne gönderiyoruz
            if(formData) {
                axios.post('/api/roomupdate/' + formData.id, formData).then(response => {
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
    return (
        <>
            {/* Add Note */}
            <div
                className="modal custom-modal fade modal-padding"
                id="update_room"
                role="dialog"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header header-border align-items-center justify-content-between p-0">
                            <h5 className="modal-title">Add Room</h5>
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
                            <form id='updateNote' onSubmit={handleNewRoomSend} method='post'>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">Floor Number</label>
                                            <input className="form-control"
                                                   type="text"
                                                   onChange={NewRoomSendChange}
                                                   name='floor_number'
                                                   value={formData?.floor_number}/>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">Room Number</label>
                                            <input className="form-control"
                                                   type="text"
                                                   onChange={NewRoomSendChange}
                                                   name='room_number'
                                                   value={formData?.room_number}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">Floor Square</label>
                                            <input className="form-control"
                                                   type="text"
                                                   onChange={NewRoomSendChange}
                                                   name='floor_square'
                                                   value={formData?.floor_square}/>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">Seperastie glas</label>
                                            <input className="form-control"
                                                   type="text"
                                                   onChange={NewRoomSendChange}
                                                   name='window_square'
                                                   value={formData?.Binnenzijde}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">Binnenzijde</label>
                                            <input className="form-control"
                                                   type="text"
                                                   onChange={NewRoomSendChange}
                                                   name='floor_square'
                                                   value={formData?.Buitenzijde}/>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">Butienzijde</label>
                                            <input className="form-control"
                                                   type="text"
                                                   onChange={NewRoomSendChange}
                                                   name='window_square'
                                                   value={formData?.Seperstie_glas}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">Room Type</label>
                                            <input className="form-control"
                                                   type="text"
                                                   onChange={NewRoomSendChange}
                                                   name='room_type'
                                                   value={formData?.room_type}/>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">Usage Type</label>
                                            <input className="form-control"
                                                   type="text"
                                                   onChange={NewRoomSendChange}
                                                   name='useage_type'
                                                   value={formData?.useage_type}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">Wall Type</label>
                                            <input className="form-control"
                                                   type="text"
                                                   onChange={NewRoomSendChange}
                                                   name='wall_type'
                                                   value={formData?.wall_type}/>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">Floor Type</label>
                                            <input className="form-control"
                                                   type="text"
                                                   onChange={NewRoomSendChange}
                                                   name='floor_type'
                                                   value={formData?.floor_type}/>
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
                                        Save Room
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
const AddRoom: React.FC<Props> = ({kullanici, building}) => {
    const [formData, setFormData] = useState<RoomProps>({
        id: 0,
        building_id: building.id,
        floor_number: '',
        room_number: '',
        floor_square: '',
        Binnenzijde: '',
        Buitenzijde: '',
        Seperstie_glas: '',
        room_type: '',
        floor_type: '',
        useage_type: '',
        wall_type: '',
        created_at: new Date(),
        updated_at: new Date()
    });
    useEffect(() => {
        console.log(formData);
    }, [formData]);
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
            axios.post('/api/roomstore', formData).then(response => {
                console.log('Room added sucsessfully:', response.data);
                window.location.reload();
            }).catch(err => {

                console.error('There is an error accured while adding a room:', err);
            });
            //return response.data; // Eklendikten sonra dönen veriyi işlemek için isteğin yanıtını döndürebilirsiniz
        } catch (error) {
            console.error('There is an error accured while adding a room:', error);
            throw error; // Hata durumunda hatayı yakalayabilir veya yukarıya iletebilirsiniz
        }
    };
    return (
        <>
            {/* Add Note */}
            <div
                className="modal custom-modal fade modal-padding"
                id="add_room"
                role="dialog"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header header-border align-items-center justify-content-between p-0">
                            <h5 className="modal-title">Add Room</h5>
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
                                            <label className="col-form-label">Floor Number</label>
                                            <input className="form-control"
                                                   type="text"
                                                   onChange={NewRoomSendChange}
                                                   name='floor_number'
                                                   value={formData.floor_number}/>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">Room Number</label>
                                            <input className="form-control"
                                                   type="text"
                                                   onChange={NewRoomSendChange}
                                                   name='room_number'
                                                   value={formData.room_number}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">Floor Square</label>
                                            <input className="form-control"
                                                   type="text"
                                                   onChange={NewRoomSendChange}
                                                   name='floor_square'
                                                   value={formData.floor_square}/>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">Binnenzijde</label>
                                            <input className="form-control"
                                                   type="text"
                                                   onChange={NewRoomSendChange}
                                                   name='Binnenzijde'
                                                   value={formData.Binnenzijde}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">Buitenzijde</label>
                                            <input className="form-control"
                                                   type="text"
                                                   onChange={NewRoomSendChange}
                                                   name='Buitenzijde'
                                                   value={formData.Buitenzijde}/>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">Seperstie Glas</label>
                                            <input className="form-control"
                                                   type="text"
                                                   onChange={NewRoomSendChange}
                                                   name='Seperstie_glas'
                                                   value={formData.Seperstie_glas}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">Room Type</label>
                                            <input className="form-control"
                                                   type="text"
                                                   onChange={NewRoomSendChange}
                                                   name='room_type'
                                                   value={formData.room_type}/>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">Usage Type</label>
                                            <input className="form-control"
                                                   type="text"
                                                   onChange={NewRoomSendChange}
                                                   name='useage_type'
                                                   value={formData.useage_type}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">Wall Type</label>
                                            <input className="form-control"
                                                   type="text"
                                                   onChange={NewRoomSendChange}
                                                   name='wall_type'
                                                   value={formData.wall_type}/>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">Floor Type</label>
                                            <input className="form-control"
                                                   type="text"
                                                   onChange={NewRoomSendChange}
                                                   name='floor_type'
                                                   value={formData.floor_type}/>
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
                                        Save Room
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

export {AddRoom, UpdateRoom};
