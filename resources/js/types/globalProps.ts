interface TicketsDataProps {
    id: number;
    opener_name: string;
    customer: string;
    building: string;
    refnum: string;
    status: string;
    title: string;
    delete: string;
    created_at: Date;
    updated_at: Date;
    closing_date?: Date;
    ticketsubject: string;
    ticket_to: string;
    ticket_type: string;
    hasNotis?: number | 0;
    assigned_type?: string | undefined;
    closing_comment?: string | undefined;
    assigned_persons?: string | undefined;
    evaluator_persons?: string | undefined;
}

interface OtherUsersProps {
    id: number;
    name: string;
    roleName: string;
    profile_image_path?: string;
    customerid?: string;
    buildid?: number;
}

interface CustomerProps {
    id: number;
    CustomerID: string;
    Unvan: string;
    username: string;
    VergiDairesi: string;
    VergiNumarasi: string;
    Yetkili: string;
    email: string;
    phone_number: string;
    address: string;
    city: string;
    postal_code: string;
    country: string;
    passive: number;
    created_at: Date;
    updated_at: Date;
    tag: string;
    billsendtype: string;
    customer_group: string;
    assigned_locations?: CustomerAsignedLocationProps[];
}

interface CustomerAsignedLocationProps {
    id: number;
    customerid: string;
    locationid: number;
    rooms: string;
    created_at: Date;
    updated_at: Date;
}

interface NoteProps {
    id: number;
    customerid: string;
    openername: string;
    notetitle: string;
    note: string;
    delete: boolean;
    created_at: Date;
    updated_at: Date;
}

interface NoteCommentProps {
    id?: number;
    note_id: number;
    client_id: string;
    writer: string;
    comment: string;
    delete: boolean;
    created_at: Date;
    updated_at: Date;
}

interface BuildingProps {
    id: number;
    LocationID: string;
    BuildingName: string;
    locationadress: string;
    Note: string;
    passive: number;
    email: string;
    postalcode: string;
    dnumber: string;
    bolge: string;
    created_at: Date;
    updated_at: Date;
    is_assigned?: boolean;
}

interface RoomProps {
    id: number;
    building_id: number;
    floor_number: string;
    room_number: string;
    room_type: string;
    useage_type: string;
    floor_type: string;
    wall_type: string;
    floor_square: string;
    Binnenzijde: string;
    Buitenzijde: string;
    Seperstie_glas: string;
    percentage?: number;
    created_at: Date;
    updated_at: Date;
}

interface TicketSum {
    title: string;
    percentage: string;
    value: number;
    cardlabel: string;
}

interface MemberProps {
    id: number;
    member_id: string;
    member_name: string;
    location_id: number;
    CustomerID: string;
    customerUnvan: string;
    adres: string;
    email: string;
    phone_number: string;
    postal_code: string;
    billsendtype: string;
    bill_to_member: number;
    status: number;
    created_at: Date;
    updated_at: Date;
}

interface memberRommsProps {
    id: number;
    member_id: string;
    room_id: string;
    room_number: string;
    cıkıs_tarihi: Date;
    start_date: Date;
    floor_number: string;
    room_type: string;
    useage_type: string;
}

interface TicketFileProps {
    id: number;
    filename: string;
    mime_type: string;
    media_id: number;
    is_message: number;
    ticket_id: number;
    message_id?: number;
    created_at: Date;
}

interface TicketMessagesProps {
    id: number;
    ticket_id: number;
    userName: string;
    Message: string;
    created_at: string;
    updated_at: string;
    files: {
        id: number;
        filename: string;
        mime_type: string;
        media_id: number;
    }[];
}

interface MediaProps {
    id: number;
    model_type: string;
    model_id: number;
    uuid: string;
    collection_name: string;
    name: string;
    file_name: string;
    mime_type: string;
    disk: string;
    conversions_disk: string;
    size: number;
    manipulations: any;
    custom_properties: any;
    generated_conversions: any;
    responsive_images: any;
    order_column: number;
}

interface NotificationDataProps {
    id: string;
    type: string;
    notifiable_type: string;
    notifiable_id: string;
    data: string;
    read_at: Date | null;
    created_at: Date;
    updated_at: Date;
}

interface clientsContactPerson {
    id: number;
    first_name: string;
    tussen: string;
    last_name: string;
    email: string;
    phone_number: string;
    title: string;
    function: string;
    mobilenum: string;
    connectedCustomer: string;
    hoofcontactperson: boolean;
    passive: boolean;
    is_user: number;
    createDate: Date;
    updateDate: Date;
}

interface TicketReacts {
    id: number;
    ticket_id: number;
    react_text: string;
    before_status: string;
    after_status: string;
    evaluator_persons: string;
    created_at: Date;
    updated_at: Date;
    files: {
        id: number;
        filename: string;
        mime_type: string;
        media_id: number;
    }[];
}

interface RouteAuths {
    id: number
    page_name: string;
    path: string;
    read: boolean;
    write: boolean;
    delete: boolean;
    children?: RouteAuths[];
    CustomerID?: string;
}

interface MedewerkerDataProps {
    id?: number;
    title: string;
    first_name: string;
    tussen?: string;
    last_name: string;
    email: string;
    phone_number: string;
    gender: string;
    address: string;
    house_number: string;
    postal_code: string;
    residence: string;
    date_of_birth: Date;
    employment_type: string;
    contract_type?: string;
    proeftijd?: Date;
    personnel_number: number;
    iban_number: string;
    start_date: Date;
    travel_allowance: string;
    hourly_rate: number;
    rights: string;
    contract_hours: string;
    bsn_number: string;
    end_date?: Date;
    travel_expenses: number;
    bonus_amount: number;
    created_at: Date;
    passive: boolean;
    rijbewijsnummer?: string;
    rij_afgegeven_op?: Date;
    rij_gedlig_tot?: Date;
    asigned_supervisor?: string;
}

interface CustomerAsignedRoomsDataProps {
    id?: number;
    CustomerID: string;
    LocationID: string;
    roomID: string;
    percentage: number;
    created_at: Date;
}

interface CustomerWithRoomsOnLocatie {
    id: number;
    CustomerID: string;
    Unvan: string;
    room: RoomProps[];
    totalArea: number | 0;
    totalRoom: number | 0;
    ratio: number | 0;
}

interface Recurrence {
    frequency: 'daily' | 'weekly' | 'monthly' | 'four-weekly' | 'quarterly' | 'biannually' | 'annually';
    interval: number; // Tekrar aralığı, örneğin 2 haftada bir tekrar gibi durumlar için
    startDate: Date; // Tekrarın başlangıç tarihi
    endDate: Date; // Tekrarın biteceği tarih
    occurrences?: number; // Toplam kaç tekrar olacağını belirtebilir (opsiyonel)
}

interface ClientProjectsTasksDataProps {
    id?: number;
    project_id: number;
    product: number;
    aciklama: string;
    btw: number;
    birim: number;
    toplam: number;
    startDate: Date;
    endDate: Date | null;
    recurrence: Recurrence | null;
    ratePerHour: number;
}

interface ClientProjectsDataProps {
    id?: number;
    project_id: string;
    project_name: string;
    relevant_contract_id: number | null;
    customer_id: string;
    location_id?: number;
    tasks: ClientProjectsTasksDataProps[];
}

export type {
    CustomerProps,
    NoteCommentProps,
    NoteProps,
    BuildingProps,
    TicketsDataProps,
    RoomProps,
    MemberProps,
    TicketSum,
    memberRommsProps,
    OtherUsersProps,
    TicketFileProps,
    TicketMessagesProps,
    MediaProps,
    NotificationDataProps,
    clientsContactPerson,
    TicketReacts,
    RouteAuths,
    CustomerAsignedLocationProps,
    MedewerkerDataProps,
    CustomerAsignedRoomsDataProps,
    CustomerWithRoomsOnLocatie,
}
