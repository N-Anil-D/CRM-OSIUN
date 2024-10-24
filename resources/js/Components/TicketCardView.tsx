import React, {PropsWithChildren, useEffect, useState} from "react";
import {DragDropContext, Droppable, Draggable, DropResult} from "react-beautiful-dnd";
import {TicketSum, TicketsDataProps, CustomerProps, BuildingProps, OtherUsersProps} from "@/types/globalProps";
import {Link} from "@inertiajs/react";
import moment from "moment/moment";
import {StatusChangeModel} from "@/Components/StatusChangeModel";

export function TicketCardView({
                                   ticketDomData,
                                   setTicketDomData,
                                   editTicket,
                                   deleteTicket,
                                   handleTicketStatusChange,
                                   customers,
                                   building,
                                   otherUsers,
                                   ticketDummySums
                               }: PropsWithChildren<{
    ticketDomData: TicketsDataProps[],
    setTicketDomData: React.Dispatch<React.SetStateAction<TicketsDataProps[]>>,
    editTicket: (ticketId: number) => void,
    deleteTicket: (ticketId: number) => void,
    handleTicketStatusChange: (ticketId: number) => void,
    customers: CustomerProps[],
    building: BuildingProps[],
    otherUsers: OtherUsersProps[],
    ticketDummySums: TicketSum[] | null
}>) {
    const [ticketSums, setTicketSums] = useState<TicketSum[]>();
    const [showStatusChangeModel, setShowStatusChangeModel] = useState<boolean>(false);
    const [selectedTicket, setSelectedTicket] = useState<TicketsDataProps>(ticketDomData[0]);
    const [selectedReactStatus, setSelectedREactStatus] = useState<string>('');
    const [groupedTasks, setGroupTask] = useState<{ [key: string]: TicketsDataProps[] }>();
    useEffect(() => {
        setGroupTask(groupTasksByStatus(ticketDomData))
    }, [ticketDomData]);
    useEffect(() => {
        if (ticketDummySums)
            setTicketSums(ticketDummySums);
    }, [ticketDummySums]);
    const typeClass = (type: string): string => {
        switch (type) {
            case "complimenten" :
                return "task-priority badge bg-inverse-success";
            case "comentaar":
                return "task-priority badge bg-inverse-info";
            case "vraag":
                return "task-priority badge bg-inverse-warning";
            case "klacht":
                return "task-priority badge bg-inverse-danger";
            case "Melding":
                return "task-priority badge bg-inverse-danger";
            case "Extrawerk":
                return "task-priority badge bg-inverse-warning";
            case "Ongegrond":
                return "task-priority badge bg-inverse-info";
            default:
                return "task-priority badge bg-inverse-danger"

        }
    }
    const groupTasksByStatus = (tasks: TicketsDataProps[]) => {
        return tasks.reduce((groups: { [key: string]: TicketsDataProps[] }, task) => {
            const status = task.status;
            if (!groups[status]) {
                groups[status] = [];
            }
            groups[status].push(task);
            return groups;
        }, {});
    };

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) {
            return;
        }

        const {source, destination} = result;
        if (source.droppableId !== destination.droppableId) {
            // Görev statüsü değişti
            const tasks = Array.from(ticketDomData);
            const groupedTasks = groupTasksByStatus(tasks);

            const sourceStatus = source.droppableId;
            const destinationStatus = destination.droppableId;

            const [movedTask] = groupedTasks[sourceStatus].splice(source.index, 1);

            // Modalı açmak için seçilen görevi ve hedef statüyü ayarlayın
            setSelectedTicket(movedTask);
            console.log(destinationStatus);
            setSelectedREactStatus(destinationStatus);
            setShowStatusChangeModel(true);
        } else {
            const tasks = Array.from(ticketDomData);
            const groupedTasks = groupTasksByStatus(tasks);

            const sourceStatus = source.droppableId;
            const destinationStatus = destination.droppableId;

            const [movedTask] = groupedTasks[sourceStatus].splice(source.index, 1);
            movedTask.status = destinationStatus;
            groupedTasks[destinationStatus].splice(destination.index, 0, movedTask);

            const updatedTasks = Object.values(groupedTasks).flat();

            setTicketDomData(updatedTasks);
        }
    };
    const findCustomerNames = (items: string) => {
        let cids: string[] = items.split(";");
        let Name: string = '';
        cids.forEach(cid => {
            Name += customers?.filter(x => x.CustomerID == cid).map(x => x.Unvan).join(', ');
        });
        return Name;
    }
    const findLocationNames = (items: string) => {
        let lids: string[] = items.split(";");
        let Name: string = '';
        lids.forEach((lid, index) => {
            Name += building?.filter(x => x.id.toString() == lid).map(x => x.BuildingName).join(', ');
            if (index != lids.length - 1) Name += ', ';
        })
        return Name;
    }
    if (ticketDomData)
        return (
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="kanban-list kanban-purple">
                    <div className="kanban-header">
                        <span className="status-title">Nieuw&nbsp;
                            <span className="badge rounded-pill bg-info-gradient text-black text-md-center">
                                {ticketSums ? ticketSums[0]?.value : "Calculating"}
                            </span>
                        </span>
                        <div className="dropdown kanban-action">
                            <a data-bs-toggle="dropdown">
                                <i className="fa-solid fa-ellipsis-vertical"/>
                            </a>
                            <div className="dropdown-menu dropdown-menu-right">
                                <a
                                    className="dropdown-item"
                                    data-bs-toggle="modal"
                                    data-bs-target="#edit_task_board"
                                >
                                    Edit
                                </a>
                                <a className="dropdown-item">
                                    Delete
                                </a>
                            </div>
                        </div>
                    </div>
                    {/* Pending List */}

                    <Droppable droppableId="New" direction="vertical">
                        {(provided) => (
                            <div className="kanban-wrap" ref={provided.innerRef}>
                                {groupedTasks && groupedTasks['New'] && groupedTasks['New'].map((task, index) => (
                                    <Draggable
                                        key={task.id}
                                        draggableId={task.id.toString()}
                                        index={index}
                                    >
                                        {(provided) => (
                                            <div
                                                className="card panel kanban-box my-1"
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <div className="osi-board-sm">
                                                    <div className="task-board-header">
                                                    <span className="status-title">
                                                        <a href={"/ticketdetail/" + task.id.toString()}>
                                                            {task.customer === 'ALL' ?
                                                                'Alles' :
                                                                (findCustomerNames(task.customer) ?? "Undefined or passive client")}
                                                        </a>
                                                    </span>
                                                        <div className="dropdown kanban-task-action">
                                                            <a data-bs-toggle="dropdown">
                                                                <i className="fa-solid fa-angle-down"/>
                                                            </a>
                                                            <div className="dropdown-menu dropdown-menu-right">
                                                                <a
                                                                    className="dropdown-item"
                                                                    onClick={() => editTicket(task.id)}
                                                                >
                                                                    Edit
                                                                </a>
                                                                <a className="dropdown-item"
                                                                   onClick={() => deleteTicket(task.id)}
                                                                >
                                                                    Delete
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <a className={'text-black'}
                                                       href={"/ticketdetail/" + task.id.toString()}>
                                                        <div className="task-board-body">
                                                            <div className="kaban-info">
                                                                <span>
                                                                    <i className="la la-id-badge"/>
                                                                    {task.id}
                                                                </span>
                                                            </div>
                                                            <div className="kanban-info">
                                                                <span>
                                                                    <i className="la la-map-marker"/>
                                                                    {task.building == "-1" ? 'Alles' : findLocationNames(task.building)}
                                                                </span>
                                                            </div>
                                                            <div className="kanban-info">
                                                                <span>
                                                                    <i className={"la la-user-circle"}/>
                                                                    {task.opener_name}
                                                                </span>
                                                            </div>
                                                            {task.ticket_to ? (
                                                                <div className="kanban-info">
                                                                <span>
                                                                    <i className={"la la-user-circle"}/>
                                                                    {task.ticket_to}
                                                                </span>
                                                                </div>) : null}
                                                            <div className="kanban-info">
                                                                <span>
                                                                    <i className={"la la-book"}/>
                                                                    {task.title}
                                                                </span>
                                                            </div>
                                                            <div className="kanban-footer">
                                                                <span className="task-info-cont">
                                                                    <span className="task-date">
                                                                        <i className="fa-regular fa-clock"/>{" "}
                                                                        {moment(task.created_at).format('DD-MM-YYYY HH:mm')}
                                                                    </span>
                                                                    {task.closing_date && (
                                                                        <span>
                                                                            <i className={"la la-times-circle"}/>
                                                                            {moment(task.closing_date).format('DD-MM-YYYY HH:mm')}
                                                                        </span>)}
                                                                    <span className={typeClass(task.ticket_type)}>
                                                                        {task.ticket_type}
                                                                    </span>
                                                                    {task.hasNotis && task.hasNotis > 0 ? (
                                                                            <span
                                                                                className=" task-date badge bg-danger ms-1">
                                                                            <span>
                                                                                {task.hasNotis}
                                                                            </span>
                                                                        </span>)
                                                                        : null}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>

                <div className="kanban-list kanban-warning">
                    <div className="kanban-header">
                        <span className="status-title">In Bewerking&nbsp;
                            <span className="badge rounded-pill bg-primary-gradient text-gray-700 text-md-center">
                                {ticketSums ? ticketSums[1]?.value : "Calculating"}
                            </span></span>
                        <div className="dropdown kanban-action">
                            <a data-bs-toggle="dropdown">
                                <i className="fa-solid fa-ellipsis-vertical"/>
                            </a>
                            <div className="dropdown-menu dropdown-menu-right">
                                <a
                                    className="dropdown-item"
                                    data-bs-toggle="modal"
                                    data-bs-target="#edit_task_board"
                                >
                                    Edit
                                </a>
                                <a className="dropdown-item">
                                    Delete
                                </a>
                            </div>
                        </div>
                    </div>
                    {/* Progress List */}
                    <Droppable droppableId="In Progress" direction="vertical">
                        {(provided) => (
                            <div className="kanban-wrap space-y-2" ref={provided.innerRef}>
                                {groupedTasks && groupedTasks['In Progress'] && groupedTasks['In Progress'].map((task, index) => (
                                    <Draggable
                                        key={task.id}
                                        draggableId={task.id.toString()}
                                        index={index}
                                    >
                                        {(provided) => (
                                            <div
                                                className="card panel kanban-box my-1"
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <div className="osi-board-sm">
                                                    <div className="task-board-header">
                                                    <span className="status-title">
                                                        <a href={"/ticketdetail/" + task.id.toString()}>
                                                            {task.customer === 'ALL' ?
                                                                'Alles' : findLocationNames(task.building)}
                                                        </a>
                                                    </span>
                                                        <div className="dropdown-menu dropdown-menu-right">
                                                            <a
                                                                className="dropdown-item"
                                                                onClick={() => editTicket(task.id)}
                                                            >
                                                                Edit
                                                            </a>
                                                            <a className="dropdown-item"
                                                               onClick={() => deleteTicket(task.id)}
                                                            >
                                                                Delete
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <a className={'text-black'}
                                                       href={"/ticketdetail/" + task.id.toString()}>
                                                        <div className="task-board-body">
                                                            <div className="kaban-info">
                                                                <span>
                                                                    <i className="la la-id-badge"/>
                                                                    {task.id}
                                                                </span>
                                                            </div>
                                                            <div className="kanban-info">
                                                    <span>
                                                        <i className="la la-map-marker"/>
                                                        {task.building == "-1" ? 'Alles' : findLocationNames(task.building)}
                                                    </span>
                                                            </div>
                                                            <div className="kanban-info">
                                                    <span>
                                                        <i className={"la la-user-circle"}/>
                                                        {task.opener_name}
                                                    </span>
                                                            </div>
                                                            {task.ticket_to ? (
                                                                <div className="kanban-info">
                                                                <span>
                                                                    <i className={"la la-user-circle"}/>
                                                                    {task.ticket_to}
                                                                </span>
                                                                </div>) : null}
                                                            <div className="kanban-info">
                                                    <span>
                                                        <i className={"la la-book"}/>
                                                        {task.title}
                                                    </span>
                                                            </div>
                                                            <div className="kanban-footer">
                                                    <span className="task-info-cont">
                                                        <span className="task-date">
                                                            <i className="fa-regular fa-clock"/>{" "}
                                                            {moment(task.created_at).format('DD-MM-YYYY HH:mm')}
                                                        </span>
                                                        <span>
                                                            <i className={"la la-times-circle"}/>
                                                            {moment(task.closing_date).format('DD-MM-YYYY HH:mm')}
                                                        </span>
                                                        <span className={typeClass(task.ticket_type)}>
                                                            {task.ticket_type}
                                                        </span>
                                                        {task.hasNotis && task.hasNotis > 0 ? (
                                                                <span className=" task-date badge bg-danger ms-1">
                                                                    <span>
                                                                        {task.hasNotis}
                                                                    </span>
                                                                </span>)
                                                            : null}
                                                    </span>
                                                            </div>
                                                        </div>
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
                <div className="kanban-list kanban-success">
                    <div className="kanban-header">
                        <span className="status-title">Afgehandeld&nbsp;
                            <span className="badge rounded-pill bg-info-subtle text-black text-md-center">
                                {ticketSums ? ticketSums[2]?.value : "Calculating"}
                            </span></span>
                        <div className="dropdown kanban-action">
                            <a data-bs-toggle="dropdown">
                                <i className="fa-solid fa-ellipsis-vertical"/>
                            </a>
                            <div className="dropdown-menu dropdown-menu-right">
                                <a
                                    className="dropdown-item"

                                    data-bs-toggle="modal"
                                    data-bs-target="#edit_task_board"
                                >
                                    Edit
                                </a>
                                <a className="dropdown-item">
                                    Delete
                                </a>
                            </div>
                        </div>
                    </div>
                    <Droppable droppableId="Closed" direction="vertical">
                        {(provided) => (
                            <div className="kanban-wrap" ref={provided.innerRef}>
                                {groupedTasks && groupedTasks['Closed'] && groupedTasks['Closed'].map((task, index) => (
                                    <Draggable
                                        key={task.id}
                                        draggableId={task.id.toString()}
                                        index={index}
                                    >
                                        {(provided) => (
                                            <div
                                                className="card panel kanban-box my-1"
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <div className="osi-board-sm">
                                                    <div className="task-board-header">
                                                    <span className="status-title">
                                                        <a href={"/ticketdetail/" + task.id.toString()}>
                                                            {task.customer === 'ALL' ? 'Alles' : findLocationNames(task.building)}
                                                        </a>
                                                    </span>
                                                        <div className="dropdown kanban-task-action">
                                                            <a data-bs-toggle="dropdown">
                                                                <i className="fa-solid fa-angle-down"/>
                                                            </a>
                                                            <div className="dropdown-menu dropdown-menu-right">
                                                                <a
                                                                    className="dropdown-item"
                                                                    onClick={() => editTicket(task.id)}
                                                                >
                                                                    Edit
                                                                </a>
                                                                <a className="dropdown-item"
                                                                   onClick={() => deleteTicket(task.id)}
                                                                >
                                                                    Delete
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <a className={'text-black'}
                                                       href={"/ticketdetail/" + task.id.toString()}>
                                                        <div className="task-board-body">
                                                            <div className="kaban-info">
                                                                <span>
                                                                    <i className="la la-id-badge"/>
                                                                    {task.id}
                                                                </span>
                                                            </div>
                                                            <div className="kanban-info">
                                                    <span>
                                                        <i className="la la-map-marker"/>
                                                        {task.building == "-1" ? 'Alles' : findLocationNames(task.building)}
                                                    </span>
                                                            </div>
                                                            <div className="kanban-info">
                                                    <span>
                                                        <i className={"la la-user-circle"}/>
                                                        {task.opener_name}
                                                    </span>
                                                            </div>
                                                            {task.ticket_to ? (
                                                                <div className="kanban-info">
                                                                <span>
                                                                    <i className={"la la-user-circle"}/>
                                                                    {task.ticket_to}
                                                                </span>
                                                                </div>) : null}
                                                            <div className="kanban-info">
                                                    <span>
                                                        <i className={"la la-book"}/>
                                                        {task.title}
                                                    </span>
                                                            </div>
                                                            <div className="kanban-footer">
                                                    <span className="task-info-cont">
                                                        <span className="task-date">
                                                            <i className="fa-regular fa-clock"/>{" "}
                                                            {moment(task.created_at).format('DD-MM-YYYY HH:mm')}
                                                        </span>
                                                        <span>
                                                            <i className={"la la-times-circle"}/>
                                                            {moment(task.closing_date).format('DD-MM-YYYY HH:mm')}
                                                        </span>
                                                        <span className={typeClass(task.ticket_type)}>
                                                            {task.ticket_type}
                                                        </span>
                                                        {task.hasNotis && task.hasNotis > 0 ? (
                                                                <span className=" task-date badge bg-danger ms-1">
                                                                    <span>
                                                                        {task.hasNotis}
                                                                    </span>
                                                                </span>)
                                                            : null}
                                                    </span>
                                                            </div>
                                                        </div>
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
                <div className="kanban-list kanban-danger">
                    <div className="kanban-header">
                        <span className="status-title">On Hold&nbsp;
                            <span className="badge rounded-pill bg-light-pending text-black text-md-center">
                                {ticketSums ? ticketSums[4]?.value : "Calculating"}
                            </span>
                        </span>
                        <div className="dropdown kanban-action">
                            <a data-bs-toggle="dropdown">
                                <i className="fa-solid fa-ellipsis-vertical"/>
                            </a>
                            <div className="dropdown-menu dropdown-menu-right">
                                <a className="dropdown-item">
                                    Edit
                                </a>
                                <a className="dropdown-item">
                                    Delete
                                </a>
                            </div>
                        </div>
                    </div>
                    <Droppable droppableId="On Hold" direction="vertical">
                        {(provided) => (
                            <div className="kanban-wrap" ref={provided.innerRef}>
                                {groupedTasks && groupedTasks['On Hold'] && groupedTasks['On Hold'].map((task, index) => (
                                    <Draggable
                                        key={task.id}
                                        draggableId={task.id.toString()}
                                        index={index}
                                    >
                                        {(provided) => (
                                            <div
                                                className="card panel kanban-box my-1"
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <div className="osi-board-sm">
                                                    <div className="task-board-header">
                                                    <span className="status-title">
                                                        <a href={"/ticketdetail/" + task.id.toString()}>
                                                            {task.customer === 'ALL' ? 'Alles' : (customers?.find((x) => (x.CustomerID === task.customer))?.Unvan ?? "Undefined or passive client")}</a>
                                                    </span>
                                                        <div className="dropdown kanban-task-action">
                                                            <a data-bs-toggle="dropdown">
                                                                <i className="fa-solid fa-angle-down"/>
                                                            </a>
                                                            <div className="dropdown-menu dropdown-menu-right">
                                                                <a
                                                                    className="dropdown-item"
                                                                    onClick={() => editTicket(task.id)}
                                                                >
                                                                    Edit
                                                                </a>
                                                                <a className="dropdown-item"
                                                                   onClick={() => deleteTicket(task.id)}
                                                                >
                                                                    Delete
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <a className={'text-black'}
                                                       href={"/ticketdetail/" + task.id.toString()}>
                                                        <div className="task-board-body">
                                                            <div className="kaban-info">
                                                                <span>
                                                                    <i className="la la-id-badge"/>
                                                                    {task.id}
                                                                </span>
                                                            </div>
                                                            <div className="kanban-info">
                                                    <span>
                                                        <i className="la la-map-marker"/>
                                                        {task.building == "-1" ? 'Alles' : findLocationNames(task.building)}
                                                    </span>
                                                            </div>
                                                            <div className="kanban-info">
                                                    <span>
                                                        <i className={"la la-user-circle"}/>
                                                        {task.opener_name}
                                                    </span>
                                                            </div>
                                                            {task.ticket_to ? (
                                                                <div className="kanban-info">
                                                                <span>
                                                                    <i className={"la la-user-circle"}/>
                                                                    {task.ticket_to}
                                                                </span>
                                                                </div>) : null}
                                                            <div className="kanban-info">
                                                    <span>
                                                        <i className={"la la-book"}/>
                                                        {task.title}
                                                    </span>
                                                            </div>
                                                            <div className="kanban-footer">
                                                    <span className="task-info-cont">
                                                        <span className="task-date">
                                                            <i className="fa-regular fa-clock"/>{" "}
                                                            {moment(task.created_at).format('DD-MM-YYYY HH:mm')}
                                                        </span>
                                                        <span>
                                                            <i className={"la la-times-circle"}/>
                                                            {moment(task.closing_date).format('DD-MM-YYYY HH:mm')}
                                                        </span>
                                                        <span className={typeClass(task.ticket_type)}>
                                                            {task.ticket_type}
                                                        </span>
                                                        {task.hasNotis && task.hasNotis > 0 ? (
                                                                <span className=" task-date badge bg-danger ms-1">
                                                                    <span>
                                                                        {task.hasNotis}
                                                                    </span>
                                                                </span>)
                                                            : null}
                                                    </span>
                                                            </div>
                                                        </div>
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
                <div className="kanban-list kanban-gray">
                    <div className="kanban-header">
                        <span className="status-title">Vervallen&nbsp;
                            <span className="badge rounded-pill bg-white text-black text-md-center">
                                {ticketSums ? ticketSums[5]?.value : "Calculating"}
                            </span></span>
                        <div className="dropdown kanban-action">
                            <a data-bs-toggle="dropdown">
                                <i className="fa-solid fa-ellipsis-vertical"/>
                            </a>
                            <div className="dropdown-menu dropdown-menu-right">
                                <a
                                    className="dropdown-item"

                                    data-bs-toggle="modal"
                                    data-bs-target="#edit_task_board"
                                >
                                    Edit
                                </a>
                                <a className="dropdown-item">
                                    Delete
                                </a>
                            </div>
                        </div>
                    </div>
                    <Droppable droppableId="Cancelled" direction="vertical">
                        {(provided) => (
                            <div className="kanban-wrap" ref={provided.innerRef}>
                                {groupedTasks && groupedTasks['Cancelled'] && groupedTasks['Cancelled'].map((task, index) => (
                                    <Draggable
                                        key={task.id}
                                        draggableId={task.id.toString()}
                                        index={index}>
                                        {(provided) => (
                                            <div
                                                className="card panel kanban-box my-1"
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <div className="osi-board-sm">
                                                    <div className="task-board-header">
                                                    <span className="status-title">
                                                        <a href={"/ticketdetail/" + task.id.toString()}>
                                                            {task.customer === 'ALL' ? 'Alles' : (customers?.find((x) => (x.CustomerID === task.customer))?.Unvan ?? "Undefined or passive client")}</a>
                                                    </span>
                                                        <div className="dropdown kanban-task-action">
                                                            <a data-bs-toggle="dropdown">
                                                                <i className="fa-solid fa-angle-down"/>
                                                            </a>
                                                            <div className="dropdown-menu dropdown-menu-right">
                                                                <a
                                                                    className="dropdown-item"
                                                                    onClick={() => editTicket(task.id)}
                                                                >
                                                                    Edit
                                                                </a>
                                                                <a className="dropdown-item"
                                                                   onClick={() => deleteTicket(task.id)}
                                                                >
                                                                    Delete
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <a className={'text-black'}
                                                       href={"/ticketdetail/" + task.id.toString()}>
                                                        <div className="task-board-body">
                                                            <div className="kaban-info">
                                                                <span>
                                                                    <i className="la la-id-badge"/>
                                                                    {task.id}
                                                                </span>
                                                            </div>
                                                            <div className="kanban-info">
                                                    <span>
                                                        <i className="la la-map-marker"/>
                                                        {task.building == "-1" ? 'Alles' : findLocationNames(task.building)}
                                                    </span>
                                                            </div>
                                                            <div className="kanban-info">
                                                    <span>
                                                        <i className={"la la-user-circle"}/>
                                                        {task.opener_name}
                                                    </span>
                                                            </div>
                                                            {task.ticket_to ? (
                                                                <div className="kanban-info">
                                                                <span>
                                                                    <i className={"la la-user-circle"}/>
                                                                    {task.ticket_to}
                                                                </span>
                                                                </div>) : null}
                                                            <div className="kanban-info">
                                                    <span>
                                                        <i className={"la la-book"}/>
                                                        {task.title}
                                                    </span>
                                                            </div>
                                                            <div className="kanban-footer">
                                                    <span className="task-info-cont">
                                                        <span className="task-date">
                                                            <i className="fa-regular fa-clock"/>{" "}
                                                            {moment(task.created_at).format('DD-MM-YYYY HH:mm')}
                                                        </span>
                                                        <span>
                                                            <i className={"la la-times-circle"}/>
                                                            {moment(task.closing_date).format('DD-MM-YYYY HH:mm')}
                                                        </span>
                                                        <span className={typeClass(task.ticket_type)}>
                                                            {task.ticket_type}
                                                        </span>
                                                        {task.hasNotis && task.hasNotis > 0 ? (
                                                                <span className=" task-date badge bg-danger ms-1">
                                                                    <span>
                                                                        {task.hasNotis}
                                                                    </span>
                                                                </span>)
                                                            : null}
                                                    </span>
                                                            </div>
                                                        </div>
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
                {selectedTicket && <StatusChangeModel showCloseTicketModel={showStatusChangeModel}
                                                      setShowCloseTicketModel={setShowStatusChangeModel}
                                                      ticketDomData={selectedTicket}
                                                      selectedReactStatus={selectedReactStatus}
                                                      otherUsers={otherUsers}/>}
            </DragDropContext>);
    else return;
}
