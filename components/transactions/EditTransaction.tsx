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
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import CategorySelector from "../categories/CategorySelector";
import { useSelector } from "react-redux";
import { selectWalletState } from "../../store/slices/wallet.slice";
import useForm from "../../hooks/useForm";
import {
  TransactionsModel,
  TransactionType,
} from "../../models/transactions.model";
import useApi from "../../hooks/useApi";
import { getSelectOption, getSelectOptions } from "../../utils/array";

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
  /**
   * This form states an initialized to use validation
   */
  const expenseForm = useForm();
  const transferForm = useForm();
  const incomeForm = useForm();

  const [isLoading, setIsLoading] = React.useState(false);
  const wallets = useSelector(selectWalletState);
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
          account: transaction.wallet._id,
        });
      } else if (transaction.type === TransactionType.EXPENSE) {
        expenseForm.resetForm({
          category: transaction.category,
          amount: transaction.amount,
          date: new Date(transaction.date),
          account: transaction.wallet._id,
        });
      } else if (transaction.type === TransactionType.TRANSFER) {
        transferForm.resetForm({
          to: transaction.to._id,
          from: transaction.from._id,
          amount: transaction.amount,
          date: new Date(transaction.date),
        });
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
          notes: form.values.notes || "",
          type: TransactionType.EXPENSE,
          wallet: getWalletById(form.values.account),
          date: (form.values.date as Date).toISOString(),
        };
        break;
      case TransactionType.TRANSFER: // transfer
        transactionData = {
          amount: parseInt(form.values.amount.toString().trim()),
          from: getWalletById(form.values.from),
          to: getWalletById(form.values.to),
          notes: form.values.notes || "",
          type: TransactionType.TRANSFER,
          date: (form.values.date as Date).toISOString(),
        };
        break;
      case TransactionType.INCOME: // income
        transactionData = {
          amount: parseInt(form.values.amount.toString().trim()),
          category: form.values.category,
          notes: form.values.notes || "",
          type: TransactionType.INCOME,
          wallet: getWalletById(form.values.account),
          date: (form.values.date as Date).toISOString(),
        };
        break;
      default:
        break;
    }
    // pass the id to the functions
    transactionData["_id"] = transaction._id;
    /**
     * Add data to api
     */
    console.log(transactionData);
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
                      <InputLeftAddon>FCFA</InputLeftAddon>
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
                <Textarea
                  name="notes"
                  value={expenseForm.values.notes}
                  onChange={expenseForm.handleChange}
                  placeholder="Notes"
                />
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
                  <InputLeftAddon>FCFA</InputLeftAddon>
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
                <Textarea
                  name="notes"
                  value={transferForm.values.notes}
                  onChange={transferForm.handleChange}
                  placeholder="Notes"
                />
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
                      <InputLeftAddon>FCFA</InputLeftAddon>
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
                <Textarea
                  name="notes"
                  value={incomeForm.values.notes}
                  onChange={incomeForm.handleChange}
                  placeholder="Notes"
                />
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
