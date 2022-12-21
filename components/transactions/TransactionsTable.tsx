import React, {useState} from "react";
import {Avatar, Grid, GridItem, Skeleton, SkeletonCircle, Tab, TabList, Tabs} from "@chakra-ui/react";
import {BsArrowRightShort, BsGrid, BsPlus} from "react-icons/bs";
import {TbDatabaseImport} from "react-icons/tb";
import {BiTransfer} from "react-icons/bi";
import {RiShareCircleLine} from "react-icons/ri";
import {useSelector} from "react-redux";
import {selectTransactionData} from "../../store/slices/transaction.slice";
import Styles from "../../styles/TransactionTable.module.scss";
import {IoSyncOutline, IoWalletOutline} from "react-icons/io5";
import {
    TransactionsModel,
    TransactionType,
} from "../../models/transactions.model";
import {formatDate} from "../../utils/date";
import ViewTransactionDetails from "./ViewTransactionDetails";
import TransactionAmount from "./TransactionAmount";
import useApi from "../../hooks/useApi";
import useWindowSize from "../../hooks/useWindowSize";

export default function TransactionsTable() {
    const transactionsState = useSelector(selectTransactionData);
    const [transactions, setTransactions] = React.useState<TransactionsModel[]>(
        []
    );
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [activeTabIndex, setActiveTabIndex] = React.useState(0);
    const [openDetailsModal, setOpenDetailsModal] = React.useState(false);
    const api = useApi();
    const [selectedTransaction, setSelectedTransaction] =
        React.useState<TransactionsModel | null>(null);

    const loadTransactions = React.useCallback((tabIndex) => {
            // Fetch data from api
            switch (tabIndex) {
                case 0:
                default:
                    setTransactions(transactionsState);
                    break;
                case 1:
                    setTransactions(() =>
                        transactionsState.filter(
                            (transaction) => transaction.type === TransactionType.INCOME
                        )
                    );
                    break;
                case 2:
                    setTransactions(() =>
                        transactionsState.filter(
                            (transaction) => transaction.type === TransactionType.EXPENSE
                        )
                    );
                    break;
                case 3:
                    setTransactions(() =>
                        transactionsState.filter(
                            (transaction) => transaction.type === TransactionType.TRANSFER
                        )
                    );
                    break;
            }
        },
        [transactionsState]
    );

    React.useEffect(() => {
        if (transactionsState.length == 0) {
            api.getTransactions().then(() => setIsPageLoading(false));
        } else {
            setIsPageLoading(false);
        }
    }, []);

    React.useEffect(() => {
        if (transactionsState.length > 0) {
            loadTransactions(activeTabIndex);
        }
        // else if (transactionsState.length > 0) {
        //   setIsPageLoading(false);
        // }
        (transactionsState)
    }, [loadTransactions, transactionsState, activeTabIndex]);

    const onTabChange = (index: number) => {
        setActiveTabIndex(index);
        loadTransactions(index);
    };

    const showDetails = (transaction) => {
        setSelectedTransaction(transaction);
        setOpenDetailsModal(true);
    };

    return (
        <>
            {isPageLoading && <PageLoadingSchema/>}
            {(!isPageLoading && transactions.length > 0) && (
                <Tabs colorScheme={"purple"} onChange={onTabChange}>
                    <TabList className={'overflow-x-auto'}>
                        <Tab name="all">
                            <BsGrid/>
                            &nbsp;All
                        </Tab>
                        <Tab name="income">
                            <TbDatabaseImport/>
                            &nbsp;Income
                        </Tab>
                        <Tab name="expenses">
                            <RiShareCircleLine/>
                            &nbsp;Expenses
                        </Tab>
                        <Tab name="transfer">
                            <BiTransfer/>
                            &nbsp;Transfers
                        </Tab>
                    </TabList>
                    <div className={Styles.transactionList}>
                        {transactions.map((transaction, index) => {
                            return (
                                <TransactionItem
                                    onClick={() => showDetails(transaction)}
                                    key={index}
                                    transaction={transaction}
                                />
                            );
                        })}
                    </div>
                </Tabs>
            )}
            {(!isPageLoading && transactions.length == 0) && (
                <div className={`emptyState w-max-50`}>
                    <img
                        className={`emptyStateImage mb-6`}
                        src="/images/no_transactions.png"
                        alt="no"
                    />
                    <h2 className="text-slate-900 font-bold text-2xl">
                        No Transactions to show
                    </h2>
                    <p className="mb-4 text-md text-slate-400">
                        You have not recorded any transactions yet, all your transactions
                        will show here
                    </p>
                </div>
            )}
            <ViewTransactionDetails
                open={openDetailsModal}
                selectedTransaction={selectedTransaction}
                onClose={() => setOpenDetailsModal(false)}
            />
        </>
    );
}

function PageLoadingSchema() {
    return (
        <div className={'pt-10'}>
            <Grid templateColumns='repeat(9, 1fr)' gap={6}>
                <GridItem w='100%'>
                    <SkeletonCircle size='55'/>
                </GridItem>
                <GridItem colSpan={8} w='100%'>
                    <Skeleton height={'20px'}/>
                    <Skeleton mt='2' height={'25px'}/>
                </GridItem>
            </Grid>
            <Grid mt='8' templateColumns='repeat(9, 1fr)' gap={6}>
                <GridItem w='100%'>
                    <SkeletonCircle size='55'/>
                </GridItem>
                <GridItem colSpan={8} w='100%'>
                    <Skeleton height={'20px'}/>
                    <Skeleton mt='2' height={'25px'}/>
                </GridItem>
            </Grid>
            <Grid mt='8' templateColumns='repeat(9, 1fr)' gap={6}>
                <GridItem w='100%'>
                    <SkeletonCircle size='55'/>
                </GridItem>
                <GridItem colSpan={8} w='100%'>
                    <Skeleton height={'20px'}/>
                    <Skeleton mt='2' height={'25px'}/>
                </GridItem>
            </Grid>
            <Grid mt='8' templateColumns='repeat(9, 1fr)' gap={6}>
                <GridItem w='100%'>
                    <SkeletonCircle size='55'/>
                </GridItem>
                <GridItem colSpan={8} w='100%'>
                    <Skeleton height={'20px'}/>
                    <Skeleton mt='2' height={'25px'}/>
                </GridItem>
            </Grid>
            <Grid mt='8' templateColumns='repeat(9, 1fr)' gap={6}>
                <GridItem w='100%'>
                    <SkeletonCircle size='55'/>
                </GridItem>
                <GridItem colSpan={8} w='100%'>
                    <Skeleton height={'20px'}/>
                    <Skeleton mt='2' height={'25px'}/>
                </GridItem>
            </Grid>

        </div>
    )
}

function TransactionItem({
                             transaction,
                             onClick,
                         }: {
    transaction: TransactionsModel;
    onClick?: () => void;
}) {
    const size = useWindowSize();

    return (
        <div className={Styles.transactionItem} onClick={onClick}>
            {transaction.type == TransactionType.TRANSFER ? (
                <div className={Styles.transactionItemLeading}>
                    <Avatar bg="teal.500" icon={<IoSyncOutline size={28}/>}/>
                    <div className={Styles.transactionItemText}>
                        <h2 className={Styles.transactionItemTransferTextTitle}>
                            <span>{transaction.from.name}</span>
                            <BsArrowRightShort size={24} style={{display: "inline"}}/>
                            <span>{transaction.to.name}</span>
                        </h2>
                        <p className={Styles.transactionItemTextDate}>
                            {formatDate(transaction.date, size.width < 788 ? 'DD MMM, YYYY [at] HH:MM' : null)}
                        </p>
                    </div>
                </div>
            ) : (
                <div className={Styles.transactionItemLeading}>
                    <Avatar
                        name={transaction.category.name}
                        bg="purple.500"
                        color="white"
                        src={transaction.category.icon}
                    />
                    <div className={Styles.transactionItemText}>
                        <h2 className={Styles.transactionItemTextTitle}>
                            {transaction.category.name}
                        </h2>
                        <p className={Styles.transactionItemTextDate}>
                            {formatDate(transaction.date, size.width < 788 ? 'DD MMM, YYYY [at] HH:MM' : null)}
                        </p>
                    </div>
                </div>
            )}
            <div className={Styles.transactionItemTrailing}>
                <TransactionAmount transaction={transaction}/>
                {transaction.account && (
                    <p className="wallet text-right">
                        <IoWalletOutline className={Styles.actionIcon}/>
                        <small>{transaction.account.name}</small>
                    </p>
                )}
            </div>
        </div>
    );
}