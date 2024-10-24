import { useState, PropsWithChildren, ReactNode } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/react';
import { User } from '@/types';
import TileButton from '@/Components/TileButton';
import { faEnvelope, faCaretSquareUp, faCalendarCheck, faSquareCaretUp, faBuilding, faUser } from '@fortawesome/free-regular-svg-icons'

export default function MainMenuButtons({ user }: PropsWithChildren<{ user: User}>) {

    return (
        <div className="row py-12">
            <div className="row p-12 ">
                <div id='Buttons'
                     className="space-1 overflow-hidden shadow-sm sm:rounded-lg grid grid-cols-4 gap-2 flex items-center place-content-stretch">
                    <TileButton className='flex-1' text={"SuperVisor Dashboard"} ikon={faCaretSquareUp} link={'fakedash/supervisor'}/>
                    <TileButton className='flex-1' text={"Personel Dashboard"} ikon={faCaretSquareUp} link={'fakedash/personnel'}/>
                    <TileButton className='flex-1' text={"CManager Dashboard"} ikon={faCaretSquareUp} link={'fakedash/cmanager'}/>
                    <TileButton className='flex-1' text={"User Dashboard"} ikon={faCaretSquareUp} link={'fakedash/User'}/>
                    <TileButton className='flex-1' text={"ReactEmailPreview"} ikon={faCaretSquareUp} link={'/email-preview'}/>
                </div>
            </div>
            <div className="row p-12 ">
                <div id='Buttons'
                     className="space-1 overflow-hidden shadow-sm sm:rounded-lg grid grid-cols-4 gap-2 flex items-center place-content-stretch">
                    <TileButton className='flex-1' text={"TICKETS"} ikon={faEnvelope} link={route('tickets')}/>
                    <TileButton className='flex-1' text={"WORKPLAN"} ikon={faCalendarCheck} link={route('clients')}/>
                    <TileButton className='flex-1' text={"Offertes"} ikon={faEnvelope} link={route('clients')}/>
                    <TileButton className='flex-1' text={"Locations"} ikon={faBuilding} link={route('locations')}/>
                </div>
            </div>
            <div className="row p-12">
                <div id='Buttons'
                     className="space-1 overflow-hidden shadow-sm sm:rounded-lg grid grid-cols-4 gap-2 flex items-center place-content-stretch">
                    <TileButton className='flex-1' text={"Users Management"} ikon={faUser} link={route('userboard')}/>
                    <TileButton className='flex-1' text={"CUSTOMER"} ikon={faSquareCaretUp} link={route('clients')}/>
                </div>
            </div>
        </div>

    )
}
