import {Config} from 'ziggy-js';
import {RouteAuths,BuildingProps,CustomerProps} from './globalProps'

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    roleName: string;
    connectedBuild: string;
    connectedCustomer: string;
    bann: boolean;
    profile_image_path?: string;
    permissions: RouteAuths[];
    customers?: CustomerProps[];
    buildings?: BuildingProps[];
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
    ziggy: Config & { location: string };
};
