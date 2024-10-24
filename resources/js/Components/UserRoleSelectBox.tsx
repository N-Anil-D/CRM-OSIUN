import React, { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Role {
  name: string;
}

interface RoleSelectProps {
  selected: string;
  classvalue: string;
}

const people: Role[] = [
  { name: 'admin' },
  { name: 'Supervisor' },
  { name: 'Personnel' },
  { name: 'Client Manager' },
  { name: 'Client' }
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const RoleSelect: React.FC<RoleSelectProps> = ({ selected, classvalue }) => {
  const [selectedRole, setSelectedRole] = useState(people.find(role => role.name === selected) || people[3]);

  return (
    <Listbox value={selectedRole} onChange={setSelectedRole}>
      {({ open }) => (
        <>
          <div className="relative mt-2">
            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6 dark:text-gray-200 text-gray-900 bg-white dark:bg-gray-800">
              <span className="flex items-center">
                <span className="ml-3 block truncate">{selectedRole.name}</span>
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
                {people.map((person, personIndex) => (
                  <Listbox.Option
                    key={personIndex}
                    className={({ active }) =>
                      classNames(
                        active ? 'bg-indigo-600 text-white' : 'dark:text-gray-200 text-gray-900 bg-white dark:bg-gray-800',
                        'relative cursor-default select-none py-2 pl-3 pr-9'
                      )
                    }
                    value={person}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">
                          <span
                            className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                          >
                            {person.name}
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
