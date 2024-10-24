import React, { Fragment, useState, useEffect } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

interface CustomerSelectProps {
    connectedCustomer: string;
    roleId: number;
}

interface CustomerTable {
    id:number;
    CustomerID:string;
    Unvan:string;
    username:string;
    VergiDairesi:string;
    Yetkili:string;
    email:string;
    phone_number:string;
    address:string;
    postal_code:string;
    country:string;
    passive:number;
    created_at:string;
    updated_at:string;
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

const RoleSelect: React.FC<CustomerSelectProps> = ({ connectedCustomer, roleId }) => {

    const [customers, setCustomers] = useState<CustomerTable[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerTable>();
    const dummy: CustomerTable = {
        id:0,
        CustomerID:"000",
        Unvan:"All",
        passive:0,
        username:"",
        address:"",
        country:"",
        created_at:"",
        email:"",
        phone_number:"",
        postal_code:"",
        updated_at:"",
        VergiDairesi:"",
        Yetkili:""
    };
    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await axios.get(`/api/building/roleGuide`);
            setCustomers(response.data);
        } catch (error) {
            console.error('Error fetching structures:', error);
        }
    };

    const updateUserCustomer = async (roleId: number, connectedBuild: string) => {
        await axios.put(`/api/roles/${roleId}`, { connectedBuild: connectedBuild });
        // Burada kullanıcının rolünü güncelledikten sonra gerekli işlemleri yapabilirsiniz.
    };

    return (
        <Listbox value={selectedCustomer} onChange={setSelectedCustomer}>
        {({ open }) => (
          <>
            <div className="relative mt-2">
              <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6 dark:text-gray-200 text-gray-900 bg-white dark:bg-gray-800">
                <span className="flex items-center">
                  <span className="ml-3 block truncate">{selectedCustomer?.Unvan}</span>
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm  dark:text-gray-200 text-gray-900 bg-white dark:bg-gray-800">
                  {customers.map((customer, Index) => (
                    <Listbox.Option
                      key={Index}
                      className={({ active }) =>
                        classNames(
                          active ? 'bg-indigo-600 text-white' : 'dark:text-gray-200 text-gray-900 bg-white dark:bg-gray-800',
                          'relative cursor-default select-none py-2 pl-3 pr-9'
                        )
                      }
                      value={customer}
                    >
                      {({ selected, active }) => (
                        <>
                          <div className="flex items-center">
                            <span
                              className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                            >
                              {customer.Unvan}
                            </span>
                          </div>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? 'text-white' : ' dark:text-gray-200 text-gray-900 bg-white dark:bg-gray-800',
                                'absolute inset-y-0 right-0 flex items-center pr-4'
                              )}
                            >
                              <FontAwesomeIcon className="h-5 w-5" aria-hidden="true" icon={faCheckCircle} />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    );
};

export default RoleSelect;
