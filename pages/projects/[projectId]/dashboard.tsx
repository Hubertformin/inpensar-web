
import ProjectViewLayout from "../../../components/nav/ProjectViewLayout";
import DatePicker from "react-datepicker";
import React, {useState} from "react";
import dayjs from "dayjs";
import {Divider, Select, Skeleton, useToast} from "@chakra-ui/react";
import useUtils from "../../../hooks/useUtils";
import dynamic from "next/dynamic";
import CategoriesReportsTable from "../../../components/dashboard/CategoriesReportsTable";
import styles from '../../../styles/Dashboard.module.scss'
import useApi from "../../../hooks/useApi";
import {useSelector} from "react-redux";
import {selectAuthUserState} from "../../../store/slices/auth.slice";
import {selectAnalyticsFilters, selectAnalyticsState} from "../../../store/slices/analytics.slice";
import {AnalyticsModel} from "../../../models/analytics.model";

const MonthlyChart = dynamic(
    () => import("../../../components/dashboard/MonthlyChart"),
    { ssr: false }
);

export default function Dashboard() {
    const [startDate, setStartDate] = React.useState<Date>();
    const [endDate, setEndDate] = React.useState(new Date());
    const [isPageLoading, setIsPageLoading] = React.useState(true);
    const [dateFilter, setDateFilter] = useState<string>('this_month');
    const utils = useUtils();
    const api = useApi();
    const toast = useToast();
    // Redux states
    const authUserState = useSelector(selectAuthUserState);
    const analyticsState: AnalyticsModel = useSelector(selectAnalyticsState);
    const analyticsFilters = useSelector(selectAnalyticsFilters);

    React.useEffect(() => {
        if (analyticsFilters.startDate && analyticsFilters.endDate) {
            setStartDate(new Date(analyticsFilters.startDate))
            setEndDate(new Date(analyticsFilters.endDate))
        } else {
            const startOfMonth = dayjs().startOf('month').toDate();
            setStartDate(startOfMonth);
        }

        if (analyticsFilters.dateFilter) {
            console.log(analyticsFilters.dateFilter)
            setDateFilter(dateFilter)
        }
    }, []);

    React.useEffect(() => {
        // get reports
        if (authUserState._id && !analyticsState) {
            api.getProjectReports({ dateFilter: 'this_month' })
                .then(() => setIsPageLoading(false))
                .catch(console.error)
        } else {
            setIsPageLoading(false);
        }
    }, [authUserState, analyticsState]);

    function onFilterDate(props: {startDate?: string, endDate?: string, dateFilter?: string}) {
        setIsPageLoading(true)
        api.getProjectReports(props).then(console.log).catch((e) => {
            console.error(e);
            toast({
                title: 'Failed to load Analytics',
                description: 'We are not able to load your analytics at this time. Please try again later',
                status: "warning"
            })
        })
    }

    function onDateFilterChange(event) {
        const value = event.target.value;
        setDateFilter(value);
        // It the user selects custom, the date picker will be used
        if (value === 'custom') return;
        // If the value is all, fetch all data from the database
        // Load filters
        onFilterDate({ dateFilter: value });
    }

    function onDateRangeSelect(dates) {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
        // Load data if both dates have been set
        if (start && end) {
            // Find new Data
            onFilterDate({ startDate: start.toISOString().split('T')[0], endDate: end.toISOString().split('T')[0]});
        }
    }

    return (
        <ProjectViewLayout title={'Dashboard'}>
            <main className="page-view px-4 md:px-6">
                <div className={` ${styles.toolbar} toolbar mb-2 flex justify-between align-items-center items-center`}>
                    <div className="leading">
                        <h1 className="font-bold text-xl md:text-2xl">Dashboard</h1>
                        <p className="text-slate-500">This month</p>
                    </div>
                    <div className="date">
                        <div className="actions flex">
                            <div className={'w-40'}>
                                <Select disabled={isPageLoading} value={dateFilter} onChange={onDateFilterChange}>
                                    <option value="this_week">This Week</option>
                                    <option value="this_month">This Month</option>
                                    <option value="this_year">This Year</option>
                                    <option value="custom">Custom</option>
                                </Select>
                            </div>
                            {dateFilter === 'custom' && <div className="ml-3" style={{width: "240px"}}>
                                <DatePicker
                                    startDate={startDate}
                                    onChange={onDateRangeSelect}
                                    dateFormat="dd MMM yyyy"
                                    endDate={endDate}
                                    selectsRange
                                />
                            </div>}
                        </div>
                    </div>
                </div>
                    <Divider />
                {isPageLoading ?
                    <DashboardSkeleton /> :
                    <div className={`${styles.viewBody} pt-4`}>
                    <div className="cards md:grid md:grid-cols-3 md:gap-4 mb-6">
                        <div className="">
                            <div className={"data-card rounded-lg py-3 px-3 border md:border-0 mb-4 md:mb-0 md:shadow flex items-center h-20"}>
                                <img src="/icons/income_icon.jpg" alt="" className={"h-11 w-11 rounded-full"}/>
                                <div className="text pl-2">
                                    <p className="font-semibold text-sm mb-0">Earnings</p>
                                    <h3 className="font-bold text-blue-500 text-xl">{/*utils.formatCurrency(10500000) :*/ utils.formatShortCurrency(analyticsState?.earnings)}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="">
                            <div className="data-card rounded-lg py-3 px-3 border md:border-0 mb-4 md:mb-0 md:shadow flex items-center h-20">
                                <img src="/icons/expense_icon.jpg" alt="" className={"h-12 w-12 rounded-full"}/>
                                <div className="text pl-2">
                                    <p className="font-semibold text-sm mb-0">Expenses</p>
                                    <h3 className="font-bold text-red-500 text-xl">{/*utils.formatCurrency(10500000) :*/ utils.formatShortCurrency(analyticsState?.expenses)}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="">
                            <div className="data-card rounded-lg py-3 px-3 border md:border-0 mb-4 md:mb-0 md:shadow flex items-center h-20">
                                <img src="/icons/balance_icon.jpg" alt="" className={"h-12 w-12 rounded-full"}/>
                                <div className="text pl-2">
                                    <p className="font-semibold text-sm mb-0">Balance</p>
                                    <h3 className="font-bold text-purple-500 text-xl">{/*utils.formatCurrency(10500000) :*/ utils.formatShortCurrency(analyticsState?.balance)}</h3>
                                </div>
                            </div>
                        </div>
                        {/*<div className="savings">*/}
                        {/*    <div className="data-card rounded-lg py-3 px-3 border md:border-0 mb-4 md:mb-0 md:shadow flex items-center h-20">*/}
                        {/*        <img src="/icons/savings_icon.jpg" alt="" className={"h-12 w-12 rounded-full"}/>*/}
                        {/*        <div className="text pl-2">*/}
                        {/*            <p className="font-semibold text-sm mb-0">Savings</p>*/}
                        {/*            <h3 className="font-bold text-green-500 text-xl"> utils.formatShortCurrency(2000000)}</h3>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </div>
                    <div className="area-chart shadow rounded-lg md:px-3 mb-4 pt-4">
                        <div className="title">
                            <h4 className="font-bold text-sm px-4">Activity this month</h4>
                        </div>
                        <MonthlyChart />
                    </div>
                    <CategoriesReportsTable />
                </div>}
            </main>
        </ProjectViewLayout>
    )
}

function DashboardSkeleton() {
    return(
        <div className="">
            <div className="cards md:grid md:grid-cols-3 md:gap-4 mb-3">
                <Skeleton height='100px' />
                <Skeleton height='100px' />
                <Skeleton height='100px' />
            </div>
            <div className="area-chart mb-4 pt-4">
                <Skeleton height='350px' />
            </div>
            <div className="area-chart mb-4 pt-4">
                <Skeleton height='240px' />
            </div>
        </div>
    )
}