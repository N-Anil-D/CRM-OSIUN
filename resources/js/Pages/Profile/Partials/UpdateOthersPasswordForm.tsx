import { useRef, FormEventHandler } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { PageProps, User } from '@/types';

export default function UpdateOthersPasswordForm({ className = '', user, onHide }:
{ className?: string, user:User, onHide: ()=>void }) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        user:user
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.others.update'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onHide();
                alert('Neiuw Wachtwoord sended.')
            },
            onError: (errors) => {
                alert(errors);
            },
        });
    };

    return (
        <section className={className}>
            <form onSubmit={updatePassword} className="mt-6 space-y-6">

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Send New Password to User</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-red-500">Sended.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
