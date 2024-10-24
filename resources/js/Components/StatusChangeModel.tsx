import React, {useState, useEffect, PropsWithChildren} from "react";
import {ArrowRightCircle, Camera, CameraOff, File, Trash2} from "react-feather";
import CameraComponent from "@/Components/CameraComponent";
import {Modal} from "react-bootstrap";
import {OtherUsersProps, TicketsDataProps} from "@/types/globalProps";
import axios from "axios";
import moment from "moment";


export function StatusChangeModel({
                                      showCloseTicketModel,
                                      setShowCloseTicketModel,
                                      ticketDomData,
                                      selectedReactStatus,
                                      otherUsers,
                                  }: PropsWithChildren<{
    showCloseTicketModel: boolean,
    setShowCloseTicketModel: React.Dispatch<React.SetStateAction<boolean>>,
    ticketDomData: TicketsDataProps,
    selectedReactStatus: string,
    otherUsers: OtherUsersProps[],
}>) {

    const [showCamera, setShowCamera] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isWorking, setIsWorking] = useState<boolean>(false);
    const [closingFormData, setClosingFormData] = useState<
        {
        ticket_id: number,
        closing_comment: string}>({
            ticket_id: -1,
            closing_comment: ''
        });
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
    const removeFile = (index: number) => {
        const updatedFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(updatedFiles);
    };
    const handleAddCameraFiles = (e: File[]) => {
        e.map(file => {
            setSelectedFiles(prevState => [...prevState, file]);
        })

    }
    const toggleCamera = () => {
        setShowCamera(prevState => !prevState);
    };
    const handleFileChange = (e: any) => {
        console.log(e.target.files);
        const files: File[] = Array.from(e.target.files || []);
        files.map(file => {
            setSelectedFiles(prevState => [...prevState, file]);
        })
    };
    const ticketReactEvent = (event: any) => {
        event.preventDefault();
        setIsWorking(true);
        if (closingFormData.closing_comment == undefined && closingFormData.closing_comment == null
            && closingFormData.closing_comment == '') setClosingFormData(prevState => ({...prevState, closing_comment: '...'}))
            const request = new FormData();
            request.append('id', ticketDomData.id.toString());
            request.append('closing_comment', closingFormData.closing_comment);
            request.append('after_status', selectedReactStatus);
            request.append('closing_date', moment(new Date).format('YYYY-MM-DD HH:mm:ss'));
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
                    closingFormData.closing_comment = '';
                    window.location.reload();
                }
            }).catch(err => {
                alert('An error occurred');
                console.log('close ticket error', err);
            }).finally(() => {
                setShowCloseTicketModel(false);
            })
        setIsWorking(false);
    }
    return (<Modal show={showCloseTicketModel} onHide={() => {
        setShowCloseTicketModel(false);
        setIsWorking(false);
    }}
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
                                        <span><i
                                            className="fas fa-spinner fa-spin fa-lg me-2"></i>Uploading</span>) : "Gereed"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </Modal>);
}
