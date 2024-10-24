import React, {useState, useEffect} from 'react';
import {AblyProvider, useChannel, useConnectionStateListener} from 'ably/react';
import * as Ably from 'ably';
import {Link} from '@inertiajs/react';
import {TicketsDataProps} from "@/types/globalProps";

interface DataProps {
    userID: string; // userID'nin türü string olarak değiştirildi
}

interface NotificationProps {
  message: string;
}

const NotificationComponent: React.FC<{ userID: string }> = ({userID}) => {
    const [notifications, setNotifications] = useState<TicketsDataProps[]>([]);

    useConnectionStateListener('connected', () => {
        console.log('Connected to Ably!');
    });

    const {channel} = useChannel(`notification:${userID}`, (message: any) => {
        let newTicket = message.data as TicketsDataProps;
        setNotifications(previousMessages => [...previousMessages, newTicket]);
        console.log(newTicket);
        let ticketSubject;
        if (newTicket && newTicket.ticketsubject && newTicket.ticketsubject.length > 150) {
            ticketSubject = newTicket.ticketsubject.substring(0, 150) + '...';
        } else if (newTicket && newTicket.ticketsubject) {
            ticketSubject = newTicket.ticketsubject;
        } else {
            ticketSubject = ''; // Varsayılan bir değer atayabilirsiniz
        }

    });

    return (
        <div className="alert alert-secondary" role={"alert"}>
            {notifications && notifications.length > 0 && notifications.map((notification, index) => (
                <div key={index} className="notification-message">
                    <ul>
                        <li>
                            <h3>{notification.title}</h3>
                        </li>
                        <li>
                            <h3>{notification.ticket_type}</h3>
                        </li>
                        <li>
                            <p>{notification.ticketsubject}</p>
                        </li>
                    </ul>
                    <Link href={'/tickets'} className="alert-link">
                        Go to...
                    </Link>
                </div>
            ))}
        </div>
    );
};

const Notification: React.FC<DataProps> = ({userID}) => {
    const ablyKey: string = "1frV0Q.mfUdVA:W4uHd-XhG7-JhnGUe9MCdngjh-_ZA6mZdxr-qWexT3Y";
    const client = new Ably.Realtime.Promise({key: ablyKey, clientId: userID});

    return (
        <AblyProvider client={client}>
            <NotificationComponent userID={userID}/>
        </AblyProvider>
    );
};

export const SuccessAlert: React.FC<NotificationProps> = ({ message }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, 10000);

        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    return (
        <div className="alert alert-secondary rounded-pill alert-dismissible fade show position-fixed bottom-0 end-0 m-3">
            {message}
            <button
                type="button"
                className="btn-close custom-close"
                data-bs-dismiss="alert"
                aria-label="Close"
                onClick={() => setVisible(false)}
            >
                <i className="fa fa-times" />
            </button>
        </div>
    );
};

export default {SuccessAlert};
