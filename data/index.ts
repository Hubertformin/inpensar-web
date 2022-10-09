import { BudgetModel } from "../models/budget.model";
import { TransactionsModel } from "../models/transactions.model"
import { WalletModel } from "../models/wallet.model";
import {CategoryModel} from "../models/category.model";

const expense_categories: CategoryModel[] = [
    {
        icon: 'https://ik.imagekit.io/enchird/inpensar_categories/food_ebNZzYIJz.png?updatedAt=1635067130364',
        name: 'Food & Drink',
        type: 'expenses',
        color: '#FD3C4A'
    },
    {
        icon: 'https://ik.imagekit.io/enchird/inpensar_categories/shopping_NcP4dGK_c.png?updatedAt=1635067396353',
        name: 'Shopping',
        type: 'expenses',
        color: '#EF6C00'
    },
    {
        icon: 'https://ik.imagekit.io/enchird/inpensar_categories/transport_0C2VtvDuHZ.png?updatedAt=1635067134714',
        name: 'Transport',
        type: 'expenses',
        color: '#FBC02D'
    },
    {
        icon: 'https://ik.imagekit.io/enchird/inpensar_categories/bills_Z-t8AnaPB.png?updatedAt=1635067396246',
        name: 'Bills & Fees',
        type: 'expenses',
        color: '#303F9F'
    },
    {
        icon: 'https://ik.imagekit.io/enchird/inpensar_categories/entertainment_EQBw5OxtJ0.png?updatedAt=1635067396214',
        name: 'Entertainment',
        type: 'expenses',
        color: '#7B1FA2'
    },
    {
        icon: 'https://ik.imagekit.io/enchird/inpensar_categories/car_v9bVajYtBT.png?updatedAt=1635067128480',
        name: 'Car',
        type: 'expenses',
        color: '#F4511E'
    },
    {
        icon: 'https://ik.imagekit.io/enchird/inpensar_categories/travel_tw1SEk-Sn4.png?updatedAt=1635067135098',
        name: 'Travel',
        type: 'expenses',
        color: '#C2185B'
    },
    {
        icon: 'https://ik.imagekit.io/enchird/inpensar_categories/family_z1kbvNnXl6.png?updatedAt=1635067129943',
        name: 'Family & Personal',
        type: 'expenses',
        color: '#00796B'
    },
    {
        icon: 'https://ik.imagekit.io/enchird/inpensar_categories/education_I2llmeiacf.png?updatedAt=1635067129010',
        name: 'Education',
        type: 'expenses',
        color: '#004BA0'
    },
    {
        icon: 'https://ik.imagekit.io/enchird/inpensar_categories/health_cegTioOHPA.png?updatedAt=1635067130909',
        name: 'Health Care',
        type: 'expenses',
        color: '#E91E63'
    },
    {
        icon: 'https://ik.imagekit.io/enchird/inpensar_categories/beauty_VYNoGYeBD.png?updatedAt=1635067128297',
        name: 'Beauty',
        type: 'expenses',
        color: '#B0003A'
    },
    {
        icon: 'https://ik.imagekit.io/enchird/inpensar_categories/internet_7AqlJlX7R.png?updatedAt=1635067132418',
        name: 'Internet',
        type: 'expenses',
        color: '#007C91'
    },
    {
        icon: 'https://ik.imagekit.io/enchird/inpensar_categories/work_Uf7NRXzIh.png?updatedAt=1635067135410',
        name: 'Work',
        type: 'expenses',
        color: '#E37414'
    },
    {
        icon: 'https://ik.imagekit.io/enchird/inpensar_categories/gifts_-pQOvBCdz.png?updatedAt=1635067130616',
        name: 'Gifts',
        type: 'expenses',
        color: '#F50057'
    },
    {
        icon: 'https://ik.imagekit.io/enchird/inpensar_categories/sports_2Zss-cA_xEt.png?updatedAt=1635067134454',
        name: 'Sports & Hobbies',
        type: 'expenses',
        color: '#880E4F'
    },
    {
        icon: 'https://ik.imagekit.io/enchird/inpensar_categories/other_ugvJva27xg.png?updatedAt=1635067133208',
        name: 'Other',
        type: 'expenses',
        color: '#ADADAD'
    }
]


const income_categories: CategoryModel[] = [
    {
        icon: 'https://ik.imagekit.io/enchird/inpensar_categories/salary_ax_xo0ZSi.png?updatedAt=1635067134034',
        name: 'Salary',
        type: 'income',
        color: '#17A437'
    },
    {
        icon: 'https://ik.imagekit.io/enchird/inpensar_categories/business_vlH9juK859a.png?updatedAt=1635067128297',
        name: 'Business',
        type: 'income',
        color: '#F57C00'
    },
    {
        icon: 'https://ik.imagekit.io/enchird/inpensar_categories/gifts_-pQOvBCdz.png?updatedAt=1635067130616',
        name: 'Gifts',
        type: 'income',
        color: '#F50057'
    },
    {
        icon: 'https://ik.imagekit.io/enchird/inpensar_categories/extra_icome_I5TFNrXGoC.png?updatedAt=1635067129663',
        name: 'Extra Income',
        type: 'income',
        color: '#26418F'
    },
    {
        icon: 'https://ik.imagekit.io/enchird/inpensar_categories/loan_HnSaFvhpsWU.png?updatedAt=1635067132756',
        name: 'Loan',
        type: 'income',
        color: '#1976D2'
    },
    {
        icon: 'https://ik.imagekit.io/enchird/inpensar_categories/parental_leave_ygjnEssSg.png?updatedAt=1635067133816',
        name: 'Parantal leave',
        type: 'income',
        color: '#D81B60'
    },
    {
        icon: 'https://ik.imagekit.io/enchird/inpensar_categories/insurance_Vk-zR_0_MZ.png?updatedAt=1635067132087',
        name: 'Insurance Payout',
        type: 'income',
        color: '#006978'
    },
    {
        icon: 'https://ik.imagekit.io/enchird/inpensar_categories/allowance_MxflCsHda1.png',
        name: 'Allowance',
        type: 'income',
        color: '#BC5100'
    },
    {
        icon: 'https://ik.imagekit.io/enchird/inpensar_categories/debt_settlement_Zgw1tHdI_.png?updatedAt=1635067128706',
        name: 'Debt settlement',
        type: 'income',
        color: '#087F23'
    },
    {
        icon: 'https://ik.imagekit.io/enchird/inpensar_categories/other_ugvJva27xg.png?updatedAt=1635067133208',
        name: 'Other',
        type: 'income',
        color: '#ADADAD'
    }
]


const recent_transactions: TransactionsModel[] = [
    {
        _id: '1',
        amount: 150000,
        category: {
            icon: 'https://ik.imagekit.io/enchird/inpensar_categories/salary_ax_xo0ZSi.png?updatedAt=1635067134034',
            name: 'Salary',
            type: 'income',
            color: '#17A437'
        },
        notes: '',
        type: 'income',
        date: '2021-10-23T13:04:46.000Z'
    },
    {
        _id: '2',
        amount: 5000,
        category: {
            icon: 'https://ik.imagekit.io/enchird/inpensar_categories/food_ebNZzYIJz.png?updatedAt=1635067130364',
            name: 'Food & Drink',
            type: 'expenses',
            color: '#FD3C4A'
        },
        notes: 'Bought food for the house',
        type: 'expenses',
        date: '2021-10-20T16:45:46.000Z',
        recurrent: false
    },
    {
        _id: '3',
        amount: 2000,
        category: {
            icon: 'https://ik.imagekit.io/enchird/inpensar_categories/transport_0C2VtvDuHZ.png?updatedAt=1635067134714',
            name: 'Transport',
            type: 'expenses',
            color: '#FBC02D'
        },
        notes: '',
        type: 'expenses',
        date: '2021-10-18T17:09:46.000Z',
        recurrent: false
    },
    {
        _id: '4',
        amount: 50000,
        category: {
            icon: 'https://ik.imagekit.io/enchird/inpensar_categories/education_I2llmeiacf.png?updatedAt=1635067129010',
            name: 'Education',
            type: 'expenses',
            color: '#8bb9e4'
        },
        notes: 'Payed Fees',
        type: 'expenses',
        date: '2021-10-17T10:14:46.000Z',
        recurrent: false
    },

];

const transactions: {day: string, data: TransactionsModel[]}[] = [
    {
        day: 'Today',
        data: [
            {
                _id: '1',
                amount: 150000,
                category: {
                    icon: 'https://ik.imagekit.io/enchird/inpensar_categories/salary_ax_xo0ZSi.png?updatedAt=1635067134034',
                    name: 'Salary',
                    type: 'income',
                    color: '#17A437'
                },
                notes: 'Enchird Inc Salary',
                type: 'income',
                date: '2021-10-25T13:04:46.000Z'
            },
            {
                _id: '2',
                amount: 150000,
                category: {
                    icon: 'https://ik.imagekit.io/enchird/inpensar_categories/internet_7AqlJlX7R.png?updatedAt=1635067132418',
                    name: 'Internet',
                    type: 'expenses',
                    color: '#007C91'
                },
                notes: 'Camtel Internet',
                type: 'expenses',
                date: '2021-10-25T13:04:46.000Z'
            },
            {
                _id: '3',
                amount: 150000,
                category: {
                    icon: 'https://ik.imagekit.io/enchird/inpensar_categories/education_I2llmeiacf.png?updatedAt=1635067129010',
                    name: 'Education',
                    type: 'expenses',
                    color: '#8bb9e4'
                },
                notes: 'Bought udemy courses',
                type: 'expenses',
                date: '2021-10-25T13:04:46.000Z'
            }
        ]
    },
    {
        day: 'Yesterday',
        data: [
            {
                _id: '1',
                amount: 150000,
                category: {
                    icon: 'https://ik.imagekit.io/enchird/inpensar_categories/health_cegTioOHPA.png?updatedAt=1635067130909',
                    name: 'Health Care',
                    type: 'expenses',
                    color: '#004BA0'
                },
                notes: 'Bought Malaria drugs',
                type: 'expenses',
                date: '2021-10-24T13:04:46.000Z'
            },
            {
                _id: '2',
                amount: 150000,
                category: {
                    icon: 'https://ik.imagekit.io/enchird/inpensar_categories/debt_settlement_Zgw1tHdI_.png?updatedAt=1635067128706',
                    name: 'Debt settlement',
                    type: 'income',
                    color: '#087F23'
                },
                notes: 'Received payments from Che',
                type: 'income',
                date: '2021-10-24T13:04:46.000Z'
            },
        ]
    }
]

const budgets: BudgetModel[] = [
    {
        _id: '1',
        name: 'Budget for Food',
        amount: 10000,
        categories: [
            {...expense_categories[2], amount: 6000},
            {...expense_categories[3], amount: 4000},
        ],
        amountSpent: 6500,
        startDate: '2021-10-30T10:04:46.000Z',
        nextOccureDate: '2021-11-30T10:04:46.000Z',
        recurrence: 'every_month',
    },
    {
        _id: '2',
        name: 'Enjoyment',
        amount: 15000,
        categories: [
            {...expense_categories[2], amount: 8000},
            {...expense_categories[3], amount: 4000},
            {...expense_categories[4], amount: 3000}
        ],
        amountSpent: 22500,
        startDate: '2021-10-30T10:04:46.000Z',
        nextOccureDate: '2021-11-30T10:04:46.000Z',
        recurrence: 'every_month',
    },
    {
        _id: '3',
        name: 'Transport',
        amount: 7000,
        categories: [{...expense_categories[2], amount: 7000, percent: 100}],
        amountSpent: 6000,
        startDate: '2021-10-30T10:04:46.000Z',
        nextOccureDate: '2021-11-30T10:04:46.000Z',
        recurrence: 'every_month',
    }
];

const wallets: WalletModel[] = [
    {
        _id: '1',
        name: 'Mobile Money',
        amount: 35000,
        userId: '1'
    },
    {
        _id: '2',
        name: 'UBA',
        amount: 45000,
        userId: '1'
    },
    {
        _id: '3',
        name: 'Citi Bank',
        amount: 85000,
        userId: '1'
    }
]

export const Data =  {
    expense_categories,
    income_categories,
    recent_transactions,
    transactions,
    budgets,
    wallets
}


/**
 * const expense_categories = [
 {
      icon: 'https://ik.imagekit.io/enchird/inpensar_categories/food_ebNZzYIJz.png?updatedAt=1635067130364',
      name: 'Food & Drink',
      type: 'expenses',
      color: '#FD3C4A'
    },
 {
      icon: 'https://ik.imagekit.io/enchird/inpensar_categories/shopping_NcP4dGK_c.png?updatedAt=1635067396353',
      name: 'Shopping',
      type: 'expenses',
      color: '#EF6C00'
    },
 {
      icon: 'https://ik.imagekit.io/enchird/inpensar_categories/transport_0C2VtvDuHZ.png?updatedAt=1635067134714',
      name: 'Transport',
      type: 'expenses',
      color: '#FBC02D'
    },
 {
      icon: 'https://ik.imagekit.io/enchird/inpensar_categories/bills_Z-t8AnaPB.png?updatedAt=1635067396246',
      name: 'Bills & Fees',
      type: 'expenses',
      color: '#303F9F'
    },
 {
      icon: 'https://ik.imagekit.io/enchird/inpensar_categories/entertainment_EQBw5OxtJ0.png?updatedAt=1635067396214',
      name: 'Entertainment',
      type: 'expenses',
      color: '#7B1FA2'
    },
 {
      icon: 'https://ik.imagekit.io/enchird/inpensar_categories/car_v9bVajYtBT.png?updatedAt=1635067128480',
      name: 'Car',
      type: 'expenses',
      color: '#F4511E'
    },
 {
      icon: 'https://ik.imagekit.io/enchird/inpensar_categories/travel_tw1SEk-Sn4.png?updatedAt=1635067135098',
      name: 'Travel',
      type: 'expenses',
      color: '#C2185B'
    },
 {
      icon: 'https://ik.imagekit.io/enchird/inpensar_categories/family_z1kbvNnXl6.png?updatedAt=1635067129943',
      name: 'Family & Personal',
      type: 'expenses',
      color: '#00796B'
    },
 {
      icon: 'https://ik.imagekit.io/enchird/inpensar_categories/education_I2llmeiacf.png?updatedAt=1635067129010',
      name: 'Education',
      type: 'expenses',
      color: '#004BA0'
    },
 {
      icon: 'https://ik.imagekit.io/enchird/inpensar_categories/health_cegTioOHPA.png?updatedAt=1635067130909',
      name: 'Health Care',
      type: 'expenses',
      color: '#E91E63'
    },
 {
      icon: 'https://ik.imagekit.io/enchird/inpensar_categories/beauty_VYNoGYeBD.png?updatedAt=1635067128297',
      name: 'Beauty',
      type: 'expenses',
      color: '#B0003A'
    },
 {
      icon: 'https://ik.imagekit.io/enchird/inpensar_categories/internet_7AqlJlX7R.png?updatedAt=1635067132418',
      name: 'Internet',
      type: 'expenses',
      color: '#007C91'
    },
 {
      icon: 'https://ik.imagekit.io/enchird/inpensar_categories/work_Uf7NRXzIh.png?updatedAt=1635067135410',
      name: 'Work',
      type: 'expenses',
      color: '#E37414'
    },
 {
      icon: 'https://ik.imagekit.io/enchird/inpensar_categories/gifts_-pQOvBCdz.png?updatedAt=1635067130616',
      name: 'Gifts',
      type: 'expenses',
      color: '#F50057'
    },
 {
      icon: 'https://ik.imagekit.io/enchird/inpensar_categories/sports_2Zss-cA_xEt.png?updatedAt=1635067134454',
      name: 'Sports & Hobbies',
      type: 'expenses',
      color: '#880E4F'
    },
 {
      icon: 'https://ik.imagekit.io/enchird/inpensar_categories/other_ugvJva27xg.png?updatedAt=1635067133208',
      name: 'Other',
      type: 'expenses',
      color: '#ADADAD'
    }
 ]


 const income_categories = [
 {
      icon: 'https://ik.imagekit.io/enchird/inpensar_categories/salary_ax_xo0ZSi.png?updatedAt=1635067134034',
      name: 'Salary',
      type: 'income',
      color: '#17A437'
    },
 {
      icon: 'https://ik.imagekit.io/enchird/inpensar_categories/business_vlH9juK859a.png?updatedAt=1635067128297',
      name: 'Business',
      type: 'income',
      color: '#F57C00'
    },
 {
        icon: 'https://ik.imagekit.io/enchird/inpensar_categories/gifts_-pQOvBCdz.png?updatedAt=1635067130616',
        name: 'Gifts',
        type: 'income',
        color: '#F50057'
    },
 {
      icon: 'https://ik.imagekit.io/enchird/inpensar_categories/extra_icome_I5TFNrXGoC.png?updatedAt=1635067129663',
      name: 'Extra Income',
      type: 'income',
      color: '#26418F'
    },
 {
        icon: 'https://ik.imagekit.io/enchird/inpensar_categories/loan_HnSaFvhpsWU.png?updatedAt=1635067132756',
        name: 'Loan',
        type: 'income',
        color: '#1976D2'
    },
 {
      icon: 'https://ik.imagekit.io/enchird/inpensar_categories/parental_leave_ygjnEssSg.png?updatedAt=1635067133816',
      name: 'Parantal leave',
      type: 'income',
      color: '#D81B60'
    },
 {
      icon: 'https://ik.imagekit.io/enchird/inpensar_categories/insurance_Vk-zR_0_MZ.png?updatedAt=1635067132087',
      name: 'Insurance Payout',
      type: 'income',
      color: '#006978'
    },
 {
      icon: 'https://ik.imagekit.io/enchird/inpensar_categories/allowance_MxflCsHda1.png',
      name: 'Allowance',
      type: 'income',
      color: '#BC5100'
    },
 {
      icon: 'https://ik.imagekit.io/enchird/inpensar_categories/debt_settlement_Zgw1tHdI_.png?updatedAt=1635067128706',
      name: 'Debt settlement',
      type: 'income',
      color: '#087F23'
    },
 {
        icon: 'https://ik.imagekit.io/enchird/inpensar_categories/other_ugvJva27xg.png?updatedAt=1635067133208',
        name: 'Other',
        type: 'income',
        color: '#ADADAD'
    }
 ]
 *
 */