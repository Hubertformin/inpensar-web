import * as dayjs from "dayjs";

declare type DateFilter = 'today' | 'this_week' | 'this_month' | 'this_year';

export function getStartAndEndDateFromDateFilter(value: DateFilter | string): {startDate: string, endDate: string} {
    const date = dayjs();
    let startDate = '', endDate = '';

    switch (value) {
        case 'today':
            startDate = date.startOf('day').toISOString();
            endDate = date.endOf('day').toISOString();
            break;
        case 'this_week':
            startDate = date.startOf('week').toISOString();
            endDate = date.endOf('week').toISOString();
            break;
        case 'this_month':
            startDate = date.startOf('month').toISOString();
            endDate = date.endOf('month').toISOString();
            break;
        case 'this_year':
            startDate = date.startOf('year').toISOString();
            endDate = date.endOf('year').toISOString();
            break;
    }

    return { startDate, endDate }
}