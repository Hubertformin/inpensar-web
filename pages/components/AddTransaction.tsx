import React from "react";
import {
    Button,
    ButtonGroup,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    InputGroup,
    InputLeftAddon,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Textarea,
    useDisclosure, useToast
} from "@chakra-ui/react";
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import {RiShareCircleLine} from "react-icons/ri";
import {BiTransfer, BiCalendar} from "react-icons/bi";
import {TbDatabaseImport} from "react-icons/tb";
import CategorySelector from "./CategorySelector";
import {useDispatch, useSelector} from "react-redux";
import {selectWalletState} from "../../store/slices/wallet.slice";
import useForm from "./useForm";
import {TransactionsModel, TransactionType} from "../../models/transactions.model";
import {selectTransactionLoadingState} from "../../store/slices/transaction.slice";
import {addTransactionThunk} from "../../store/thunks/transaction.thunk";

export default function AddTransaction({
                                           open,
                                           onClose,
                                           onChange
                                       }: { open: boolean, onClose: () => void, onChange: (e: any) => void }) {
    const disclosure = useDisclosure();
    const expenseForm = useForm({
        category: null,
        amount: null,
        date: new Date(),
        account: null
    });
    const transferForm = useForm({
        to: null,
        from: null,
        amount: null,
        date: new Date(),
    });
    const incomeForm = useForm({
        category: null,
        amount: null,
        date: new Date(),
        account: null
    });
    const [accounts, setAccounts] = React.useState([]);
    const [expenseDateControl, setExpenseDateControl] = React.useState(new Date());
    const [transferDateControl, setTransferDateControl] = React.useState(new Date());
    const [incomeDateControl, setIncomeDateControl] = React.useState(new Date());
    const wallets = useSelector(selectWalletState);
    const [activeTabIndex, setActiveTabIndex] = React.useState(0);
    const toast = useToast();
    const dispatch = useDispatch();
    const transactionsLoadingState = useSelector(selectTransactionLoadingState);

    React.useEffect(() => {
        if (open) {
            openModal();
        } else {
            disclosure.onClose();
        }

        // if transaction loading state finished, close modals
        if (disclosure.isOpen && !transactionsLoadingState) {
            closeModal();
            // reset tab index and form
            setActiveTabIndex(0);
        }
        // set accounts
        setAccounts(() => wallets.map((w) => ({label: w.name, value: w._id})))
    }, [open, wallets, transactionsLoadingState]);

    const openModal = () => {
        expenseForm.resetForm({
            category: null,
            amount: null,
            date: new Date(),
            account: null
        });
        incomeForm.resetForm({
            category: null,
            amount: null,
            date: new Date(),
            account: null
        });
        transferForm.resetForm({
            to: null,
            from: null,
            amount: null,
            date: new Date(),
        });
        disclosure.onOpen();
    };

    const closeModal = () => {
        disclosure.onClose();
        if (onClose) {
            onClose();
        }
    }

    const createInputEvent = (name, value) => {
        const event = new Event('input', {
            bubbles: true,
            cancelable: true,
        });

        Object.defineProperty(event, 'target', {
            value: {
                value,
                name
            }, enumerable: true
        });
        return event;
    }

    // == when custom form control changes
    const expenseDateChange = (value) => {
        setExpenseDateControl(value);
        expenseForm.handleChange(createInputEvent('date', value));
    }
    const incomeDateChange = (value) => {
        setIncomeDateControl(value);
        incomeForm.handleChange(createInputEvent('date', value));
    }
    const transferDateChange = (value) => {
        setTransferDateControl(value);
        transferForm.handleChange(createInputEvent('date', value));
    }

    const getWalletById = (id) => {
        return wallets.find(w => w._id == id);
    }

    const addTransaction = () => {
        let form;
        switch (activeTabIndex) {
            case 0:  // expense
                form = expenseForm;
                break;
            case 1: // transfer
                form = transferForm;
                break;
            case 2: // income
                form = incomeForm;
                break;
            default:
                break;
        }

        let errors = form.validateForm();

        if (errors) {
            let key = Object.keys(errors)[0];
            toast({
                title: errors[key],
                status: 'warning',
                isClosable: true,
            })
            return;
        }
        // construct object
        let transaction: TransactionsModel;

        switch (activeTabIndex) {
            case 0: // expense form.values
                transaction = {
                    _id: (100 * Math.random()).toString(),
                    amount: form.values.amount,
                    category: form.values.category,
                    notes: form.values.notes || '',
                    type: TransactionType.EXPENSE,
                    wallet: getWalletById(form.values.account),
                    date: (form.values.date as Date).toISOString()
                };
                break;
            case 1:  // transfer
                transaction = {
                    _id: (100 * Math.random()).toString(),
                    amount: form.values.amount,
                    from: getWalletById(form.values.from),
                    to: getWalletById(form.values.to),
                    notes: form.values.notes || '',
                    type: TransactionType.TRANSFER,
                    date: (form.values.date as Date).toISOString()
                };
                break;
            case 2: // income
                transaction = {
                    _id: (100 * Math.random()).toString(),
                    amount: form.values.amount,
                    category: form.values.category,
                    notes: form.values.notes || '',
                    type: TransactionType.INCOME,
                    wallet: getWalletById(form.values.account),
                    date: (form.values.date as Date).toISOString()
                };
                break;
            default:
                break;
        }
        // ADD TO STORE VIA THUNK FUNCTION
        console.log(activeTabIndex);
        console.log(form)
        console.log(transaction)
        // @ts-ignore
        dispatch(addTransactionThunk(transaction));

    };

    return (
        <Modal
            onClose={closeModal}
            isOpen={disclosure.isOpen}
            size="xl"
            closeOnOverlayClick={false}
            closeOnEsc={false}
            colorScheme={'purple'}
            isCentered={true}

        >
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>Add Transaction</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <Tabs onChange={(index) => setActiveTabIndex(index)} colorScheme={'purple'} variant="soft-rounded">
                        <TabList className="justify-content-center">
                            <Tab><RiShareCircleLine/>&nbsp;Expense</Tab>
                            <Tab><BiTransfer/>&nbsp;Transfer</Tab>
                            <Tab><TbDatabaseImport/>&nbsp;Income</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <CategorySelector
                                    type="expense"
                                    onChange={(value) => expenseForm.handleChange(createInputEvent('category', value))}
                                />
                                <div className="row">
                                    <div className="col-sm-6">
                                        <FormControl className="mb-4" isInvalid={!!expenseForm.errors.amount}>
                                            <FormLabel>Amount</FormLabel>
                                            <InputGroup>
                                                <InputLeftAddon children='FCFA'/>
                                                <Input name="amount" onChange={expenseForm.handleChange} type='number'
                                                       placeholder='Amount'/>
                                            </InputGroup>
                                            <FormErrorMessage>{expenseForm.errors.amount}</FormErrorMessage>
                                        </FormControl>
                                    </div>
                                    <div className="col-sm-6">
                                        <FormControl className="mb-4">
                                            <FormLabel>Account</FormLabel>
                                            <Select
                                                onChange={({value}) => expenseForm.handleChange(createInputEvent('account', value))}
                                                placeholder='Select Account'
                                                options={accounts}
                                            />
                                        </FormControl>
                                    </div>
                                </div>
                                <FormControl className="mb-4">
                                    <FormLabel>Date</FormLabel>
                                    <InputGroup>
                                        {/*<InputLeftElement*/}
                                        {/*    pointerEvents='none'*/}
                                        {/*    children={<BiCalendar/>}*/}
                                        {/*/>*/}
                                        {/*<Input type='datetime' placeholder='Date'/>*/}
                                        <DatePicker
                                            selected={expenseDateControl}
                                            onChange={expenseDateChange}
                                            showTimeSelect
                                            dateFormat="MMMM d, yyyy h:mm aa"
                                        />
                                    </InputGroup>
                                </FormControl>
                                <FormControl className="mb-4">
                                    <FormLabel>Notes (Optional)</FormLabel>
                                    <Textarea name="notes" onChange={expenseForm.handleChange} placeholder='Notes'/>
                                </FormControl>
                            </TabPanel>
                            <TabPanel>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <FormControl className="mb-4">
                                            <FormLabel>From</FormLabel>
                                            <Select placeholder='Select Account'
                                                    options={accounts}
                                                    onChange={({value}) => transferForm.handleChange(createInputEvent('from', value))}
                                            />
                                        </FormControl>
                                    </div>
                                    <div className="col-sm-6">
                                        <FormControl className="mb-4">
                                            <FormLabel>To</FormLabel>
                                            <Select placeholder='Select Account'
                                                    options={accounts}
                                                    onChange={({value}) => transferForm.handleChange(createInputEvent('to', value))}
                                            />
                                        </FormControl>
                                    </div>
                                </div>
                                <FormControl className="mb-4">
                                    <FormLabel>Amount</FormLabel>
                                    <InputGroup>
                                        <InputLeftAddon children='FCFA'/>
                                        <Input name="amount" onChange={transferForm.handleChange} type='number'
                                               placeholder='Amount'/>
                                    </InputGroup>
                                </FormControl>
                                <FormControl className="mb-4">
                                    <FormLabel>Date</FormLabel>
                                    <InputGroup>
                                        {/*<InputLeftElement*/}
                                        {/*    pointerEvents='none'*/}
                                        {/*    children={<BiCalendar/>}*/}
                                        {/*/>*/}
                                        {/*<Input type='datetime' placeholder='Date'/>*/}
                                        <DatePicker
                                            selected={transferDateControl}
                                            onChange={transferDateChange}
                                            showTimeSelect
                                            dateFormat="MMMM d, yyyy h:mm aa"
                                        />
                                    </InputGroup>
                                </FormControl>
                                <FormControl className="mb-4">
                                    <FormLabel>Notes (Optional)</FormLabel>
                                    <Textarea name="notes" onChange={transferForm.handleChange} placeholder='Notes'/>
                                </FormControl>
                            </TabPanel>

                            <TabPanel>
                                <CategorySelector
                                    type="income"
                                    onChange={(value) => incomeForm.handleChange(createInputEvent('category', value))}
                                />
                                <div className="row">
                                    <div className="col-sm-6">
                                        <FormControl className="mb-4">
                                            <FormLabel>Amount</FormLabel>
                                            <InputGroup>
                                                <InputLeftAddon children='FCFA'/>
                                                <Input name="amount" onChange={incomeForm.handleChange} type='number'
                                                       placeholder='Amount'/>
                                            </InputGroup>
                                        </FormControl>
                                    </div>
                                    <div className="col-sm-6">
                                        <FormControl className="mb-4">
                                            <FormLabel>Account</FormLabel>
                                            <Select placeholder='Select Account'
                                                    options={accounts}
                                                    onChange={({value}) => incomeForm.handleChange(createInputEvent('account', value))}
                                            />
                                        </FormControl>
                                    </div>
                                </div>
                                <FormControl className="mb-4">
                                    <FormLabel>Date</FormLabel>
                                    <InputGroup>
                                        {/*<InputLeftElement*/}
                                        {/*    pointerEvents='none'*/}
                                        {/*    children={<BiCalendar/>}*/}
                                        {/*/>*/}
                                        {/*<Input type='datetime' placeholder='Date'/>*/}
                                        <DatePicker
                                            selected={incomeDateControl}
                                            onChange={incomeDateChange}
                                            showTimeSelect
                                            dateFormat="MMMM d, yyyy h:mm aa"
                                        />
                                    </InputGroup>
                                </FormControl>
                                <FormControl className="mb-4">
                                    <FormLabel>Notes (Optional)</FormLabel>
                                    <Textarea name="notes" onChange={incomeForm.handleChange} placeholder='Notes'/>
                                </FormControl>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </ModalBody>
                <ModalFooter>
                    <ButtonGroup spacing={4}>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button loadingText={'Saving'} isLoading={transactionsLoadingState} onClick={addTransaction}
                                colorScheme="purple">Save</Button>
                    </ButtonGroup>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}