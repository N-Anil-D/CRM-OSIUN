import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faArrowAltCircleRight } from '@fortawesome/free-regular-svg-icons'
import { User } from '@/types';
import UserRoleSelectBox from '@/Components/UserRoleSelectBox'
import BuildingSelectBox from '@/Components/BuildingSelectBox'
import CustomerSelectBox from '@/Components/CustomerSelectBox'

interface Kullanıcı {

    user_id: number;
    name: string;
    email: string;
    rolename: string;
    connectedBuilding: string;
    connectedCustomer: string;
    Tickets: number;
    Customers: number;
    Workplans: number;
    Bills: number;
}

const UserBoard: React.FC<Kullanıcı> = ({ user_id, name, email, rolename, connectedBuilding, connectedCustomer, Tickets, Customers, Workplans, Bills }) => {


    return (
        <li key={user_id} className="inline-block align-middle rounded-xl mx-5 px-5 mt-10 flex justify-between gap-x-6 py-5 dark:text-gray-200 text-gray-900 bg-white dark:bg-gray-800 ">
            <div className="inline-block align-middle flex min-w-0 gap-x-4 max-w-7xl mx-auto sm:px-6 lg:px-8 h-50 py-10 dark:text-gray-200 text-gray-900 bg-white dark:bg-gray-800">
                <div className="inline-block align-middle min-w-0 flex-row inline-flex gap-x-4">
                    <input readOnly value={user_id} type="text" name="roleName" id="${user_id} ${name}" className='w-10 rounded-md inline-block align-middle mt-1 truncate text-lg leading-5 text-gray-500 dark:text-gray-200 text-gray-900 bg-white dark:bg-gray-800'/>
                    <input value={name} type="text" name="roleName" id="${user_id} ${name}" className='rounded-md inline-block align-middle mt-1 truncate text-lg leading-5 text-gray-500 dark:text-gray-200 text-gray-900 bg-white dark:bg-gray-800'/>
                    <input value={email} type="text" name="roleName" id="roleName" className='rounded-md inline-block align-middle mt-1 truncate text-lg leading-5 text-gray-500 dark:text-gray-200 text-gray-900 bg-white dark:bg-gray-800'/>
                    <UserRoleSelectBox selected={rolename} classvalue='inline-block align-middle mt-1 truncate text-lg leading-5 text-gray-500 dark:text-gray-200 text-gray-900 bg-white dark:bg-gray-800'/>
                    <CustomerSelectBox connectedCustomer={connectedCustomer} roleId={user_id}/>
                    <BuildingSelectBox connectedBuilding={connectedBuilding} roleId={user_id}/>
                    <input value={rolename} type="text" name="roleName" id="roleName" className='rounded-md inline-block align-middle mt-1 truncate text-lg leading-5 text-gray-500 dark:text-gray-200 text-gray-900 bg-white dark:bg-gray-800'/>
                </div>
            </div>
        </li>
    );
};

export default UserBoard;
