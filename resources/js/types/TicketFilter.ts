import React, {useState, useEffect, useRef} from 'react';
import moment from 'moment';
import {TicketsDataProps, TicketSum} from "@/types/globalProps";
import {contactPersonsColumnsCreator} from "@/Components/Columns";


export interface TicketFilterProps {
    allTickets: TicketsDataProps[];
    id: number | -2;
    customer: string | 'all';
    building: string | "-2";
    status: string | 'all';
    filterforDate: boolean | false;
    startDate: Date;
    endDate: Date;
    Title: string | '';
    ticketType: string | 'all';
    dateRange?: string;
}

export function isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
}

export function isThisWeek(date: Date): boolean {
    const today = new Date();
    const firstDayOfWeek = today.getDate() - today.getDay() +1; // Haftanın ilk günü (Pazar)
    const startOfWeek = new Date(today.setDate(firstDayOfWeek));
    const endOfWeek = new Date(today.setDate(firstDayOfWeek + 6));

    if (endOfWeek < startOfWeek) {
        endOfWeek.setMonth(startOfWeek.getMonth() + 1); // Yeni ayı ayarla
    }
    startOfWeek.setHours(0, 0, 0, 0);
    endOfWeek.setHours(23, 59, 59, 999);
    return date >= startOfWeek && date <= endOfWeek;
}

export function isThisMonth(date: Date): boolean {
    const today = new Date();
    return date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
}

export function isThisYear(date: Date): boolean {
    const today = new Date();
    return date.getFullYear() === today.getFullYear();
}

export async function calculateStatuses(t: TicketsDataProps[], listView: boolean | undefined): Promise<TicketSum[]> {
    let sums: TicketSum[] = [];
    const allSum: TicketSum = {
        title: 'all',
        percentage: '100',
        value: t.length,
        cardlabel: '',
    }
    const newSumCount: number =  t.filter(x => x.status === 'New').length;
    const progresCount: number =  t.filter(x => x.status === 'In Progress').length;
    const holdsCount: number =  t.filter(z => z.status === 'On Hold').length;
    let closedCount: number;
    if (listView)
        closedCount = t.filter(z => z.status === 'Closed' || z.status === 'Cancelled').length;
    else
        closedCount = t.filter(z => z.status === 'Closed').length;
    const canceledCount: number = t.filter(z => z.status === 'Cancelled').length;

    const totalCount = newSumCount + progresCount + closedCount + holdsCount;
    let newSumPers: number, progressPers: number, closedPers: number, holdPers: number;

    if (newSumCount > 0) newSumPers = (newSumCount / totalCount) * 100; else newSumPers = 0;
    if (progresCount > 0) progressPers = (progresCount / totalCount) * 100; else progressPers = 0;
    if (closedCount > 0) closedPers = (closedCount / totalCount) * 100; else closedPers = 0;
    if (holdsCount > 0) holdPers = (holdsCount / totalCount) * 100; else holdPers = 0;

    // Virgülden sonra iki hane olacak şekilde güncellenmiş kod:
    const newSum: TicketSum = {
        title: 'New',
        percentage: newSumPers.toFixed(2),  // Virgülden sonra 2 hane
        value: newSumCount,
        cardlabel: '',
    }
    sums.push(newSum);

    const progSum: TicketSum = {
        title: 'prog',
        percentage: progressPers.toFixed(2),  // Virgülden sonra 2 hane
        value: progresCount,
        cardlabel: '',
    }
    sums.push(progSum);

    const closedSums: TicketSum = {
        title: 'closed',
        percentage: closedPers.toFixed(2),  // Virgülden sonra 2 hane
        value: closedCount,
        cardlabel: '',
    }
    sums.push(closedSums);

    sums.push(allSum);

    const sumHolds: TicketSum = {
        title: 'on hold',
        percentage: holdPers.toFixed(2),  // Virgülden sonra 2 hane
        value: holdsCount,
        cardlabel: '',
    }
    sums.push(sumHolds);
    const sumCanceled: TicketSum = {
        title: 'canceled',
        percentage: canceledCount.toFixed(2),
        value: canceledCount,
        cardlabel: '',
    }
    sums.push(sumCanceled);
    return sums;
}

export function ticketFilter(t: TicketFilterProps): any {
    let filteredTickets: TicketsDataProps[] = t.allTickets;
    if (t.dateRange === 'all' && t.customer === 'all' && t.ticketType === 'all' && t.building === "-2" && t.status === 'all' && t.Title.trim() === "" && t.filterforDate === false && t.id === -2) {
        return filteredTickets;
    } else {
        if (t.id !== -2) {
            filteredTickets = filteredTickets.filter(x => x.id == t.id);
        }
        if (t.Title !== '') {
            filteredTickets = filteredTickets.filter(x => x.title.toLowerCase().includes(t.Title.toLowerCase()));
        }
        if (t.customer !== 'all') {
            filteredTickets = (filteredTickets.filter(x => x.customer === t.customer));
        }
        if (t.building !== "-2") {
            filteredTickets = (filteredTickets.filter(x => x.building == t.building));
        }
        if (t.status !== 'all') {
            if (t.status == 'Closed&Canceled')
                filteredTickets = (filteredTickets.filter(x =>( x.status == 'Closed' || x.status == 'Cancelled')))
            else
                filteredTickets = (filteredTickets.filter(x => x.status === t.status));
        }
        if (t.ticketType !== 'all') {
            filteredTickets = filteredTickets.filter(x => {
                if (x.assigned_type && x.assigned_type !== '') {
                    return x.assigned_type === t.ticketType;
                } else {
                    return x.ticket_type === t.ticketType;
                }
            });
        }

        if (t.dateRange === 'today') {
            filteredTickets = filteredTickets.filter(x => isToday(new Date(x.created_at)));
        } else if (t.dateRange === 'thisWeek') {
            filteredTickets = filteredTickets.filter(x => isThisWeek(new Date(x.created_at)));
        } else if (t.dateRange === 'thisMonth') {
            filteredTickets = filteredTickets.filter(x => isThisMonth(new Date(x.created_at)));
        } else if (t.dateRange === 'thisYear') {
            filteredTickets = filteredTickets.filter(x => isThisYear(new Date(x.created_at)));
        }

        if (t.filterforDate && t.startDate && t.endDate) {
            const startDate = new Date(t.startDate);
            const endDate = new Date(t.endDate);
            filteredTickets = filteredTickets.filter(x => {
                const ticketDate = new Date(x.created_at);
                return ticketDate >= startDate && ticketDate <= endDate;
            });
        }
    }

    return filteredTickets;
}
