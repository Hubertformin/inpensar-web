
import ProjectViewLayout from "../../../components/nav/ProjectViewLayout";
import DatePicker from "react-datepicker";
import React from "react";

export default function Dashboard() {
    const [startDate, setStartDate] = React.useState(new Date());
    const [endDate, setEndDate] = React.useState(new Date());

    function onDateRangeSelect(dates) {
        console.log(dates)
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    }

    return (
        <ProjectViewLayout>
            <main className="page-view px-6 py-6">
                <div className="toolbar mb-6 flex justify-between align-items-center">
                    <h1 className="font-bold text-2xl">Dashboard</h1>
                    <div className="date">
                        <div className="actions flex">
                            <div className="mr-3" style={{ width: "320px" }}>
                                <DatePicker
                                    startDate={startDate}
                                    onChange={onDateRangeSelect}
                                    dateFormat="dd MMMM, yyyy"
                                    endDate={endDate}
                                    selectsRange
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </ProjectViewLayout>
    )
}