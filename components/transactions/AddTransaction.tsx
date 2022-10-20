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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import { RiShareCircleLine } from "react-icons/ri";
import { BiTransfer } from "react-icons/bi";
import { TbDatabaseImport } from "react-icons/tb";
import CategorySelector from "../categories/CategorySelector";
import { useSelector } from "react-redux";
import {selectAccountsState} from "../../store/slices/accounts.slice";
import useForm from "../../hooks/useForm";
import {
  TransactionsModel,
  TransactionType,
} from "../../models/transactions.model";
import useApi from "../../hooks/useApi";
import { getSelectOptions } from "../../utils/array";
import "@uiw/react-md-editor/dist/mdeditor.min.css";
import "@uiw/react-markdown-preview/dist/markdown.min.css";
import dynamic from "next/dynamic";

const MDEditor = dynamic(
    () => import("@uiw/react-md-editor"),
    { ssr: false }
);

interface AddTransactionProps {
  open: boolean;
  onClose: () => void;
  onChange?: (e: any) => void;
}

export default function AddTransaction({ open, onClose }: AddTransactionProps) {
  const disclosure = useDisclosure();
  /**
   * This form states an initialized to use validation
   */
  const expenseForm = useForm({
    category: null,
    amount: null,
    date: new Date(),
    account: null,
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
    account: null,
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const wallets = useSelector(selectAccountsState);
  const [activeTabIndex, setActiveTabIndex] = React.useState(0);
  const [expenseNotes, setExpenseNotes] = React.useState("");
  const [transferNotes, setTransferNotes] = React.useState("");
  const [incomeNotes, setIncomeNotes] = React.useState("");
  const toast = useToast();
  const api = useApi();

  const resetForms = () => {
    setActiveTabIndex(0);
    // Reset forms
    expenseForm.resetForm({
      category: null,
      amount: null,
      date: new Date(),
      account: null,
    });
    incomeForm.resetForm({
      category: null,
      amount: null,
      date: new Date(),
      account: null,
    });
    transferForm.resetForm({
      to: null,
      from: null,
      amount: null,
      date: new Date(),
    });
    // reset notes form controls
    setExpenseNotes('');
    setIncomeNotes('');
    setTransferNotes('');
  };

  const openModal = React.useCallback(() => {
    if (!disclosure.isOpen) {
      // set initial date of date controls to today
      // this is done because when the user opens the modal the default value should be the current date and time
      // ! DO NOT ADD `resetForms` function the dependency array, it will cause infinite re-renders
      resetForms();
    }
    disclosure.onOpen();
  }, [disclosure]);

  React.useEffect(() => {
    if (open) {
      // open modal
      openModal();
    } else {
      disclosure.onClose();
    }
  }, [disclosure, open, openModal]);

  const closeModal = () => {
    disclosure.onClose();
    setIsLoading(false);
    if (onClose) {
      onClose();
    }
  };

  const createInputEvent = (name, value) => {
    const event = new Event("input", {
      bubbles: true,
      cancelable: true,
    });

    Object.defineProperty(event, "target", {
      value: {
        value,
        name,
      },
      enumerable: true,
    });
    return event;
  };

  // == when custom form control changes
  const expenseDateChange = (value) => {
    expenseForm.handleChange(createInputEvent("date", value));
  };
  const incomeDateChange = (value) => {
    incomeForm.handleChange(createInputEvent("date", value));
  };
  const transferDateChange = (value) => {
    transferForm.handleChange(createInputEvent("date", value));
  };

  const getWalletById = (id) => {
    return wallets.find((w) => w._id == id);
  };

  const addTransaction = () => {
    let form;
    switch (activeTabIndex) {
      case 0: // expense
        form = expenseForm;
        break;
      case 1: // income
        form = incomeForm;
        break;
      case 2: // transfer
        form = transferForm;
        break;
      default:
        break;
    }

    let errors = form.validateForm();
    /**
     * TODO: VALIDATIONS TO CHECK
     * Transfer to and from wallets cannot be the same
     * The amount must be greater than 0
     * Check if the wallet balance is enough for the amount specified in both the expenses form and in the
     *  "from" control of the transfer wallet
     */

    if (errors) {
      let key = Object.keys(errors)[0];
      toast({
        title: errors[key],
        status: "warning",
        isClosable: true,
      });
      return;
    }
    // construct object
    let transaction: TransactionsModel;

    switch (activeTabIndex) {
      case 0: // expense form.values
        transaction = {
          _id: (100 * Math.random()).toString(),
          amount: parseInt(form.values.amount.toString().trim()),
          category: form.values.category,
          notes: expenseNotes || "",
          type: TransactionType.EXPENSE,
          wallet: getWalletById(form.values.account),
          date: (form.values.date as Date).toISOString(),
        };
        break;
      case 1: // income
        transaction = {
          _id: (100 * Math.random()).toString(),
          amount: parseInt(form.values.amount.toString().trim()),
          category: form.values.category,
          notes: incomeNotes || "",
          type: TransactionType.INCOME,
          wallet: getWalletById(form.values.account),
          date: (form.values.date as Date).toISOString(),
        };
        break;
      case 2: // transfer
        transaction = {
          _id: (100 * Math.random()).toString(),
          amount: parseInt(form.values.amount.toString().trim()),
          from: getWalletById(form.values.from),
          to: getWalletById(form.values.to),
          notes: transferNotes || "",
          type: TransactionType.TRANSFER,
          date: (form.values.date as Date).toISOString(),
        };
        break;
      default:
        break;
    }
    /**
     * Add data to api
     */
    setIsLoading(true);
    api
      .addTransaction(transaction)
      .then(() => {
        resetForms();
      })
      .finally(() => {
        closeModal();
      });
  };

  return (
    <Modal
      onClose={closeModal}
      isOpen={disclosure.isOpen}
      size="3xl"
      closeOnOverlayClick={false}
      closeOnEsc={false}
      blockScrollOnMount={false}
      colorScheme={"purple"}
      isCentered={true}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Transaction</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs
            onChange={(index) => setActiveTabIndex(index)}
            colorScheme={"purple"}
            variant="soft-rounded"
          >
            <TabList className="justify-content-center">
              <Tab>
                <RiShareCircleLine />
                &nbsp;Expense
              </Tab>
              <Tab>
                <TbDatabaseImport />
                &nbsp;Income
              </Tab>
              <Tab>
                <BiTransfer />
                &nbsp;Transfer
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <CategorySelector
                  type="expense"
                  onChange={(value) =>
                    expenseForm.handleChange(
                      createInputEvent("category", value)
                    )
                  }
                />
                <div className="row">
                  <div className="col-sm-6">
                    <FormControl
                      className="mb-4"
                      isInvalid={!!expenseForm.errors.amount}
                    >
                      <FormLabel>Amount</FormLabel>
                      <InputGroup>
                        <InputLeftAddon bg={'purple.100'} color={'purple.500'}>FCFA</InputLeftAddon>
                        <Input
                          name="amount"
                          value={expenseForm.values.amount}
                          onChange={expenseForm.handleChange}
                          type="number"
                          placeholder="Amount"
                        />
                      </InputGroup>
                      <FormErrorMessage>
                        {expenseForm.errors.amount}
                      </FormErrorMessage>
                    </FormControl>
                  </div>
                  <div className="col-sm-6">
                    <FormControl className="mb-4">
                      <FormLabel>Account</FormLabel>
                      <Select
                        onChange={(e: any) =>
                          expenseForm.handleChange(
                            createInputEvent("account", e.value)
                          )
                        }
                        placeholder="Select Account"
                        options={getSelectOptions(wallets, "name", "_id")}
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
                      selected={expenseForm.values.date}
                      onChange={expenseDateChange}
                      showTimeSelect
                      dateFormat="MMMM d, yyyy h:mm aa"
                    />
                  </InputGroup>
                </FormControl>
                <FormControl className="mb-4">
                  <FormLabel>Notes (Optional)</FormLabel>
                  {/*<Textarea*/}
                  {/*  name="notes"*/}
                  {/*  value={expenseForm.values.notes}*/}
                  {/*  onChange={expenseForm.handleChange}*/}
                  {/*  placeholder="Notes"*/}
                  {/*/>*/}
                  <div data-color-mode="light">
                    <div className="wmde-markdown-var"> </div>
                    <MDEditor value={expenseNotes} preview="edit" onChange={setExpenseNotes} />
                  </div>

                </FormControl>
              </TabPanel>

              <TabPanel>
                <CategorySelector
                  type="income"
                  onChange={(value) =>
                    incomeForm.handleChange(createInputEvent("category", value))
                  }
                />
                <div className="row">
                  <div className="col-sm-6">
                    <FormControl className="mb-4">
                      <FormLabel>Amount</FormLabel>
                      <InputGroup>
                        <InputLeftAddon bg={'purple.100'} color={'purple.500'}>FCFA</InputLeftAddon>
                        <Input
                          name="amount"
                          value={incomeForm.values.amount}
                          onChange={incomeForm.handleChange}
                          type="number"
                          placeholder="Amount"
                        />
                      </InputGroup>
                    </FormControl>
                  </div>
                  <div className="col-sm-6">
                    <FormControl className="mb-4">
                      <FormLabel>Account</FormLabel>
                      <Select
                        placeholder="Select Account"
                        options={getSelectOptions(wallets, "name", "_id")}
                        onChange={({ value }) =>
                          incomeForm.handleChange(
                            createInputEvent("account", value)
                          )
                        }
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
                      selected={incomeForm.values.date}
                      onChange={incomeDateChange}
                      showTimeSelect
                      dateFormat="MMMM d, yyyy h:mm aa"
                    />
                  </InputGroup>
                </FormControl>
                <FormControl className="mb-4">
                  <FormLabel>Notes (Optional)</FormLabel>
                  {/*<Textarea*/}
                  {/*  name="notes"*/}
                  {/*  value={incomeForm.values.notes}*/}
                  {/*  onChange={incomeForm.handleChange}*/}
                  {/*  placeholder="Notes"*/}
                  {/*/>*/}
                  <div data-color-mode="light">
                    <div className="wmde-markdown-var"> </div>
                    <MDEditor value={incomeNotes} preview="edit" onChange={setIncomeNotes} />
                  </div>
                </FormControl>
              </TabPanel>

              <TabPanel>
                <div className="row">
                  <div className="col-sm-6">
                    <FormControl className="mb-4">
                      <FormLabel>From</FormLabel>
                      <Select
                        placeholder="Select Account"
                        options={getSelectOptions(wallets, "name", "_id")}
                        onChange={({ value }) =>
                          transferForm.handleChange(
                            createInputEvent("from", value)
                          )
                        }
                      />
                    </FormControl>
                  </div>
                  <div className="col-sm-6">
                    <FormControl className="mb-4">
                      <FormLabel>To</FormLabel>
                      <Select
                        placeholder="Select Account"
                        options={getSelectOptions(wallets, "name", "_id")}
                        onChange={({ value }) =>
                          transferForm.handleChange(
                            createInputEvent("to", value)
                          )
                        }
                      />
                    </FormControl>
                  </div>
                </div>
                <FormControl className="mb-4">
                  <FormLabel>Amount</FormLabel>
                  <InputGroup>
                    <InputLeftAddon bg={'purple.100'} color={'purple.500'}>FCFA</InputLeftAddon>
                    <Input
                      name="amount"
                      value={transferForm.values.amount}
                      onChange={transferForm.handleChange}
                      type="number"
                      placeholder="Amount"
                    />
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
                      selected={transferForm.values.date}
                      onChange={transferDateChange}
                      showTimeSelect
                      dateFormat="MMMM d, yyyy h:mm aa"
                    />
                  </InputGroup>
                </FormControl>
                <FormControl className="mb-4">
                  <FormLabel>Notes (Optional)</FormLabel>
                  {/*<Textarea*/}
                  {/*  name="notes"*/}
                  {/*  value={transferForm.values.notes}*/}
                  {/*  onChange={transferForm.handleChange}*/}
                  {/*  placeholder="Notes"*/}
                  {/*/>*/}
                  <div data-color-mode="light">
                    <div className="wmde-markdown-var"> </div>
                    <MDEditor value={transferNotes} preview="edit" onChange={setTransferNotes} />
                  </div>
                </FormControl>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup spacing={4}>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              loadingText={"Saving"}
              isLoading={isLoading}
              onClick={addTransaction}
              colorScheme="purple"
            >
              Save
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
