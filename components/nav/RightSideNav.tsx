import styles from "../../styles/RightSideNav.module.scss";
import React from "react";
import {BudgetModel} from "../../models/budget.model";
import {useSelector} from "react-redux";
import {selectBudgetLoadingState, selectBudgetState} from "../../store/slices/budget.slice";
import {BudgetTile} from "../budget/BudgetTile";
import AccountTile from "../accounts/AccountTile";
import {AccountsModel} from "../../models/accounts.model";
import {selectAccountLoadingState, selectAccountsState} from "../../store/slices/accounts.slice";
import {Grid, GridItem, Skeleton, SkeletonCircle} from "@chakra-ui/react";
import useApi from "../../hooks/useApi";
import {selectActiveProjectState} from "../../store/slices/projects.slice";

export default function RightSideNav() {
    const budgets: BudgetModel[] = useSelector(selectBudgetState);
    const accounts: AccountsModel[] = useSelector(selectAccountsState);
    const api = useApi();
    const activeProject = useSelector(selectActiveProjectState);
    const accountLoading: boolean = useSelector(selectAccountLoadingState);
    const budgetLoading: boolean = useSelector(selectBudgetLoadingState);

    async function loadAccountsAndBudget() {
        if (activeProject && budgets.length == 0) {
            await api.getBudgets().catch(err => console.error(err));
        }

        if (accounts.length == 0) {
            await api.getAccounts().catch(err => console.error(err));
        }
    }

    React.useEffect(() => {
        loadAccountsAndBudget();
    }, []);

    return (
        <div className={styles.sideNavContainer}>
            <div className={`${styles.topContainer}`}>
                <div className={`${styles.header} pt-4 md:px-6`}>
                    <h4 className="tex-lg font-bold">This month&apos;s budgets</h4>
                </div>
                <div className={`${styles.list} md:px-6 mt-4`}>
                    {budgetLoading && <BudgetLoadingSchema/>}
                    {(budgets?.length > 0 && !budgetLoading) && (<div className="budget-body mt-4">
                        {budgets.map((budget, index) => {
                            return <BudgetTile isSummary={true} key={index} budget={budget}/>;
                        })}
                    </div>)}
                    {(budgets?.length == 0 && !budgetLoading) && (
                        <div className="budget-body mt-4">
                            <div className={`emptyState`}>
                                <img
                                    className={`emptyStateImage mb-6`}
                                    src="/images/no_budget.png"
                                    alt="no"
                                />
                                <h2 className="text-slate-900 font-bold text-lg">
                                    No budgets this month
                                </h2>
                                <p className="mb-4 text-sm text-slate-400">
                                    You have not created a budget, active budgets will show here
                                </p>
                            </div>
                        </div>)}
                </div>
            </div>
            <div className={styles.bottomContainer}>
                <div className={`${styles.header} pt-4 md:px-6`}>
                    <h4 className="tex-lg font-bold">Accounts</h4>
                </div>
                <div className="md:px-6 pt-6">
                    {accountLoading && <AccountsLoadingSchema/>}
                    {(accounts.length > 0 && !accountLoading) && accounts.map((account, index) => {
                        return (<AccountTile size={'sm'} key={'account_tile_' + index} account={account}/>)
                    })}
                    {(accounts.length == 0 && !accountLoading) && (
                        <div className="budget-body">
                            <div className={`emptyState pt-16 w-max-50`}>
                                <img
                                    className={`emptyStateImage mb-6`}
                                    src="/images/no_accounts.svg"
                                    style={{height: '100px'}}
                                    alt="no"
                                />
                                <h2 className="text-slate-900 font-bold text-lg">
                                    No accounts to show
                                </h2>
                                <p className="mb-4 text-sm text-slate-400">
                                    You have not created an account, all your accounts
                                    will show here
                                </p>
                            </div>
                        </div>)
                    }
                </div>
            </div>
        </div>
    )
}

function BudgetLoadingSchema() {
    return (
        <div className={'pt-6'}>
            <div className="mb-6">
                <Skeleton height={'20px'}/>
                <Skeleton mt='2' height={'40px'}/>
            </div>
            <div className="mb-6">
                <Skeleton height={'20px'}/>
                <Skeleton mt='2' height={'40px'}/>
            </div>
            <div className="mb-6">
                <Skeleton height={'20px'}/>
                <Skeleton mt='2' height={'40px'}/>
            </div>
            <div className="mb-6">
                <Skeleton height={'20px'}/>
                <Skeleton mt='2' height={'40px'}/>
            </div>
        </div>
    )
}

function AccountsLoadingSchema() {
    return (
        <div>
            <Grid mt='6' templateColumns='repeat(6, 1fr)' gap={6}>
                <GridItem w='100%'>
                    <SkeletonCircle size='55'/>
                </GridItem>
                <GridItem colSpan={5} w='100%'>
                    <Skeleton height={'20px'}/>
                    <Skeleton mt='2' height={'25px'}/>
                </GridItem>
            </Grid>
            <Grid mt='6' templateColumns='repeat(6, 1fr)' gap={6}>
                <GridItem w='100%'>
                    <SkeletonCircle size='55'/>
                </GridItem>
                <GridItem colSpan={5} w='100%'>
                    <Skeleton height={'20px'}/>
                    <Skeleton mt='2' height={'25px'}/>
                </GridItem>
            </Grid>
            <Grid mt='6' templateColumns='repeat(6, 1fr)' gap={6}>
                <GridItem w='100%'>
                    <SkeletonCircle size='55'/>
                </GridItem>
                <GridItem colSpan={5} w='100%'>
                    <Skeleton height={'20px'}/>
                    <Skeleton mt='2' height={'25px'}/>
                </GridItem>
            </Grid>
        </div>
    )
}
