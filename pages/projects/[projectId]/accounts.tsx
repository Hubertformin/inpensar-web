import {
    Button, ButtonGroup, Divider, Grid, GridItem, Skeleton, SkeletonCircle, SkeletonText,
} from "@chakra-ui/react";
import ProjectViewLayout from "../../../components/nav/ProjectViewLayout";
import {BsPlus} from "react-icons/bs";
import React, {useState} from "react";
import styles from '../../../styles/Accounts.module.scss';
import CreateOrEditAccount from "../../../components/accounts/CreateOrEditAccount";
import {AccountsModel} from "../../../models/accounts.model";
import {useSelector} from "react-redux";
import {selectAccountBalanceState, selectAccountsState} from "../../../store/slices/accounts.slice";
import AccountTile from "../../../components/accounts/AccountTile";
import useUtils from "../../../hooks/useUtils";
import useWindowSize from "../../../hooks/useWindowSize";

export default function AccountsHome() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const accounts: AccountsModel[] = useSelector(selectAccountsState);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const balance: number = useSelector(selectAccountBalanceState);
    const utils = useUtils();
    const size = useWindowSize();
    const IS_MOBILE = size.width < 768;

    React.useEffect(() => {
        if (accounts.length > 0) {
            setIsPageLoading(false);
        }
    }, [accounts]);

    const selectAccount = (account) => {
        setSelectedAccount(account);
        setShowAddModal(true);
    }

    function onCloseFormModal() {
        setShowAddModal(false);
        setSelectedAccount(null);
    }

    return (
        <ProjectViewLayout title={'Accounts'}>
            <main className="page-view py-6">
                <div className="toolbar mb-6 px-6 md:px-8 flex justify-between align-items-center">
                    <h1 className="font-bold text-xl md:text-2xl">Accounts</h1>
                    <div className="date">
                        <div className="actions flex">
                            <ButtonGroup spacing="4">
                                <Button
                                    colorScheme="purple"
                                    variant={IS_MOBILE ? "outline" : "solid"}
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
                    <h1 className="font-bold text-4xl">{utils.formatCurrency(balance)}</h1>
                </div>
                <Divider/>
                <div className="account-body pt-10 pb-8 px-4 md:px-8">
                    {isPageLoading && <AccountsPageLoadingSchema />}
                    {
                        (accounts.length > 0 && !isPageLoading) && accounts.map((account, index) => {
                            return (
                                <AccountTile
                                    key={'account_tile_' + index}
                                    size={'md'}
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
        <div className={'pt-10'}>
            <Grid templateColumns='repeat(9, 1fr)' gap={6}>
                <GridItem w='100%'>
                    <SkeletonCircle size='55' />
                </GridItem>
                <GridItem colSpan={8} w='100%'>
                    <Skeleton height={'20px'} />
                    <Skeleton mt='2' height={'25px'} />
                </GridItem>
            </Grid>
            <Grid mt='8' templateColumns='repeat(9, 1fr)' gap={6}>
                <GridItem w='100%'>
                    <SkeletonCircle size='55' />
                </GridItem>
                <GridItem colSpan={8} w='100%'>
                    <Skeleton height={'20px'} />
                    <Skeleton mt='2' height={'25px'} />
                </GridItem>
            </Grid>
            <Grid mt='8' templateColumns='repeat(9, 1fr)' gap={6}>
                <GridItem w='100%'>
                    <SkeletonCircle size='55' />
                </GridItem>
                <GridItem colSpan={8} w='100%'>
                    <Skeleton height={'20px'} />
                    <Skeleton mt='2' height={'25px'} />
                </GridItem>
            </Grid>
            <Grid mt='8' templateColumns='repeat(9, 1fr)' gap={6}>
                <GridItem w='100%'>
                    <SkeletonCircle size='55' />
                </GridItem>
                <GridItem colSpan={8} w='100%'>
                    <Skeleton height={'20px'} />
                    <Skeleton mt='2' height={'25px'} />
                </GridItem>
            </Grid>
            <Grid mt='8' templateColumns='repeat(9, 1fr)' gap={6}>
                <GridItem w='100%'>
                    <SkeletonCircle size='55' />
                </GridItem>
                <GridItem colSpan={8} w='100%'>
                    <Skeleton height={'20px'} />
                    <Skeleton mt='2' height={'25px'} />
                </GridItem>
            </Grid>

        </div>
    )
}