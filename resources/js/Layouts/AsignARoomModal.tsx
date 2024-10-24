import React, {useState, useEffect} from 'react';
import {MinusCircle, MoreVertical, PlusCircle, XCircle} from 'react-feather';
import {PageProps} from '@/types';
import {Head, Link} from '@inertiajs/react';
import axios from "axios";
import moment from "moment/moment";
import {
    BuildingProps,
    CustomerProps,
    RoomProps,
    RouteAuths,
    CustomerAsignedRoomsDataProps,
    CustomerWithRoomsOnLocatie
} from '@/types/globalProps';
import {User} from '@/types';
import {forEach} from "react-bootstrap/ElementChildren";
import Cookies from "js-cookie";
import Swal from 'sweetalert2';
import {AgGridReact} from 'ag-grid-react';
import {themeQuartz} from '@ag-grid-community/theming';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import {ICellRendererParams, ColDef, ValueGetterParams} from 'ag-grid-community';
import withReactContent from "sweetalert2-react-content";
import {Modal} from 'react-bootstrap';
import IconButton from '@mui/material/IconButton';

interface asignRoomToClientProps {
    auth: User;
    customer: CustomerProps | null;
    locatie: BuildingProps;
    rooms: RoomProps[];
    pageAuth: RouteAuths | undefined;
    showModel: boolean;
    onHide: () => void;
}

interface asignedRoomsProps {
    klant: CustomerWithRoomsOnLocatie;
    show: boolean;
    onHide: () => void;
}

export function AsignedRoomsModal({klant, show, onHide}: asignedRoomsProps) {
    const MySwal = withReactContent(Swal);
    const [domData, setDomData] = useState<RoomProps[]>();
    const [recordData, setRecordData] = useState<RoomProps[]>()
    useEffect(() => {
        setDomData(klant.room);
        setRecordData(klant.room);
    }, [klant]);
    const handleCellValueChange = (event: any) => {
        const {column, data, newValue, oldValue} = event;
        if (column.colId === '1' && oldValue != newValue) {
            if (parseInt(newValue) > 0 && domData) {
                let e = domData.map(item => {
                    if (item.id == data.id) {
                        item.percentage = newValue;
                    }
                    return item;
                })
            } else if (parseInt(newValue) == 0) {
                //Burada Selecteer kolonundaki iconType true olmalı
            }
        }
    };
    const RoomColumns: ColDef[] = [
        {
            headerName: 'Selecteer',
            flex: 1,
            cellRenderer: (params: ICellRendererParams) => {
                const isInRecordData = recordData ? recordData.some(item => item.id === params.data.id) : false;
                return (<IconButton onClick={(e) => {
                    e.preventDefault();
                    if (!isInRecordData)
                        setRecordData(prevState => {
                            if (prevState) return [...prevState, params.data]
                            else return params.data;
                        });
                    else
                        setRecordData(prevState => {
                            if (prevState) {
                                return prevState.filter(x => x.id !== params.data.id);
                            }
                            return prevState;
                        })
                }} className={`btn-icon flex flex-row-reverse`}>
                    {isInRecordData ?
                        (<MinusCircle className={'text-red-500 rounded-full w-full'} size={30}/>) :
                        (<PlusCircle className={'text-green-600 rounded-full w-full'} size={30}/>)}
                </IconButton>)
            }
        },
        {
            headerName: 'Percentage',
            flex: 1,
            editable: true,  // Hücreyi düzenlenebilir yapıyoruz.
            valueGetter: (params: ValueGetterParams) => {
                return params.data.percentage || 100; // Varsayılan olarak yüzde 100'ü alıyoruz.
            },
            valueSetter: (params: any) => {
                params.data.percentage = params.newValue;  // Girilen yeni değeri veri kaynağına atıyoruz.
                return true;
            },
            cellEditor: 'agTextCellEditor',  // Düzenleme için bir text editörü kullanıyoruz.
            cellRenderer: (params: ICellRendererParams) => {
                return (
                    <input
                        type="number"
                        value={params.value}
                        onChange={(e) => {
                            let updatedValue = parseInt(e.target.value);
                            params.node.setDataValue('percentage', updatedValue);
                        }}
                        min={0}
                        max={100}
                        className="form-control"
                    />
                );
            }
        },
        {
            headerName: "Floor Number",
            flex: 1,
            valueGetter: (params: ValueGetterParams) => {
                return `${params.data.floor_number}`;
            },
            cellRenderer: (params: ICellRendererParams) => {
                return (
                    <p>
                        {params.data.floor_number}
                    </p>
                );
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Room Number",
            flex: 1,
            valueGetter: (params: ValueGetterParams) => {
                return `${params.data.room_number}`;
            },
            cellRenderer: (params: ICellRendererParams) => {
                return (
                    <p>
                        {params.data.room_number}
                    </p>
                );
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Room Type",
            flex: 1,
            valueGetter: (params: ValueGetterParams) => {
                return `${params.data.room_type}`;
            },
            cellRenderer: (params: ICellRendererParams) => {
                return (
                    <p>
                        {params.data.room_type}
                    </p>
                );
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Usage Type",
            flex: 2,
            valueGetter: (params: ValueGetterParams) => {
                return `${params.data.useage_type}`;
            },
            cellRenderer: (params: ICellRendererParams) => {
                return (
                    <p>
                        {params.data.useage_type}
                    </p>
                );
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Floor Square",
            flex: 1,
            valueGetter: (params: ValueGetterParams) => {
                return `${params.data.floor_square}`;
            },
            cellRenderer: (params: ICellRendererParams) => {
                return (
                    <p>
                        {params.data.floor_square}
                    </p>
                );
            },
            filter: true, floatingFilter: true
        },
    ];

    const markAll = () => {
        if (domData) setRecordData(domData);
    }
    const unMarkAll = ()=> {
        setRecordData([]);
    }
    const asignHandle = () => {
        MySwal.fire({
            title: 'Zal worden opgeslagen.',
            text: 'Weet u zeker dat u de registratie wilt uitvoeren?',
            showCancelButton: true,
            confirmButtonText: 'OK',
            cancelButtonText: 'Annuleren',
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger',
            },
        }).then(result => {
            if (result.isConfirmed && recordData && recordData.length>0) {
                const request = {
                    customerID: klant.CustomerID,
                    locatieID: recordData[0].building_id,
                    rooms: recordData,
                }
                axios.post('/api/updateclientrooms', request).then(resp => {
                    if (resp.status == 200) {
                        MySwal.fire({
                            title: 'Basarili',
                            text: '...',
                            confirmButtonText: 'OK',
                            customClass: {
                                confirmButton: 'btn btn-success',
                            },
                        });
                    } else if (resp.status == 300) {
                        MySwal.fire({
                            title: 'Error 300',
                            text: resp.data,
                            confirmButtonText: 'OK',
                        })
                    }
                }).catch(err => {
                    console.log('save error', err);
                })
            } else {
                MySwal.fire({
                    title: 'Geannuleerd',
                    text: 'Gebruikersaccount is nog steeds inactief',
                    confirmButtonText: 'OK',
                    customClass: {
                        confirmButton: 'btn btn-success',
                    },
                });
            }
        }).catch(error => {
            MySwal.fire({
                title: 'Fout!',
                text: 'Er is iets misgegaan.\n' + error,
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'btn btn-danger',
                },
            });
        });
    }
    return (
        <Modal show={show} onHide={onHide} size={'lg'} centered>
            <div className="modal-content p-2 m-0">
                <div className="modal-header header-border align-items-center justify-content-between p-0">
                    <h5 className="model-title text-lg-center">
                        Asign Rooms
                    </h5>
                    <button
                        type="button"
                        className="bg-red-600 btn-close position-static d-flex justify-content-center align-items-center"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        onClick={() => onHide()}>
                            <span aria-hidden="true"><XCircle className={' bg-red-500 rounded-full text-white'}
                                                              size={25}/></span>
                    </button>
                </div>
                <div className="modal-body p-0">
                    <div className="ag-theme-quartz ag-theme-mycustomtheme">
                        <AgGridReact<RoomProps>
                            pagination={false}
                            domLayout='autoHeight'
                            onGridReady={(params) => params.api.sizeColumnsToFit()}
                            columnDefs={RoomColumns}
                            rowData={domData}
                            onCellValueChanged={handleCellValueChange}
                        />
                    </div>
                </div>
                <div className="modal-footer footer-border align-items-center justify-content-between p-0">
                    <div className="col-12 text-end form-wizard-button">
                        <button className="btn btn-success text-black mr-4" onClick={(e) => {
                            e.preventDefault();
                            markAll();
                        }}>Alles selecteren
                        </button>
                        <button className="btn btn-secondary mr-4" onClick={(e) => {
                            e.preventDefault();
                            unMarkAll();
                        }}>Niets selecteren
                        </button>
                        <button className="btn btn-primary wizard-next-btn"
                                onClick={(e) => {
                                    e.preventDefault();
                                    asignHandle();
                                }}>
                            Opslaan
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export function AsignARoomModal({
                                    auth,
                                    customer,
                                    locatie,
                                    pageAuth,
                                    rooms,
                                    showModel,
                                    onHide,
                                }: asignRoomToClientProps) {
    const MySwal = withReactContent(Swal);
    const [projectsData, setProjectsData] = useState()
    const [writeAuth, setWriteAuth] = useState<boolean>(false);
    const [deleteAuth, setDeleteAuth] = useState<boolean>(false)
    const [asignedRooms, setAsignedRooms] = useState<CustomerAsignedRoomsDataProps[] | null>(null);
    const [asignableRooms, setAsignableRooms] = useState<RoomProps[] | null | undefined>();
    const [selectedRoomForAsign, setSelectedRoomForAsign] = useState<RoomProps[] | null>(null);
    useEffect(() => {
        if (customer) {
            const request = {
                CustomerID: customer.CustomerID,
                locatieID: locatie.id
            }
            console.log(request);
            axios.post('/api/getlocationsasignedrooms', request).then(resp => {
                if (resp.status == 200) {
                    if (Array.isArray(resp.data.asignedrooms))
                        setAsignedRooms(resp.data.asignedrooms);
                    else setAsignableRooms(null);
                }
            }).catch(err => {
                MySwal.fire({
                    title: 'Fout!',
                    text: 'Er is iets misgegaan.\n' + err,
                    confirmButtonText: 'OK',
                    customClass: {
                        confirmButton: 'btn btn-danger',
                    },
                });
            })
        }

        if (pageAuth?.children) {
            let contentAuth = pageAuth.children.find(x => x.page_name == `Klants`)
            if (contentAuth) {
                setWriteAuth(contentAuth.write);
                setDeleteAuth(contentAuth.delete)
            }
        }

    }, [auth, customer, locatie]);
    useEffect(() => {
        if (asignedRooms) {
            let roomList = rooms.filter(x => {
                x.percentage = 100;
                if (asignedRooms && asignedRooms.length > 0 && asignedRooms.some((z: any) => z.roomID == x.id)) {
                    let asign = asignedRooms.find(z => z.roomID == x.id.toString());
                    if (asign) {
                        if (asign.percentage < 100) {
                            x.percentage -= asign.percentage;
                            return x;
                        }
                    }
                } else {
                    return x;
                }
            })
            if (roomList)
                setAsignableRooms(roomList);
        }
    }, [asignedRooms]);
    const addAsignRoomHandler = (room: RoomProps, add: boolean) => {
        if (add) {
            if (selectedRoomForAsign && selectedRoomForAsign.some(x => x == room)) {
                let asignedRooms: RoomProps[] = selectedRoomForAsign.map(item => {
                    if (room.id == item.id) {
                        return room;
                    } else return item;
                });
                if (asignedRooms) {
                    setSelectedRoomForAsign(asignedRooms);
                }
            } else {
                setSelectedRoomForAsign(prevState => {
                    if (prevState) {
                        return [...prevState, room];
                    } else return [room];
                })
            }
        } else if (!add && selectedRoomForAsign && selectedRoomForAsign.some(x => x == room)) {
            let asignedRooms: RoomProps[] = selectedRoomForAsign.filter(item => item.id != room.id);
            if (asignedRooms) {
                setSelectedRoomForAsign(asignedRooms);
            }
        }
    }
    const handleCellValueChange = (event: any) => {
        const {column, data, newValue, oldValue} = event;
        if (column.colId === '1' && oldValue != newValue) {
            addAsignRoomHandler(data, true);
        }
    };
    const RoomColumns: ColDef[] = [
        {
            headerName: 'Selecteer',
            flex: 1,
            cellRenderer: (params: ICellRendererParams) => {
                const [iconType, setIconType] = useState(selectedRoomForAsign && selectedRoomForAsign.includes(params.data) ? true : false)
                return (<IconButton onClick={(e) => {
                    e.preventDefault();
                    addAsignRoomHandler(params.data, !iconType);
                    setIconType(!iconType);
                }} className={`btn-icon flex flex-row-reverse`}>
                    {iconType ?
                        (<MinusCircle className={'text-red-500 rounded-full w-full'} size={30}/>) :
                        (<PlusCircle className={'text-green-600 rounded-full w-full'} size={30}/>)}
                </IconButton>)
            }
        },
        {
            headerName: 'Percentage',
            flex: 1,
            editable: true,  // Hücreyi düzenlenebilir yapıyoruz.
            valueGetter: (params: ValueGetterParams) => {
                return params.data.percentage || 100; // Varsayılan olarak yüzde 100'ü alıyoruz.
            },
            valueSetter: (params: any) => {
                params.data.percentage = params.newValue;  // Girilen yeni değeri veri kaynağına atıyoruz.
                return true;
            },
            cellEditor: 'agTextCellEditor',  // Düzenleme için bir text editörü kullanıyoruz.
            cellRenderer: (params: ICellRendererParams) => {
                return (
                    <input
                        type="number"
                        value={params.value}
                        onChange={(e) => {
                            let updatedValue = parseInt(e.target.value);
                            params.node.setDataValue('percentage', updatedValue);
                        }}
                        min={0}
                        max={100}
                        className="form-control"
                    />
                );
            }
        },
        {
            headerName: "Floor Number",
            flex: 1,
            valueGetter: (params: ValueGetterParams) => {
                return `${params.data.floor_number}`;
            },
            cellRenderer: (params: ICellRendererParams) => {
                return (
                    <p>
                        {params.data.floor_number}
                    </p>
                );
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Room Number",
            flex: 1,
            valueGetter: (params: ValueGetterParams) => {
                return `${params.data.room_number}`;
            },
            cellRenderer: (params: ICellRendererParams) => {
                return (
                    <p>
                        {params.data.room_number}
                    </p>
                );
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Room Type",
            flex: 1,
            valueGetter: (params: ValueGetterParams) => {
                return `${params.data.room_type}`;
            },
            cellRenderer: (params: ICellRendererParams) => {
                return (
                    <p>
                        {params.data.room_type}
                    </p>
                );
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Usage Type",
            flex: 2,
            valueGetter: (params: ValueGetterParams) => {
                return `${params.data.useage_type}`;
            },
            cellRenderer: (params: ICellRendererParams) => {
                return (
                    <p>
                        {params.data.useage_type}
                    </p>
                );
            },
            filter: true, floatingFilter: true
        },
        {
            headerName: "Floor Square",
            flex: 1,
            valueGetter: (params: ValueGetterParams) => {
                return `${params.data.floor_square}`;
            },
            cellRenderer: (params: ICellRendererParams) => {
                return (
                    <p>
                        {params.data.floor_square}
                    </p>
                );
            },
            filter: true, floatingFilter: true
        },
    ];
    const asignHandle = () => {
        MySwal.fire({
            title: 'Zal worden opgeslagen.',
            text: 'Weet u zeker dat u de registratie wilt uitvoeren?',
            showCancelButton: true,
            confirmButtonText: 'OK',
            cancelButtonText: 'Annuleren',
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger',
            },
        }).then(result => {
            if (result.isConfirmed) {
                const request = {
                    customerID: customer?.CustomerID,
                    locatieID: locatie.id,
                    rooms: selectedRoomForAsign,
                }
                axios.post('/api/asignclientrooms', request).then(resp => {
                    if (resp.status == 200) {
                        MySwal.fire({
                            title: 'Basarili',
                            text: '...',
                            confirmButtonText: 'OK',
                            customClass: {
                                confirmButton: 'btn btn-success',
                            },
                        }).then(()=>{
                            window.location.reload();
                        });
                    } else if (resp.status == 300) {
                        MySwal.fire({
                            title: 'Error 300',
                            text: resp.data,
                            confirmButtonText: 'OK',
                        })
                    }
                }).catch(err => {
                    console.log('save error', err);
                })
            } else {
                MySwal.fire({
                    title: 'Geannuleerd',
                    text: 'Gebruikersaccount is nog steeds inactief',
                    confirmButtonText: 'OK',
                    customClass: {
                        confirmButton: 'btn btn-success',
                    },
                });
            }
        }).catch(error => {
            MySwal.fire({
                title: 'Fout!',
                text: 'Er is iets misgegaan.\n' + error,
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'btn btn-danger',
                },
            });
        });
    }
    const markAll = () => {
        if (asignableRooms) setSelectedRoomForAsign(asignableRooms);
    }
    return (
        <div className={'z-20'}>
            <Modal show={showModel} onClose={onHide} centered={true} size={'xl'}>
                <div className="modal-content p-2 m-0">
                    <div className="modal-header header-border align-items-center justify-content-between p-0">
                        <h5 className="model-title text-lg-center">
                            Asign Rooms
                        </h5>
                        <button
                            type="button"
                            className="bg-red-600 btn-close position-static d-flex justify-content-center align-items-center"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={() => onHide()}>
                            <span aria-hidden="true"><XCircle className={' bg-red-500 rounded-full text-white'}
                                                              size={25}/></span>
                        </button>
                    </div>
                    <div className="modal-body p-0">
                        <div className="ag-theme-quartz ag-theme-mycustomtheme">
                            <AgGridReact<RoomProps>
                                pagination={false}
                                domLayout='autoHeight'
                                onGridReady={(params) => params.api.sizeColumnsToFit()}
                                columnDefs={RoomColumns}
                                rowData={asignableRooms}
                                onCellValueChanged={handleCellValueChange}
                            />
                        </div>
                    </div>
                    <div className="modal-footer footer-border align-items-center justify-content-between p-0">
                        <div className="col-12 text-end form-wizard-button">
                            <button className="btn btn-secondary mr-4" onClick={(e) => {
                                e.preventDefault();
                                markAll();
                            }}>Opnieuw instellen
                            </button>
                            <button className="btn btn-primary wizard-next-btn"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        asignHandle();
                                    }}>
                                Opslaan
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
