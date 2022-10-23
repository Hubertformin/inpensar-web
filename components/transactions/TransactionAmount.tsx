import {TransactionsModel, TransactionType} from "../../models/transactions.model";
import Styles from "../../styles/TransactionTable.module.scss";
import {BsPlus} from "react-icons/bs";
import {HiOutlineMinusSm} from "react-icons/hi";
import React, {CSSProperties} from "react";
import useUtils from "../../hooks/useUtils";

interface TransactionAmountProps {
    transaction: TransactionsModel;
    textStyle?: CSSProperties;
    iconSize?: number;
}

export default function TransactionAmount({transaction, iconSize = 18, textStyle = {}}: TransactionAmountProps) {
    const utils = useUtils();
    switch (transaction.type) {
        case TransactionType.INCOME:
        default:
            return (<p className={`${Styles.transactionItemAmount} text-green-80`}>
                <BsPlus style={{margin: '0'}} size={iconSize} className={Styles.actionIcon}/>
                <span style={{ ...textStyle }}>{utils.formatCurrency(transaction.amount)}</span>
            </p>);
        case TransactionType.EXPENSE:
            return (<p className={`${Styles.transactionItemAmount} text-red-80`}>
                <HiOutlineMinusSm style={{margin: '0'}} size={iconSize} className={Styles.actionIcon}/>
                <span style={{ ...textStyle }}>{utils.formatCurrency(transaction.amount)}</span>
            </p>);
        case TransactionType.TRANSFER:
            return (<p className={`${Styles.transactionItemAmount} text-teal-80`}>
                {/*<IoSyncOutline size={18} style={{margin: '0 4px 0 0'}} className={Styles.actionIcon}/>*/}
                <span style={{ ...textStyle }}>{utils.formatCurrency(transaction.amount)}</span>
            </p>)
    }

}