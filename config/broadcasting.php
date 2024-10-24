<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Broadcaster
    |--------------------------------------------------------------------------
    |
    | This option controls the default broadcaster that will be used by the
    | framework when an event needs to be broadcast. You may set this to
    | any of the connections defined in the "connections" array below.
    |
    | Supported: "reverb", "pusher", "ably", "redis", "log", "null"
    |
    */

    'default' => env('BROADCAST_CONNECTION', 'ably'),

    /*
    |--------------------------------------------------------------------------
    | Broadcast Connections
    |--------------------------------------------------------------------------
    |
    | Here you may define all of the broadcast connections that will be used
    | to broadcast events to other systems or over WebSockets. Samples of
    | each available type of connection are provided inside this array.
    |
    */

    'connections' => [



        'ably' => [
            'driver' => 'ably',
            'key' => env('ABLY_KEY'),
            'options' => [
                'host' => 'rest.ably.io',
                'cluster' => env('ABLY_CLUSTER', 'eu'),
            ],
        ],
        'pusher' => [
            'driver' => 'pusher',
            'key' => env('ABLY_KEY'),
            'secret' => env('ABLY_SECRET'),
            'app_id' => env('ABLY_APP_ID'),
            'options' => [
                'cluster' => env('ABLY_CLUSTER', 'eu'),
                'useTLS' => true,
                'encrypted' => true,
                'host' => 'realtime.ably.io',
                'port' => 443,
                'scheme' => 'https',
                'authEndpoint' => '/broadcasting/auth',
            ],
        ],

        'log' => [
            'driver' => 'log',
        ],

        'null' => [
            'driver' => 'null',
        ],

    ],

];
