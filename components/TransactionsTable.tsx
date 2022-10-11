import React from "react";
import {Avatar, Tab, TabList, Tabs} from "@chakra-ui/react";
import {BsArrowRightShort, BsGrid, BsPlus} from "react-icons/bs";
import {TbDatabaseImport} from "react-icons/tb";
import {BiTransfer} from "react-icons/bi";
import {RiShareCircleLine} from "react-icons/ri";
import {useSelector} from "react-redux";
import {selectTransactionState} from "../../store/slices/transaction.slice";
import Styles from '../../styles/TransactionHome.module.scss';
import {IoSyncOutline, IoWalletOutline} from "react-icons/io5";
import {TransactionsModel, TransactionType} from "../../models/transactions.model";
import {formatDate} from "../../utils/date";
import {formatCurrent} from "../../utils/number";
import {HiOutlineMinusSm} from "react-icons/hi";

function TransactionAmount({transaction}: { transaction: TransactionsModel }) {
    switch (transaction.type) {
        case TransactionType.INCOME:
        default:
            return (<p className={`${Styles.transactionItemAmount} text-green-80`}>
                <BsPlus style={{margin: '0'}} className={Styles.actionIcon}/>
                {formatCurrent(transaction.amount)}
            </p>);
        case TransactionType.EXPENSE:
            return (<p className={`${Styles.transactionItemAmount} text-red-80`}>
                <HiOutlineMinusSm style={{margin: '0'}} className={Styles.actionIcon}/>
                {formatCurrent(transaction.amount)}
            </p>);
        case TransactionType.TRANSFER:
            return (<p className={`${Styles.transactionItemAmount} text-teal-80`}>
                {/*<IoSyncOutline size={18} style={{margin: '0 4px 0 0'}} className={Styles.actionIcon}/>*/}
                {formatCurrent(transaction.amount)}
            </p>)
    }

}

function TransactionItem({transaction}: { transaction: TransactionsModel }) {
    return (
        <div className={Styles.transactionItem}>
            {transaction.type == TransactionType.TRANSFER ?
                (<div className={Styles.transactionItemLeading}>
                    <Avatar bg='teal.500' icon={<IoSyncOutline size={28} />}/>
                    <div className={Styles.transactionItemText}>
                        <h2 className={Styles.transactionItemTransferTextTitle}>
                            <span>{transaction.from.name}</span>
                            <BsArrowRightShort size={24} style={{display:'inline'}} />
                            <span>{transaction.to.name}</span>
                        </h2>
                        <p className={Styles.transactionItemTextDate}>{formatDate(transaction.date)}</p>
                    </div>
                </div>) :
                (<div className={Styles.transactionItemLeading}>
                    <Avatar name={transaction.category.name} bg="purple.500" color="white" src={transaction.category.icon} />
                    <div className={Styles.transactionItemText}>
                        <h2 className={Styles.transactionItemTextTitle}>{transaction.category.name}</h2>
                        <p className={Styles.transactionItemTextDate}>{formatDate(transaction.date)}</p>
                    </div>
                </div>)
            }
            <div className={Styles.transactionItemTrailing}>
                <TransactionAmount transaction={transaction}/>
                {transaction.wallet && <p className="wallet text-right">
                    <IoWalletOutline className={Styles.actionIcon}/>
                    <small>{transaction.wallet.name}</small>
                </p>}
            </div>
        </div>
    );
}

export default function TransactionsTable() {
    const transactionsState = useSelector(selectTransactionState);
    const [transactions, setTransactions] = React.useState<TransactionsModel[]>([]);
    const [activeTabIndex, setActiveTabIndex] = React.useState(0);

    React.useEffect(() => {
        loadTransactions(activeTabIndex);
    }, [transactionsState]);

    const onTabChange = (index: number) => {
        setActiveTabIndex(index);
        loadTransactions(index)
    }

    const loadTransactions = (tabIndex) => {
        switch (tabIndex) {
            case 0:
            default:
                setTransactions(transactionsState);
                break;
            case 1:
                setTransactions(() => transactionsState.filter(transaction => transaction.type === TransactionType.INCOME));
                break;
            case 2:
                setTransactions(() => transactionsState.filter(transaction => transaction.type === TransactionType.TRANSFER));
                break;
            case 3:
                setTransactions(() => transactionsState.filter(transaction => transaction.type === TransactionType.EXPENSE));
                break;
        }
    }

    return (
        <Tabs colorScheme={'purple'} onChange={onTabChange}>
            <TabList>
                <Tab name="all"><BsGrid/>&nbsp;All</Tab>
                <Tab name="income"><TbDatabaseImport/>&nbsp;Income</Tab>
                <Tab name="transfer"><BiTransfer/>&nbsp;Transfers</Tab>
                <Tab name="expenses"><RiShareCircleLine/>&nbsp;Expenses</Tab>
            </TabList>
            <div className={Styles.transactionList}>
                {
                    transactions.map((transaction, index) => {
                        return <TransactionItem key={index} transaction={transaction}/>
                    })
                }
            </div>
        </Tabs>
    );
}