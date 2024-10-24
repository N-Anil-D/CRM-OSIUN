import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link} from '@inertiajs/react';
import {PageProps} from '@/types';
import MainMenuButtons from '@/Layouts/MainMenuButtons';
import Sidebar, {MenuProps, SidebarDataProps, SubMenuProps} from '@/Layouts/Sidebar';
import React, {useState} from "react";
import Select from "react-select";
import {Mail, MessageCircle, MoreVertical, PlusCircle, UserPlus,ShoppingBag} from "react-feather";
import {Table} from "antd";
import moment from "moment";
import axios from "axios";
import {MemberProps, BuildingProps, RoomProps, CustomerProps, memberRommsProps} from "@/types/globalProps";
interface dataProps {
    member: MemberProps;
    location: BuildingProps;
    allLocaitons: BuildingProps[];
    rooms: RoomProps[];
    client: CustomerProps;
    memberRoom: memberRommsProps[];
}

const CreateProject: React.FC<dataProps> =({member, location, client}) => {

    const [faturaType, setFaturaType] = useState<string>("0");
    const [selectRoomData , setSelectRoomData] = useState<memberRommsProps>({
        id:0,
        member_id: member.member_id,
        cıkıs_tarihi: new Date(),
        room_id: '',
        room_number:'',
        room_type: '',
        useage_type:'',
        floor_number: '',
        start_date: new Date(),
    });
    const handleNewRoomSend = () =>{

    };
    const NewRoomSendChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setSelectRoomData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const customStyles = {
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.isFocused ? "#ff9b44" : "#fff",
            color: state.isFocused ? "#fff" : "#000",
            "&:hover": {
                backgroundColor: "#ff9b44",
            },
        }),
    };
    const Information = (type:string) => {
        switch (type) {
            case "0":
                return (
                    <>
                        <div className={'row'}>
                            <label>Contactpersoon</label>
                            <label>{client.Yetkili}</label>
                        </div>
                        <div className={'row'}>
                            <label>Adres</label>
                            <label>{client.address}</label>
                        </div>
                        <div className={'row'}>
                            <label>Postcode en plaats</label>
                            <label>{client.postal_code}</label>
                        </div>
                        <div className={'row'}>
                            <label>Land</label>
                            <label>{client.city}</label>
                        </div>
                        <div className={'row'}>
                            <label>Verzendmethode</label>
                            <label>{client.billsendtype}</label>
                        </div>
                        <div className={'row'}>
                            <label>E-mailadres</label>
                            <label>{client.email}</label>
                        </div>
                    </>
                )
            case "1":
                return (
                    <>
                        <div className={'row'}>
                            <label>Contactpersoon</label>
                            <label>{client.Yetkili}</label>
                        </div>
                        <div className={'row'}>
                            <label>Adres</label>
                            <label>{location.locationadress}</label>
                        </div>
                        <div className={'row'}>
                            <label>Postcode en plaats</label>
                            <label>{client.postal_code}</label>
                        </div>
                        <div className={'row'}>
                            <label>Land</label>
                            <label>{client.city}</label>
                        </div>
                        <div className={'row'}>
                            <label>Verzendmethode</label>
                            <label>{client.billsendtype}</label>
                        </div>
                        <div className={'row'}>
                            <label>E-mailadres</label>
                            <label>{client.email}</label>
                        </div>
                    </>
                )
            case "2":
                return (
                    <>
                        <div className={'row'}>
                            <label>Contactpersoon</label>
                            <label>{member.member_name}</label>
                        </div>
                        <div className={'row'}>
                            <label>Adres</label>
                            <label>{member.adres}</label>
                        </div>
                        <div className={'row'}>
                            <label>Postcode en plaats</label>
                            <label>{member.postal_code}</label>
                        </div>
                        <div className={'row'}>
                            <label>Verzendmethode</label>
                            <label>{member.billsendtype}</label>
                        </div>
                        <div className={'row'}>
                            <label>E-mailadres</label>
                            <label>{member.email}</label>
                        </div>
                    </>
                )
        }
    }
    return (<div className="modal modal-fullscreen custom-modal fade" id="add_project"
                 role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content">
                <div
                    className="modal-header header-border align-items-center justify-content-between">
                    <h5 className="modal-title">Create Project</h5>
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
                                <div className="input-block mb-3 flex-col">
                                    <label className="col-form-label">Debiteur</label>
                                    <select  onChange={(e) => setFaturaType(e.target.value)}>
                                        <option value={0} label={'Client'}></option>
                                        <option value={1} label={'Location'}></option>
                                        <option value={2} label={'Member'}></option>
                                    </select>
                                    {Information(faturaType)}
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="input-block mb-3">
                                    <label className="col-form-label">Room Number</label>
                                    <input className="form-control"
                                           type="text"
                                           onChange={NewRoomSendChange}
                                           name='room_number'
                                           value={selectRoomData.member_id}/>
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
                                           value={moment(selectRoomData.start_date).format('DD-MM-YYYY')}/>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="input-block mb-3">
                                    <label className="col-form-label">Seperastie glas</label>
                                    <input className="form-control"
                                           type="text"
                                           onChange={NewRoomSendChange}
                                           name='window_square'
                                           value={moment(selectRoomData.cıkıs_tarihi).format('DD-MM-YYY')}/>
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
                                           value={selectRoomData.room_id}/>
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
    </div>)
}
export {CreateProject}
