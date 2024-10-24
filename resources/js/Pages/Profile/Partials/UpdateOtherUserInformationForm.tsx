import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import {Link, useForm, usePage} from '@inertiajs/react';
import {Transition} from '@headlessui/react';
import React, {FormEventHandler, useEffect, useState} from 'react';
import {PageProps, User} from '@/types';
import Select from "react-select";
import {BuildingProps, CustomerProps, RouteAuths} from "@/types/globalProps";
import {permitableContactPersonList, permitablePageList} from "@/types/PagePermitions";
import {permitionsTableColumns} from '@/Components/Columns';
import {Table} from "antd";
import {redirect} from "react-router-dom";
import PermissionsTable from "@/Components/PermissionsTable";
import SecondaryButton from "@/Components/SecondaryButton";
import ToastMessage from "@/Components/ToastMessage";

function mergePermissions(
    permitablePageList: RouteAuths[],
    editableUserPermissions: RouteAuths[]
): RouteAuths[] {
    permitablePageList.forEach(permission => {
        let data = editableUserPermissions.find(x => x.page_name == permission.page_name);
        if (data) {
            permission.id = data.id;
            permission.read = data.read;
            permission.write = data.write;
            permission.delete = data.delete;
            if (permission.children && permission.children.length > 0) {
                permission.children.forEach(child => {
                    let l = data?.children?.find(x => x.page_name === child.page_name);
                    if (l) {
                        child.id = l.id;
                        child.read = l.read;
                        child.write = l.write;
                        child.delete = l.delete;
                        if(child.children) {
                            child.children.forEach(baby => {
                                let i = l?.children?.find(x => x.page_name === baby.page_name);
                                if(i) {
                                    baby.id = i.id;
                                    baby.read = i.read;
                                    baby.write = baby.write;
                                    baby.delete = baby.delete;
                                }
                            })
                        }
                    }
                })
            }
        }
    })
    return permitablePageList;
}

export default function UpdateOtherUserInformation({
                                                       mustVerifyEmail,
                                                       status,
                                                       className = '',
                                                       user,
                                                       buildings,
                                                       clients
                                                   }: {
    mustVerifyEmail: boolean,
    status?: string,
    className?: string,
    user: User,
    buildings: BuildingProps[],
    clients: CustomerProps[]
}) {
    const [authsData, setAuthsData] = useState<RouteAuths[]>(permitablePageList);
    const [clientVaules, selClientValues] = useState<{ value: string, label: string }[] | null>(null);
    const [locationValues, setLocationValues] = useState<{ value: string, label: string }[] | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [selectsOptions, setselectOptions] = useState({
        role: [
            {value: 'Client', label: 'Klant'},
            {value: 'personel', label: 'Medewerker'},
            {value: 'forman', label: 'Voorwerker'},
            {value: 'projectleider', label: 'Projectleider'},
            {value: 'admin', label: 'Admin'},
        ],
        connectedBuild: [
            {value: 'ALL', label: 'All'},
            ...(buildings && buildings.length > 0 ? buildings.map((item: BuildingProps) => ({
                value: item.id,
                label: item.BuildingName
            })) : [])
        ],
        connectedCustomer: [
            {value: 'ALL', label: 'All'},
            ...(clients && clients.length > 0 ? clients.map((item: CustomerProps) => ({
                value: item.CustomerID,
                label: item.Unvan + " / " + item.CustomerID
            })) : [])
        ],
    });

    useEffect(() => {
        if (user.permissions && Array.isArray(user.permissions)) {
            setAuthsData(mergePermissions(permitablePageList(), user.permissions));
            setData('permissions', authsData);
        }
        console.log('user.permissions',user.permissions);
        console.log('authsDAta', authsData);
        if (user.connectedCustomer === 'ALL') {
            selClientValues([{value: 'ALL', label: 'All'}]);
            setData(previousData => ({
                ...previousData,
                connectedCustomer: 'ALL',
            }))
        } else if (user.connectedCustomer != 'ALL' && user.customers) {
            user.customers.map(x => {
                try {
                    let a = selectsOptions.connectedCustomer.find(y => y.value === x.CustomerID);
                    if (a) {
                        selClientValues(prevState => [
                            ...(prevState || []),
                            a
                        ]);
                    }
                } catch (error) {
                    console.error('Map döngüsünde hata:', error);
                }
            })
        }
        if (user.connectedBuild === 'ALL') {
            setLocationValues([{value: 'ALL', label: 'All'}]);
            setData(previousData => ({
                ...previousData,
                connectedBuild: 'ALL',
            }))
        } else if (user.connectedBuild != 'ALL' && user.buildings) {
            user.buildings.map(x => {
                try {
                    let a = selectsOptions.connectedBuild.find(y => y.value == x.id.toString());
                    if (a) {
                        setLocationValues(prevState => [
                            ...(prevState || []),
                            {value: a.value.toString(), label: a.label}
                        ])
                    }
                } catch (e) {
                    console.log(e);
                }
            })
        }
    }, [user]);
    useEffect(() => {
        setData('permissions', authsData);
    }, [authsData]);
    useEffect(() => {
        if (data.connectedBuild != 'ALL') {
            setData('willbuilds', locationValues ? locationValues : []); // locationValues'u bir array olarak ayarlıyoruz
        } else {
            setData('willbuilds', []);
        }
    }, [locationValues]);
    useEffect(() => {
        if (data.connectedCustomer != 'ALL') {
            setData('willclients', clientVaules ? clientVaules : []); // clientVaules'u bir array olarak ayarlıyoruz
        } else {
            setData('willclients', []);
        }
    }, [clientVaules]);
    const {data, setData, patch, errors, processing, recentlySuccessful} = useForm({
        id: user.id,
        name: user.name,
        email: user.email,
        email_verified_at: user.email_verified_at,
        roleName: user.roleName,
        connectedBuild: user.connectedBuild,
        connectedCustomer: user.connectedCustomer,
        bann: user.bann,
        permissions: authsData,
        willbuilds: user.buildings?.map(x => ({value: x.id.toString(), label: x.BuildingName})),
        willclients: user.customers?.map(x => ({value: x.CustomerID, label: x.Unvan})),
    });
    const [userStatus, setUserStatus] = useState(data.bann ? {value: '1', label: 'Passive'} : {
        value: '0',
        label: 'Active'
    })
    useEffect(() => {
        console.log(data);
    }, [data]);
    const submit: React.FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update.other'), {
            preserveScroll: true,
            onSuccess: () => {
                setToast({message: 'Profil başarıyla güncellendi!', type: 'success'});
                setTimeout(() => {
                    window.location.reload();
                }, 1000); // Mesaj gösterildikten sonra 1 saniye bekleyip sayfayı yeniler
            },
            onError: (err) => {
                const errorMessage = err?.message || 'Bir hata oluştu!'; // Eğer JSON mesaj varsa burada gösteririz
                setToast({message: errorMessage, type: 'error'});
            },
        });
    };
    const tableColumns = permitionsTableColumns(authsData, setAuthsData);
    const fetchClientSelect = (e: any) => {
        if (Array.isArray(e) && e.some(x => x.value === 'ALL')) {
            data.connectedCustomer = 'ALL';
            setData('willclients', []);
            const v = e.filter(x => x.value === 'ALL');
            selClientValues(v);
        } else {
            data.connectedCustomer = 'various';
            selClientValues(e);
        }
    }
    const fetchLocationSelect = (e: any) => {
        if (Array.isArray(e) && e.some(x => x.value === 'ALL')) {
            data.connectedBuild = 'ALL'
            setData('willbuilds', []);
            const v = e.filter(x => x.value === 'ALL');
            setLocationValues(v);
        } else {
            data.connectedBuild = 'various'
            setLocationValues(e);
        }
    }
    const NewUserSendChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 ">Profile Information</h2>

                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="centered col-12">
                <div className="col-md-12">
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="input-block mb-3">
                                <label className="col-form-label">User Name <span
                                    className="text-danger">*</span></label>
                                <input type="text"
                                       className="form-control"
                                       onChange={NewUserSendChange}
                                       name={'name'}
                                       value={data.name}
                                />
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="input-block mb-3">
                                <label className="col-form-label">e-Mail adres <span
                                    className="text-danger">*</span></label>
                                <input type="email"
                                       className="form-control"
                                       onChange={NewUserSendChange}
                                       name={'email'}
                                       value={data.email}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="input-block mb-3">
                                <label className="col-form-label">Role Name <span
                                    className="text-danger">*</span></label>
                                <Select options={selectsOptions.role}
                                        placeholder={'Please Select a Role'}
                                        value={selectsOptions.role.find(x => x.value === data.roleName) ?? null}
                                        onChange={(e: any) => {
                                            if (e) {
                                                setData(prevState => ({
                                                    ...prevState,
                                                    roleName: e.value
                                                }));
                                            }
                                        }}/>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="input-block mb-3">
                                <label className="col-form-label">Connected Client</label>
                                <Select options={selectsOptions.connectedCustomer}
                                        placeholder={'Please Select Clients'}
                                        isMulti={true}
                                        value={clientVaules}
                                        onChange={(e: any) => {
                                            if (e) {
                                                fetchClientSelect(e)
                                            }
                                        }}/>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="input-block mb-3">
                                <label className="col-form-label">Connected Location</label>
                                <Select options={selectsOptions.connectedBuild}
                                        id={'buildselect'}
                                        isMulti={true}
                                        isClearable={true}
                                        isSearchable={true}
                                        placeholder={'Please Select a Location'}
                                        value={locationValues}
                                        onChange={(e: any) => {
                                            if (e) {
                                                fetchLocationSelect(e);
                                            }
                                        }}/>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="input-block mb-3">
                                <label className="col-form-label">Status</label>
                                <Select
                                    options={[{value: '0', label: 'Active'}, {value: '1', label: 'Passive'}]}
                                    value={userStatus.value}
                                    onChange={(e: any) => {
                                        if (e) {
                                            setUserStatus(e.value);
                                            setData(prevState => ({
                                                ...prevState,
                                                passive: e.value
                                            }));
                                        }
                                    }}/>
                            </div>
                        </div>
                    </div>
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="text-sm mt-2 text-gray-800 ">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="underline text-sm text-gray-600 hover:text-gray-900  rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 "
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 font-medium text-sm text-green-600 ">
                                A new verification link has been sent to your email address.
                            </div>
                        )}
                    </div>
                )}
                <div className="row">
                    <div className="col-12">
                        {(clientVaules?.some(x => x.value === 'ALL') || locationValues?.some(x => x.value === 'ALL')) ? (
                            <h4 className={'text-red-600'}>Indien een 'ALL'-item is geselecteerd, kunt u geen andere
                                keuzes maken</h4>
                        ) : null}
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <PermissionsTable dataSource={authsData ?? null} setDataSource={setAuthsData}/>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600 ">Saved.</p>
                    </Transition>
                </div>
            </form>
            {toast && (
                <ToastMessage
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </section>
    );
}

function UpdateContactPersonUserInformation({
                                                mustVerifyEmail,
                                                status,
                                                className = '',
                                                user,
                                                buildings,
                                                client,
                                                permissions,
                                            }: {
    mustVerifyEmail: boolean,
    status?: string,
    className?: string,
    user: User,
    buildings: BuildingProps[],
    client: CustomerProps
    permissions: RouteAuths[],
}) {
    const [authsData, setAuthsData] = useState<RouteAuths[]>(permitableContactPersonList);
    const [locationValues, setLocationValues] = useState<{ value: string, label: string }[] | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [selectsOptions, setselectOptions] = useState({
        role: [
            {value: 'user', label: 'User'},
            {value: 'Client', label: 'Client'},
            {value: 'supervisor', label: 'Supervisor'},
            {value: 'personel', label: 'Personnel'},
            {value: 'admin', label: 'Admin'},
        ],
        connectedBuild: [
            {value: 'ALL', label: 'All'},
            ...(buildings && buildings.length > 0 ? buildings.map((item: BuildingProps) => ({
                value: item.id,
                label: item.BuildingName
            })) : [])
        ],
        connectedCustomer: {value: client.CustomerID, label: client.Unvan},
    });
    const [clientVaules, selClientValues] = useState<{
        value: string,
        label: string
    } | null>(selectsOptions.connectedCustomer);

    useEffect(() => {
        if (permissions && Array.isArray(permissions)) {
            setAuthsData(mergePermissions(permitableContactPersonList(), permissions));
            setData('permissions', authsData);
        }
        if (user.connectedBuild === 'ALL') {
            setLocationValues([{value: 'ALL', label: 'All'}]);
            setData(previousData => ({
                ...previousData,
                connectedBuild: 'ALL',
            }))
        } else if (user.connectedBuild != 'ALL' && user.buildings) {
            user.buildings.map(x => {
                try {
                    let a = selectsOptions.connectedBuild.find(y => y.value == x.id.toString());
                    if (a) {
                        setLocationValues(prevState => [
                            ...(prevState || []),
                            {value: a.value.toString(), label: a.label}
                        ])
                    }
                } catch (e) {
                    console.log(e);
                }
            })
        }
    }, [user]);
    useEffect(() => {
        setData('permissions', authsData);
    }, [authsData]);
    useEffect(() => {
        if (data.connectedBuild != 'ALL') {
            setData('willbuilds', locationValues ? locationValues : []); // locationValues'u bir array olarak ayarlıyoruz
        } else {
            setData('willbuilds', []);
        }
    }, [locationValues]);
    useEffect(() => {
        setData('willclients', clientVaules ? [{value: clientVaules.value, label: clientVaules.label}] : []); // clientVaules'u bir array olarak ayarlıyoruz

    }, [clientVaules]);
    const {data, setData, patch, errors, processing, recentlySuccessful} = useForm({
        id: user.id,
        name: user.name,
        email: user.email,
        email_verified_at: user.email_verified_at,
        roleName: user.roleName,
        connectedBuild: user.connectedBuild,
        connectedCustomer: user.connectedCustomer,
        bann: user.bann,
        permissions: authsData,
        willbuilds: user.buildings?.map(x => ({value: x.id.toString(), label: x.BuildingName})),
        willclients: user.customers?.map(x => ({value: x.CustomerID, label: x.Unvan})),
    });
    useEffect(() => {
        console.log(data);
    }, [data]);
    const submit: React.FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update.other'), {
            preserveScroll: true,
            onSuccess: () => {
                setToast({message: 'Profil başarıyla güncellendi!', type: 'success'});
                setTimeout(() => {
                    window.location.reload();
                }, 1000); // Mesaj gösterildikten sonra 1 saniye bekleyip sayfayı yeniler
            },
            onError: (err) => {
                const errorMessage = err?.message || 'Bir hata oluştu!'; // Eğer JSON mesaj varsa burada gösteririz
                setToast({message: errorMessage, type: 'error'});
            },
        });
    };
    const tableColumns = permitionsTableColumns(authsData, setAuthsData);

    const fetchLocationSelect = (e: any) => {
        if (Array.isArray(e) && e.some(x => x.value === 'ALL')) {
            data.connectedBuild = 'ALL'
            setData('willbuilds', []);
            const v = e.filter(x => x.value === 'ALL');
            setLocationValues(v);
        } else {
            data.connectedBuild = 'various'
            setLocationValues(e);
        }
    }
    const NewUserSendChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 ">Rechteninformatie</h2>
            </header>

            <form onSubmit={submit} className="centered col-sm-12">
                <div className="row">
                    <div className="col-12">
                        <PermissionsTable dataSource={authsData ?? null} setDataSource={setAuthsData}/>
                    </div>
                </div>
                <div className="flex items-center col-12">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600 ">Saved.</p>
                    </Transition>
                </div>
            </form>
            {toast && (
                <ToastMessage
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </section>
    );
}

export {UpdateContactPersonUserInformation};
