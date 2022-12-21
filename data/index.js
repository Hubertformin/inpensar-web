"use strict";
exports.__esModule = true;
exports.Data = void 0;
var transactions_model_1 = require("../models/transactions.model");
var accounts_model_1 = require("../models/accounts.model");
var constants_1 = require("./constants");
var month_days = [
    { value: "all", label: "All" },
    { value: "01", label: "1st" },
    { value: "02", label: "2nd" },
    { value: "03", label: "3rd" },
    { value: "04", label: "4th" },
    { value: "05", label: "5th" },
    { value: "06", label: "6th" },
    { value: "07", label: "7th" },
    { value: "08", label: "8th" },
    { value: "09", label: "9th" },
    { value: "10", label: "10th" },
    { value: "11", label: "11th" },
    { value: "12", label: "12th" },
    { value: "13", label: "13th" },
    { value: "14", label: "14th" },
    { value: "15", label: "15th" },
    { value: "16", label: "16th" },
    { value: "17", label: "17th" },
    { value: "18", label: "18th" },
    { value: "19", label: "19th" },
    { value: "20", label: "20th" },
    { value: "21", label: "21st" },
    { value: "22", label: "22nd" },
    { value: "23", label: "23rd" },
    { value: "24", label: "24th" },
    { value: "25", label: "25th" },
    { value: "26", label: "26th" },
    { value: "27", label: "27th" },
    { value: "28", label: "28th" },
    { value: "29", label: "29th" },
    { value: "30", label: "30th" },
    { value: "31", label: "31st" },
];
var expense_categories = [
    {
        icon: "https://ik.imagekit.io/enchird/inpensar_categories/food_ebNZzYIJz.png?updatedAt=1635067130364",
        name: "Food & Drink",
        type: transactions_model_1.TransactionType.EXPENSE,
        color: "#FD3C4A"
    },
    {
        icon: "https://ik.imagekit.io/enchird/inpensar_categories/shopping_NcP4dGK_c.png?updatedAt=1635067396353",
        name: "Shopping",
        type: transactions_model_1.TransactionType.EXPENSE,
        color: "#EF6C00"
    },
    {
        icon: "https://ik.imagekit.io/enchird/inpensar_categories/transport_0C2VtvDuHZ.png?updatedAt=1635067134714",
        name: "Transport",
        type: transactions_model_1.TransactionType.EXPENSE,
        color: "#FBC02D"
    },
    {
        icon: "https://ik.imagekit.io/enchird/inpensar_categories/bills_Z-t8AnaPB.png?updatedAt=1635067396246",
        name: "Bills & Fees",
        type: transactions_model_1.TransactionType.EXPENSE,
        color: "#303F9F"
    },
    {
        icon: "https://ik.imagekit.io/enchird/inpensar_categories/entertainment_EQBw5OxtJ0.png?updatedAt=1635067396214",
        name: "Entertainment",
        type: transactions_model_1.TransactionType.EXPENSE,
        color: "#7B1FA2"
    },
    {
        icon: "https://ik.imagekit.io/enchird/inpensar_categories/car_v9bVajYtBT.png?updatedAt=1635067128480",
        name: "Car",
        type: transactions_model_1.TransactionType.EXPENSE,
        color: "#F4511E"
    },
    {
        icon: "https://ik.imagekit.io/enchird/inpensar_categories/travel_tw1SEk-Sn4.png?updatedAt=1635067135098",
        name: "Travel",
        type: transactions_model_1.TransactionType.EXPENSE,
        color: "#C2185B"
    },
    {
        icon: "https://ik.imagekit.io/enchird/inpensar_categories/family_z1kbvNnXl6.png?updatedAt=1635067129943",
        name: "Family & Personal",
        type: transactions_model_1.TransactionType.EXPENSE,
        color: "#00796B"
    },
    {
        icon: "https://ik.imagekit.io/enchird/inpensar_categories/education_I2llmeiacf.png?updatedAt=1635067129010",
        name: "Education",
        type: transactions_model_1.TransactionType.EXPENSE,
        color: "#004BA0"
    },
    {
        icon: "https://ik.imagekit.io/enchird/inpensar_categories/health_cegTioOHPA.png?updatedAt=1635067130909",
        name: "Health Care",
        type: transactions_model_1.TransactionType.EXPENSE,
        color: "#E91E63"
    },
    {
        icon: "https://ik.imagekit.io/enchird/inpensar_categories/beauty_VYNoGYeBD.png?updatedAt=1635067128297",
        name: "Beauty",
        type: transactions_model_1.TransactionType.EXPENSE,
        color: "#B0003A"
    },
    {
        icon: "https://ik.imagekit.io/enchird/inpensar_categories/internet_7AqlJlX7R.png?updatedAt=1635067132418",
        name: "Internet",
        type: transactions_model_1.TransactionType.EXPENSE,
        color: "#007C91"
    },
    {
        icon: "https://ik.imagekit.io/enchird/inpensar_categories/work_Uf7NRXzIh.png?updatedAt=1635067135410",
        name: "Work",
        type: transactions_model_1.TransactionType.EXPENSE,
        color: "#E37414"
    },
    {
        icon: "https://ik.imagekit.io/enchird/inpensar_categories/gifts_-pQOvBCdz.png?updatedAt=1635067130616",
        name: "Gifts",
        type: transactions_model_1.TransactionType.EXPENSE,
        color: "#F50057"
    },
    {
        icon: "https://ik.imagekit.io/enchird/inpensar_categories/sports_2Zss-cA_xEt.png?updatedAt=1635067134454",
        name: "Sports & Hobbies",
        type: transactions_model_1.TransactionType.EXPENSE,
        color: "#880E4F"
    },
    {
        icon: "https://ik.imagekit.io/enchird/inpensar_categories/other_ugvJva27xg.png?updatedAt=1635067133208",
        name: "Other",
        type: transactions_model_1.TransactionType.EXPENSE,
        color: "#ADADAD"
    },
];
var income_categories = [
    {
        icon: "https://ik.imagekit.io/enchird/inpensar_categories/salary_ax_xo0ZSi.png?updatedAt=1635067134034",
        name: "Salary",
        type: transactions_model_1.TransactionType.INCOME,
        color: "#17A437"
    },
    {
        icon: "https://ik.imagekit.io/enchird/inpensar_categories/business_vlH9juK859a.png?updatedAt=1635067128297",
        name: "Business",
        type: transactions_model_1.TransactionType.INCOME,
        color: "#F57C00"
    },
    {
        icon: "https://ik.imagekit.io/enchird/inpensar_categories/gifts_-pQOvBCdz.png?updatedAt=1635067130616",
        name: "Gifts",
        type: transactions_model_1.TransactionType.INCOME,
        color: "#F50057"
    },
    {
        icon: "https://ik.imagekit.io/enchird/inpensar_categories/extra_icome_I5TFNrXGoC.png?updatedAt=1635067129663",
        name: "Extra Income",
        type: transactions_model_1.TransactionType.INCOME,
        color: "#26418F"
    },
    {
        icon: "https://ik.imagekit.io/enchird/inpensar_categories/loan_HnSaFvhpsWU.png?updatedAt=1635067132756",
        name: "Loan",
        type: transactions_model_1.TransactionType.INCOME,
        color: "#1976D2"
    },
    {
        icon: "https://ik.imagekit.io/enchird/inpensar_categories/parental_leave_ygjnEssSg.png?updatedAt=1635067133816",
        name: "Parantal leave",
        type: transactions_model_1.TransactionType.INCOME,
        color: "#D81B60"
    },
    {
        icon: "https://ik.imagekit.io/enchird/inpensar_categories/insurance_Vk-zR_0_MZ.png?updatedAt=1635067132087",
        name: "Insurance Payout",
        type: transactions_model_1.TransactionType.INCOME,
        color: "#006978"
    },
    {
        icon: "https://ik.imagekit.io/enchird/inpensar_categories/allowance_MxflCsHda1.png",
        name: "Allowance",
        type: transactions_model_1.TransactionType.INCOME,
        color: "#BC5100"
    },
    {
        icon: "https://ik.imagekit.io/enchird/inpensar_categories/debt_settlement_Zgw1tHdI_.png?updatedAt=1635067128706",
        name: "Debt settlement",
        type: transactions_model_1.TransactionType.INCOME,
        color: "#087F23"
    },
    {
        icon: "https://ik.imagekit.io/enchird/inpensar_categories/other_ugvJva27xg.png?updatedAt=1635067133208",
        name: "Other",
        type: transactions_model_1.TransactionType.INCOME,
        color: "#ADADAD"
    },
];
var recent_transactions = [
    {
        _id: "1",
        amount: 150000,
        category: {
            icon: "https://ik.imagekit.io/enchird/inpensar_categories/salary_ax_xo0ZSi.png?updatedAt=1635067134034",
            name: "Salary",
            type: transactions_model_1.TransactionType.INCOME,
            color: "#17A437"
        },
        notes: "",
        type: transactions_model_1.TransactionType.INCOME,
        date: "2021-10-23T13:04:46.000Z"
    },
    {
        _id: "2",
        amount: 5000,
        category: {
            icon: "https://ik.imagekit.io/enchird/inpensar_categories/food_ebNZzYIJz.png?updatedAt=1635067130364",
            name: "Food & Drink",
            type: transactions_model_1.TransactionType.EXPENSE,
            color: "#FD3C4A"
        },
        notes: "Bought food for the house",
        type: transactions_model_1.TransactionType.EXPENSE,
        date: "2021-10-20T16:45:46.000Z",
        recurrent: false
    },
    {
        _id: "3",
        amount: 2000,
        category: {
            icon: "https://ik.imagekit.io/enchird/inpensar_categories/transport_0C2VtvDuHZ.png?updatedAt=1635067134714",
            name: "Transport",
            type: transactions_model_1.TransactionType.EXPENSE,
            color: "#FBC02D"
        },
        notes: "",
        type: transactions_model_1.TransactionType.EXPENSE,
        date: "2021-10-18T17:09:46.000Z",
        recurrent: false
    },
    {
        _id: "4",
        amount: 50000,
        category: {
            icon: "https://ik.imagekit.io/enchird/inpensar_categories/education_I2llmeiacf.png?updatedAt=1635067129010",
            name: "Education",
            type: transactions_model_1.TransactionType.EXPENSE,
            color: "#8bb9e4"
        },
        notes: "Payed Fees",
        type: transactions_model_1.TransactionType.EXPENSE,
        date: "2021-10-17T10:14:46.000Z",
        recurrent: false
    },
];
var transaction_segment = [
    {
        day: "Today",
        data: [
            {
                _id: "1",
                amount: 150000,
                category: {
                    icon: "https://ik.imagekit.io/enchird/inpensar_categories/salary_ax_xo0ZSi.png?updatedAt=1635067134034",
                    name: "Salary",
                    type: transactions_model_1.TransactionType.INCOME,
                    color: "#17A437"
                },
                notes: "Enchird Inc Salary",
                type: transactions_model_1.TransactionType.INCOME,
                date: "2021-10-25T13:04:46.000Z"
            },
            {
                _id: "2",
                amount: 150000,
                category: {
                    icon: "https://ik.imagekit.io/enchird/inpensar_categories/internet_7AqlJlX7R.png?updatedAt=1635067132418",
                    name: "Internet",
                    type: transactions_model_1.TransactionType.EXPENSE,
                    color: "#007C91"
                },
                notes: "Camtel Internet",
                type: transactions_model_1.TransactionType.EXPENSE,
                date: "2021-10-25T13:04:46.000Z"
            },
            {
                _id: "3",
                amount: 150000,
                category: {
                    icon: "https://ik.imagekit.io/enchird/inpensar_categories/education_I2llmeiacf.png?updatedAt=1635067129010",
                    name: "Education",
                    type: transactions_model_1.TransactionType.EXPENSE,
                    color: "#8bb9e4"
                },
                notes: "Bought udemy courses",
                type: transactions_model_1.TransactionType.EXPENSE,
                date: "2021-10-25T13:04:46.000Z"
            },
        ]
    },
    {
        day: "Yesterday",
        data: [
            {
                _id: "1",
                amount: 150000,
                category: {
                    icon: "https://ik.imagekit.io/enchird/inpensar_categories/health_cegTioOHPA.png?updatedAt=1635067130909",
                    name: "Health Care",
                    type: transactions_model_1.TransactionType.EXPENSE,
                    color: "#004BA0"
                },
                notes: "Bought Malaria drugs",
                type: transactions_model_1.TransactionType.EXPENSE,
                date: "2021-10-24T13:04:46.000Z"
            },
            {
                _id: "2",
                amount: 150000,
                category: {
                    icon: "https://ik.imagekit.io/enchird/inpensar_categories/debt_settlement_Zgw1tHdI_.png?updatedAt=1635067128706",
                    name: "Debt settlement",
                    type: transactions_model_1.TransactionType.INCOME,
                    color: "#087F23"
                },
                notes: "Received payments from Che",
                type: transactions_model_1.TransactionType.INCOME,
                date: "2021-10-24T13:04:46.000Z"
            },
        ]
    },
];
var transactions = [
    {
        _id: "1",
        amount: 10000,
        category: {
            icon: "https://ik.imagekit.io/enchird/inpensar_categories/health_cegTioOHPA.png?updatedAt=1635067130909",
            name: "Health Care",
            type: transactions_model_1.TransactionType.EXPENSE,
            color: "#004BA0"
        },
        notes: "Bought Malaria drugs",
        type: transactions_model_1.TransactionType.EXPENSE,
        account: {
            _id: "1",
            name: "Mobile Money",
            amount: 35000,
            owner: "1"
        },
        date: "2021-10-24T13:04:46.000Z"
    },
    {
        _id: "2",
        amount: 120000,
        category: {
            icon: "https://ik.imagekit.io/enchird/inpensar_categories/debt_settlement_Zgw1tHdI_.png?updatedAt=1635067128706",
            name: "Debt settlement",
            type: transactions_model_1.TransactionType.INCOME,
            color: "#087F23"
        },
        notes: "Received payments from Che",
        type: transactions_model_1.TransactionType.INCOME,
        account: {
            _id: "2",
            name: "UBA",
            amount: 45000,
            owner: "1"
        },
        date: "2021-10-24T13:04:46.000Z"
    },
    {
        _id: "3",
        amount: 83000,
        category: {
            icon: "https://ik.imagekit.io/enchird/inpensar_categories/salary_ax_xo0ZSi.png?updatedAt=1635067134034",
            name: "Salary",
            type: transactions_model_1.TransactionType.INCOME,
            color: "#17A437"
        },
        notes: "Enchird Inc Salary",
        type: transactions_model_1.TransactionType.INCOME,
        account: {
            _id: "1",
            name: "Mobile Money",
            amount: 35000,
            owner: "1"
        },
        date: "2021-10-25T13:04:46.000Z"
    },
    {
        _id: "4",
        amount: 27000,
        category: {
            icon: "https://ik.imagekit.io/enchird/inpensar_categories/internet_7AqlJlX7R.png?updatedAt=1635067132418",
            name: "Internet",
            type: transactions_model_1.TransactionType.EXPENSE,
            color: "#007C91"
        },
        notes: "Camtel Internet",
        type: transactions_model_1.TransactionType.EXPENSE,
        account: {
            _id: "1",
            name: "Mobile Money",
            amount: 35000,
            owner: "1"
        },
        date: "2021-10-25T13:04:46.000Z"
    },
    {
        _id: "5",
        amount: 130000,
        category: {
            icon: "https://ik.imagekit.io/enchird/inpensar_categories/education_I2llmeiacf.png?updatedAt=1635067129010",
            name: "Education",
            type: transactions_model_1.TransactionType.EXPENSE,
            color: "#8bb9e4"
        },
        notes: "Bought udemy courses",
        type: transactions_model_1.TransactionType.EXPENSE,
        account: {
            _id: "2",
            name: "UBA",
            amount: 45000,
            owner: "1"
        },
        date: "2021-10-25T13:04:46.000Z"
    },
    {
        _id: "6",
        amount: 130000,
        from: {
            _id: "1",
            name: "Mobile Money",
            amount: 35000,
            owner: "1"
        },
        to: {
            _id: "2",
            name: "UBA",
            amount: 45000,
            owner: "1"
        },
        notes: "Bought udemy courses",
        type: transactions_model_1.TransactionType.TRANSFER,
        date: "2021-10-25T13:04:46.000Z"
    },
];
var budgets = [
    {
        _id: "1",
        name: "Budget for Food",
        amount: 10000,
        categories: [expense_categories[2], expense_categories[3]],
        amountSpent: 6500,
        color: constants_1.CONSTANTS.COLORS[2],
        resetsMonthly: true,
        owner: "YOU"
    },
    {
        _id: "2",
        name: "Enjoyment",
        amount: 15000,
        categories: [
            expense_categories[2],
            expense_categories[3],
            expense_categories[4],
        ],
        amountSpent: 22500,
        color: constants_1.CONSTANTS.COLORS[5],
        resetsMonthly: true,
        owner: "YOU"
    },
    {
        _id: "3",
        name: "Transport",
        amount: 7000,
        categories: [expense_categories[3]],
        amountSpent: 4000,
        color: constants_1.CONSTANTS.COLORS[1],
        resetsMonthly: true,
        owner: "YOU"
    },
];
var wallets = [
    {
        _id: "1",
        name: "Mobile Money",
        amount: 35000,
        type: accounts_model_1.AccountType.CHECKING,
        owner: "1"
    },
    {
        _id: "2",
        name: "UBA",
        amount: 45000,
        type: accounts_model_1.AccountType.CHECKING,
        owner: "1"
    },
    {
        _id: "3",
        name: "Citi Bank",
        amount: 85000,
        type: accounts_model_1.AccountType.SAVINGS,
        owner: "1"
    },
];
exports.Data = {
    // months,
    month_days: month_days,
    expense_categories: expense_categories,
    income_categories: income_categories,
    recent_transactions: recent_transactions,
    transaction_segment: transaction_segment,
    transactions: transactions,
    budgets: budgets,
    wallets: wallets
};
