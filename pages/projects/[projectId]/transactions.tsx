import {
  Button,
  ButtonGroup,
  Divider,
  FormControl,
  Stat,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import React, { useEffect, useState } from "react";
import AddTransaction from "../../../components/transactions/AddTransaction";
import { Data } from "../../../data";
import TransactionsTable from "../../../components/transactions/TransactionsTable";
import { BsPlus } from "react-icons/bs";
import { useSelector } from "react-redux";
import { selectCategoriesState } from "../../../store/slices/categories.slice";
import { sortArrayOfObjects } from "../../../utils/array";
import ProjectViewLayout from "../../../components/nav/ProjectViewLayout";
import { selectTransactionInsights } from "../../../store/slices/transaction.slice";
import useUtils from "../../../hooks/useUtils";
import useWindowSize from "../../../hooks/useWindowSize";
import  {GoSettings} from 'react-icons/go';

export default function TransactionsHome() {
  const utils = useUtils();
  const size = useWindowSize();
  const categoriesState = useSelector(selectCategoriesState);
  const transactionInsights = useSelector(selectTransactionInsights);
  const [showAddModal, setShowAddModal] = useState(false);
  const [startDate, setStartDate] = React.useState(new Date());
  const [categoriesSelectOptions, setCategoriesSelectOptions] = React.useState<
    { value: string; label: string }[]
  >([]);
  const IS_MOBILE = size.width < 768;

  useEffect(() => {
    let _categories = [
      ...categoriesState.income.map((c) => ({ value: c.name, label: c.name })),
      ...categoriesState.expenses.map((c) => ({
        value: c.name,
        label: c.name,
      })),
    ];
    // sort art
    _categories = sortArrayOfObjects(_categories, "label");
    // add generic label
    _categories.unshift({ value: "all", label: "All" });
    setCategoriesSelectOptions(_categories);
  }, [categoriesState.expenses, categoriesState.income]);

  return (
    <ProjectViewLayout title={'Transactions'}>
      <main className={`page-view px-3 md:px-6 py-6`}>
        <div className="toolbar mb-4 md:mb-6 flex justify-between align-items-center">
          <h1 className="font-bold text-xl md:text-2xl">Transactions</h1>
          <div className="sm-actions md:hidden">
            <Button
                className={"sm-button"}
                colorScheme="purple"
                variant="ghost"
                onClick={() => setShowAddModal(true)}
            >
              <BsPlus />
              &nbsp;Add Transaction
            </Button>
          </div>
          <div className="actions hidden md:flex">
            {/*<Button onClick={toggleColorMode}>*/}
            {/*    Toggle {colorMode === 'light' ? 'Dark' : 'Light'}*/}
            {/*</Button>*/}
            {/*<div className="mr-3" style={{width: '100px'}}>*/}
            {/*    <Select placeholder='Year' options={[{label: '2022', value: '2022'}]} />*/}
            {/*</div>*/}
            <div className="mr-3" style={{ width: "100px" }}>
              <Select
                  defaultValue={Data.month_days[0]}
                  placeholder="Day"
                  options={Data.month_days}
              />
            </div>
            <div className="mr-3" style={{ width: "160px" }}>
              {/*<Select placeholder='Month' options={Data.months} />*/}
              <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  showMonthYearPicker
                  dateFormat={`MMMM, yyyy`}
              />
            </div>
          </div>
        </div>
        <div className="pg-header-sm md:hidden mb-4">
          <div className="border border-purple-500 w-auto rounded-full text-purple-900 bg-purple-50 h-8 w-24 px-3 font-medium flex items-center gap-2">
            <GoSettings /><span>Filter</span>
          </div>
        </div>
        <div className="pg-header hidden md:block mb-4">
          <div className="flex justify-between align-items-center">
            <div className="leading hidden md:block" style={{ width: "180px" }}>
              <FormControl>
                {/*<FormLabel>Filter by category</FormLabel>*/}
                <Select
                    placeholder="Select Category"
                    defaultValue={{ value: "all", label: "All" }}
                    options={categoriesSelectOptions}
                />
              </FormControl>
            </div>
            <ButtonGroup spacing="4">
              <Button
                  className={"md-button"}
                  colorScheme="purple"
                  onClick={() => setShowAddModal(true)}
              >
                <BsPlus />
                &nbsp;Add Transaction
              </Button>
              {/*<Button>Add Expense</Button>*/}
            </ButtonGroup>
          </div>
        </div>
        <Divider />
        {<div className="mt-4">
          <StatGroup>
            <Stat>
              <StatLabel>Earnings</StatLabel>
              <StatNumber className={"text-blue-600"}>
                {
                  IS_MOBILE ? utils.formatShortCurrency(transactionInsights.earnings, { decimalPlaces: 0}) : utils.formatCurrency(transactionInsights.earnings)
                }
              </StatNumber>
              <StatHelpText>
                {/*<StatArrow type='increase' />*/}
                {/*23.36%*/}
              </StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>Expenses</StatLabel>
              <StatNumber className={"text-pink-600"}>
                {IS_MOBILE ? utils.formatShortCurrency(transactionInsights.expenses, { decimalPlaces: 0}) : utils.formatCurrency(transactionInsights.expenses)}
              </StatNumber>
              <StatHelpText>
                {/*<StatArrow type='decrease' />*/}
                {/*9.05%*/}
              </StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>Balance</StatLabel>
              <StatNumber
                className={
                  transactionInsights.balance < 0
                    ? "text-red-600"
                    : "text-green-600"
                }
              >
                {IS_MOBILE ? utils.formatShortCurrency(transactionInsights.balance, { decimalPlaces: 0}) : utils.formatCurrency(transactionInsights.balance)}
              </StatNumber>
              <StatHelpText>
                {/*<StatArrow type='increase' />*/}
                {/*23.36%*/}
              </StatHelpText>
            </Stat>
          </StatGroup>

          <div className="transaction-body mt-4">
            <TransactionsTable />
          </div>
        </div>}
      </main>
      {/*<BottomNav/>*/}
      {/*    Modals*/}
      <AddTransaction
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </ProjectViewLayout>
  );
}