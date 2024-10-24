import Echo from 'laravel-echo';
import * as Ably from 'ably';
import Pusher from 'pusher-js';

const ablyKey: string = "YD-6eQ.TI3Mig:GAzbyUTEZyjEyO6qS4ln1390oStihXa7qrTpT1EkN7g";
// window.Ably = Ably;

const echo = new Echo({
    broadcaster: 'ably',
    key: ablyKey,
    cluster: 'eu',
});
export default echo;
