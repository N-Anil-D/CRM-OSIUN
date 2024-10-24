import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link} from '@inertiajs/react';
import {PageProps} from '@/types';
import React, {useState, useEffect, useRef} from 'react';
import axios, {all} from 'axios';
import TicketModelPopup from '@/Layouts/TicketModelPopup';
import DeleteModal from '@/Layouts/DeleteModal';
import TicketFilter from '@/Layouts/TicketFilter';
import {Table} from "antd";
import Select from 'react-select';
import moment from 'moment';
import Sidebar, {MenuProps, SidebarDataProps} from "@/Layouts/Sidebar";
import {Edit, Mail, MessageCircle, MoreVertical, PlusCircle, UserPlus} from "react-feather";
import AddNotes from "@/Layouts/ClientsAddNote";
import {AddRoom, UpdateRoom} from "@/Layouts/AddRoom";
import {AddTicket, UpTicket} from "@/Layouts/AddTicket"

interface TicketsDataProps {
    id: number;
    opener_name: string;
    customer: string;
    building: string;
    room: string;
    status: string;
    title: string;
    delete: string;
    created_at: Date;
    updated_at: Date;
    ticketsubject: string;
}
interface areaData extends PageProps{
    ticket: TicketsDataProps;
}
const Chat: React.FC<areaData> = ({auth, ticket}) => {
    return (
        <div className="col-xl-4 col-lg-5 theiaStickySidebar">
            <div className='stickybar'>
                <div className="ticket-chat">
                    <div className="ticket-chat-head">
                        <h4>Ticket Chat</h4>
                        <div className="chat-post-box">
                            <form>
                                                <textarea
                                                    className="form-control"
                                                    rows={4}
                                                    defaultValue={"Post"}
                                                />
                                <div className="files-attached d-flex justify-content-between align-items-center">
                                    <div className="post-files">
                                        <Link href="#">
                                            <i className="la la-image"/>
                                        </Link>
                                        <Link href="#">
                                            <i className="la la-file-video"/>
                                        </Link>
                                    </div>
                                    <button type="submit">Sent</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="ticket-chat-body">
                        <ul className="created-tickets-info">
                            <li>
                                <div className="ticket-created-user">
                                    <div className="user-name">
                                        <h5>
                                            <span>John Doe</span> posted a status
                                        </h5>
                                        <span>5 hours ago</span>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className="ticket-created-info">
                                    <h6>Impact on Work</h6>
                                    <p>
                                        This issue disrupts meetings, delays task completion, and
                                        affects my overall productivity.
                                    </p>
                                    <Link href="#" className="comment-text">
                                        <i className="la la-comments me-2"/>
                                        Comments (2)
                                    </Link>
                                </div>
                            </li>
                            <li>
                                <div className="ticket-created-user">
                                    <div className="user-name">
                                        <h5>
                                            <span>Rebecca Velazquez</span>
                                        </h5>
                                        <span>2 hours ago</span>
                                    </div>
                                </div>
                                <p className="details-text">
                                    Check the System and Application logs in the Event Viewer
                                    for warnings or errors that coincide with the times the
                                    freezes occur.
                                </p>
                            </li>
                            <li>
                                <div className="ticket-created-user">
                                    <div className="user-name">
                                        <h5>
                                            <span>Rahul Daviz</span>
                                        </h5>
                                        <span>3 hours ago</span>
                                    </div>
                                </div>
                                <p className="details-text">
                                    Confirm that basic troubleshooting steps have been correctly
                                    executed (restarts, updates, antivirus scans).
                                </p>
                            </li>
                        </ul>
                    </div>
                    <div className="ticket-chat-footer">
                        <form>
                            <div className="d-flex justify-content-between align-items-center">
                                <input type="text" className="form-control"/>
                                <button type="submit">
                                    <i className="la la-arrow-right"/>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>)
}
export {Chat}
