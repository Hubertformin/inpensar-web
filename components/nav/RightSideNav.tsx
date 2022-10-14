import styles from "../../styles/RightSideNav.module.scss";
import React from "react";
import {BudgetModel} from "../../models/budget.model";
import {useSelector} from "react-redux";
import {selectBudgetState} from "../../store/slices/budget.slice";
import {BudgetTile} from "../budget/BudgetTile";
import AccountTile from "../accounts/AccountTile";
import {AccountsModel} from "../../models/accounts.model";
import {selectAccountBalanceState, selectAccountsState} from "../../store/slices/accounts.slice";

export default function RightSideNav() {
    const budgets: BudgetModel[] = useSelector(selectBudgetState);
    const accounts: AccountsModel[] = useSelector(selectAccountsState);
    const balance: number = useSelector(selectAccountBalanceState);

    return (
        <div className={styles.sideNavContainer}>
            <div className={`${styles.topContainer}`}>
                <div className={`${styles.header} pt-4 px-6`}>
                    <h4 className="tex-lg font-bold">This month's budgets</h4>
                </div>
                <div className={`${styles.list} px-6 mt-4`}>
                    {budgets?.length > 0 ? (<div className="budget-body mt-4">
                        {budgets.map((budget, index) => {
                            return <BudgetTile isSummary={true} key={index} budget={budget}/>;
                        })}
                    </div>) : (
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
                <div className={`${styles.header} pt-4 px-6`}>
                    <h4 className="tex-lg font-bold">Accounts</h4>
                </div>
                <div className="px-6 pt-6">
                    {
                        accounts.length > 0 ? accounts.map((account, index) => {
                            return (<AccountTile size={'sm'} key={'account_tile_' + index} account={account}/>)
                        }) : (
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