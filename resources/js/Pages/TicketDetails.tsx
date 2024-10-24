import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link} from '@inertiajs/react';
import {Inertia} from '@inertiajs/inertia';
import {PageProps} from '@/types';
import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import moment from 'moment';
import Sidebar, {MenuProps, SidebarDataProps} from "@/Layouts/Sidebar";
import {
    BuildingProps,
    CustomerProps,
    OtherUsersProps,
    RoomProps,
    TicketFileProps,
    TicketMessagesProps,
    TicketsDataProps,
    TicketReacts
} from "@/types/globalProps";
import TicketFilter from "@/Layouts/TicketFilter";
import tickets from "@/Pages/Tickets";
import {
    Camera,
    CameraOff,
    Edit,
    Mail,
    MessageCircle,
    MoreVertical,
    PlusCircle,
    Trash2,
    Upload,
    Download,
    File,
    ArrowRight,
    ArrowRightCircle,
    XCircle,
    Send,
    XOctagon
} from "react-feather";
import {types} from "sass";
import Error = types.Error;
import {Modal, Button, CloseButton} from 'react-bootstrap';
import CameraComponent from "@/Components/CameraComponent";
import ExpandableText from "@/Components/ExpandableText";
import FileGallery from "@/Components/FileGallery";
import FloatingButton from "@/Components/FloatingButton";
import {timeAgo} from "@/types/timeago";
import {UpTicket} from "@/Layouts/AddTicket";

interface TicketDetailProps extends PageProps {
    locations: BuildingProps[];
    rooms: RoomProps[];
    client: CustomerProps[];
    ticket: TicketsDataProps;
    ticketmessages: TicketMessagesProps[];
    files: TicketFileProps[];
    otherUsers: OtherUsersProps[];
    ticketreacts: TicketReacts[];
}

const TicketDetails: React.FC<TicketDetailProps> = ({
                                                        auth,
                                                        locations,
                                                        rooms,
                                                        files,
                                                        client,
                                                        ticket,
                                                        ticketmessages,
                                                        otherUsers,
                                                        ticketreacts
                                                    }) => {
    const [data, setData] = useState({
        locations,
        rooms,
        files,
        client,
        ticket,
        ticketmessages,
        otherUsers,
        ticketreacts
    });
    const [isWorking, setIsWorking] = useState<boolean>(false);
    const [filesDoms, setFilesDoms] = useState<JSX.Element[]>();
    const [openerFilesDoms, setOpenerFilesDoms] = useState<JSX.Element[]>();
    const [closerFilesDoms, setCloserFilesDoms] = useState<JSX.Element[]>();
    const [currentGalleryIndex, setGalleryIndex] = useState<number>(0);
    const [showGallery, setShowGallery] = useState<boolean>(false);
    const [selectedTab, setSelectedTab] = useState<string>("rooms");
    const [newMessage, setNewMessasge] = useState<string>("");
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [ticketDomData, setTicketDomData] = useState<TicketsDataProps>(ticket)
    const [ticketStatus, setTicketStatus] = useState<{
        text: string;
        type: string
        Icon: string;
        Button: string;
        outline: string;
        bg: string;
    }>(
        {
            text: "Nieuw",
            type: "New",
            Icon: "far fa-dot-circle text-white",
            Button: "btn-primary",
            outline: "btn-outline-primary",
            bg: ""
        })
    const [locationDomData, setLocationDomData] = useState<BuildingProps>({
        id: -1,
        LocationID: '-1',
        created_at: ticketDomData.created_at,
        updated_at: ticketDomData.updated_at,
        BuildingName: 'All',
        email: 'various',
        Note: 'various',
        locationadress: 'various',
        passive: 0,
        bolge:'',
        dnumber:'',
        postalcode: 'vaious',
    });
    const [clientDomData, setClientDomData] = useState<CustomerProps>({
        id: -1,
        Unvan: 'All',
        address: 'various',
        CustomerID: 'All',
        created_at: ticketDomData.created_at,
        updated_at: ticketDomData.updated_at,
        city: 'various',
        passive: 0,
        email: 'various',
        billsendtype: 'various',
        country: 'various',
        customer_group: 'various',
        tag: 'various',
        phone_number: 'various',
        postal_code: 'various',
        username: 'various',
        VergiDairesi: 'various',
        VergiNumarasi: 'various',
        Yetkili: 'various'
    });
    const [ticketFilesDoms, setTicketFilesDoms] = useState<TicketFileProps[]>([]);
    const [ticketDomMessages, setTicketDomMessages] = useState<TicketMessagesProps[]>(ticketmessages);
    const [needNotisRefres, setNeedNotisRefresh] = useState<boolean>(true)
    const [showTypeAsignModel, setShowTypeAsignModel] = useState(false);
    const [showCloseTicketModel, setShowCloseTicketModel] = useState(false);
    const [showDeleteModel, setShowDeleteModel] = useState(false);
    const [closingFormData, setClosingFormData] = useState<{
        ticket_id: number,
        closing_comment: string
    }>(
        {
            ticket_id: ticket.id,
            closing_comment: ''
        })
    const [showCamera, setShowCamera] = useState(false);
    const [messageSelectedFiles, setMessageSelectedFiles] = useState<File[]>([]);
    const [domReacts, setDomReacts] = useState<TicketReacts[]>()
    const [selectedReactStatus, setSelectedRreactStatus] = useState<string>(ticket.status)
    const [selectedEditableReact, setSelectedEditableReact] = useState<TicketReacts | null>(null)
    const [showReactEditModal, setShowReactEditModal] = useState<boolean>(false);
    const [enableReactEntry, setEnableReactEntry] = useState<boolean>(false);
    const ticketReactActivityDomy = useRef<HTMLAreaElement>();
    const [showUpdateTicket, setShowUpdateTicket] = useState<boolean>(false);
    const messageScroolDown = () => {
        const chatArea = document.getElementById('chatArea') as HTMLDivElement;
        if (chatArea) {
            chatArea.scrollTop = chatArea.scrollHeight;
        }
    }
    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedRreactStatus(event.target.value);
    };
    const toggleCamera = () => {
        setShowCamera(prevState => !prevState);
    };
    const [showChat, setShowChat] = useState<boolean>(false);

    function autoResize(event: any) {
        const textarea = event.target;
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }

    const ticketReactEvent = (event: any) => {
        event.preventDefault();
        setIsWorking(true);
        if (closingFormData.closing_comment !== undefined && closingFormData.closing_comment !== null
            && closingFormData.closing_comment !== '') {
            const request = new FormData();
            request.append('id', ticket.id.toString());
            request.append('closing_comment', closingFormData.closing_comment);
            request.append('after_status', selectedReactStatus);
            if (selectedFiles.length > 0) selectedFiles.forEach((file) => {
                request.append('files[]', file);
            })
            const userIds = otherUsers.map(item => item.id).join(',');
            if (ticketDomData.ticket_to == "" || ticketDomData.ticket_to === null || ticketDomData.ticket_to === undefined) {
                request.append('userIds', userIds);
            } else {
                let userID = otherUsers.find(item => (item.name === ticketDomData.ticket_to))?.id;
                if (userID) request.append('userIds', userID.toString());
                else {
                    userID = otherUsers.find(item => (item.name === ticketDomData.opener_name))?.id;
                    if (userID) request.append('userIds', userID.toString());
                }
            }
            axios.post('/api/reactticketstore', request).then(resp => {
                if (resp.status === 200) {
                    fetchData();
                    closingFormData.closing_comment = '';
                    window.location.reload();
                }
            }).catch(err => {
                alert('An error occurred');
                console.log('close ticket error', err);
            }).finally(() => {
                setShowCloseTicketModel(false);
                setIsWorking(false);
            })
        } else alert('Please write a comment');
    }
    const updateReactEvent = (event: any) => {
        event.preventDefault();
        if (selectedEditableReact != null) {
            const request = new FormData();
            request.append('id', ticket.id.toString());
            request.append('react_id', selectedEditableReact.id.toString());
            request.append('closing_comment', selectedEditableReact.react_text);
            request.append('after_status', selectedEditableReact.after_status);
            request.append('before_status', selectedEditableReact.before_status);
            if (selectedFiles.length > 0) selectedFiles.forEach((file) => {
                request.append('files[]', file);
            })
            axios.post('/api/reactticketupdate', request).then(resp => {
                if (resp.status === 200) {
                    fetchData();
                    setShowReactEditModal(false);
                    window.location.reload();
                }
            }).catch(err => {
                alert('An error occurred');
                console.log('close ticket error', err);
            })
        }
    }
    const profileImageCreator = (other: OtherUsersProps): JSX.Element | undefined => {
        if (other.profile_image_path) {
            return (<img
                src={`${process.env.REACT_APP_BASE_URL}/storage/${other.profile_image_path}`}
                alt="User Profile"
                style={{width: '150px', height: '150px', borderRadius: '50%'}}
            />);
        } else {
            const initials = other.name ? other.name.split(' ').map(word => word[0]).join('').toUpperCase() : 'N/A';
            return (<div
                style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: '#6E66C8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '30px',
                    color: '#fff',
                    fontFamily: 'Alex Brush, handwriting',
                }}
            >
                {initials}
            </div>);
        }
    }
    const reactFileCreator = (files: any[]): JSX.Element[] | undefined => {
        // Eğer files bir string olarak gelirse, onu JSON'a parse edin
        if (typeof files === 'string') {
            try {
                files = JSON.parse(files);
            } catch (error) {
                console.error('Error parsing JSON:', error);
                return; // JSON hatalı ise null döner
            }
        }
        // Eğer files bir dizi ise, JSX öğelerini oluşturun
        if (Array.isArray(files) && files.length > 0 && files[0].id !== null) {
            return files.map((file, index) => (
                <div key={file.id || index} className="thumbnail-item">
                    {file.mime_type && file.mime_type.includes('image') ? (
                        <img
                            onClick={() => {
                                setGalleryIndex(file.id);
                                setShowGallery(true);
                            }}
                            className="thumbnail"
                            src={`/uploads/${file.media_id}/${file.filename}`}
                            alt=""
                        />
                    ) : (
                        <a onClick={() => {
                            setGalleryIndex(file.id);
                            setShowGallery(true);
                        }}>
                        <span className="file-icon">
                            <File size={80}/>
                        </span>
                        </a>
                    )}
                    <button
                        className="remove-button z-50"
                        onClick={() => downloadHandler(file)}
                    >
                        <Download className="text-red-800" size={20}/>
                    </button>
                </div>
            ));
        }
        return;
    };
    const handleTabClick = (menu: MenuProps) => {
        setSelectedTab(menu.menuValue.toLowerCase());
    };
    const fetchData = () => {
        axios.post('/api/ticketDetailDataUpdate/' + ticket.id).then(resp => {
            let pageData: TicketDetailProps = resp.data;
            setData(pageData);
            console.log(pageData);
        }).catch(err => console.log(err));
    };
    const Refresh = (e: any) => {
        e.preventDefault();
        fetchData();
    }
    const statusChangeHandler = (status: string) => {
        setSelectedRreactStatus(status);
        setShowCloseTicketModel(true);
    }
    const asignTypeHandler = (type: string) => {
        axios.post(`/api/assigntickettype/${ticket.id}/${type}`)
            .then(resp => {
                setShowTypeAsignModel(false);
                setTicketDomData(prevState => ({
                    ...prevState,
                        assigned_type: type
                }))
                fetchData();
            }).catch(err => {
            alert(err);
            setShowTypeAsignModel(false);
        })
    }
    const downloadHandler = (file: TicketFileProps) => {
        try {
            const url = "/uploads/" + file.media_id + "/" + file.filename;
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', file.filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
            alert(err);
        }
    }
    const messageDownloadHandler = (file: any) => {
        try {
            if (file.media_id && file.mime_type && file.filename) {
                const url = "/uploads/" + file.media_id + "/" + file.filename;
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', file.filename);
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
            }
        } catch (err) {
            console.error(err);
            alert(err);
        }
    }
    const asignableMeldingTypes = [
        {
            type: 'complimenten',
            text: 'Complimenten',
            Icon: "far fa-dot-circle text-white",
            Button: "btn-success",
            outline: "btn-outline-success",
            bg: "bg-success"
        },
        {
            type: 'comentaar',
            text: 'Comentaar',
            Icon: "far fa-dot-circle text-white",
            Button: "btn-secondary",
            outline: "btn-outline-secondary",
            bg: "bg-secondary"
        },
        {
            type: 'vraag',
            text: 'Vraag',
            Icon: "far fa-dot-circle text-white",
            Button: "btn-warning",
            outline: "btn-outline-warning",
            bg: "bg-warning"
        },
        {
            type: 'klacht',
            text: 'Klacht',
            Icon: "far fa-dot-circle text-white",
            Button: "btn-danger",
            outline: "btn-outline-danger",
            bg: "bg-danger"
        },
        {
            type: 'Melding',
            text: 'Melding',
            Icon: "far fa-dot-circle text-white",
            Button: "btn-secondary",
            outline: "btn-outline-secondary",
            bg: "bg-secondary"
        },
        {
            type: 'Extrawerk',
            text: 'Extra werk',
            Icon: "far fa-dot-circle text-white",
            Button: "btn-secondary",
            outline: "btn-outline-secondary",
            bg: "bg-secondary"
        },
        {
            type: 'Ongegrond',
            text: 'Ongegrond',
            Icon: "far fa-dot-circle text-white",
            Button: "btn-secondary",
            outline: "btn-outline-secondary",
            bg: "bg-secondary"
        },
    ]
    const statusOptions: any[] = [
        {
            text: "Nieuw",
            type: "New",
            Icon: "far fa-dot-circle text-white",
            Button: "btn-primary",
            outline: "btn-outline-info",
            bg: ""
        },
        {
            text: "In Bewerking",
            type: "In Progress",
            Icon: "far fa-dot-circle text-white",
            Button: "btn-warning",
            outline: "btn-outline-warning",
            bg: "bg-warning"
        },
        {
            text: "Afgehandeld",
            type: "Closed",
            Icon: "far fa-dot-circle text-white",
            Button: "btn-success",
            outline: "btn-outline-success",
            bg: "bg-success"
        },
        {
            text: "On Hold",
            type: "On Hold",
            Icon: "far fa-dot-circle text-white",
            Button: "btn-danger",
            outline: "btn-outline-danger",
            bg: "bg-danger"
        },
        {
            text: "Vervallen",
            type: "Cancelled",
            Icon: "far fa-dot-circle text-white",
            Button: "btn-secondary",
            outline: "btn-outline-secondary",
            bg: "bg-secondary"
        },
    ];
    useEffect(() => {
        try {
            setTicketFilesDoms(data.files);
            setTicketDomMessages(data.ticketmessages);
            setTicketDomData(data.ticket);
            setClientDomData(data.client[0]);//Buraya kullanıcının bağlantı kaydına göre bir veya birden fazla data gelecek
            setLocationDomData(data.locations[0]);
            setDomReacts(data.ticketreacts);
        } catch (err) {
            alert(err);
            window.location.reload();
        }
    }, [,data]);
    useEffect(() => {
        switch (ticketDomData.status) {
            case "On Hold":
                setTicketStatus(statusOptions[3]);
                break;
            case "Closed":
                setTicketStatus(statusOptions[2]);
                break;
            case "In Progress":
                setTicketStatus(statusOptions[1]);
                break;
            case "Cancelled":
                setTicketStatus(statusOptions[4]);
                break;
            default:
                setTicketStatus(statusOptions[0]);
        }
    }, [ticketDomData.status]);
    useEffect(() => {
        if (ticketFilesDoms.length > 0) {
            fileViews();
            openerFileViews();
        } else if (files.length > 0 && ticketFilesDoms.length === 0) {
            setTicketFilesDoms(files);
            fileViews();
            openerFileViews();
        } else {
            console.log('dosya bulunsa dahi görüntülenemiyor.');
        }
    }, [ticketFilesDoms]);
    useEffect(() => {
        if (ticketreacts && ticketreacts.length > 0) setDomReacts(ticketreacts);
    }, [ticketreacts]);
    useEffect(() => {
        markAsRead();
        console.dir(ticketDomMessages)
    }, []);
    const markAsRead = async () => {
        axios.put('/api/notifications/' + ticketDomData.id + '/mark-as-read').then(resp => {
            if (resp.status == 200) {
                console.log('mark as reas sucseed');
                setNeedNotisRefresh(true);
            } else if (resp.status == 400) {
                console.log(resp);
            } else console.log('can not markt as readed');
        }).catch(err => {
            console.log('Mark as read Error', err);
        })
    }
    const handleFileChange = (e: any) => {
        console.log(e.target.files);
        const files: File[] = Array.from(e.target.files || []);
        files.map(file => {
            setSelectedFiles(prevState => [...prevState, file]);
        })
    };
    const removePhoto = (index: number) => {
        const updatedPhotos = messageSelectedFiles.filter((_, i) => i !== index);
        setMessageSelectedFiles(updatedPhotos);
    };
    const handleAddCameraFiles = (e: File[]) => {
        e.map(file => {
            setSelectedFiles(prevState => [...prevState, file]);
        })

    }
    const UploadFilesSelected = (files: File[]) => {
        const request = new FormData();
        if (files.length > 0) files.forEach((file) => {
            request.append('files[]', file);
        });
        axios.post('/api/ticketfilesuploads', request).then(response => {
            console.log('Files added sucsessfully:', response.data);
            let newFiles: TicketFileProps[] = response.data.file as TicketFileProps[];
            newFiles.forEach(file => {
                setTicketFilesDoms(prevState => [...prevState, file]);
            })
        }).catch(err => {

            console.error('There is an error accured while adding a Message:', err);
        });
    }
    const handleFileUpload = (e: any) => {
        console.log(e.target.files);
        const files: File[] = Array.from(e.target.files || []);
        const request = new FormData();
        if (files.length > 0) files.forEach((file) => {
            request.append('files[]', file);
        });
        request.append('ticket_id', ticket.id.toString());
        const userIds = otherUsers.map(item => item.id).join(',');
        if (ticketDomData.ticket_to == "" || ticketDomData.ticket_to == null) {
            console.log('Tüm Kullanıcılara yollandı');
            request.append('userIds', userIds);
        } else {
            let userID = otherUsers.find(item => (item.name === ticketDomData.ticket_to))?.id;
            if (userID) request.append('userIds', userID.toString());
            else {
                userID = otherUsers.find(item => (item.name === ticketDomData.opener_name))?.id;
                if (userID) request.append('userIds', userID.toString());
            }
        }
        axios.post('/api/ticketfilesuploads', request).then(response => {
            console.log('Files added sucsessfully:', response.data);
            let newFiles: TicketFileProps[] = response.data.file as TicketFileProps[];
            newFiles.forEach(file => {
                setTicketFilesDoms(prevState => [...prevState, file]);
            })

        }).catch(err => {

            console.error('There is an error accured while adding a Message:', err);
        });
    }
    const messageFilesShower = (e: any) => {
        console.log('showingFiles', e.target.files);
        const files: File[] = Array.from(e.target.files || []);
        const totalSize = files.reduce((acc, file) => acc + file.size, 0);
        const maxSize = 25 * 1024 * 1024; // 25MB in bytes
        if (totalSize > maxSize) {
            alert('Total file size should not exceed 25MB');
            e.target.value = ''; // Clear the file input
            return;
        }
        files.forEach(file => {
            setMessageSelectedFiles(prevState => [...prevState, file]);
        })
    }
    const MessageSendHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (newMessage === null || newMessage === '') {
                setNewMessasge('.');
                console.log(newMessage);
            } else console.log(newMessage);
            const request = new FormData();
            request.append('ticket_id', ticketDomData.id.toString());
            request.append('userName', auth.user.name);
            request.append('Message', newMessage);
            request.append('delete', "0");
            if (messageSelectedFiles.length > 0)
                messageSelectedFiles.forEach((file) => {
                    request.append('files[]', file);
                });
            const userIds = otherUsers.map(item => item.id).join(',');
            if (ticketDomData.ticket_to == "" || ticketDomData.ticket_to == null) {
                console.log('Tüm Kullanıcılara yollandı');
                request.append('userIds', userIds);
            } else {
                let userID = otherUsers.find(item => (item.name === ticketDomData.ticket_to))?.id;
                if (userID) request.append('userIds', userID.toString());
                else {
                    userID = otherUsers.find(item => (item.name === ticketDomData.opener_name))?.id;
                    if (userID) request.append('userIds', userID.toString());
                }
            }
            axios.post('/api/ticketsmessagestore', request).then(response => {
                console.log('Message added sucsessfully:', response.data);
                let newMessageLine: TicketMessagesProps = {
                    ticket_id: response.data.message.ticket_id,
                    Message: response.data.message.Message,
                    id: response.data.message.id,
                    created_at: response.data.message.created_at,
                    updated_at: response.data.message.updated_at,
                    userName: response.data.message.userName,
                    files: Array.isArray(response.data.file) ? response.data.file.map((x: {
                        id: number,
                        filename: string,
                        mime_type: string,
                        media_id: number
                    }) => ({
                        id: x.id,
                        filename: x.filename,
                        mime_type: x.mime_type,
                        media_id: x.media_id
                    })) : [],
                }
                setTicketDomMessages(prevState => [...prevState, newMessageLine]);
                const inputera = document.getElementById('newMessageEra') as HTMLInputElement;
                if (inputera) inputera.value = '';
                setNewMessasge('');
                setMessageSelectedFiles([]);
                messageScroolDown();
            }).catch(err => {
                console.error('There is an error accured while adding a Message:', err);
            });
        } catch (error) {
            console.error('There is an error accured while adding a message:', error);
            throw error;
        }
    }
    const SidebarData: SidebarDataProps[] = [];
    const fileViews = () => {
        if (ticketFilesDoms.filter(x => x.created_at != ticketDomData.created_at && x.is_message === 0).length > 0) {
            let e: JSX.Element[] = ticketFilesDoms.filter(x => x.created_at != ticketDomData.created_at && x.is_message === 0).map((file: TicketFileProps) => (
                <li key={file.id}>
                    <div className="col-12 flex flex-row">
                        <div className="col-11 flex flex-row">
                            {file.mime_type.includes('image') ?
                                (
                                    <img
                                        onClick={() => {
                                            setGalleryIndex(file.id);
                                            setShowGallery(true);
                                        }}
                                        className="thumbnail"
                                        src={"/uploads/" + file.media_id + "/" + file.filename}
                                        alt=""/>
                                ) : (
                                    <a onClick={() => {
                                        setGalleryIndex(file.id);
                                        setShowGallery(true);
                                    }}>
                                        <span className="file-icon">
                                        <File size={80}/>
                            </span>
                                    </a>
                                )}

                            <p>{file.filename}</p>
                        </div>
                        <div className="file-download col-1 text-end">
                            <a className={'text-end'}
                               onClick={() => {
                                   downloadHandler(file);
                               }}>
                                <Download size={20}/>
                            </a>
                        </div>
                    </div>
                </li>
            ));
            setFilesDoms(e);
        }
    }

    const openerFileViews = () => {
        if (ticketFilesDoms.filter(x => x.created_at === ticketDomData.created_at && x.is_message === 0).length > 0) {
            let e: JSX.Element[] = ticketFilesDoms.filter(x => x.created_at === ticketDomData.created_at && x.is_message === 0).map((file: TicketFileProps) => (
                <li key={file.id}>
                    <div className="col-12 flex flex-row">
                        <div className="col-11 flex flex-row">

                            {file.mime_type.includes('image') ?
                                (
                                    <img
                                        onClick={() => {
                                            setGalleryIndex(file.id);
                                            setShowGallery(true);
                                        }}
                                        className="thumbnail"
                                        src={"/uploads/" + file.media_id + "/" + file.filename}
                                        alt=""/>
                                ) : (
                                    <a onClick={() => {
                                        setGalleryIndex(file.id);
                                        setShowGallery(true);
                                    }}>
                                        <span className="file-icon">
                                        <File size={80}/>
                            </span>
                                    </a>
                                )}

                        </div>
                        <div className="file-download col-1 text-end">
                            <a className={'text-end'}
                               onClick={() => {
                                   downloadHandler(file);
                               }}>
                                <Download size={20}/>
                            </a>
                        </div>
                    </div>
                </li>
            ));
            setOpenerFilesDoms(e);
        }
    }
    const handleTicket = (Ticket: TicketsDataProps | null) => {

    }
    const ticketMessageDataHandler = async (args: {
        newTicketMessage?: TicketMessagesProps;
        detailUpdateNeeded?: number;
    } | null) => {
        if (args) {
            if (args.newTicketMessage) {
                setTicketDomMessages(prevState => [...prevState, args.newTicketMessage as TicketMessagesProps]);
            }
            if (args.detailUpdateNeeded === ticketDomData.id) {
                fetchData();
            }
        }
    }
    const [isSidebarExpanded, setSidebarExpanded] = useState<boolean>(false);
    const removeFile = (index: number) => {
        const updatedFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(updatedFiles);
    };
    const UpsateTicketRenew = (updatedTicket: TicketsDataProps) => {
        window.location.reload();
    }
    return (
        <AuthenticatedLayout user={auth.user}
                             collectNotification={false}
                             notificationDataHandler={handleTicket}
                             ticketMessageDataHandler={ticketMessageDataHandler}
                             isSidebarExpanded={isSidebarExpanded}
                             setSidebarExpanded={setSidebarExpanded}
                             isTicketTableActive={false}
                             isMessageTableActive={true}
                             SidebarData={SidebarData} handleTabClick={handleTabClick}
        >
            <Head title={`Melding: ${ticket.id}`}/>
            {/* Page Wrapper */}
            <div className="page-wrapper ">
                <div className="content container-fluid">
                    {/* Page Header */}
                    <div className="page-header">
                        <div className="row align-items-center">
                            <div className="col">
                                <h3 className="page-title mb-0">Melding Detail</h3>
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link href={route('dashboard')}>Dashboard</Link>
                                    </li>
                                    <li className="breadcrumb-item"><Link href={route('tickets')}>Meldingen</Link>
                                    </li>
                                    <li className="breadcrumb-item active">Melding Detail
                                    </li>
                                    <li className="breadcrumb-item active">{ticketDomData.id}
                                    </li>
                                </ul>

                            </div>
                            <div className="col-md-3 float-end ms-auto">
                                <div className="d-flex title-head">
                                    <label htmlFor="file-upload"
                                           className={'grid-view btn btn-link'}>
                                        <a className={'btn btn-primary mx-3 px-3'}>
                                            <i className="las la-file-alt"/> Upload Files</a>
                                        <input className="form-control"
                                               id={"file-upload"}
                                               onChange={(e) => (handleFileUpload(e))}
                                               type="file"
                                               multiple
                                               style={{display: 'none'}}
                                        />
                                    </label>
                                    <div className="view-icons">
                                        <a onClick={(e) => (Refresh(e))}
                                           className="grid-view btn btn-link"> <i className="las la-redo-alt"/>
                                        </a>
                                        {auth.user.roleName === 'admin' || auth.user.roleName === 'supervisor' ? (
                                            <div className="contacts-action">
                                                <div className="dropdown">
                                                    <a className="m-2 p-2 dropdown-toggle marg-tp grid-view btn btn-link"
                                                       data-bs-toggle="dropdown"
                                                       aria-expanded="false"><MoreVertical size={20}/></a>
                                                    <div className="dropdown-menu dropdown-menu-right">
                                                        <a className="dropdown-item btn-outline-primary"
                                                           onClick={() => setShowTypeAsignModel(true)}>Assign a
                                                            Type</a>
                                                        <a className="dropdown-item btn-outline-primary"
                                                           onClick={() => setShowCloseTicketModel(true)}>Close
                                                            Ticket</a>
                                                        <a className="dropdown-item btn-outline-primary"
                                                           onClick={() => setShowUpdateTicket(true)}>Edit Meldingen</a>
                                                        <a className="dropdown-item btn-outline-primary"
                                                           onClick={() => setShowDeleteModel(true)}>Delete</a>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* /Page Header */}
                    <div className="row">
                        <div className="col-xl-8 col-lg-8">
                            <div className="ticket-detail-head">
                                <div className="row items-stretch">
                                    <div className="col-xxl-3 col-md-6">
                                        <div className="ticket-head-card">
                                            <span className={"ticket-detail-icon " + ticketStatus.bg}>
                                                <i className={ticketStatus.Icon}/>
                                            </span>
                                            <div className="detail-info">
                                                <h6>Status</h6>
                                                <div className="btn-list">
                                                    <div className="btn-group ">
                                                        <button
                                                            className={"btn dropdown-toggle btn-sm rounded-pill " + ticketStatus.Button}
                                                            type="button"
                                                            id="defaultDropdown"
                                                            data-bs-toggle="dropdown"
                                                            data-bs-auto-close="true"
                                                            aria-expanded="false"
                                                        >
                                                            {ticketStatus.text}
                                                        </button>
                                                        <ul className="dropdown-menu" aria-labelledby="defaultDropdown">
                                                            {statusOptions.filter((item) => item.type !== ticketDomData.status).map((x) => (
                                                                <li key={x.type}> {/* Add unique key */}
                                                                    <button
                                                                        className={`dropdown-item ${x.outline}`}
                                                                        onClick={(e) => statusChangeHandler(x.type)}
                                                                    >
                                                                        {x.text}
                                                                    </button>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xxl-3 col-md-6">
                                        <div className="ticket-head-card">
                                            <span className="ticket-detail-icon bg-danger-lights">
                                                <i className="la la-user"/>
                                            </span>
                                            <div className="detail-info info-two">
                                                <h6>Melding Maker</h6>
                                                <h6>{ticketDomData.opener_name}</h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xxl-3 col-md-6">
                                        <div className="ticket-head-card">
                                            <span className="ticket-detail-icon bg-warning-lights">
                                                <i className="la la-calendar"/>
                                            </span>
                                            <div className="detail-info info-two">
                                                <h6>Melding Datum</h6>
                                                <p>{moment(ticketDomData.created_at).format('DD-MM-YYYY HH:mm')}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xxl-3 col-md-6">
                                        <div className="ticket-head-card">
                                            <span className="ticket-detail-icon bg-purple-lights">
                                                <i className="la la-comment-dots"/>
                                            </span>
                                            <div className="detail-info info-two">
                                                <h6>Inkomen Melding Type</h6>
                                                <a onClick={() => setShowTypeAsignModel(true)}>
                                                    <h6>{ticketDomData.ticket_type}</h6></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="ticket-purpose">
                                <div className="row">
                                    <div className="col-2">
                                        <h5><b>Melding:</b></h5>
                                    </div>
                                    <div className="col-10">
                                        <p className={'text-black'}>{ticketDomData.title}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="ticket-purpose">
                                <div className="row">
                                    <div className="col-2">
                                        <h5><b>Omschrijving:</b></h5>
                                    </div>
                                    <div className="col-10">
                                        <p className={'text-black'}>{ticketDomData.ticketsubject}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="ticket-chat ">
                                <div className="col-xl-12">
                                    <div className="ticket-chat-head">
                                        <h4 className={'text-center'}><b>Activiteit</b></h4>
                                        {enableReactEntry ? (
                                            <div className="chat-post-box">
                                                <form
                                                    className={'flex flex-row items-center justify-start space-x-2'}
                                                    onSubmit={ticketReactEvent} id={'closeMelding'}>
                                                    <div className="col-9 ">
                                                        <textarea
                                                            style={{minHeight: 20, overflowY: "hidden"}}
                                                            className="form-control"
                                                            value={closingFormData.closing_comment}
                                                            name='ticketsubject'
                                                            onInput={autoResize}
                                                            onChange={(e) => {
                                                                setClosingFormData(prevState => ({
                                                                    ...prevState,
                                                                    closing_comment: e.target.value
                                                                }));
                                                            }}
                                                        />
                                                    </div>
                                                    <div
                                                        className="files-attached d-flex justify-content-end align-items-right">
                                                        <div className="post-files">
                                                            <label htmlFor="message-gallery"
                                                                   className={'grid-view btn btn-link'}>
                                                                <a className={'grid-view btn btn-link'}>
                                                                    <i className="la la-image "/>
                                                                </a>
                                                                <input className="form-control"
                                                                       id={"message-gallery"}
                                                                       onChange={(e) => (handleFileChange(e))}
                                                                       multiple
                                                                       type="file"
                                                                       style={{display: 'none'}}
                                                                />
                                                            </label>
                                                        </div>
                                                        <button type="submit"><Send size={20}/></button>
                                                        <button className={'btn btn-md btn-outline-danger'}
                                                                type="button"
                                                                onClick={() => setEnableReactEntry(false)}><XOctagon
                                                            size={20}/></button>
                                                    </div>
                                                    <div className="row">
                                                        <div className="thumbnail-carousel">
                                                            {selectedFiles.length > 0 && selectedFiles.map((photo, index) => (
                                                                <div className={'thumbnail-item'}>
                                                                    <img src={URL.createObjectURL(photo)}
                                                                         alt={`Thumbnail ${index}`}
                                                                         className="thumbnail"/>
                                                                    <button className="remove-button z-50"
                                                                            onClick={() => removeFile(index)}>
                                                                        <Trash2 className={'text-red-800'}
                                                                                size={20}/>
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>) : (
                                            <div className="chat-post-box col-12">
                                                <button className="btn btn-secondary col-12 justify-content-lg-start"
                                                        onClick={() => setEnableReactEntry(true)}>
                                                    Please Enter a Comment
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <hr/>

                                    {domReacts && domReacts.length > 0 ? (
                                        <div className="ticket-chat-body email-content col-xl-12 pr-sm-2 bg-gray-100">
                                            {domReacts.map((e: TicketReacts, index) => (
                                                <React.Fragment key={index}>
                                                    <div className="row">
                                                        <div className="col-1">
                                                            {profileImageCreator(otherUsers.find(x => x.name === e.evaluator_persons) ?? auth.user)}
                                                        </div>
                                                        <div className="col-10">
                                                            <div
                                                                className="flex flex-row items-center justify-start space-x-4">
                                                                <h5 className="text-black">
                                                                    <b>{e.evaluator_persons}</b>
                                                                </h5>&nbsp;
                                                                <p>
                                                                    {statusOptions.filter((item) => item.type === e.before_status).map((x) => (
                                                                        <>{x.text}</>
                                                                    ))}
                                                                    &nbsp;to&nbsp;
                                                                    {statusOptions.filter((item) => item.type === e.after_status).map((x) => (
                                                                        <>{x.text}</>
                                                                    ))}
                                                                </p>&nbsp;
                                                                <p className="text-muted">
                                                                    {timeAgo(new Date(e.created_at))}
                                                                </p>
                                                            </div>
                                                            <a
                                                                onClick={() => {
                                                                    setSelectedEditableReact(e);
                                                                    setShowReactEditModal(true);
                                                                }}
                                                            >
                                                                <div className="row card contact-sidebar">
                                                                    <div>
                                                                        <p className="text-black inner-text-area">
                                                                            {e.react_text}
                                                                        </p>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="thumbnail-carousel col-12">
                                                                            {reactFileCreator(e.files)}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </React.Fragment>
                                            ))}

                                        </div>
                                    ) : null}
                                </div>
                            </div>


                            <hr/>

                            {/*<Chat auth={auth}></Chat>*/}

                        </div>
                        <div className="col-xl-4 col-lg-4">
                            {ticketDomData.assigned_type || ticketDomData.closing_date ? (
                                <div className="ticket-detail-head">
                                    <div className="row">
                                        {ticketDomData.assigned_type &&
                                            (<div className={"items-stretch " + (ticket.closing_date && "col-xxl-6")}>
                                                <div className="ticket-head-card">
                                            <span className="ticket-detail-icon bg-purple-500">
                                                <i className="la la-comment-dots"/>
                                            </span>
                                                    <div className="detail-info info-two">
                                                        <h6>Afgehandeld Melding Type</h6>
                                                        <h6>{ticketDomData.assigned_type}</h6>
                                                    </div>
                                                </div>
                                            </div>)}
                                        {ticket.closing_date && (
                                            <div className={"items-stretch " + (ticket.assigned_type && "col-xxl-6")}>
                                                <div className="ticket-head-card">
                                            <span className="ticket-detail-icon bg-warning-lights">
                                                <i className="la la-calendar"/>
                                            </span>
                                                    <div className="detail-info info-two">
                                                        <h6>Sluiting Datum</h6>
                                                        <p>{moment(ticketDomData.closing_date).format('DD-MM-YYYY HH:mm')}</p>
                                                    </div>
                                                </div>
                                            </div>)}
                                    </div>
                                </div>
                            ) : null}
                            <div className="attached-files-info">
                                <div className="row">
                                    <div className="col-xxl-12">
                                        <div className="attached-files">
                                            <h6>Meldingen Files</h6>
                                            <ul>
                                                {openerFilesDoms && openerFilesDoms.length > 0 ? openerFilesDoms :
                                                    <p>No files available</p>}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="attached-files-info">
                                <div className="row">
                                    <div className="col-xxl-12">
                                        <div className="attached-files">
                                            <h6>Bestanden & Foto's</h6>
                                            <ul>
                                                {filesDoms && filesDoms.length > 0 ? filesDoms :
                                                    <p>No files available</p>}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal show={showChat} onHide={() => setShowChat(false)} className={'z-30'} size={'lg'} centered>
                    <div className="attached-files-info">
                        <div className="ticket-chat" id={'chatArea'}>
                            <div className="ticket-chat-head">
                                <h4>Melding Messages</h4>
                            </div>
                            <div className="ticket-chat-body email-content col-md-12"
                                 style={{overflowY: 'auto'}}>
                                <div className="table-responsive col-md-12">
                                    <table className="col-md-12 table table-inbox table-hover"
                                           style={{
                                               width: '100%',
                                               borderCollapse: 'collapse',
                                               maxWidth: '100%'
                                           }}>
                                        <thead>
                                        <tr>
                                            <th style={{width: '15%', textAlign: 'left'}}></th>
                                            <th style={{
                                                width: '70%',
                                                textAlign: 'left',
                                                wordWrap: 'break-word'
                                            }}></th>
                                            <th style={{width: '15%', textAlign: 'right'}}></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {ticketDomMessages.map((item: TicketMessagesProps) => {
                                            let files = item.files;

                                            if (typeof files === 'string') {
                                                try {
                                                    files = JSON.parse(files);
                                                } catch (e) {
                                                    console.error('Error parsing files:', e);
                                                    files = [];
                                                }
                                            }

                                            return (
                                                <tr className="clickable-row" key={item.id.toString()}>
                                                    <td className="name">
                                                        {item.userName}
                                                    </td>
                                                    <td className="subject"
                                                        style={{padding: '8px 16px', wordWrap: 'break-word'}}>
                                                        <ExpandableText text={item.Message}/>
                                                        <div className="thumbnail-carousel">

                                                            {Array.isArray(files) && files.length > 0 && files.map(z => (
                                                                z.filename && z.mime_type && z.media_id ? (
                                                                    <>
                                                                        {z.mime_type.includes('image') ? (
                                                                            <div className="thumbnail-item">
                                                                                <img
                                                                                    onClick={() => {
                                                                                        setGalleryIndex(z.media_id ?? 0);
                                                                                        setShowGallery(true);
                                                                                    }}
                                                                                    className="thumbnail"
                                                                                    src={`/uploads/${z.media_id}/${z.filename}`}
                                                                                    alt=""
                                                                                />
                                                                                <button
                                                                                    className="remove-button z-50"
                                                                                    onClick={(e) => {
                                                                                        e.preventDefault();
                                                                                        messageDownloadHandler(z);
                                                                                    }}>
                                                                                    <Download size={20}/>
                                                                                </button>
                                                                            </div>
                                                                        ) : (
                                                                            <div className="thumbnail-item"
                                                                                 key={z.media_id}>
                                                                                <div
                                                                                    className="col-10 flex flex-row">
                                                                                        <span className="file-icon"><i
                                                                                            className="la la-file"/></span>
                                                                                    <p>{z.filename}</p>
                                                                                </div>
                                                                                <div
                                                                                    className="file-download col-2">
                                                                                    <a onClick={(e) => {
                                                                                        e.preventDefault();
                                                                                        messageDownloadHandler(z);
                                                                                    }}>
                                                                                        <i className="la la-download"/>
                                                                                    </a>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </>

                                                                ) : null
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td style={{
                                                        padding: '8px 16px',
                                                        textAlign: 'right',
                                                        fontSize: '0.8em'
                                                    }}
                                                        className="mail-date">{moment(item.created_at).format('YYYY-MM-DD HH:mm')}</td>

                                                </tr>
                                            );
                                        })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="ticket-chat">
                            <div className="ticket-chat-head">
                                <div className="chat-post-box">
                                    <form onSubmit={MessageSendHandler} id={'newMessageEra'}>
                                                    <textarea
                                                        style={{minHeight: 50}}
                                                        className="form-control"
                                                        value={newMessage}
                                                        name='ticketsubject'
                                                        onChange={(e) => (setNewMessasge(e.target.value))}/>
                                        <div
                                            className="files-attached d-flex justify-content-between align-items-center">
                                            <div className="post-files">
                                                <label htmlFor="message-gallery"
                                                       className={'grid-view btn btn-link'}>
                                                    <a className={'grid-view btn btn-link'}>
                                                        <i className="la la-image "/></a>
                                                    <input className="form-control"
                                                           id={"message-gallery"}
                                                           onChange={(e) => (messageFilesShower(e))}
                                                           multiple
                                                           type="file"
                                                           style={{display: 'none'}}
                                                    />
                                                </label>
                                            </div>
                                            <button type="submit">Sent</button>
                                        </div>
                                        {messageSelectedFiles.length > 0 && (
                                            <div className="thumbnail-carousel">
                                                {messageSelectedFiles.map((file, index) => (
                                                    <div
                                                        key={index}
                                                        className={`thumbnail-item`}
                                                    >
                                                        <img src={URL.createObjectURL(file)}
                                                             alt={`Thumbnail ${index}`} className="thumbnail"/>
                                                        <button className="remove-button z-30"
                                                                onClick={() => removePhoto(index)}>
                                                            <Trash2 size={20}/>
                                                        </button>
                                                    </div>
                                                ))
                                                }
                                            </div>
                                        )}
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
                <Modal show={showTypeAsignModel} onHide={() => setShowTypeAsignModel(false)}
                       className={'z-30'} size={'lg'} centered>
                    <div className="modal-dialog-centered modal-lg" role={'document'}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Assign a Type</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    onClick={() => setShowTypeAsignModel(false)}
                                >
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="ticket-detail-head">
                                        <div className="row items-stretch btn-group">
                                            {asignableMeldingTypes.map((x) => (
                                                <button
                                                    type={'button'}
                                                    className={`m-3 p-3 btn rounded-pill btn-sm ${x.outline}`}
                                                    onClick={(e) => asignTypeHandler(x.type)}
                                                >
                                                        <span className={"ticket-detail-icon " + ticketStatus.bg}>
                                                <i className={ticketStatus.Icon}/>
                                            </span>
                                                    {x.text}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
                <Modal show={showCloseTicketModel} onHide={() => setShowCloseTicketModel(false)}
                       className={'z-30'} size={'lg'} centered>
                    <div className="modal-dialog-centered modal-lg" role={'document'}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Change Melding Status</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setShowCloseTicketModel(false)
                                    }}
                                >
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <form id={'closingForm'} onSubmit={ticketReactEvent} method={'post'}>
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <div className="input-block mb-3">
                                                    <label className="col-form-label">Description</label>
                                                    <textarea className="form-control"
                                                              value={closingFormData.closing_comment}
                                                              name='ticketsubject'
                                                              style={{height: '200px'}}
                                                              onChange={(e) => {
                                                                  setClosingFormData(prevState => ({
                                                                      ...prevState,
                                                                      closing_comment: e.target.value
                                                                  }));
                                                              }}
                                                    />
                                                </div>
                                                <div className="row flex flex-row items-center justify-start">
                                                    <div
                                                        className="col-12 flex flex-row items-center justify-start space-x-4">
                                                        {statusOptions.filter((item) => item.type === ticketDomData.status).map((x) => (
                                                            <button
                                                                key={x.type}
                                                                type={'button'}
                                                                className={`btn btn-lg rounded-pill ${x.Button}`}
                                                            >
                                                                {x.text}
                                                            </button>
                                                        ))}
                                                        <ArrowRightCircle size={25}/>
                                                        {statusOptions.filter((item) => item.type === selectedReactStatus).map((x) => (
                                                            <button
                                                                key={x.type}
                                                                type={'button'}
                                                                className={`btn btn-lg rounded-pill ${x.Button}`}
                                                            >
                                                                {x.text}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="input-block mb-3">
                                                    <label className="col-form-label">Upload Files</label>
                                                    <div className="row">
                                                        <div className="col-xl-11">
                                                            <div className="flex-row flex">
                                                                <input className="form-control"
                                                                       onChange={(e) => (handleFileChange(e))}
                                                                       multiple type="file"/>
                                                            </div>
                                                        </div>
                                                        <div className="col-xl-1">
                                                            <a className="btn btn-primary" data-bs-toggle="modal"
                                                               data-bs-target="#takeAPhoto" onClick={toggleCamera}>
                                                                {showCamera ? <CameraOff className='me-2' size={40}/> :
                                                                    <Camera className='me-2' size={40}/>}
                                                            </a>
                                                        </div>
                                                        {showCamera &&
                                                            <CameraComponent
                                                                cameraStatus={showCamera ? showCamera : false}
                                                                onHide={() => setShowCamera(false)}
                                                                setCapturedFiles={handleAddCameraFiles}
                                                                otherFiles={selectedFiles}
                                                            />}
                                                        <div className="thumbnail-carousel">
                                                            {selectedFiles.length > 0 && selectedFiles.map((photo, index) => (
                                                                <div className={'thumbnail-item'}>
                                                                    <img src={URL.createObjectURL(photo)}
                                                                         alt={`Thumbnail ${index}`}
                                                                         className="thumbnail"/>
                                                                    <button className="remove-button z-50"
                                                                            onClick={() => removeFile(index)}>
                                                                        <Trash2 className={'text-red-800'} size={20}/>
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="submit-section">
                                            <button
                                                disabled={isWorking}
                                                style={{cursor: isWorking ? "not-allowed" : "pointer"}}
                                                className="btn btn-primary submit-btn"
                                                data-bs-dismiss="modal"
                                                aria-label="Close"
                                                type="submit"
                                            >
                                                {isWorking ? (
                                                    <span><i className="fas fa-spinner fa-spin fa-lg me-2"></i>Uploading</span>) : "Submit"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
                {/* /Edit Ticket Modal */
                }
                <Modal show={showReactEditModal} size={'lg'} centered onHide={() => setShowReactEditModal(false)}>
                    <div className="modal-dialog-centered modal-lg" role={'document'}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit reactie op melding</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    onClick={() => setShowReactEditModal(false)}
                                >
                                    <span aria-hidden="true"><XCircle className={'text-red-800'}/></span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <form id={'closingForm'} onSubmit={updateReactEvent} method={'post'}>
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <div className="input-block mb-3">
                                                    <label className="col-form-label">Description</label>
                                                    <textarea className="form-control"
                                                              value={selectedEditableReact?.react_text}
                                                              name='ticketsubject'
                                                              style={{height: '200px'}}
                                                              onChange={(e) => {
                                                                  if (selectedEditableReact != null) {
                                                                      const updatedReact = {
                                                                          ...selectedEditableReact,
                                                                          react_text: e.target.value
                                                                      };
                                                                      setSelectedEditableReact(updatedReact); // Örneğin, state güncelleyici bir fonksiyon kullanın
                                                                  }
                                                              }}
                                                    />
                                                </div>
                                                <div className="row flex flex-row items-center justify-start">
                                                    <div
                                                        className="col-12 flex flex-row items-center justify-start space-x-4">
                                                        {statusOptions.filter((item) => item.type === selectedEditableReact?.before_status).map((x) => (
                                                            <button
                                                                key={x.type}
                                                                type="button"
                                                                className={`btn btn-lg rounded-pill ${x.outline}`}
                                                            >
                                                                {x.text}
                                                            </button>
                                                        ))}
                                                        <ArrowRightCircle size={25}/>
                                                        <div className="btn-list">
                                                            <div className="btn-group ">
                                                                {statusOptions.filter((item) => item.type === selectedEditableReact?.after_status).map((x) => (
                                                                    <button
                                                                        key={x.type}
                                                                        className={`btn dropdown-toggle btn-lg rounded-pill ${x.Button}`}
                                                                        type="button"
                                                                        id="ReactEditDropdown"
                                                                        data-bs-toggle="dropdown"
                                                                        data-bs-auto-close="true"
                                                                        aria-expanded="false"
                                                                    >
                                                                        {x.text}
                                                                    </button>
                                                                ))}
                                                                <ul className="dropdown-menu"
                                                                    aria-labelledby="ReactEditDropdown">
                                                                    {statusOptions.filter((item) => item.type !== selectedReactStatus).map((x) => (
                                                                        <li key={x.type}> {/* Add unique key */}
                                                                            <button
                                                                                className={`dropdown-item ${x.outline}`}
                                                                                type={'button'}
                                                                                onClick={(e) => {
                                                                                    if (selectedEditableReact !== null) {
                                                                                        const upreact = {
                                                                                            ...selectedEditableReact,
                                                                                            after_status: x.type
                                                                                        };
                                                                                        setSelectedEditableReact(upreact);
                                                                                        const dropdownToggle = document.getElementById('ReactEditDropdown');
                                                                                        if (dropdownToggle) {
                                                                                            dropdownToggle.click(); // Dropdown menüsünü kapatmak için tıklama tetikleyin
                                                                                        }
                                                                                    }
                                                                                }}
                                                                            >
                                                                                {x.text}
                                                                            </button>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="input-block mb-3">
                                                    <label className="col-form-label">Upload Files</label>
                                                    <div className="row">
                                                        <div className="col-xl-11">
                                                            <div className="flex-row flex">
                                                                <input className="form-control"
                                                                       onChange={(e) => (handleFileChange(e))}
                                                                       multiple type="file"/>
                                                            </div>
                                                        </div>
                                                        <div className="col-xl-1">
                                                            <a className="btn btn-primary" data-bs-toggle="modal"
                                                               data-bs-target="#takeAPhoto" onClick={toggleCamera}>
                                                                {showCamera ? <CameraOff className='me-2' size={40}/> :
                                                                    <Camera className='me-2' size={40}/>}
                                                            </a>
                                                        </div>
                                                        {showCamera &&
                                                            <CameraComponent
                                                                cameraStatus={showCamera ? showCamera : false}
                                                                onHide={() => setShowCamera(false)}
                                                                setCapturedFiles={handleAddCameraFiles}
                                                                otherFiles={selectedFiles}
                                                            />}
                                                        <div className="thumbnail-carousel">
                                                            {selectedFiles.length > 0 && selectedFiles.map((photo, index) => (
                                                                <div className={'thumbnail-item'}>
                                                                    <img src={URL.createObjectURL(photo)}
                                                                         alt={`Thumbnail ${index}`}
                                                                         className="thumbnail"/>
                                                                    <button className="remove-button z-50"
                                                                            onClick={() => removeFile(index)}>
                                                                        <Trash2 className={'text-red-800'} size={20}/>
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="submit-section">
                                            <button
                                                className="btn btn-primary submit-btn"
                                                data-bs-dismiss="modal"
                                                aria-label="Close"
                                                type="submit"
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
                <FloatingButton onClick={() => setShowChat(true)}
                                icon={<MessageCircle/>}
                >

                </FloatingButton>
            </div>
            <FileGallery files={ticketFilesDoms} show={showGallery} onHide={() => setShowGallery(false)}
                         setFiles={setTicketFilesDoms} setSelectedFile={currentGalleryIndex}/>
            <UpTicket ticketDataHandler={UpsateTicketRenew}
                      otherUsers={otherUsers} customer={Array.isArray(client) ? client : [client]}
                      user={auth.user} buildings={Array.isArray(locations) ? locations : [locations]}
                      islocationDetail={false}
                      ticket={ticket}
                      onHide={() => setShowUpdateTicket(false)}
                      UpTicketModelShow={showUpdateTicket}
            />
        </AuthenticatedLayout>

    )
}

export default TicketDetails
