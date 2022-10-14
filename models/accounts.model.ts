export enum AccountType {
    CHECKING = "checking",
    LOAN = "loan",
    INVESTMENT = "investment",
    WALLET = "wallet",
    SAVINGS = "savings",
}

export interface AccountsModel {
    _id?: string;
    name?: string;
    amount?: number;
    type?: AccountType;
    owner?: string
}