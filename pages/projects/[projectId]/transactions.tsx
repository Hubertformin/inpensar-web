import {
  Button,
  ButtonGroup,
  Divider,
  FormControl, Grid, GridItem, Skeleton, SkeletonCircle,
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
import { formatCurrency } from "../../../utils/number";

export default function TransactionsHome() {
  const categoriesState = useSelector(selectCategoriesState);
  const transactionInsights = useSelector(selectTransactionInsights);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [startDate, setStartDate] = React.useState(new Date());
  const [categoriesSelectOptions, setCategoriesSelectOptions] = React.useState<
    { value: string; label: string }[]
  >([]);

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
    <ProjectViewLayout>
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
                  dateFormat="MMMM, yyyy"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="pg-header mb-4">
          <div className="flex justify-between align-items-center">
            <div className="leading" style={{ width: "180px" }}>
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
                {formatCurrency(transactionInsights.earnings)}
              </StatNumber>
              <StatHelpText>
                {/*<StatArrow type='increase' />*/}
                {/*23.36%*/}
              </StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>Expenses</StatLabel>
              <StatNumber className={"text-pink-600"}>
                {formatCurrency(transactionInsights.expenses)}
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
                {formatCurrency(transactionInsights.balance)}
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

function PageLoadingSchema() {
  return (
      <div className={''}>
        <div className="row mb-10">
          <div className="col-sm-4">
            <Skeleton height={'105px'} />
          </div>
          <div className="col-sm-4">
            <Skeleton height={'105px'} />
          </div>
          <div className="col-sm-4">
            <Skeleton height={'105px'} />
          </div>
        </div>
        <Grid templateColumns='repeat(5, 1fr)' gap={6}>
          <GridItem w='100%'>
            <SkeletonCircle size='55' />
          </GridItem>
          <GridItem colSpan={4} w='100%'>
            <Skeleton height={'25px'} />
            <Skeleton mt='2' height={'30px'} />
          </GridItem>
        </Grid>
      </div>
  )
}