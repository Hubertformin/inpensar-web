import * as dayjs from "dayjs";

declare type DateFilter = 'today' | 'this_week' | 'this_month' | 'this_year';

export function getStartAndEndDateFromDateFilter(value: DateFilter | string): {startDate: string, endDate: string} {
    const date = dayjs();
    let startDate = '', endDate = '';

    switch (value) {
        case 'today':
            startDate = date.startOf('day').toISOString().split('T')[0];
            endDate = date.endOf('day').toISOString().split('T')[0];
            break;
        case 'this_week':
            startDate = date.startOf('week').toISOString().split('T')[0];
            endDate = date.endOf('week').toISOString().split('T')[0];
            break;
        case 'this_month':
            startDate = date.startOf('month').toISOString().split('T')[0];
            endDate = date.endOf('month').toISOString().split('T')[0];
            break;
        case 'this_year':
            startDate = date.startOf('year').toISOString().split('T')[0];
            endDate = date.endOf('year').toISOString().split('T')[0];
            break;
    }

    return { startDate, endDate }
}