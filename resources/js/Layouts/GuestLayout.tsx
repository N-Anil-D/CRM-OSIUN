import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import ThemeSwitcher from '@/Components/ThemeSwitcher';
export default function Guest({ children }: PropsWithChildren) {
    return (
        <div
            className="login-back-image min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100 dark:bg-gray-900">
            <div>
                <ApplicationLogo className="log-logo h-auto fill-current text-gray-500" alt="Logo"/>
            </div>
            <div className='mt-2 border-4 border-solid border-rainbow animate-spin sm:rounded-lg'>
                <div className="w-full sm:max-w-lg px-12 py-8 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg ">
                    {children}
                </div>
            </div>

        </div>
    );
}
