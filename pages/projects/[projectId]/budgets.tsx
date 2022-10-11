import DatePicker from "react-datepicker";
import { Button, ButtonGroup,Divider,
} from "@chakra-ui/react";
import ProjectViewLayout from "../../../components/nav/ProjectViewLayout";
import Select from "react-select";
import {Data} from "../../../data";
import React, {useState} from "react";
import {BsPlus} from "react-icons/bs";
import CreateBudgetForm from "../../../components/budget/CreateBudget";

export default function BudgetHome() {
    const [startDate, setStartDate] = React.useState(new Date());
    const [showAddModal, setShowAddModal] = useState(false);

    return (
        <ProjectViewLayout>
            <main className="page-view px-8 py-6">
                <div className="toolbar mb-6 flex justify-between align-items-center">
                    <h1 className="font-bold text-2xl">Budgets</h1>
                    <div className="date">
                        <div className="actions flex">
                            {/*<Button onClick={toggleColorMode}>*/}
                            {/*    Toggle {colorMode === 'light' ? 'Dark' : 'Light'}*/}
                            {/*</Button>*/}
                            {/*<div className="mr-3" style={{width: '100px'}}>*/}
                            {/*    <Select placeholder='Year' options={[{label: '2022', value: '2022'}]} />*/}
                            {/*</div>*/}
                            <div className="mr-3" style={{ width: "100px" }}>
                                <Select
                                    defaultValue={Data.month_days[0]}
                                    placeholder="Day"
                                    options={Data.month_days}
                                />
                            </div>
                            <div className="mr-3" style={{ width: "160px" }}>
                                {/*<Select placeholder='Month' options={Data.months} />*/}
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    showMonthYearPicker
                                    dateFormat="MMMM, yyyy"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pg-header mb-4">
                    <div className="flex justify-between align-items-center">
                        <div className="leading" style={{ width: "180px" }}>

                        </div>
                        <ButtonGroup spacing="4">
                            <Button
                                colorScheme="purple"
                                onClick={() => setShowAddModal(true)}
                            >
                                <BsPlus />
                                &nbsp;Add Budget
                            </Button>
                            {/*<Button>Add Expense</Button>*/}
                        </ButtonGroup>
                    </div>
                </div>
                <Divider />
                <div className="mt-4">
                </div>
            {/*    modals*/}
                <CreateBudgetForm open={showAddModal} onClose={() => setShowAddModal(false)} />
            </main>
        </ProjectViewLayout>
    )
}