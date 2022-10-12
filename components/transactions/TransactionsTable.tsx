import React from "react";
import { Avatar, Tab, TabList, Tabs } from "@chakra-ui/react";
import { BsArrowRightShort, BsGrid, BsPlus } from "react-icons/bs";
import { TbDatabaseImport } from "react-icons/tb";
import { BiTransfer } from "react-icons/bi";
import { RiShareCircleLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { selectTransactionData } from "../../store/slices/transaction.slice";
import Styles from "../../styles/TransactionTable.module.scss";
import { IoSyncOutline, IoWalletOutline } from "react-icons/io5";
import {
  TransactionsModel,
  TransactionType,
} from "../../models/transactions.model";
import { formatDate } from "../../utils/date";
import ViewTransactionDetails from "./ViewTransactionDetails";
import TransactionAmount from "./TransactionAmount";

function TransactionItem({
  transaction,
  onClick,
}: {
  transaction: TransactionsModel;
  onClick?: () => void;
}) {
  return (
    <div className={Styles.transactionItem} onClick={onClick}>
      {transaction.type == TransactionType.TRANSFER ? (
        <div className={Styles.transactionItemLeading}>
          <Avatar bg="teal.500" icon={<IoSyncOutline size={28} />} />
          <div className={Styles.transactionItemText}>
            <h2 className={Styles.transactionItemTransferTextTitle}>
              <span>{transaction.from.name}</span>
              <BsArrowRightShort size={24} style={{ display: "inline" }} />
              <span>{transaction.to.name}</span>
            </h2>
            <p className={Styles.transactionItemTextDate}>
              {formatDate(transaction.date)}
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
              {formatDate(transaction.date)}
            </p>
          </div>
        </div>
      )}
      <div className={Styles.transactionItemTrailing}>
        <TransactionAmount transaction={transaction} />
        {transaction.wallet && (
          <p className="wallet text-right">
            <IoWalletOutline className={Styles.actionIcon} />
            <small>{transaction.wallet.name}</small>
          </p>
        )}
      </div>
    </div>
  );
}

export default function TransactionsTable() {
  const transactionsState = useSelector(selectTransactionData);
  const [transactions, setTransactions] = React.useState<TransactionsModel[]>(
    []
  );
  const [activeTabIndex, setActiveTabIndex] = React.useState(0);
  const [openDetailsModal, setOpenDetailsModal] = React.useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    React.useState<TransactionsModel | null>(null);

  const loadTransactions = React.useCallback(
    (tabIndex) => {
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
    loadTransactions(activeTabIndex);
  }, [loadTransactions, activeTabIndex]);

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
      {transactions && transactions.length > 0 ? (
        <Tabs colorScheme={"purple"} onChange={onTabChange}>
          <TabList>
            <Tab name="all">
              <BsGrid />
              &nbsp;All
            </Tab>
            <Tab name="income">
              <TbDatabaseImport />
              &nbsp;Income
            </Tab>
            <Tab name="expenses">
              <RiShareCircleLine />
              &nbsp;Expenses
            </Tab>
            <Tab name="transfer">
              <BiTransfer />
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
      ) : (
        <div className={`${Styles.emptyState} w-max-50`}>
          <img
            className={`${Styles.emptyStateImage} mb-6`}
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
