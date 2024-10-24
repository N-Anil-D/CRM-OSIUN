import Select, {GroupBase, Props as SelectProps, SelectInstance} from 'react-select';
import React, {useEffect, useState, useRef, ReactElement, LegacyRef} from "react";
import axios from "axios";
import {Link} from "@inertiajs/react";
import {
    Camera, CameraOff, Trash2, UserPlus, Mail, List,
    ArrowRight
} from "react-feather";
import CameraComponent from '@/Components/CameraComponent';
import {Modal, Button} from 'react-bootstrap';
import {
    RoomProps,
    BuildingProps,
    CustomerProps,
    TicketsDataProps,
    OtherUsersProps
} from "@/types/globalProps";
import {User} from '@/types';
import {Mention, MentionSearchEvent, MentionItemTemplateOptions} from 'primereact/mention';
import {getFormSubmissionInfo} from "react-router-dom/dist/dom";

interface AddProps {
    customer: CustomerProps[];
    user: User;
    buildings: BuildingProps[];
    islocationDetail: boolean;
    otherUsers: OtherUsersProps[];
    ticketDataHandler: (newTicket: TicketsDataProps) => void;
    AddTicketModelShow: boolean;
    onHide: () => void;
}

interface UpProps {
    customer: CustomerProps[];
    user: User;
    buildings: BuildingProps[];
    islocationDetail: boolean;
    ticket: TicketsDataProps;
    otherUsers: OtherUsersProps[];
    ticketDataHandler: (newTicket: TicketsDataProps) => void;
    UpTicketModelShow: boolean;
    onHide: () => void;
}

interface DomProps {
    value: number;
    label: string;
}

interface SubjectBoxProps {
    otherUsers: {
        value: number;
        label: string
    }[] | null;
    mentionUsers: {
        value: number;
        label: string;
    }[] | null;
    setMetionUsers: React.Dispatch<React.SetStateAction<{
        value: number;
        label: string;
    }[] | null>>;
    takeValue: (e: any) => void;
    value: string;
}

function groupOtherUserData(unGroupedData: OtherUsersProps[], customer: CustomerProps[]) {
    const grouped = unGroupedData.reduce((acc, current) => {
        const key = `${current.id}-${current.name}-${current.roleName}`; // userid ve username birleştirerek benzersiz key
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(current);
        return acc;
    }, {} as Record<string, typeof unGroupedData>);
    const options = Object.keys(grouped).map(groupKey => {
        const [id, username, roleName] = groupKey.split('-'); // Key'den userid ve username ayrıştırılıyor

        const relatedData = grouped[groupKey][0];

        return {
            value: parseInt(id), // Burada userid sayıya dönüştürülüyor
            label: username + ' - ' + (roleName != 'Client' && roleName != 'user' ? 'Osius' : customer.find(x => x.CustomerID == relatedData.customerid)?.Unvan) + (roleName == 'admin' ? ' - Admin' : ''),
        };
    });
    return options
}

const UpTicket: React.FC<UpProps> = ({
                                         ticketDataHandler,
                                         otherUsers,
                                         customer,
                                         user,
                                         buildings,
                                         islocationDetail,
                                         ticket,
                                         UpTicketModelShow,
                                         onHide
                                     }) => {

    const buildSelectRef = useRef<SelectInstance<any, false, GroupBase<any>>>(null);
    const userRef = useRef<SelectInstance<any, false, GroupBase<any>>>(null);
    const [buildingDomOptions, setBuildingDomOptions] = useState<{ value: number; label: string }[]>([]);
    const [updateTicket, setUpdateTicket] = useState(ticket);
    const [customerOptions, setCustomerOptions] = useState<any[]>(customer?.map((item) => ({
        value: item.CustomerID,
        label: item.Unvan,
    })) || [])
    const [ticketToOptions, setTicketToOptions] = useState<{
        value: number;
        label: string
    }[] | null>(otherUsers.map(x => ({value: x.id, label: x.name})))
    const [mentionedUsers, setMentionedUsers] = useState<OtherUsersProps[] | null>(null)
    const [selectedMentionedPersons, setSelectedMentionedPersons] = useState<{
        value: number;
        label: string;
    }[] | null>(null);
    const [selectedCustomer, setSelectedCustomer] = useState(updateTicket
        ? customerOptions.find(option => option.value === updateTicket.customer)
        : null)
    const [selectedBuilding, setSelectedBuilding] = useState(updateTicket
        ? buildingDomOptions.find(option => option.value.toString() === updateTicket.building.toString())
        : null);
    const ticketTypeOptions = [
        {value: 'complimenten', label: 'Complimenten'},
        {value: 'comentaar', label: 'Comentaar'},
        {value: 'vraag', label: 'Vraag'},
        {value: 'klacht', label: 'Klacht'},
        {value: 'Melding', label: 'Melding'},
        {value: 'Extrawerk', label: 'Extra werk'},
        {value: 'Ongegrond', label: 'Ongegrond'},
    ]
    const [selectedTicketType, setSelectedTicketType] = useState(updateTicket
        ? ticketTypeOptions.find(option => option.value === updateTicket.ticket_type)
        : null);
    const [selectedTicketTo, setSelectedTicketTo] = useState({
        label: updateTicket.ticket_to,
        value: -1
    })

    const [isCustomerValueDisabled, setCustomerValueDisabled] = useState<boolean>(false);
    const [isBuildingValueDisabled, setBuildingValueDisabled] = useState<boolean>(false);
    useEffect(() => {
        setUpdateTicket(ticket);
        fetchOptions();
        if (user.roleName != 'Client' && user.roleName != 'user') {
            setBuildingDomOptions(prevState => [{value: -1, label: 'Alle'}, ...prevState]);
            setCustomerOptions(prevState => [{value: 'ALL', label: 'Alle'}, ...prevState]);
        }
        if (customerOptions.length == 1) {
            setSelectedCustomer(customerOptions[0]);
            setCustomerValueDisabled(true);
        }
        if (buildingDomOptions.length == 1) {
            setSelectedBuilding(buildingDomOptions[0]);
            setBuildingValueDisabled(true);
        }
    }, [, buildings, ticket, customer]);
    const groupOtherUserData = (unGroupedData: OtherUsersProps[]) => {
        const grouped = unGroupedData.reduce((acc, current) => {
            const key = `${current.id}-${current.name}-${current.roleName}-${current.customerid}`; // userid ve username birleştirerek benzersiz key
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(current);
            return acc;
        }, {} as Record<string, typeof unGroupedData>);
        const options = Object.keys(grouped).map(groupKey => {
            const [id, username, roleName, customerid] = groupKey.split('-'); // Key'den userid ve username ayrıştırılıyor

            return {
                value: parseInt(id), // Burada userid sayıya dönüştürülüyor
                label: username + ' - ' + (roleName != 'Client' && roleName != 'user' ? 'Osius' : customer.find(x => x.CustomerID == customerid)?.Unvan) + (roleName == 'admin' ? ' - Admin' : ''),
            };
        });
        return options
    }
    const fetchTicketToOptions = () => {
        let oothers = otherUsers;
        if (selectedCustomer && selectedCustomer.value != 'ALL') {

            oothers = oothers.filter(x => (x.customerid == selectedCustomer.value || !x.customerid));
        }
        if (selectedBuilding && selectedBuilding.value != -1) {

            oothers = oothers.filter(x => (x.buildid == selectedBuilding.value || !x.customerid));
        }

        setTicketToOptions(groupOtherUserData(oothers));
    }
    useEffect(() => {
        fetchTicketToOptions();
    }, [selectedBuilding]);
    useEffect(() => {
        fetchTicketToOptions();
        if (selectedCustomer?.value != 'ALL') {
            let klant = customer.find(x => x.CustomerID == selectedCustomer?.value);
            if (klant && klant.assigned_locations) {
                let locs = klant.assigned_locations.map(loc => loc.locationid);
                setBuildingDomOptions([{
                    value: -1,
                    label: 'Alle'
                }, ...buildings.filter(x => locs.includes(x.id)).map((item: BuildingProps) => ({
                    value: item.id,
                    label: item.BuildingName
                }))]);
            }
        } else {
            setBuildingDomOptions([{value: -1, label: 'Alle'}, ...buildings.map((item: BuildingProps) => ({
                value: item.id,
                label: item.BuildingName
            }))]);
        }
    }, [selectedCustomer]);
    const fetchLocationOptions = (building_id: number) => {
        updateTicket.building = building_id.toString();
        setSelectedBuilding(buildingDomOptions.find(x => x.value == building_id) ?? {
            value: -1,
            label: 'cannot find'
        });
        if (userRef.current) userRef.current.clearValue();
    };
    const fetchOptions = () => {
        let DomOpt = customer?.map((item) => ({
            value: item.CustomerID,
            label: item.Unvan,
        }));
        setCustomerOptions([{value: 'ALL', label: 'Alle'}, ...DomOpt]);
        let bDomOpt = buildings.map((item: BuildingProps) => ({
            value: item.id, label: item.BuildingName
        }))
        setBuildingDomOptions([{value: -1, label: 'Alle'}, ...bDomOpt]);

        setSelectedBuilding(buildingDomOptions.find(x => x.value.toString() === updateTicket.building))

    };
    const fetchCustomerOptions = (customerId: string) => {
        setUpdateTicket(prevState => ({
            ...prevState,
            customer: customerId,
        }));
        if (userRef.current) userRef.current.clearValue();
    };
    const handleUpdateTicketSend = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const request = new FormData();
            request.append('id', updateTicket.id.toString());
            request.append('opener_name', updateTicket.opener_name);
            request.append('customer', updateTicket.customer);
            request.append('building', updateTicket.building.toString());
            request.append('room', updateTicket.refnum);
            request.append('title', updateTicket.title);
            request.append('ticketsubject', updateTicket.ticketsubject);
            request.append('status', updateTicket.status);
            request.append('ticket_type', updateTicket.ticket_type);
            request.append('delete', '0');
            request.append('ticket_to', updateTicket.ticket_to);
            const userIds = otherUsers.map(item => item.id).join(',');
            if (updateTicket.ticket_to == "") {
                request.append('userIds', userIds);
            } else {
                const userID = otherUsers.find(item => (item.name === updateTicket.ticket_to))?.id;
                if (userID) request.append('userIds', userID.toString());
            }
            if (selectedFiles.length > 0) selectedFiles.forEach((file) => {
                request.append('files[]', file);
            });
            axios.post('/api/tickets/update', updateTicket).then(response => {
                ticketDataHandler(response.data[0]);
                onHide();
            }).catch(err => {

                console.error('There is an error accured while adding a ticket:', err);
            });
            //return response.data; // Eklendikten sonra dönen veriyi işlemek için isteğin yanıtını döndürebilirsiniz
        } catch (error) {
            console.error('There is an error accured while adding a ticket:', error);
            throw error; // Hata durumunda hatayı yakalayabilir veya yukarıya iletebilirsiniz
        }

    };
    const UpdateTicketSendChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setUpdateTicket(prevState => ({
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
    useEffect(() => {
        setSelectedCustomer(updateTicket
            ? customerOptions.find(option => option.value === updateTicket.customer)
            : null);
        setSelectedBuilding(updateTicket
            ? buildingDomOptions.find(option => option.value.toString() === updateTicket.building.toString())
            : null);

        if (updateTicket && updateTicket.ticket_to != "" && updateTicket.ticket_to != null) {
            setSelectedTicketTo({
                label: updateTicket.ticket_to,
                value: -1
            });
        } else {
            setSelectedTicketTo({
                label: "Please Select a User or Not...",
                value: -1
            });
        }
    }, [updateTicket, buildingDomOptions]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const handleFileChange = (e: any) => {
        const files: File[] = Array.from(e.target.files || []);
        const totalSize = files.reduce((acc, file) => acc + file.size, 0);
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes

        if (totalSize > maxSize) {
            alert('Total file size should not exceed 25MB');
            e.target.value = ''; // Clear the file input
            return;
        }
        setSelectedFiles(files);
    };
    const mentionedPersonFetch = (e: any) => {
        if (e) {
            setSelectedMentionedPersons(e);
            if (mentionedUsers && mentionedUsers.length > e.length) {
                setMentionedUsers(prev => {
                    if (prev && selectedMentionedPersons)
                        return prev.filter(x => e.some((z: any) => z.value == x.id));
                    else return [];
                })
            }
            if (Array.isArray(e)) {
                e.forEach(item => {
                    let finduser = otherUsers.find(i => i.id == item.value);
                    if (finduser) {
                        setMentionedUsers(prevState => {
                                if (prevState && !prevState.some(t => t.id == finduser.id)) {
                                    return [...prevState, finduser]
                                } else if (!prevState)
                                    return [finduser];
                                else
                                    return prevState;
                            }
                        )
                    }
                })
            }
        }
    }
    useEffect(() => {
        if (mentionedUsers && mentionedUsers.length > 0 && selectedMentionedPersons && selectedMentionedPersons.length < mentionedUsers.length) {

            mentionedUsers.forEach(item => {
                setSelectedMentionedPersons(prev => {
                    if (prev) {
                        let newSelections = [...prev];
                        mentionedUsers.forEach(item => {
                            if (!newSelections.some(x => x.value == item.id)) {
                                newSelections.push({value: item.id, label: item.name});
                            }
                        });
                        return newSelections;
                    } else if (!prev) {
                        return [{value: item.id, label: item.name}];
                    } else {
                        return prev;
                    }
                })
            })
        }
    }, [mentionedUsers]);
    return (
        <Modal show={UpTicketModelShow} onHide={onHide} className={'z-30'} size="lg" centered>
            <div className="modal-dialog-centered modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Melding bewerken</h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={onHide}
                        >
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form id='ticketUpdate' onSubmit={handleUpdateTicketSend} method='post'>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="input-block mb-3">
                                        <label className="col-form-label">Titel</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            name='title'
                                            value={updateTicket?.title}
                                            onChange={UpdateTicketSendChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="input-block mb-3">
                                        <label className="col-form-label">Melding ID</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            readOnly
                                            name='id'
                                            value={updateTicket?.id}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-4">
                                    <div className="input-block mb-3">
                                        <label className="col-form-label">Bedrijf</label>
                                        <Select
                                            id="customerSelect"
                                            options={customerOptions}
                                            value={selectedCustomer}
                                            isDisabled={isCustomerValueDisabled}
                                            styles={customStyles}
                                            onChange={(e: any) => {
                                                if (e) {
                                                    fetchCustomerOptions(e.value);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="input-block mb-3">
                                        <label className="col-form-label">Locatie</label>
                                        {islocationDetail ? <input className="form-control" type="text"
                                                                   value={buildings[0].BuildingName}/>
                                            : <Select id='buildingSelect'
                                                      ref={buildSelectRef}
                                                      options={buildingDomOptions}
                                                      defaultValue={selectedBuilding}
                                                      styles={customStyles}
                                                      isClearable={true}
                                                      isSearchable={true}
                                                      isDisabled={isBuildingValueDisabled}
                                                      onChange={(e: any) => {
                                                          if (e) {
                                                              fetchLocationOptions(e.value);
                                                          }
                                                      }
                                                      }
                                            />}
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="input-block mb-3">
                                        <label className="col-form-label">Referentienummer</label>
                                        <input className="form-control"
                                               type="text"
                                               onChange={UpdateTicketSendChange}
                                               name='refnum'
                                               value={updateTicket?.refnum}/>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="input-block mb-3">
                                        <label className="col-form-label">Selecteer Persoon</label>
                                        <Select id='ticketToSelect'
                                                options={ticketToOptions ?? []}
                                                placeholder={"Kies een persoon of voor iedereen "}
                                                isClearable={true}
                                                isSearchable={true}
                                                isMulti={true}
                                                styles={customStyles}
                                                value={selectedTicketTo}
                                                onChange={mentionedPersonFetch}/>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="input-block mb-3">
                                        <label className="col-form-label">Melding Type</label>
                                        <Select id={'typeSelect'}
                                                options={ticketTypeOptions}
                                                value={selectedTicketType}
                                                isClearable={true}
                                                isSearchable={true}
                                                styles={customStyles}
                                                onChange={(e: any) => {
                                                    updateTicket.ticket_type = e.value;
                                                    setSelectedTicketType(ticketTypeOptions.find(option => option.value === updateTicket.ticket_type))
                                                }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="input-block mb-3">
                                        <label className="col-form-label">Volledige omschrijving van uw melding</label>
                                        <SubjectBox value={updateTicket?.ticketsubject}
                                                    otherUsers={ticketToOptions}
                                                    takeValue={(e) => (handleFileChange(e))}
                                                    setMetionUsers={setSelectedMentionedPersons}
                                                    mentionUsers={selectedMentionedPersons}/>
                                    </div>
                                    <div className="input-block mb-3">
                                        <label className="col-form-label">Update Bestanden</label>
                                        <input className="form-control" type="file"/>
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
                                    Opslaan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

const SubjectBox: React.FC<SubjectBoxProps> = ({
                                                   otherUsers,
                                                   setMetionUsers,
                                                   mentionUsers,
                                                   takeValue,
                                                   value
                                               }: SubjectBoxProps) => {
    const [suggestions, setSuggestions] = useState<{
        value: number;
        label: string;
    }[] | undefined>([]);
    const onMultipleSearch = (event: MentionSearchEvent) => {
        const trigger = event.trigger;
        if (trigger === '@' && otherUsers) {
            setTimeout(() => {
                const query = event.query;
                let suggestions;
                if (!query.trim().length) {
                    suggestions = [...otherUsers];
                    suggestions = otherUsers.filter((user) => {
                        return user.label.toLowerCase().startsWith(query.toLowerCase());
                    });
                }
                setSuggestions(suggestions);
            }, 250);
        }
    }
    const itemTemplate = (suggestion: any) => {
        return (
            <div className="hover:bg-purple-200 bg-gray-300 flex flex-row align-items-center card rounded-4 m-1 p-1"
                 style={{width: '20rem'}}>
                <UserPlus size={30}
                          className={'rounded-full w-12'}/>
                <span className="flex flex-column ml-2">
                    {suggestion.label}
                    <small style={{fontSize: '.75rem', color: 'var(--text-color-secondary)'}}>
                        {suggestion.value}
                    </small>
                </span>
            </div>
        );
    }
    const multipleItemTemplate = (suggestion: any, options: MentionItemTemplateOptions) => {
        const trigger = options.trigger;
        if (trigger === '@' && suggestion.label) {
            return itemTemplate(suggestion);
        }
        return null;
    }
    const onSelect = (e: any) => {
        const selectedUser: any = e.suggestion;
        if (mentionUsers && !mentionUsers.some(m => (m.label == selectedUser.label)))
            setMetionUsers(prevState => (prevState ? [...prevState, selectedUser] : [selectedUser]));
        else if (!mentionUsers) setMetionUsers(selectedUser);
    };
    const onInputChange = (e: any) => {
        const value = e.target.value;
        takeValue(value);
        const words = value.split(' ');
        const lastWord = words[words.length - 1];
        if (mentionUsers) {
            let mentionwords: string[] = words.filter((x: string) => x.startsWith('@'));

            if (mentionwords.length !== mentionUsers.length) {
                let users = otherUsers?.filter(x => mentionwords.includes(`@${x.label.replace(/\s+/g, '')}`));
                if (users && users.length == mentionwords.length) {
                    setMetionUsers(users);
                }
            }
        }
        if (lastWord.startsWith('@') && otherUsers) {
            const mention = lastWord.substring(1);
            const existingMention = otherUsers.find(user => user.label.toLowerCase() === mention.toLowerCase());
            if (existingMention && !mentionUsers?.some(m => m.label === existingMention.label)) {
                setMetionUsers(prevState => (prevState ? [...prevState, existingMention] : [existingMention]));
            }
        }
    };
    return (
        <div>
            <Mention
                trigger={'@'}
                suggestions={suggestions}
                onSearch={onMultipleSearch}
                onSelect={onSelect}
                onChange={onInputChange}
                itemTemplate={multipleItemTemplate}
                value={value}
                field="label"
                placeholder="Type @ to mention"
                cols={90}
                rows={5}
            />
        </div>
    );
};
const AddTicket: React.FC<AddProps> = ({
                                           ticketDataHandler,
                                           otherUsers,
                                           customer,
                                           user,
                                           buildings,
                                           islocationDetail,
                                           AddTicketModelShow,
                                           onHide
                                       }) => {
    const userRef = useRef<SelectInstance<any, false, GroupBase<any>>>(null);
    const [mentionedUsers, setMentionedUsers] = useState<OtherUsersProps[] | null>(null)
    const [selectedMentionedPersons, setSelectedMentionedPersons] = useState<{
        value: number;
        label: string;
    }[] | null>(null);

    const [buildingDomOptions, setBuildingDomOptions] = useState<{
        value: number;
        label: string
    }[]>
    ([...buildings.map((item: BuildingProps) => ({
        value: item.id,
        label: item.BuildingName
    }))]);
    const [customerDomOptions, setCustomerDomOptions] = useState(
        [...customer?.map((item) => ({
            value: item.CustomerID,
            label: item.Unvan
        }))]);
    const [selectedCustomerValue, setSelectedCustomerValue] = useState<{ value: string; label: string }[] | null>(null);
    const [selectedBuildingValue, setSelectedBuildingValue] = useState<{ value: number; label: string }[] | null>(null);
    const [isCustomerValueDisabled, setCustomerValueDisabled] = useState<boolean>(false)
    const [isBuildingValueDisabled, setBuildingValueDisabled] = useState<boolean>(false)
    const [ticketToOptions, setTicketToOptions] = useState<{
        value: number;
        label: string
    }[] | null>(groupOtherUserData(otherUsers, customer));
    const [formData, setFormData] = useState<TicketsDataProps>({
        id: 0,
        opener_name: user.name,
        customer: customer[0].CustomerID,
        building: "-1",
        refnum: "",
        status: "New",
        title: "",
        delete: "0",
        created_at: new Date(),
        updated_at: new Date(),
        ticketsubject: "",
        ticket_to: "",
        ticket_type: "new",
    });
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [suggestions, setSuggestions] = useState<OtherUsersProps[]>([]);
    const [showCamera, setShowCamera] = useState(false);
    const toggleCamera = () => {
        setShowCamera(prevState => !prevState);
    };
    const handleFileChange = (e: any) => {
        const files: File[] = Array.from(e.target.files || []);
        const totalSize = files.reduce((acc, file) => acc + file.size, 0);
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes

        if (totalSize > maxSize) {
            alert('Total file size should not exceed 25MB');
            e.target.value = ''; // Clear the file input
            return;
        }
        setSelectedFiles(files);
    };
    useEffect(() => {
        setFormData(prevState => ({
            ...prevState,
            opener_name: user.name
        }));
        if (user.roleName != 'Client' && user.roleName != 'user') {
            setBuildingDomOptions(prevState => [{value: -1, label: 'Alle'}, ...prevState]);
            setCustomerDomOptions(prevState => [{value: 'ALL', label: 'Alle'}, ...prevState]);
        }
        if (customerDomOptions.length == 1) {
            setSelectedCustomerValue([customerDomOptions[0]]);
            setCustomerValueDisabled(true);
            setFormData(prevState => ({
                ...prevState,
                customer: customerDomOptions[0].value
            }));
        }
        if (buildingDomOptions.length == 1) {
            setSelectedBuildingValue([buildingDomOptions[0]]);
            setBuildingValueDisabled(true);
            setFormData(prevState => ({
                ...prevState,
                building: buildingDomOptions[0].value.toString()
            }));
        }
    }, [user]);
    useEffect(() => {
        if (islocationDetail) {
            fetchClientOptions('ALL');
            fetchLocationOptions(buildings[0].id);
            formData.customer = 'ALL';
            formData.building = buildings[0].id.toString();
        }
    }, [buildings]);
    useEffect(() => {
        fetchTicketToOptions();
    }, [selectedBuildingValue]);
    useEffect(() => {
        fetchTicketToOptions();
        if (selectedCustomerValue && selectedCustomerValue.length > 0 && Array.isArray(selectedCustomerValue) && !selectedCustomerValue.some(x => x.value == 'ALL')) {
            setBuildingDomOptions([{
                value: -1,
                label: 'Alle'
            }]);
            selectedCustomerValue.forEach(item => {
                let klant = customer.find(x => x.CustomerID == item.value);
                if (klant && klant.assigned_locations) {
                    let locs = klant.assigned_locations.map(loc => loc.locationid);
                    setBuildingDomOptions(prevState => [
                        ...prevState,
                        ...buildings
                            .filter(x => locs.includes(x.id))
                            .filter(x => !prevState.some(t => t.value == x.id))
                            .map((item: BuildingProps) => ({
                                value: item.id,
                                label: item.BuildingName
                            }))
                    ]);
                }
            })
        } else {
            setBuildingDomOptions([{value: -1, label: 'Alle'}, ...buildings.map((item: BuildingProps) => ({
                value: item.id,
                label: item.BuildingName
            }))]);
        }
    }, [selectedCustomerValue]);
    const fetchTicketToOptions = () => {
        let oothers = otherUsers;
        if (selectedCustomerValue && Array.isArray(selectedCustomerValue) && !selectedCustomerValue.some(x => x.value == 'ALL')) {

            oothers = oothers.filter(x => (selectedCustomerValue.some(z => z.value == x.customerid) || !x.customerid));
        }
        if (selectedBuildingValue && Array.isArray(selectedBuildingValue) && !selectedBuildingValue.some(x => x.value == -1)) {

            oothers = oothers.filter(x => (selectedBuildingValue.some(z => z.value == x.buildid) || !x.customerid));
        }

        setTicketToOptions(groupOtherUserData(oothers, customer));
    }

    const fetchClientOptions = (e: any) => {

        if (Array.isArray(e) && e.some(x => x.value === 'ALL') && e.length > 1) {
            const v = e.filter(x => x.value === 'ALL');
            setSelectedCustomerValue(v);
        } else {
            setSelectedCustomerValue(e);
        }
        if (userRef.current) userRef.current.clearValue();
    };
    const fetchLocationOptions = (e: any) => {
        if (Array.isArray(e) && e.some(x => x.value === -1) && e.length > 1) {
            const v = e.filter(x => x.value === -1);
            setSelectedBuildingValue(v);
        } else {
            setSelectedBuildingValue(e);
        }
        if (userRef.current) userRef.current.clearValue();
    };
    const NewTicketSendChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleNewTicketSend = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            let customerRecord = '';
            let buildingsRecord = '';
            if (!selectedCustomerValue || selectedCustomerValue.length < 1) {
                alert('Lütfen bir bedrijven seçin.');
                return;
            } else {
                customerRecord = selectedCustomerValue.map(x => x.value).join(';');
            }
            if (!selectedBuildingValue || selectedBuildingValue.length < 1) {
                alert('Lütfen bir locatie seçin.');
                return;
            } else {
                buildingsRecord = selectedBuildingValue.map(x => x.value).join(';')
            }
            const request = new FormData();
            request.append('opener_name', formData.opener_name);
            request.append('customer', customerRecord);
            request.append('building', buildingsRecord);
            request.append('room', formData.refnum);
            request.append('title', formData.title);
            request.append('ticketsubject', formData.ticketsubject);
            request.append('status', 'New');
            request.append('ticket_type', formData.ticket_type);
            request.append('delete', '0');
            if (selectedMentionedPersons && selectedMentionedPersons.length > 0) {
                setFormData(prevState => ({
                    ...prevState,
                    ticket_to: selectedMentionedPersons[0].label
                }))
                const userIds = selectedMentionedPersons?.map(item => item.value).join(',');
                request.append('userIds', userIds);
            }
            request.append('ticket_to', formData.ticket_to);
            if (selectedFiles.length > 0) selectedFiles.forEach((file) => {
                request.append('files[]', file);
            });
            axios.post('/api/tickets/store', request).then(response => {
                const nevTivket: TicketsDataProps = {
                    building: response.data[0].building,
                    status: response.data[0].status,
                    ticket_to: response.data[0].ticket_to,
                    refnum: response.data[0].refnum,
                    id: response.data[0].id,
                    ticket_type: response.data[0].ticket_type,
                    customer: response.data[0].customer,
                    opener_name: response.data[0].opener_name,
                    updated_at: response.data[0].updated_at,
                    title: response.data[0].title,
                    created_at: response.data[0].created_at,
                    delete: response.data[0].delete,
                    ticketsubject: response.data[0].ticketsubject
                }
                ticketDataHandler(nevTivket);
            }).catch(err => {
                console.error('There is an error accured while adding a ticket:', err);
            });
        } catch (error) {
            console.error('There is an error accured while adding a ticket:', error);
            throw error;
        }
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
    const handleUserNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prevState => ({
            ...prevState,
            ticket_to: value
        }))
        if (value.length > 1) {
            try {
                const filteredUsers: OtherUsersProps[] = otherUsers.filter(user =>
                    user.name.toLowerCase().includes(value.toLowerCase()));
                setSuggestions(filteredUsers);
            } catch (error) {
                console.error('Error fetching user suggestions:', error);
            }
        } else {
            setSuggestions([]);
        }
    };
    const handleSuggestionClick = (user: OtherUsersProps) => {
        setFormData(prevState => ({
            ...prevState,
            ticket_to: user.name
        }))
        setSuggestions([]);
    };
    const removeFile = (index: number) => {
        const updatedFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(updatedFiles);
    };
    const mentionedPersonFetch = (e: any) => {
        if (e) {
            setSelectedMentionedPersons(e);
        }
    }
    useEffect(() => {
        if (selectedMentionedPersons && selectedMentionedPersons.length > 0) {
            let users: OtherUsersProps[] = [];

            selectedMentionedPersons.forEach(item => {
                let muser = otherUsers.find(x => x.id == item.value);
                if (muser) {
                    users.push(muser);
                } else alert('kullanıcı bulunamadı...');
            })
            if (users && users.length > 0)
                setMentionedUsers(users);
        } else setMentionedUsers([]);
    }, [selectedMentionedPersons]);
    if (customer && buildings) return (
        <Modal show={AddTicketModelShow} onHide={onHide} className={'z-30'} size="lg" centered>
            <div className="modal-dialog-centered modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Nieuwe Melding</h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={onHide}
                        >
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form id='newTicket' onSubmit={handleNewTicketSend} method='post'>
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="input-block mb-3">
                                        <label className="col-form-label">Titel</label>
                                        <input className="form-control"
                                               type="text"
                                               onChange={NewTicketSendChange}
                                               name='title'
                                               value={formData.title}/>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="input-block mb-3">
                                        <label className="col-form-label">Bedrijf</label>
                                        {islocationDetail ?
                                            <input className={"form-control"} value={customer[0].Unvan}/> :
                                            <Select id='customerUSelect'
                                                    options={customerDomOptions}
                                                    isClearable={true}
                                                    placeholder={"Selecteer..."}
                                                    isSearchable={true}
                                                    isMulti={true}
                                                    styles={customStyles}
                                                    value={selectedCustomerValue}
                                                    isDisabled={isCustomerValueDisabled}
                                                    onChange={(e: any) => {
                                                        if (e) {
                                                            fetchClientOptions(e);
                                                        }
                                                    }}
                                            />}
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="input-block mb-3">
                                        <label className="col-form-label">Locatie</label>
                                        {islocationDetail ? <input className="form-control" type="text"
                                                                   value={buildings[0].BuildingName}/>
                                            : <Select id='buildingSelect'
                                                      options={buildingDomOptions}
                                                      styles={customStyles}
                                                      placeholder={"Selecteer..."}
                                                      isClearable={true}
                                                      isSearchable={true}
                                                      isMulti={true}
                                                      value={selectedBuildingValue}
                                                      isDisabled={isBuildingValueDisabled}
                                                      onChange={(e: any) => {
                                                          if (e) {
                                                              fetchLocationOptions(e);
                                                          }
                                                      }
                                                      }
                                            />}
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="input-block mb-3">
                                        <label className="col-form-label">Referentienummer</label>
                                        <input className="form-control"
                                               type="text"
                                               onChange={NewTicketSendChange}
                                               name='refnum'
                                               value={formData.refnum}/>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="input-block mb-3">
                                        <label className="col-form-label">Selecteer Persoon</label>
                                        <Select id='ticketToSelect'
                                                options={ticketToOptions ?? []}
                                                ref={userRef}
                                                value={selectedMentionedPersons}
                                                placeholder={"Kies een persoon of voor iedereen"}
                                                isClearable={true}
                                                isSearchable={true}
                                                isMulti={true}
                                                styles={customStyles}
                                                onChange={mentionedPersonFetch}/>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="input-block mb-3">
                                        <label className="col-form-label">Melding Type</label>
                                        <Select id={'typeSelect'}
                                                options={[
                                                    {value: 'complimenten', label: 'Complimenten'},
                                                    {value: 'comentaar', label: 'Comentaar'},
                                                    {value: 'vraag', label: 'Vraag'},
                                                    {value: 'klacht', label: 'Klacht'},
                                                    {value: 'Melding', label: 'Melding'},
                                                    {value: 'Extrawerk', label: 'Extra werk'},
                                                    {value: 'Ongegrond', label: 'Ongegrond'},
                                                ]
                                                }
                                                placeholder={"Selecteer..."}
                                                onChange={(e: any) => {
                                                    formData.ticket_type = e.value;
                                                }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="input-block mb-3">
                                        <label className="col-form-label">Volledige omschrijving van uw melding</label>
                                        <SubjectBox value={formData.ticketsubject} otherUsers={ticketToOptions}
                                                    takeValue={(e) => {
                                                        setFormData(prevState => ({
                                                            ...prevState,
                                                            ticketsubject: e
                                                        }));
                                                    }} setMetionUsers={setSelectedMentionedPersons}
                                                    mentionUsers={selectedMentionedPersons}/>
                                    </div>
                                    <div className="input-block mb-3">
                                        <label className="col-form-label">Update Bestanden</label>
                                        <div className="row">
                                            <div className="col-xl-11">
                                                <div className="flex-row flex">
                                                    <input className="form-control"
                                                           onChange={(e) => (handleFileChange(e))}//Ramon Ugurlu  Bestand toevoegen(Dosya Seç) Geen bestanden(Hiç Dosya Seçilmedi)
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
                                                <CameraComponent cameraStatus={showCamera ? showCamera : false}
                                                                 onHide={() => setShowCamera(false)}
                                                                 setCapturedFiles={setSelectedFiles}
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
                                    onClick={onHide}
                                >
                                    Gereed
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Modal>);
}
export {AddTicket, UpTicket};
