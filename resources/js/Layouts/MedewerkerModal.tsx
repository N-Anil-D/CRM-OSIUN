import React, {useState, useEffect, PropsWithChildren} from "react";
import {Modal} from "react-bootstrap";
import {
    XCircle, Smartphone,
    Phone, AtSign, Map, MapPin, Home, UserPlus
} from "react-feather";
import {CustomerProps, MedewerkerDataProps} from "@/types/globalProps";
import axios from "axios";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import ReactDatePicker from "react-datepicker";
import {SelectButton, SelectButtonChangeEvent} from "primereact/selectbutton";

export function AddMedewerker({
                                  showModel,
                                  setShowModel,
                                  onHide,
                                  editPerson
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
    const genders: { value: string, label: string }[] = [
        {value: 'man', label: 'Man'},
        {value: 'vrouw', label: 'Vrouw'},
        {value: 'manvrouw', label: 'Man Vrouw'},
        {value: 'onbekend', label: 'Onbekend'}
    ];
    const selectButtonOptions: string[] = ['Ja', 'Nee'];
    const [value, setValue] = useState<string>(selectButtonOptions[0]);

    const today = new Date();
    const treeMLater = new Date(today);
    treeMLater.setMonth(today.getMonth() + 3);
    const [editData, setEditData] = useState(false);
    const [selectedEmpTpe, setSelectedEmpType] = useState<{ value: number; label: string }>();
    const [selectedContractType, setSelectedContractType] = useState<{ value: number; label: string }>();
    const [isDate, setIsDate] = useState<number>(0);
    const [selectedTitle, setSelectedTitle] = useState(titles[0]);
    const [proeftijdDate, setProeftijdDate] = useState<Date>(new Date(treeMLater));
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
    const ContractOptions: { value: number; label: string }[] = [{value: 1, label: 'Eigen medewerker'},
        {value: 2, label: 'Uitzendkracht'},
        {value: 3, label: 'ZZP'},
        {value: 4, label: 'Inleen'},];
    const ContractTypeOptions = [{value: 1, label: 'Vast'},
        {value: 2, label: 'Tijdelijk'},]
    useEffect(() => {
        if (editPerson) {
            setData(editPerson);
            setEditData(true);
        } else {
            setData({
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
            });
            setEditData(false);
        }
    }, [editPerson]);
    const save = (event: any) => {
        if (isDate) setData(prevState => ({
            ...prevState,
            proeftijd: proeftijdDate
        }))
        event.preventDefault();
        if (editData && editPerson && data.id && data.id != 0) {
            alert('update');
            axios.post('/api/medewerkersupdate', data).then((response) => {
                onHide(response.data[0] as MedewerkerDataProps, true);
                alert('başarılı');
                window.location.reload();
            }).catch((error) => {
                console.log(error);
                alert('hata\n' + error.toString());
            });
        } else {
            alert('Store')
            axios.post('/api/medewerkersstore', data).then((response) => {
                if (response.status == 200) {
                    window.location.reload();
                } else console.log(response);
            }).catch((error) => {
                console.log(error);
                alert('hata\n' + error.toString());
            });
        }
    }
    const handleDateChange1 = (date: Date) => {
        setData(prev => ({
            ...prev,
            date_of_birth: date
        }))
    };

    const customStyles = {
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.isFocused ? "#a682ed" : "#fff",
            color: state.isFocused ? "#fff" : "#000",
            "&:hover": {
                backgroundColor: "#a682ed",
            },
        }),
    };
    return (
        <Modal className={'pt-2'} key={'modalOfAddContact'} centered show={showModel} size={'lg'}>
            <div className="modal-dialog-centered modal-lg" role={'document'}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h6 className="modal-title">Nieuwe Contactpersoon
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
                                                    <label className="col-form-label">Titel</label>
                                                    <Select
                                                        id={'titleSelect'}
                                                        value={selectedTitle}
                                                        styles={customStyles}
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
                                                    <label className="col-form-label">Voornaam</label>
                                                    <input
                                                        type="text" className="form-control"
                                                        value={data.first_name}
                                                        onChange={(e) => {
                                                            setData(prev => ({...prev, first_name: e.target.value}))
                                                        }}/>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="input-block mb-1">
                                                    <label className="col-form-label">Tussenvoegsel</label>
                                                    <input
                                                        type="text" className="form-control"
                                                        value={data.tussen}
                                                        onChange={(e) => {
                                                            setData(prev => ({...prev, tussen: e.target.value}))
                                                        }}/>
                                                </div>
                                            </div>
                                            <div className="col-md-3">

                                                <div
                                                    className="input-block mb-1">
                                                    <label className="col-form-label">Achternaam</label>
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
                                                    <label className="col-form-label">E-mailadres</label>
                                                    <input type="text" className="form-control"
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
                                                    <label className="col-form-label">Telefoonnummer</label>
                                                    <div className="input-group">
                                                        <span className="text-center input-group-text"
                                                              id="basic-addon1">
                                                            <Phone size={20}/>
                                                        </span>
                                                        <div className="col-lg-10">
                                                            <input type="text" className="form-control-sm col-md-12"
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
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label className="col-form-label">Geslacht</label>
                                                <div className="input-group">
                                                <span className="input-group-text" id="basic-addon1">
                                                    <i className={'fa fa-transgender'}/>
                                                </span>
                                                    <div className="col-lg-10">
                                                        <Select
                                                            id={'genderSelect'}
                                                            options={genders}
                                                            placeholder={'Selecteer'}
                                                            styles={customStyles}
                                                            value={data.gender}
                                                            onChange={(e: any) => {
                                                                if (e) {
                                                                    setData(prevState => ({
                                                                        ...prevState,
                                                                        gender: e.value
                                                                    }))
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-8">
                                                <div
                                                    className="form-control-sm input-block mb-3 row flex items-center justify-center">
                                                    <label className="col-form-label">
                                                        Adres
                                                    </label>
                                                    <div className="input-group">
                                                        <span className="input-group-text" id="basic-addon1">
                                                            <Map size={20}/>
                                                        </span>
                                                        <div className="col-lg-10">
                                                            <input
                                                                type="text" className="form-control-sm col-md-12"
                                                                value={data.address}
                                                                onChange={(e) => {
                                                                    setData(prev => ({
                                                                        ...prev,
                                                                        address: e.target.value
                                                                    }))
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className="col-md-4">
                                                <div
                                                    className="form-control-sm input-block mb-3 row flex items-center justify-center">
                                                    <label className="col-form-label">
                                                        Huisnummer
                                                    </label>
                                                    <div className="col-lg-12">
                                                        <input type="text" className="form-control-sm col-md-12"
                                                               value={data.house_number}
                                                               onChange={(e) => {
                                                                   setData(prev => ({
                                                                       ...prev,
                                                                       house_number: e.target.value
                                                                   }))
                                                               }}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div
                                            className="form-control-sm input-block mb-3 row flex items-center justify-center">
                                            <h6 className="form-control-sm col-lg-3 col-form-h6">
                                                Postcode
                                            </h6>
                                            <div className="form-control-sm col-lg-9">
                                                <div className="input-group">
                                                <span className="input-group-text" id="basic-addon1">
                                                    <i className={'fa fa-address-book'}/>
                                                </span>
                                                    <div className="col-lg-11">
                                                        <input type="text" className="form-control-sm col-md-12"
                                                               value={data.postal_code}
                                                               onChange={(e) => {
                                                                   setData(prev => ({
                                                                       ...prev,
                                                                       postal_code: e.target.value
                                                                   }))
                                                               }}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="form-control-sm input-block mb-3 row flex items-center justify-center">
                                            <h6 className="form-control-sm col-lg-3 col-form-h6">
                                                Woonplaats
                                            </h6>
                                            <div className="form-control-sm col-lg-9">
                                                <div className="input-group">
                                                <span className="input-group-text" id="basic-addon1">
                                                    <Home size={20}/>
                                                </span>
                                                    <div className="col-lg-11">
                                                        <input type="text" className="form-control-sm col-md-12"
                                                               value={data.residence}
                                                               onChange={(e) => {
                                                                   setData(prev => ({
                                                                       ...prev,
                                                                       residence: e.target.value
                                                                   }))
                                                               }}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="form-control-sm input-block mb-3 row flex items-center justify-center">
                                            <h6 className="form-control-sm col-lg-3 col-form-h6">
                                                Geboortedatum
                                            </h6>
                                            <div className="form-control-sm col-lg-9">
                                                <div className="input-group">
                                                <span className="input-group-text" id="basic-addon1">
                                                    <i className={'fa fa-cake-candles'}/>
                                                </span>
                                                    <div className="col-lg-11">
                                                        <ReactDatePicker
                                                            selected={data.date_of_birth}
                                                            onChange={handleDateChange1}
                                                            className="form-control floating datetimepicker"
                                                            dateFormat="dd-MM-yyyy"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="form-control-sm input-block mb-3 row flex items-center justify-center">
                                            <h6 className="form-control-sm col-lg-3 col-form-h6">
                                                Datum inschrijving
                                            </h6>
                                            <div className="form-control-sm col-lg-9">
                                                <div className="input-group">
                                                <span className="input-group-text" id="basic-addon1">
                                                    <AtSign size={20}/>
                                                </span>
                                                    <div className="col-lg-11">
                                                        <ReactDatePicker
                                                            selected={data.start_date}
                                                            onChange={(date) => {
                                                                if (date) setData(prev => ({
                                                                    ...prev,
                                                                    start_date: date
                                                                }))
                                                            }}
                                                            className="form-control floating datetimepicker"
                                                            dateFormat="dd-MM-yyyy"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-end">
                                            <button type="submit" className="btn btn-primary">
                                                Gereed
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
