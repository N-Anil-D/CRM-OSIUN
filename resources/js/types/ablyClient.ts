// ablyClient.ts
import * as Ably from 'ably';
import Push from "ably";

let client: Ably.Types.RealtimePromise;

export const getAblyClient = (clientId: string): Ably.Types.RealtimePromise => {
    if (!client) {
        client = new Ably.Realtime.Promise({
            key: "YD-6eQ.TI3Mig:GAzbyUTEZyjEyO6qS4ln1390oStihXa7qrTpT1EkN7g",
            clientId: clientId,
            // pushServiceWorkerUrl: '/service_worker.js',
            // plugins: { Push }
        });
    }
    return client;
};
