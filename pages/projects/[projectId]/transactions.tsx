import {
    Button,
    ButtonGroup,
    Divider,
    Stat,
    Select,
    StatGroup,
    StatHelpText,
    StatLabel,
    StatNumber,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalFooter,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import React, { useState } from "react";
import AddTransaction from "../../../components/transactions/AddTransaction";
import TransactionsTable from "../../../components/transactions/TransactionsTable";
import { BsPlus } from "react-icons/bs";
import { useSelector } from "react-redux";
import ProjectViewLayout from "../../../components/nav/ProjectViewLayout";
import { selectTransactionData, selectTransactionInsights } from "../../../store/slices/transaction.slice";
import useUtils from "../../../hooks/useUtils";
import useWindowSize from "../../../hooks/useWindowSize";
import { GoSettings } from "react-icons/go";
import useApi from "../../../hooks/useApi";
import { selectAuthUserState } from "../../../store/slices/auth.slice";
import dayjs from "dayjs";
import { AccountsModel } from "../../../models/accounts.model";
import { selectAccountsState } from "../../../store/slices/accounts.slice";
import { useRouter } from "next/router";
import { selectActiveProjectState } from "../../../store/slices/projects.slice";

export default function TransactionsHome() {
    const utils = useUtils();
    const api = useApi();
    const size = useWindowSize();
    const accountWarningDis = useDisclosure();
    const router = useRouter();

    const authUserState = useSelector(selectAuthUserState);
    const transactionInsights = useSelector(selectTransactionInsights);
    const transactionsState = useSelector(selectTransactionData);
    const accountState = useSelector((state: any) => state.accounts);
    const accounts: AccountsModel[] = accountState.data;
    const activeProject = useSelector(selectActiveProjectState);

    const [showAddModal, setShowAddModal] = useState(false);
    const [startDate, setStartDate] = React.useState<Date>();
    const [endDate, setEndDate] = React.useState(new Date());
    const [isPageLoading, setIsPageLoading] = useState(false);

    const IS_MOBILE = size.width < 768;
    // State for data filtering
    const [dateFilter, setDateFilter] = useState<string>("all");

    const toast = useToast();

    // useEffect(() => {
    //   let _categories = [
    //     ...categoriesState.income.map((c) => ({ value: c.name, label: c.name })),
    //     ...categoriesState.expenses.map((c) => ({
    //       value: c.name,
    //       label: c.name,
    //     })),
    //   ];
    //   // sort art
    //   _categories = sortArrayOfObjects(_categories, "label");
    //   // add generic label
    //   _categories.unshift({ value: "all", label: "All" });
    //   setCategoriesSelectOptions(_categories);
    // }, [categoriesState.expenses, categoriesState.income]);

    React.useEffect(() => {
        const startOfMonth = dayjs().startOf("month").toDate();
        setStartDate(startOfMonth);
    }, []);

    React.useEffect(() => {
        console.log(transactionsState.length == 0 && dateFilter == "all" && authUserState._id);
        if (transactionsState.length == 0 && dateFilter == "all" && authUserState._id) {
            setIsPageLoading(true);
            api.getTransactions().then(() => setIsPageLoading(false));
        }
    }, [transactionsState.length]);

    /**
     * When the user attempts to filter the date
     */
    function onFilterDate(props: { startDate?: string; endDate?: string; dateFilter?: string }) {
        setIsPageLoading(true);
        api.getTransactions(props).then((data) => {
            setIsPageLoading(false);
        });
    }

    function onDateFilterChange(event) {
        const value = event.target.value;
        setDateFilter(value);
        // It the user selects custom, the date picker will be used
        if (value === "custom") return;
        // If the value is all, fetch all data from the database
        // Load filters
        onFilterDate({ dateFilter: value });
    }

    // When the date picture is changed
    function onDatePickerChange(dates) {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
        // Load data if both dates have been set
        if (start && end) {
            // Find new Data
            onFilterDate({ startDate: start.toISOString().split("T")[0], endDate: end.toISOString().split("T")[0] });
        }
    }

    function showTransactionModal() {
        if (accountState.isLoading) {
            toast({
                title: "Please wait while we load all your data.",
            });
        } else if (!accountState.isLoading && accounts.length > 0) {
            setShowAddModal(true);
        } else {
            accountWarningDis.onOpen();
        }
    }

    return (
        <ProjectViewLayout title={"Transactions"}>
            <main className={`page-view px-3 md:px-6 py-6`}>
                <div className="toolbar mb-4 md:mb-6 flex justify-between align-items-center">
                    <h1 className="font-bold text-xl md:text-2xl">Transactions</h1>
                    <div className="sm-actions md:hidden">
                        <Button className={"sm-button"} colorScheme="brand" variant="ghost" onClick={showTransactionModal}>
                            <BsPlus />
                            &nbsp;Add Transaction
                        </Button>
                    </div>
                    <div className="actions hidden md:block">
                        {/*<Button onClick={toggleColorMode}>*/}
                        {/*    Toggle {colorMode === 'light' ? 'Dark' : 'Light'}*/}
                        {/*</Button>*/}
                        {/*<div className="mr-3" style={{width: '100px'}}>*/}
                        {/*    <Select placeholder='Year' options={[{label: '2022', value: '2022'}]} />*/}
                        {/*</div>*/}
                        <p className="label mb-1 text-sm font-bold">Showing:</p>
                        <div className="md:flex">
                            <div className="mr-3" style={{ width: "130px" }}>
                                <Select defaultValue={dateFilter} isDisabled={isPageLoading} onChange={onDateFilterChange}>
                                    <option value="all">All</option>
                                    <option value="today">Today</option>
                                    <option value="this_week">This Week</option>
                                    <option value="this_month">This Month</option>
                                    <option value="this_year">This Year</option>
                                    <option value="custom">Custom</option>
                                </Select>
                            </div>
                            {dateFilter === "custom" && (
                                <div className="mr-3" style={{ width: "240px" }}>
                                    {/*<Select placeholder='Month' options={Data.months} />*/}
                                    <DatePicker startDate={startDate} endDate={endDate} disabled={isPageLoading} onChange={onDatePickerChange} selectsRange dateFormat={`dd MMM yyyy`} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="pg-header-sm md:hidden mb-4">
                    <div className="border border-purple-500 w-auto rounded-full text-purple-900 bg-purple-50 h-8 w-24 px-3 font-medium flex items-center gap-2">
                        <GoSettings />
                        <span>Filter</span>
                    </div>
                </div>
                <div className="pg-header hidden md:block mb-4">
                    <div className="flex justify-between align-items-center">
                        <div className="leading hidden md:block" style={{ width: "180px" }}>
                            {/*<FormControl>*/}
                            {/*  /!*<FormLabel>Filter by category</FormLabel>*!/*/}
                            {/*  <Select*/}
                            {/*      placeholder="Select Category"*/}
                            {/*      defaultValue={{ value: "all", label: "All" }}*/}
                            {/*      options={categoriesSelectOptions}*/}
                            {/*  />*/}
                            {/*</FormControl>*/}
                        </div>
                        <ButtonGroup spacing="4">
                            <Button className={"md-button"} colorScheme="brand" onClick={showTransactionModal}>
                                <BsPlus />
                                &nbsp;Add Transaction
                            </Button>
                            {/*<Button>Add Expense</Button>*/}
                        </ButtonGroup>
                    </div>
                </div>
                <Divider />
                {
                    <div className="mt-4">
                        <StatGroup>
                            <Stat>
                                <StatLabel>Earnings</StatLabel>
                                <StatNumber className={"text-blue-600"}>
                                    {IS_MOBILE ? utils.formatShortCurrency(transactionInsights.earnings, { decimalPlaces: 0 }) : utils.formatCurrency(transactionInsights.earnings)}
                                </StatNumber>
                                <StatHelpText>
                                    {/*<StatArrow type='increase' />*/}
                                    {/*23.36%*/}
                                </StatHelpText>
                            </Stat>

                            <Stat>
                                <StatLabel>Expenses</StatLabel>
                                <StatNumber className={"text-pink-600"}>
                                    {IS_MOBILE ? utils.formatShortCurrency(transactionInsights.expenses, { decimalPlaces: 0 }) : utils.formatCurrency(transactionInsights.expenses)}
                                </StatNumber>
                                <StatHelpText>
                                    {/*<StatArrow type='decrease' />*/}
                                    {/*9.05%*/}
                                </StatHelpText>
                            </Stat>

                            <Stat>
                                <StatLabel>Balance</StatLabel>
                                <StatNumber className={transactionInsights.balance < 0 ? "text-red-600" : "text-green-600"}>
                                    {IS_MOBILE ? utils.formatShortCurrency(transactionInsights.balance, { decimalPlaces: 0 }) : utils.formatCurrency(transactionInsights.balance)}
                                </StatNumber>
                                <StatHelpText>
                                    {/*<StatArrow type='increase' />*/}
                                    {/*23.36%*/}
                                </StatHelpText>
                            </Stat>
                        </StatGroup>

                        <div className="transaction-body mt-4">
                            <TransactionsTable loading={isPageLoading} />
                        </div>
                    </div>
                }
            </main>
            {/*<BottomNav/>*/}
            {/*    Modals*/}
            <AddTransaction open={showAddModal} onClose={() => setShowAddModal(false)} />

            <Modal onClose={accountWarningDis.onClose} isOpen={accountWarningDis.isOpen} size="lg" closeOnOverlayClick={false} closeOnEsc={false} colorScheme={"brand"} isCentered={true}>
                <ModalOverlay />
                <ModalContent>
                    <ModalBody>
                        <img src="/saving.png" alt="" className="mx-auto h-40 mb-3" />
                        <h2 className="text-lg text-center font-bold mb-4">List Your Bank Account for Balance Updates</h2>

                        <p className="text-slate-500 text-center text-sm">
                            To ensure accurate and up-to-date balances in your records, we kindly ask you to list your bank account within the app. This information allows us to fetch the latest
                            transaction data and update your balances accordingly. It&apos;s important to note that this process does not involve linking the app directly to your bank account or
                            providing access to your account details. Listing your bank account is a simple step to help you stay on top of your financial information. <br />
                            Thank you for your understanding and cooperation!
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <ButtonGroup spacing={4}>
                            <Button onClick={accountWarningDis.onClose}>Cancel</Button>
                            <Button onClick={() => router.push(`/projects/${activeProject.id}/accounts`)} colorScheme="brand">
                                Set up Accounts
                            </Button>
                        </ButtonGroup>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </ProjectViewLayout>
    );
}
