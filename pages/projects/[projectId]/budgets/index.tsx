import DatePicker from "react-datepicker";
import {Button, ButtonGroup, Divider, Skeleton, SkeletonCircle} from "@chakra-ui/react";
import ProjectViewLayout from "../../../../components/nav/ProjectViewLayout";
import React, {useState} from "react";
import {BsPlus} from "react-icons/bs";
import CreateOrEditBudgetForm from "../../../../components/budget/CreateOrEditBudget";
import {BudgetTile} from "../../../../components/budget/BudgetTile";
import {useSelector} from "react-redux";
import {BudgetModel} from "../../../../models/budget.model";
import {selectBudgetState} from "../../../../store/slices/budget.slice";
import {useRouter} from "next/router";
import {selectActiveProjectState} from "../../../../store/slices/projects.slice";

export default function BudgetHome() {
    const [startDate, setStartDate] = React.useState(new Date());
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const budgets: BudgetModel[] = useSelector(selectBudgetState);
    const activeProject = useSelector(selectActiveProjectState);
    const router = useRouter();

    React.useEffect(() => {
        if (budgets.length > 0) {
            setIsPageLoading(false);
        }
    }, [budgets]);

    return (
        <ProjectViewLayout title={'Budgets'}>
            <main className="page-view px-4 md:px-8 py-6">
                <div className="toolbar mb-6 flex justify-between align-items-center">
                    <h1 className="font-bold text-xl md:text-2xl">Budgets</h1>
                    <div className="date">
                        <div className="actions flex justify-end">
                            <div style={{width: "160px"}}>
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
                    <div className="md:flex justify-between align-items-center">
                        <div className="leading" style={{width: "180px"}}></div>
                        <ButtonGroup spacing="4">
                            <Button
                                colorScheme="purple"
                                onClick={() => setShowAddModal(true)}
                            >
                                <BsPlus/>
                                &nbsp;Add Budget
                            </Button>
                            {/*<Button>Add Expense</Button>*/}
                        </ButtonGroup>
                    </div>
                </div>
                <Divider/>
                {isPageLoading && <PageLoadingSchema />}
                {(budgets?.length > 0 && !isPageLoading) && (<div className="budget-body mt-4">
                    {budgets.map((budget, index) => {
                        return <BudgetTile key={index}
                                           onClick={() => router.push(`/projects/${activeProject?.id}/budgets/${budget._id}`)}
                                           budget={budget}/>;
                    })}
                </div>)}
                {(budgets?.length == 0 && !isPageLoading) &&(
                    <div className="budget-body mt-4">
                        <div className={`emptyState w-max-50`}>
                            <img
                                className={`emptyStateImage mb-6`}
                                src="/images/no_budget.png"
                                alt="no"
                            />
                            <h2 className="text-slate-900 font-bold text-2xl">
                                No budgets to show
                            </h2>
                            <p className="mb-4 text-md text-slate-400">
                                You have not created a budget, all your budget
                                will show here
                            </p>
                        </div>
                    </div>)}

                {/*    modals*/}
                <CreateOrEditBudgetForm
                    open={showAddModal}
                    onClose={() => setShowAddModal(false)}
                />
            </main>
        </ProjectViewLayout>
    );
}

function PageLoadingSchema() {
    return (
        <div className={'pt-10'}>
            <div className="mb-8">
                <Skeleton height={'20px'} />
                <Skeleton mt='2' height={'50px'} />
            </div>
            <div className="mb-8">
                <Skeleton height={'20px'} />
                <Skeleton mt='2' height={'50px'} />
            </div>
            <div className="mb-8">
                <Skeleton height={'20px'} />
                <Skeleton mt='2' height={'50px'} />
            </div>
            <div className="mb-8">
                <Skeleton height={'20px'} />
                <Skeleton mt='2' height={'50px'} />
            </div>
            <div className="mb-8">
                <Skeleton height={'20px'} />
                <Skeleton mt='2' height={'50px'} />
            </div>
        </div>
    )
}