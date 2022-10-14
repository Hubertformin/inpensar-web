import {AccountsModel, AccountType} from "../models/accounts.model";

export function getAccountTypeName(type: AccountType) {
    switch (type) {
        case AccountType.CHECKING:
        default:
            return 'Checking';
        case AccountType.SAVINGS:
            return 'Savings'
        case AccountType.INVESTMENT:
            return 'Investment';
        case AccountType.LOAN:
            return 'Loan';
        case AccountType.WALLET:
            return 'Wallet';
    }
}

export function computeAccountBalance(accounts: AccountsModel[]) {
    return accounts.reduce(function (acc, obj) { return acc + Number(obj.amount); }, 0);
}