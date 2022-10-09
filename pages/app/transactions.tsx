import BottomNav from "../components/BottomBar";
import {
    Button,
    ButtonGroup,
    Divider, FormControl,
    Stat,
    StatGroup,
    StatHelpText,
    StatLabel,
    StatNumber,
} from "@chakra-ui/react";
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import React, {useEffect, useState} from "react";
import AddTransaction from "../components/AddTransaction";
import {Data} from "../../data";
import TransactionsTable from "../components/TransactionsTable";
import SideNav from "../components/SideNav";
import {BsPlus} from "react-icons/bs";
import {useSelector} from "react-redux";
import {selectCategoriesState} from "../../store/slices/categories.slice";

export default function TransactionsHome() {
    const categoriesState = useSelector(selectCategoriesState);
    const [showAddModal, setShowAddModal] = useState(false);
    const [startDate, setStartDate] = React.useState(new Date());
    const [categoriesSelectOptions, setCategoriesSelectOptions] = React.useState<{value: string, label: string}[]>([]);

    useEffect(() => {
        console.log(categoriesState)
        let _categories = [
            ...categoriesState.income.map(c => ({value: c.name, label: c.name})),
            ...categoriesState.expenses.map(c => ({value: c.name, label: c.name}))
        ];
        // sort art
        _categories.sort((a,b) => (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0))
        // add generic label
        _categories.unshift({value: 'all', label: 'All'});
        setCategoriesSelectOptions(_categories);
    }, []);

    const onAddTransaction = (e) => {
        console.log(e);
    };

    return (
        <div className='__page_home'>
            <SideNav />
            <div className="page-container">
                <main className="page-view px-6 py-6">
                    <div className="toolbar mb-6 flex justify-between align-items-center">
                        <h1 className="font-bold text-2xl">Transactions</h1>
                        <div className="date">
                            <div className="actions flex">
                                {/*<Button onClick={toggleColorMode}>*/}
                                {/*    Toggle {colorMode === 'light' ? 'Dark' : 'Light'}*/}
                                {/*</Button>*/}
                                {/*<div className="mr-3" style={{width: '100px'}}>*/}
                                {/*    <Select placeholder='Year' options={[{label: '2022', value: '2022'}]} />*/}
                                {/*</div>*/}
                                <div className="mr-3" style={{width: '100px'}}>
                                    <Select defaultInputValue={'all'} placeholder='Day' options={Data.month_days} />
                                </div>
                                <div className="mr-3" style={{width: '160px'}}>
                                    {/*<Select placeholder='Month' options={Data.months} />*/}
                                    <DatePicker
                                        selected={startDate}
                                        onChange={(date) => setStartDate(date)}
                                        showMonthYearPicker
                                        dateFormat="MMMM, yyyy"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pg-header mb-4">
                        <div className="flex justify-between align-items-center">
                            <div className="leading" style={{width: '180px'}}>
                                <FormControl>
                                    {/*<FormLabel>Filter by category</FormLabel>*/}
                                    <Select
                                        placeholder='Select Category'
                                        options={categoriesSelectOptions}
                                    />
                                </FormControl>
                            </div>
                            <ButtonGroup spacing='4'>
                                <Button colorScheme="purple" onClick={() => setShowAddModal(true)}><BsPlus />&nbsp;Add Transaction</Button>
                                {/*<Button>Add Expense</Button>*/}
                            </ButtonGroup>
                        </div>

                    </div>
                    <Divider/>
                    <div className="mt-4">
                        <StatGroup>
                            <Stat>
                                <StatLabel>Income</StatLabel>
                                <StatNumber className={"text-green-600"}>FCFA 345,670</StatNumber>
                                <StatHelpText>
                                    {/*<StatArrow type='increase' />*/}
                                    {/*23.36%*/}
                                </StatHelpText>
                            </Stat>

                            <Stat>
                                <StatLabel>Expenses</StatLabel>
                                <StatNumber className={"text-pink-600"}>FCFA 450,000</StatNumber>
                                <StatHelpText>
                                    {/*<StatArrow type='decrease' />*/}
                                    {/*9.05%*/}
                                </StatHelpText>
                            </Stat>

                            <Stat>
                                <StatLabel>Net Worth</StatLabel>
                                <StatNumber className={"text-red-600"}>- FCFA 105,670</StatNumber>
                                <StatHelpText>
                                    {/*<StatArrow type='increase' />*/}
                                    {/*23.36%*/}
                                </StatHelpText>
                            </Stat>
                        </StatGroup>

                        <div className="transaction-body mt-4">
                            <TransactionsTable />
                        </div>
                    </div>
                </main>
                {/*<BottomNav/>*/}
                {/*    Modals*/}
                <AddTransaction open={showAddModal} onChange={onAddTransaction} onClose={() => setShowAddModal(false)} />
            </div>
        </div>
    )
}