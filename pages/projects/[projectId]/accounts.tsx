import {
    Button, ButtonGroup, Divider, Skeleton, SkeletonCircle, SkeletonText,
} from "@chakra-ui/react";
import ProjectViewLayout from "../../../components/nav/ProjectViewLayout";
import {BsPlus} from "react-icons/bs";
import React, {useState} from "react";
import styles from '../../../styles/Accounts.module.scss';
import {formatCurrency} from "../../../utils/number";
import CreateOrEditAccount from "../../../components/accounts/CreateOrEditAccount";
import {AccountsModel} from "../../../models/accounts.model";
import {useSelector} from "react-redux";
import {selectAccountBalanceState, selectAccountsState} from "../../../store/slices/accounts.slice";
import AccountTile from "../../../components/accounts/AccountTile";
import useApi from "../../../hooks/useApi";

export default function AccountsHome() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const accounts: AccountsModel[] = useSelector(selectAccountsState);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const balance: number = useSelector(selectAccountBalanceState);
    const api = useApi();

    React.useEffect(() => {
        api.getAccounts().catch(err => console.log(err)).then(() => setIsPageLoading(false));
    }, []);

    const selectAccount = (account) => {
        setSelectedAccount(account);
        setShowAddModal(true);
    }

    function onCloseFormModal() {
        setShowAddModal(false);
        setSelectedAccount(null);
    }

    return (
        <ProjectViewLayout>
            <main className="page-view py-6">
                <div className="toolbar mb-6 px-8 flex justify-between align-items-center">
                    <h1 className="font-bold text-2xl">Accounts</h1>
                    <div className="date">
                        <div className="actions flex">
                            <ButtonGroup spacing="4">
                                <Button
                                    colorScheme="purple"
                                    onClick={() => setShowAddModal(true)}
                                >
                                    <BsPlus/>
                                    &nbsp;Add Account
                                </Button>
                                {/*<Button>Add Expense</Button>*/}
                            </ButtonGroup>
                        </div>
                    </div>
                </div>
                <div className={`${styles.header}`}>
                    <p className="text-slate-500 text-xl">Account Balance</p>
                    <h1 className="font-bold text-4xl">{formatCurrency(balance)}</h1>
                </div>
                <Divider/>
                <div className="account-body pt-10 pb-8 px-8">
                    {isPageLoading && <AccountsPageLoadingSchema />}
                    {
                        (accounts.length > 0 && !isPageLoading) && accounts.map((account, index) => {
                            return (
                                <AccountTile
                                    key={'account_tile_' + index}
                                    account={account}
                                    onClick={() => selectAccount(account)}
                                />)
                        })
                    }
                    {  (accounts.length == 0 && !isPageLoading) &&  (<div className="budget-body">
                                <div className={`emptyState pt-16 w-max-50`}>
                                    <img
                                        className={`emptyStateImage mb-6`}
                                        src="/images/no_accounts.svg"
                                        alt="no"
                                    />
                                    <h2 className="text-slate-900 font-bold text-2xl">
                                        No accounts to show
                                    </h2>
                                    <p className="mb-4 text-md text-slate-400">
                                        You have not created an account, all your accounts
                                        will show here
                                    </p>
                                </div>
                            </div>)
                    }
                </div>
            </main>
            {/*    */}
            <CreateOrEditAccount open={showAddModal} account={selectedAccount} onClose={onCloseFormModal}/>
        </ProjectViewLayout>
    )
}

function AccountsPageLoadingSchema() {
    return (
       <>
           <div className="flex gap-4 items-center border-b pb-4 mb-2">
               <SkeletonCircle size='55' />
               <div className={'w-3/4'}>
                   <Skeleton height={'20px'} />
                   <Skeleton mt='2' height={'10px'} />
               </div>
           </div>
           <div className="flex gap-4 items-center border-b pb-4 mb-2">
               <SkeletonCircle size='55' />
               <div className={'w-3/4'}>
                   <Skeleton height={'20px'} />
                   <Skeleton mt='2' height={'10px'} />
               </div>
           </div>
           <div className="flex gap-4 items-center border-b pb-4 mb-2">
               <SkeletonCircle size='55' />
               <div className={'w-3/4'}>
                   <Skeleton height={'20px'} />
                   <Skeleton mt='2' height={'10px'} />
               </div>
           </div>
           <div className="flex gap-4 items-center border-b pb-4 mb-2">
               <SkeletonCircle size='55' />
               <div className={'w-3/4'}>
                   <Skeleton height={'20px'} />
                   <Skeleton mt='2' height={'10px'} />
               </div>
           </div>
       </>
    )
}