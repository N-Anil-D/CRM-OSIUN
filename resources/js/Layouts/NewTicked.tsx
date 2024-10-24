import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import PrimaryButton from '@/Components/PrimaryButton';
const socket = new WebSocket('ws://localhost:7431');
import React, { useState } from 'react';
import axios from 'axios';

interface Kullanıcı {
    id?: number;
    opener_name?: string;
    customer?: string;
    building?: string;
    room?: string;
    status?: number;
    title?: string;
    delete?: number;
}

interface PagePropsWithUsers extends PageProps {

    users: Kullanıcı[] | null;

}
