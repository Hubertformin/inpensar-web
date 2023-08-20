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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import CategorySelector from "../categories/CategorySelector";
import { useSelector } from "react-redux";
import {selectAccountsState} from "../../store/slices/accounts.slice";
import useForm from "../../hooks/useForm";
import {
  TransactionsModel,
  TransactionType,
} from "../../models/transactions.model";
import useApi from "../../hooks/useApi";
import { getSelectOption, getSelectOptions } from "../../utils/array";
import "@uiw/react-md-editor/dist/mdeditor.min.css";
import "@uiw/react-markdown-preview/dist/markdown.min.css";
import dynamic from "next/dynamic";
import {selectAuthUserState} from "../../store/slices/auth.slice";

const MDEditor = dynamic(
    () => import("@uiw/react-md-editor"),
    { ssr: false }
);

interface EditTransactionProps {
  open: boolean;
  transaction: TransactionsModel;
  onClose: () => void;
  onChange?: (e: any) => void;
}

export default function EditTransaction({
  open,
  transaction,
  onClose,
}: EditTransactionProps) {
  const disclosure = useDisclosure();
  const authUser = useSelector(selectAuthUserState);
  /**
   * This form states an initialized to use validation
   */
  const expenseForm = useForm();
  const transferForm = useForm();
  const incomeForm = useForm();

  const [isLoading, setIsLoading] = React.useState(false);
  const [expenseNotes, setExpenseNotes] = React.useState("");
  const [transferNotes, setTransferNotes] = React.useState("");
  const [incomeNotes, setIncomeNotes] = React.useState("");
  const wallets = useSelector(selectAccountsState);
  const toast = useToast();
  const api = useApi();

  const resetForms = () => {
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
  };

  const openModal = React.useCallback(() => {
    if (!disclosure.isOpen) {
      // set initial date of date controls to today
      // this is done because when the user opens the modal the default value should be the current date and time
      if (transaction && transaction.type === TransactionType.INCOME) {
        incomeForm.resetForm({
          category: transaction.category,
          amount: transaction.amount,
          date: new Date(transaction.date),
          account: transaction.account._id,
        });
        setIncomeNotes(transaction.notes || '')
      } else if (transaction.type === TransactionType.EXPENSE) {
        expenseForm.resetForm({
          category: transaction.category,
          amount: transaction.amount,
          date: new Date(transaction.date),
          account: transaction.account._id,
        });
        setExpenseNotes(transaction.notes || '')
      } else if (transaction.type === TransactionType.TRANSFER) {
        transferForm.resetForm({
          to: transaction.to._id,
          from: transaction.from._id,
          amount: transaction.amount,
          date: new Date(transaction.date),
        });
        setTransferNotes(transaction.notes || '')
      }
    }
    disclosure.onOpen();
  }, [disclosure, expenseForm, incomeForm, transaction, transferForm]);

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

  const updateTransaction = () => {
    let form;
    switch (transaction.type) {
      case TransactionType.EXPENSE: // expense
        form = expenseForm;
        break;
      case TransactionType.TRANSFER: // transfer
        form = transferForm;
        break;
      case TransactionType.INCOME: // income
        form = incomeForm;
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
    let transactionData: TransactionsModel;

    switch (transaction.type) {
      case TransactionType.EXPENSE: // expense form.values
        transactionData = {
          amount: parseInt(form.values.amount.toString().trim()),
          category: form.values.category,
          notes: expenseNotes || "",
          type: TransactionType.EXPENSE,
          account: getWalletById(form.values.account),
          date: (form.values.date as Date).toISOString(),
        };
        break;
      case TransactionType.TRANSFER: // transfer
        transactionData = {
          amount: parseInt(form.values.amount.toString().trim()),
          from: getWalletById(form.values.from),
          to: getWalletById(form.values.to),
          notes: transferNotes || "",
          type: TransactionType.TRANSFER,
          date: (form.values.date as Date).toISOString(),
        };
        break;
      case TransactionType.INCOME: // income
        transactionData = {
          amount: parseInt(form.values.amount.toString().trim()),
          category: form.values.category,
          notes: incomeNotes || "",
          type: TransactionType.INCOME,
          account: getWalletById(form.values.account),
          date: (form.values.date as Date).toISOString(),
        };
        break;
      default:
        break;
    }
    // pass the id to the functions
    transactionData["_id"] = transaction._id;
    /**
     * Add .data to api
     */
    (transactionData);
    setIsLoading(true);
    api
      .updateTransaction(transactionData)
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
      size="2xl"
      closeOnOverlayClick={false}
      closeOnEsc={false}
      colorScheme={"purple"}
      blockScrollOnMount={false}
      isCentered={true}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Transaction</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {transaction?.type === TransactionType.EXPENSE && (
            <div className="expense_form">
              <CategorySelector
                type="expense"
                value={expenseForm.values.category}
                onChange={(value) =>
                  expenseForm.handleChange(createInputEvent("category", value))
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
                      <InputLeftAddon bg={'purple.100'} color={'purple.500'}>{authUser.settings.currency}</InputLeftAddon>
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
                      defaultValue={getSelectOption(
                        getWalletById(expenseForm.values.account),
                        "name",
                        "_id"
                      )}
                      onChange={({ value }: any) =>
                        expenseForm.handleChange(
                          createInputEvent("account", value)
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
            </div>
          )}
          {transaction?.type === TransactionType.TRANSFER && (
            <div className="transfer_form">
              <div className="row">
                <div className="col-sm-6">
                  <FormControl className="mb-4">
                    <FormLabel>From</FormLabel>
                    <Select
                      placeholder="Select Account"
                      value={getSelectOption(
                        getWalletById(transferForm.values.from),
                        "name",
                        "_id"
                      )}
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
                      value={getSelectOption(
                        getWalletById(transferForm.values.to),
                        "name",
                        "_id"
                      )}
                      options={getSelectOptions(wallets, "name", "_id")}
                      onChange={({ value }) =>
                        transferForm.handleChange(createInputEvent("to", value))
                      }
                    />
                  </FormControl>
                </div>
              </div>
              <FormControl className="mb-4">
                <FormLabel>Amount</FormLabel>
                <InputGroup>
                  <InputLeftAddon bg={'purple.100'} color={'purple.500'}>{authUser.settings.currency}</InputLeftAddon>
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
            </div>
          )}

          {transaction?.type === TransactionType.INCOME && (
            <div className="income_form">
              <CategorySelector
                type="income"
                value={incomeForm.values.category}
                onChange={(value) =>
                  incomeForm.handleChange(createInputEvent("category", value))
                }
              />
              <div className="row">
                <div className="col-sm-6">
                  <FormControl className="mb-4">
                    <FormLabel>Amount</FormLabel>
                    <InputGroup>
                      <InputLeftAddon bg={'purple.100'} color={'purple.500'}>{authUser.settings.currency}</InputLeftAddon>
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
                      value={getSelectOption(
                        getWalletById(incomeForm.values.account),
                        "name",
                        "_id"
                      )}
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
                    // selected={incomeDateControl}
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
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <ButtonGroup spacing={4}>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              loadingText={"Saving"}
              isLoading={isLoading}
              onClick={updateTransaction}
              colorScheme="brand"
            >
              Save
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
