
import ProjectViewLayout from "../../../components/nav/ProjectViewLayout";
import DatePicker from "react-datepicker";
import React from "react";
import dayjs from "dayjs";
import {Divider, Select} from "@chakra-ui/react";
import useUtils from "../../../hooks/useUtils";
import dynamic from "next/dynamic";
import CategoriesReportsTable from "../../../components/dashboard/CategoriesReportsTable";
import styles from '../../../styles/Dashboard.module.scss'

const MonthlyChart = dynamic(
    () => import("../../../components/dashboard/MonthlyChart"),
    { ssr: false }
);

export default function Dashboard() {
    const [startDate, setStartDate] = React.useState<Date>();
    const [endDate, setEndDate] = React.useState(new Date());
    const [showDatePicker, setShowDatePicker] =React.useState(false);
    const utils = useUtils();

    React.useEffect(() => {
        const startOfMonth = dayjs().startOf('month').toDate();
        setStartDate(startOfMonth)
    }, []);

    const onRangeSelect = (val) => {
        console.log(val)
        switch (val) {
            case 'This Week':
                setStartDate(dayjs().startOf('week').toDate());
                setShowDatePicker(false);
                break;
            case 'This Month':
                setStartDate(dayjs().startOf('month').toDate());
                setShowDatePicker(false);
                break;
            case 'This Year':
                setStartDate(dayjs().startOf('year').toDate());
                setShowDatePicker(false);
                break;
            case 'Custom':
                setStartDate(new Date());
                setShowDatePicker(true);
                break;
        }
        console.log(startDate)
    }

    function onDateRangeSelect(dates) {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
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
                                <Select defaultValue="This Month" onChange={e => onRangeSelect(e.target.value)}>
                                    <option value="This Week">This Week</option>
                                    <option value="This Month">This Month</option>
                                    <option value="This Year">This Year</option>
                                    <option value="Custom">Custom</option>
                                </Select>
                            </div>
                            {showDatePicker && <div className="ml-3" style={{width: "320px"}}>
                                <DatePicker
                                    startDate={startDate}
                                    onChange={onDateRangeSelect}
                                    dateFormat="dd MMMM, yyyy"
                                    endDate={endDate}
                                    selectsRange
                                />
                            </div>}
                        </div>
                    </div>
                </div>
                    <Divider />
                <div className={`${styles.viewBody} pt-4`}>
                    <div className="cards md:grid md:grid-cols-4 md:gap-4 mb-6">
                        <div className="">
                            <div className={"data-card rounded-lg py-3 px-3 border md:border-0 mb-4 md:mb-0 md:shadow flex items-center h-20"}>
                                <img src="/icons/income_icon.jpg" alt="" className={"h-11 w-11 rounded-full"}/>
                                <div className="text pl-2">
                                    <p className="font-semibold text-sm mb-0">Earnings</p>
                                    <h3 className="font-bold text-blue-500 text-xl">{/*utils.formatCurrency(10500000) :*/ utils.formatShortCurrency(10500000)}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="">
                            <div className="data-card rounded-lg py-3 px-3 border md:border-0 mb-4 md:mb-0 md:shadow flex items-center h-20">
                                <img src="/icons/expense_icon.jpg" alt="" className={"h-12 w-12 rounded-full"}/>
                                <div className="text pl-2">
                                    <p className="font-semibold text-sm mb-0">Expenses</p>
                                    <h3 className="font-bold text-red-500 text-xl">{/*utils.formatCurrency(10500000) :*/ utils.formatShortCurrency(2500000)}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="">
                            <div className="data-card rounded-lg py-3 px-3 border md:border-0 mb-4 md:mb-0 md:shadow flex items-center h-20">
                                <img src="/icons/balance_icon.jpg" alt="" className={"h-12 w-12 rounded-full"}/>
                                <div className="text pl-2">
                                    <p className="font-semibold text-sm mb-0">Balance</p>
                                    <h3 className="font-bold text-purple-500 text-xl">{/*utils.formatCurrency(10500000) :*/ utils.formatShortCurrency(6000000)}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="">
                            <div className="data-card rounded-lg py-3 px-3 border md:border-0 mb-4 md:mb-0 md:shadow flex items-center h-20">
                                <img src="/icons/savings_icon.jpg" alt="" className={"h-12 w-12 rounded-full"}/>
                                <div className="text pl-2">
                                    <p className="font-semibold text-sm mb-0">Savings</p>
                                    <h3 className="font-bold text-green-500 text-xl">{/*utils.formatCurrency(10500000) :*/ utils.formatShortCurrency(2000000)}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="area-chart shadow rounded-lg md:px-3 mb-4 pt-4">
                        <div className="title">
                            <h4 className="font-bold text-sm px-4">Activity this month</h4>
                        </div>
                        <MonthlyChart />
                    </div>
                    <CategoriesReportsTable />
                </div>
            </main>
        </ProjectViewLayout>
    )
}